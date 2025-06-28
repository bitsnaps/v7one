<template>
  <h1 class="h3 mb-3">Listings</h1>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">Listings</h5>
          <div class="card-tools d-flex">
             <button class="btn btn-sm btn-primary me-2" @click="openModal()">Add New</button>
            <div class="input-group input-group-sm" style="width: 250px;">
              <input type="text" name="table_search" class="form-control float-right" placeholder="Search" v-model="searchQuery" @keyup.enter="fetchListings">
              <div class="input-group-append">
                <button type="submit" class="btn btn-default" @click="fetchListings"><i class="fas fa-search"></i></button>
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="listing in listings" :key="listing.id">
                <td>{{ listing.id.slice(1,8) }}</td>
                <td>{{ listing.title }}</td>
                <td>{{ listing.category.name }}</td>
                <td>{{ listing.status }}</td>
                <td>
                  <button class="btn btn-sm btn-success me-1" @click="updateStatus(listing.id, 'ACTIVE')" :disabled="listing.status === 'ACTIVE'">Approve</button>
                  <button class="btn btn-sm btn-danger me-1" @click="updateStatus(listing.id, 'REMOVED_BY_ADMIN')" :disabled="listing.status === 'REMOVED_BY_ADMIN'">Remove</button>
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

  <b-modal v-model="showModal" title="Create New Listing" @hidden="resetForm" hide-footer>
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
        <input type="number" class="form-control" id="price" v-model="form.price" required>
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
        <button type="submit" class="btn btn-primary">Create</button>
      </div>
    </form>
  </b-modal>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import AdminService from '@/services/AdminService';
import { BDropdown, BDropdownItem, BModal } from 'bootstrap-vue-next';

const listings = ref([]);
const pagination = ref({});
const searchQuery = ref('');
const showModal = ref(false);
const categories = ref([]);
const flatCategories = ref([]);
const users = ref([]);
const form = reactive({
  title: '',
  description: '',
  price: 0,
  categoryId: null,
  userId: null,
});

const fetchListings = async (page = 1) => {
  try {
    const response = await AdminService.getListings(page, searchQuery.value);
    listings.value = response.data.listings;
    pagination.value = {
      current_page: response.data.currentPage,
      last_page: response.data.pages,
      prev_page_url: response.data.currentPage > 1 ? `?page=${response.data.currentPage - 1}` : null,
      next_page_url: response.data.currentPage < response.data.pages ? `?page=${response.data.currentPage + 1}` : null,
      path: '/api/admin/listings',
    };
  } catch (error) {
    console.error('Error fetching listings:', error);
  }
};

const updateStatus = async (id, status) => {
  try {
    await AdminService.updateListingStatus(id, status.toUpperCase());
    fetchListings(pagination.value.current_page);
  } catch (error) {
    console.error('Error updating listing status:', error);
  }
};

const resetForm = () => {
  form.title = '';
  form.description = '';
  form.price = 0;
  form.categoryId = null;
  form.userId = null;
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

const openModal = async () => {
  resetForm();
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
    await AdminService.createListing(form);
    fetchListings();
    showModal.value = false;
  } catch (error) {
    console.error('Error creating listing:', error);
  }
};

onMounted(() => {
  fetchListings();
});
</script>

<style scoped>
</style>
