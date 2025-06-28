
<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import AdminService from '../../services/AdminService';
import CategoryTree from './CategoryTree.vue';
import { CATEGORY_TYPES } from '../../helpers/categoryTypes';

const categories = ref([]);
const flatCategories = ref([]);
const editMode = ref(false);
const showModal = ref(false);
const form = reactive({
  id: null,
  name: '',
  slug: '',
  type: '',
  parentId: null,
});

const modalTitle = computed(() => (editMode.value ? 'Edit Category' : 'Add Category'));

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

const fetchCategories = async () => {
  try {
    const response = await AdminService.getCategories();
    categories.value = response.data;
    flatCategories.value = flattenCategories(response.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const resetForm = () => {
  form.id = null;
  form.name = '';
  form.slug = '';
  form.type = '';
  form.parentId = null;
  editMode.value = false;
};

const openModal = (category = null) => {
  if (category) {
    editMode.value = true;
    form.id = category.id;
    form.name = category.name;
    form.slug = category.slug;
    form.type = category.type;
    form.parentId = category.parentId;
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


<template>
  <h1 class="h3 mb-3">Categories</h1>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">Category Tree</h5>
          <div class="card-tools">
            <button class="btn btn-sm btn-primary" @click="openModal()">Add New</button>
          </div>
        </div>
        <div class="card-body">
          <CategoryTree :categories="categories" @edit="openModal" @delete="deleteCategory" />
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
       <div class="form-group">
        <label for="slug">Slug</label>
        <input type="text" class="form-control" id="slug" v-model="form.slug" required>
      </div>
      <div class="form-group">
        <label for="type">Type</label>
        <select class="form-control" id="type" v-model="form.type" required>
          <option v-for="type in CATEGORY_TYPES" :key="type" :value="type">{{ type.toLocaleUpperCase() }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="parentId">Parent Category</label>
        <select class="form-control" id="parentId" v-model="form.parentId">
          <option :value="null">None</option>
          <option v-for="cat in flatCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>
      <div class="d-flex justify-content-end mt-3">
        <button type="button" class="btn btn-secondary me-2" @click="showModal = false">Cancel</button>
        <button type="submit" class="btn btn-primary">{{ editMode ? 'Update' : 'Create' }}</button>
      </div>
    </form>
  </b-modal>
</template>

<style scoped>
</style>