<template>
  <h1 class="h3 mb-3">Listings</h1>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">Listings</h5>
          <div class="card-tools">
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminService from '@/services/AdminService';
import { BDropdown, BDropdownItem } from 'bootstrap-vue-next';

const listings = ref([]);
const pagination = ref({});
const searchQuery = ref('');

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

onMounted(() => {
  fetchListings();
});
</script>

<style scoped>
</style>
