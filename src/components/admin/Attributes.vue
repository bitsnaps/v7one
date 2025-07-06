<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import AdminService from '../../services/AdminService';

const attributes = ref([]);
const categories = ref([]);
const editMode = ref(false);
const showModal = ref(false);

const form = reactive({
  id: null,
  name: '',
  type: 'TEXT',
  isRequired: false,
  categoryId: null,
});

const modalTitle = computed(() => (editMode.value ? 'Edit Attribute' : 'Add Attribute'));

const fetchAttributes = async () => {
  try {
    const response = await AdminService.getAttributes();
    attributes.value = response.data;
  } catch (error) {
    console.error('Error fetching attributes:', error);
  }
};

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
  form.type = 'TEXT';
  form.isRequired = false;
  form.categoryId = null;
  editMode.value = false;
};

const openModal = (attribute = null) => {
  if (attribute) {
    editMode.value = true;
    form.id = attribute.id;
    form.name = attribute.name;
    form.type = attribute.type;
    form.isRequired = attribute.isRequired;
    form.categoryId = attribute.categoryId;
  } else {
    resetForm();
  }
  showModal.value = true;
};

const saveAttribute = async () => {
  try {
    if (editMode.value) {
      await AdminService.updateAttribute(form.id, form);
    } else {
      await AdminService.createAttribute(form);
    }
    fetchAttributes();
    showModal.value = false;
  } catch (error) {
    console.error(`Error ${editMode.value ? 'updating' : 'creating'} attribute:`, error);
  }
};

const deleteAttribute = async (id) => {
  if (confirm('Are you sure you want to delete this attribute?')) {
    try {
      await AdminService.deleteAttribute(id);
      fetchAttributes();
    } catch (error) {
      console.error('Error deleting attribute:', error);
    }
  }
};

onMounted(() => {
  fetchAttributes();
  fetchCategories();
});
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0">
      <h1 class="h3 mb-3">Attributes</h1>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Attributes</h5>
              <div class="card-tools">
                <button class="btn btn-sm btn-primary" @click="openModal()">Add New</button>
              </div>
            </div>
            <div class="card-body">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Is Required</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="attribute in attributes" :key="attribute.id">
                    <td>{{ attribute.name }}</td>
                    <td>{{ attribute.type }}</td>
                    <td>{{ attribute.category ? attribute.category.name : 'N/A' }}</td>
                    <td>
                      <span :class="['badge', attribute.isRequired ? 'bg-success' : 'bg-secondary']">
                        {{ attribute.isRequired ? 'Yes' : 'No' }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-secondary me-2" @click="openModal(attribute)">Edit</button>
                      <button class="btn btn-sm btn-danger" @click="deleteAttribute(attribute.id)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <b-modal v-model="showModal" :title="modalTitle" @hidden="resetForm" no-footer no-close-on-backdro no-close-on-backdrop>
        <form @submit.prevent="saveAttribute">
          <div class="form-group">
            <label for="name">Attribute Name</label>
            <input type="text" class="form-control" id="name" v-model="form.name" required>
          </div>
          <div class="form-group mt-2">
            <label for="type">Attribute Type</label>
            <select class="form-control" id="type" v-model="form.type">
              <option value="TEXT">Text</option>
              <option value="NUMBER">Number</option>
              <option value="BOOLEAN">Yes/No</option>
              <option value="DATE">Date</option>
            </select>
          </div>
          <div class="form-group mt-2">
            <label for="category">Category</label>
            <select class="form-control" id="category" v-model="form.categoryId" required>
              <option :value="null">-- Select Category --</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div class="form-check mt-2">
            <input class="form-check-input" type="checkbox" id="isRequired" v-model="form.isRequired">
            <label class="form-check-label" for="isRequired">
              Is Required?
            </label>
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