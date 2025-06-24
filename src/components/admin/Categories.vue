<template>
  <h1 class="h3 mb-3">Categories</h1>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">Categories</h5>
          <div class="card-tools">
            <button class="btn btn-sm btn-primary" @click="openModal()">Add New</button>
          </div>
        </div>
        <div class="card-body table-responsive p-0">
          <table class="table table-hover text-nowrap">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in categories" :key="category.id">
                <td>{{ category.id }}</td>
                <td>{{ category.name }}</td>
                <td>
                  <button class="btn btn-sm btn-primary" @click="openModal(category)">Edit</button>
                  <button class="btn btn-sm btn-danger" @click="deleteCategory(category.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="categoryModal" tabindex="-1" role="dialog" aria-labelledby="categoryModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="categoryModalLabel">{{ editMode ? 'Edit' : 'Add' }} Category</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="editMode ? updateCategory() : createCategory()">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" id="name" v-model="form.name">
            </div>
            <button type="submit" class="btn btn-primary">{{ editMode ? 'Update' : 'Create' }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';

const categories = ref([]);
const editMode = ref(false);
const form = reactive({
  id: null,
  name: '',
});

const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/admin/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const openModal = (category = null) => {
  editMode.value = !!category;
  if (category) {
    form.id = category.id;
    form.name = category.name;
  } else {
    form.id = null;
    form.name = '';
  }
  $('#categoryModal').modal('show');
};

const createCategory = async () => {
  try {
    await axios.post('/api/admin/categories', form);
    fetchCategories();
    $('#categoryModal').modal('hide');
  } catch (error) {
    console.error('Error creating category:', error);
  }
};

const updateCategory = async () => {
  try {
    await axios.put(`/api/admin/categories/${form.id}`, form);
    fetchCategories();
    $('#categoryModal').modal('hide');
  } catch (error) {
    console.error('Error updating category:', error);
  }
};

const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
</style>