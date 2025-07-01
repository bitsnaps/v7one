<script setup>
import { ref, onMounted, reactive } from 'vue';
import * as bootstrap from 'bootstrap';
import AdminService from '@/services/AdminService';

const users = ref([]);
const pagination = ref({});
const searchQuery = ref('');
const editingUser = reactive({
 id: null,
 displayName: '',
 email: '',
 isAdmin: false,
 isActive: false,
});
const newUser = reactive({
 displayName: '',
 email: '',
 password: '',
 isAdmin: false,
 isActive: true,
});
let userModal = null;
let createUserModal = null;

const fetchUsers = async (page = 1) => {
  try {
    const response = await AdminService.getUsers(page, searchQuery.value);
    users.value = response.data.users;
    pagination.value = {
      current_page: response.data.currentPage,
      last_page: response.data.pages,
      from: (response.data.currentPage - 1) * 10 + 1,
      to: (response.data.currentPage - 1) * 10 + response.data.users.length,
      total: response.data.total,
      per_page: 10, // Assuming 10 items per page as default
      path: '/api/admin/users',
      prev_page_url: response.data.currentPage > 1 ? `/api/admin/users?page=${response.data.currentPage - 1}&search=${searchQuery.value}` : null,
      next_page_url: response.data.currentPage < response.data.pages ? `/api/admin/users?page=${response.data.currentPage + 1}&search=${searchQuery.value}` : null,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const editUser = (user) => {
  Object.assign(editingUser, user);
  userModal.show();
};

const openCreateUserModal = () => {
  // Reset newUser object
  Object.assign(newUser, {
    displayName: '',
    email: '',
    password: '',
    isAdmin: false,
    isActive: true,
  });
  createUserModal.show();
};

const createUser = async () => {
  try {
    await AdminService.createUser(newUser);
    createUserModal.hide();
    fetchUsers(); // Refresh the user list
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

const saveUser = async () => {
  try {
    await AdminService.updateUser(editingUser.id, editingUser);
    userModal.hide();
    fetchUsers(); // Refresh the user list
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await AdminService.deleteUser(id);
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};

onMounted(() => {
  fetchUsers();
  userModal = new bootstrap.Modal(document.getElementById('editUserModal'));
  createUserModal = new bootstrap.Modal(document.getElementById('createUserModal'));
});
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0">

    <h1 class="h3 mb-3">Users</h1>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Users</h5>
            <div class="card-tools d-flex align-items-center">
              <BButton variant="primary" size="sm" @click="openCreateUserModal">Add New</BButton>
              <div class="input-group input-group-sm" style="width: 250px; margin-left: 1rem;">
                <input type="text" name="table_search" class="form-control float-right" placeholder="Search" v-model="searchQuery" @keyup.enter="fetchUsers(1)">
                <div class="input-group-append">
                  <button type="submit" class="btn btn-default" @click="fetchUsers(1)"><i class="fas fa-search"></i></button>
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
                <tr v-for="(user, index) in users" :key="user.id">
                  <td>{{ index+1 }}</td>
                  <td>{{ user.displayName }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.isAdmin?'admin':(user.role || 'user') }}</td>
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
              <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                <a class="page-link" href="#" @click.prevent="fetchUsers(pagination.current_page - 1)">«</a>
              </li>
              <li class="page-item" v-for="n in pagination.last_page" :key="n" :class="{ active: n === pagination.current_page }">
                <a class="page-link" href="#" @click.prevent="fetchUsers(n)">{{ n }}</a>
              </li>
              <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                <a class="page-link" href="#" @click.prevent="fetchUsers(pagination.current_page + 1)">»</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editUserModalLabel">Edit User</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label for="displayName" class="form-label">Display Name</label>
                <input type="text" class="form-control" id="displayName" v-model="editingUser.displayName">
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" v-model="editingUser.email">
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="isAdmin" v-model="editingUser.isAdmin">
                <label class="form-check-label" for="isAdmin">Is Admin</label>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="isActive" v-model="editingUser.isActive">
                <label class="form-check-label" for="isActive">Is Active</label>
              </div>
              <button type="submit" class="btn btn-primary">Save changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    <div class="modal fade" id="createUserModal" tabindex="-1" aria-labelledby="createUserModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createUserModalLabel">Create User</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createUser">
              <div class="mb-3">
                <label for="newDisplayName" class="form-label">Display Name</label>
                <input type="text" class="form-control" id="newDisplayName" v-model="newUser.displayName" required>
              </div>
              <div class="mb-3">
                <label for="newEmail" class="form-label">Email address</label>
                <input type="email" class="form-control" id="newEmail" v-model="newUser.email" required>
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">Password</label>
                <input type="password" class="form-control" id="newPassword" v-model="newUser.password" required>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="newIsAdmin" v-model="newUser.isAdmin">
                <label class="form-check-label" for="newIsAdmin">Is Admin</label>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="newIsActive" v-model="newUser.isActive">
                <label class="form-check-label" for="newIsActive">Is Active</label>
              </div>
              <button type="submit" class="btn btn-primary">Create User</button>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</main>
</template>

<style scoped>
</style>