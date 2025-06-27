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

  <b-modal v-model="showModal" :title="modalTitle" @hidden="resetForm" hide-footer>
    <form @submit.prevent="saveCategory">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" v-model="form.name" required>
      </div>
      <div class="d-flex justify-content-end mt-3">
        <button type="button" class="btn btn-secondary me-2" @click="showModal = false">Cancel</button>
        <button type="submit" class="btn btn-primary">{{ editMode ? 'Update' : 'Create' }}</button>
      </div>
    </form>
  </b-modal>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import AdminService from '../../services/AdminService';

const categories = ref([]);
const editMode = ref(false);
const showModal = ref(false);
const form = reactive({
  id: null,
  name: '',
});

const modalTitle = computed(() => (editMode.value ? 'Edit Category' : 'Add Category'));

const fetchCategories = async () => {
  try {
    const response = await AdminService.getCategories();
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const resetForm = () => {
  form.id = null;
  form.name = '';
  editMode.value = false;
};

const openModal = (category = null) => {
  if (category) {
    editMode.value = true;
    form.id = category.id;
    form.name = category.name;
  } else {
    resetForm();
  }
  showModal.value = true;
};

const saveCategory = async () => {
  try {
    if (editMode.value) {
      await AdminService.updateCategory(form.id, form);
    } else {
      await AdminService.createCategory(form);
    }
    fetchCategories();
    showModal.value = false;
  } catch (error) {
    console.error(`Error ${editMode.value ? 'updating' : 'creating'} category:`, error);
  }
};

const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await AdminService.deleteCategory(id);
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