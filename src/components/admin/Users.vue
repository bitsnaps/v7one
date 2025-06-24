<template>
  <h1 class="h3 mb-3">Users</h1>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">Users</h5>
          <div class="card-tools">
            <div class="input-group input-group-sm" style="width: 250px;">
              <input type="text" name="table_search" class="form-control float-right" placeholder="Search" v-model="searchQuery" @keyup.enter="fetchUsers">
              <div class="input-group-append">
                <button type="submit" class="btn btn-default" @click="fetchUsers"><i class="fas fa-search"></i></button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body table-responsive p-0">
          <table class="table table-hover text-nowrap">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <button class="btn btn-sm btn-primary" @click="editUser(user)">Edit</button>
                  <button class="btn btn-sm btn-danger" @click="deleteUser(user.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-footer clearfix">
          <ul class="pagination pagination-sm m-0 float-right">
            <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
              <a class="page-link" href="#" @click.prevent="fetchUsers(pagination.prev_page_url)">«</a>
            </li>
            <li class="page-item" v-for="n in pagination.last_page" :key="n" :class="{ active: n === pagination.current_page }">
              <a class="page-link" href="#" @click.prevent="fetchUsers(pagination.path + '?page=' + n)">{{ n }}</a>
            </li>
            <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
              <a class="page-link" href="#" @click.prevent="fetchUsers(pagination.next_page_url)">»</a>
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

const users = ref([]);
const pagination = ref({});
const searchQuery = ref('');

const fetchUsers = async (url = `/api/admin/users?search=${searchQuery.value}`) => {
  try {
    const response = await axios.get(url);
    users.value = response.data.data;
    pagination.value = response.data.meta;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const editUser = (user) => {
  // Implement edit user logic (e.g., open a modal with a form)
  console.log('Editing user:', user);
};

const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
</style>