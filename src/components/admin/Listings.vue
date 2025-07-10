
<script setup>
import { ref, onMounted, reactive } from 'vue';
import AdminService from '@/services/AdminService';
import { BDropdown, BDropdownItem, BModal, BBadge } from 'bootstrap-vue-next';
import { formatPrice } from '@/helpers/utils';

const listings = ref([]);
const pagination = ref({});
const searchQuery = ref('');
const showModal = ref(false);
const editMode = ref(false);
const categories = ref([]);
const flatCategories = ref([]);
const users = ref([]);
const form = reactive({
  id: null,
  title: '',
  description: '',
  price: 0,
  listType: 'FOR_SALE',
  priceType: 'FIXED',
  condition: 'NEW',
  locationCity: '',
  locationRegion: '',
  isFeatured: false,
  categoryId: null,
  userId: null,
  imageUrl: '',
});

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const response = await AdminService.uploadFile(file);
  form.imageUrl = response.data.url;
};

const fetchListings = async (currentPage = 1) => {
  try {
    const response = await AdminService.getListings(currentPage, searchQuery.value);
    listings.value = response.data.listings;
    pagination.value = {
      current_page: response.data.currentPage,
      last_page: response.data.pages,
      prev_page_url: response.data.currentPage > 1 ? `?page=${response.data.currentPage - 1}` : null,
      next_page_url: response.data.currentPage < response.data.pages ? `?page=${response.data.currentPage + 1}` : null,
      path: '/api/admin/listings',
    };
  } catch (error) {
    console.error('Error fetching deals:', error);
  }
};

const updateStatus = async (id, status) => {
  try {
    await AdminService.updateListingStatus(id, status.toUpperCase());
    fetchListings(pagination.value.current_page);
  } catch (error) {
    console.error('Error updating deal status:', error);
  }
};

const deleteListing = async (id) => {
    if (confirm('Are you sure you want to permanently delete this listing?')) {
        try {
            await AdminService.deleteListing(id);
            fetchListings(pagination.value.current_page);
        } catch (error) {
            console.error('Error deleting deal:', error);
        }
    }
};

const resetForm = () => {
  form.id = null;
  form.title = '';
  form.description = '';
  form.price = 0;
  form.listType = 'FOR_SALE';
  form.priceType = 'FIXED';
  form.condition = 'NEW';
  form.locationCity = '';
  form.locationRegion = '';
  form.isFeatured = false;
  form.categoryId = null;
  form.userId = null;
  editMode.value = false;
};

const flattenCategories = (categories, prefix = '') => {
  let result = [];
  for (const category of categories) {
    result.push({ id: category.id, name: `${prefix}${category.name}` });
    if (category.children) {
      result = result.concat(flattenCategories(category.children, `${prefix}-`));
    }
  }
  return result;
};

const openModal = async (listing = null) => {
  if (listing) {
    editMode.value = true;
    form.id = listing.id;
    form.title = listing.title;
    form.description = listing.description;
    form.price = listing.price;
    form.listType = listing.listType;
    form.priceType = listing.priceType;
    form.condition = listing.condition;
    form.locationCity = listing.locationCity;
    form.locationRegion = listing.locationRegion;
    form.isFeatured = listing.isFeatured;
    form.categoryId = listing.categoryId;
    form.userId = listing.userId;
    form.imageUrl = listing.imageUrl;
  } else {
    resetForm();
  }

  try {
    const [catResponse, userResponse] = await Promise.all([
      AdminService.getCategories(),
      AdminService.getUsers(),
    ]);
    categories.value = catResponse.data;
    flatCategories.value = flattenCategories(catResponse.data);
    users.value = userResponse.data.users;
    showModal.value = true;
  } catch (error) {
    console.error('Error fetching categories or users:', error);
  }
};

const saveListing = async () => {
  try {
    let listingId;
    if (editMode.value) {
      await AdminService.updateListing(form.id, form);
      listingId = form.id;
    } else {
      const response = await AdminService.createListing(form);
      listingId = response.data.id;
    }

    if (form.imageUrl && form.isPrimary) { // Check if a new primary image was uploaded
      await AdminService.addListingMedia({
        listingId,
        mediaUrl: form.imageUrl,
        isPrimary: true,
      });
    }

    fetchListings();
    showModal.value = false;
  } catch (error) {
    console.error(`Error saving listing:`, error);
  }
};

const deleteImage = async () => {
  if (!form.id || !form.imageUrl) return;

  if (confirm('Are you sure you want to delete this image?')) {
    try {
      const response = await AdminService.getListingMedia(form.id);
      const mediaToDelete = response.data.find(media => media.mediaUrl === form.imageUrl);
      
      if (mediaToDelete) {
        await AdminService.deleteListingMedia(mediaToDelete.id);
        form.imageUrl = ''; // Clear image from form
      } else {
        // Fallback for older listings that might just have imageUrl on the main table
        await AdminService.updateListing(form.id, { ...form, imageUrl: null });
        form.imageUrl = '';
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
};

onMounted(() => {
  fetchListings();
});
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0">

      <h1 class="h3 mb-3">Deals</h1>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Deals</h5>
              <div class="card-tools d-flex">
                <BButton variant="primary" size="sm" class="me-2" @click="openModal()">Add New</BButton>
                <div class="input-group input-group-sm" style="width: 250px;">
                  <input type="text" name="table_search" class="form-control float-right" placeholder="Search" v-model="searchQuery" @keyup.enter="fetchListings">
                  <div class="input-group-append">
                    <form @submit.prevent="fetchListings">
                    <button type="submit" class="btn btn-default"><i class="fas fa-search"></i></button>
                  </form>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body table-responsive p-0">
              <table class="table table-hover text-nowrap">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>City</th>
                    <th>Region</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(listing, index) in listings" :key="listing.id">
                    <td>{{ index+1 }}</td>
                    <td>{{ listing.title }}</td>
                    <td>{{ listing.category.name }}</td>
                    <td>{{ formatPrice(listing.price) }}</td>
                    <td>{{ listing.listType }}</td>
                    <td>{{ listing.locationCity }}</td>
                    <td>{{ listing.locationRegion }}</td>
                    <td>{{ listing.status }}</td>
                    <td>
                      <BBadge :variant="listing.isFeatured ? 'success' : 'danger'">
                        {{ listing.isFeatured ? 'Yes' : 'No' }}
                      </BBadge>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-primary me-1" @click="openModal(listing)">Edit</button>
                      <router-link :to="{ name: 'AdminMedia', params: { listingId: listing.id } }" class="btn btn-sm btn-info me-1">Media</router-link>
                      <button class="btn btn-sm btn-success me-1" @click="updateStatus(listing.id, 'ACTIVE')" :disabled="listing.status === 'ACTIVE'">Approve</button>
                      <button class="btn btn-sm btn-danger me-1" @click="deleteListing(listing.id)">Remove</button>
                      <BDropdown text="More Actions" size="sm" variant="outline-primary">
                        <BDropdownItem @click="updateStatus(listing.id, 'PENDING')" :disabled="listing.status === 'PENDING'">Pend</BDropdownItem>
                        <BDropdownItem @click="updateStatus(listing.id, 'SOLD')" :disabled="listing.status === 'SOLD'">Mark Sold</BDropdownItem>
                        <BDropdownItem @click="updateStatus(listing.id, 'EXPIRED')" :disabled="listing.status === 'EXPIRED'">Mark Expired</BDropdownItem>
                        <BDropdownItem @click="updateStatus(listing.id, 'DRAFT')" :disabled="listing.status === 'DRAFT'">Mark Draft</BDropdownItem>
                      </BDropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer clearfix">
              <ul class="pagination pagination-sm m-0 float-right">
                <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
                  <a class="page-link" href="#" @click.prevent="fetchListings(pagination.prev_page_url)">«</a>
                </li>
                <li class="page-item" v-for="n in pagination.last_page" :key="n" :class="{ active: n === pagination.current_page }">
                  <a class="page-link" href="#" @click.prevent="fetchListings(pagination.path + '?page=' + n)">{{ n }}</a>
                </li>
                <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
                  <a class="page-link" href="#" @click.prevent="fetchListings(pagination.next_page_url)">»</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <b-modal v-model="showModal" :title="editMode ? 'Edit Deal' : 'Create New Deal'" @hidden="resetForm" no-footer no-close-on-backdrop>
        <form @submit.prevent="saveListing">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" class="form-control" id="title" v-model="form.title" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea class="form-control" id="description" v-model="form.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="price">Price</label>
            <input type="text" inputmode="decimal" pattern="[0-9]*[.]?[0-9]*" class="form-control" id="price" v-model="form.price" required>
          </div>
          <div class="form-group">
            <label for="imageUrl">Image URL</label>
            <input type="text" class="form-control" id="imageUrl" v-model="form.imageUrl">
            <input type="file" @change="handleImageUpload" class="form-control mt-2">
            <img v-if="form.imageUrl" :src="`/public/${form.imageUrl}`" width="100" class="mt-2" />
            <button v-if="form.imageUrl" type="button" class="btn btn-danger btn-sm d-block mt-2" @click="deleteImage">Delete Image</button>
          </div>
          <div class="form-group">
            <label for="isPrimary">
              <input type="checkbox" id="isPrimary" v-model="form.isPrimary">
              Is Primary ?</label>
          </div>
          <div class="form-group">
            <label for="listType">Deal Type</label>
            <select class="form-control" id="listType" v-model="form.listType" required>
              <option>FOR_SALE</option>
              <option>FOR_RENT</option>
              <option>FOR_EXCHANGE</option>
              <option>SERVICE</option>
              <option>COMMUNITY</option>
            </select>
          </div>
          <div class="form-group">
            <label for="priceType">Price Type</label>
            <select class="form-control" id="priceType" v-model="form.priceType">
              <option>FIXED</option>
              <option>NEGOTIABLE</option>
              <option>CONTACT_FOR_PRICE</option>
              <option>FREE</option>
            </select>
          </div>
          <div class="form-group">
            <label for="condition">Condition</label>
            <select class="form-control" id="condition" v-model="form.condition">
              <option>NEW</option>
              <option>USED_LIKE_NEW</option>
              <option>USED_GOOD</option>
              <option>USED_FAIR</option>
              <option>REFURBISHED</option>
              <option>FOR_PARTS</option>
            </select>
          </div>
          <div class="form-group">
            <label for="locationCity">City</label>
            <input type="text" class="form-control" id="locationCity" v-model="form.locationCity">
          </div>
          <div class="form-group">
            <label for="locationRegion">Region</label>
            <input type="text" class="form-control" id="locationRegion" v-model="form.locationRegion">
          </div>
          <div class="form-check mb-2">
            <input type="checkbox" class="form-check-input" id="isFeatured" v-model="form.isFeatured">
            <label class="form-check-label" for="isFeatured">Featured</label>
          </div>
          <div class="form-group">
            <label for="categoryId">Category</label>
            <select class="form-control" id="categoryId" v-model="form.categoryId" required>
              <option v-for="cat in flatCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="userId">Seller</label>
            <select class="form-control" id="userId" v-model="form.userId" required>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.displayName || user.email }}</option>
            </select>
          </div>
          <div class="d-flex justify-content-end mt-3">
            <button type="button" class="btn btn-secondary me-2" @click="showModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary">{{ editMode ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </b-modal>
    </div>
  </main>
</template>

<style scoped>
</style>
