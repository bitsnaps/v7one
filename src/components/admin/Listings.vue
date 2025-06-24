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
                <td>{{ listing.id }}</td>
                <td>{{ listing.title }}</td>
                <td>{{ listing.category.name }}</td>
                <td>{{ listing.status }}</td>
                <td>
                  <button class="btn btn-sm btn-success" @click="updateStatus(listing.id, 'active')" :disabled="listing.status === 'active'">Approve</button>
                  <button class="btn btn-sm btn-warning" @click="updateStatus(listing.id, 'pending')" :disabled="listing.status === 'pending'">Pend</button>
                  <button class="btn btn-sm btn-danger" @click="updateStatus(listing.id, 'rejected')" :disabled="listing.status === 'rejected'">Reject</button>
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
import axios from 'axios';

const listings = ref([]);
const pagination = ref({});
const searchQuery = ref('');

const fetchListings = async (url = `/api/admin/listings?search=${searchQuery.value}`) => {
  try {
    const response = await axios.get(url);
    listings.value = response.data.data;
    pagination.value = response.data.meta;
  } catch (error) {
    console.error('Error fetching listings:', error);
  }
};

const updateStatus = async (id, status) => {
  try {
    await axios.patch(`/api/admin/listings/${id}/status`, { status });
    fetchListings();
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