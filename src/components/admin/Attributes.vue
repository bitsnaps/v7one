<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import AdminService from '../../services/AdminService';

const attributes = ref([]);
const editMode = ref(false);
const showModal = ref(false);
const listings = ref([]);
const form = reactive({
  id: null,
  attributeName: '',
  attributeValue: '',
  listingId: null,
});

const modalTitle = computed(() => (editMode.value ? 'Edit Attribute' : 'Add Attribute'));

const fetchListings = async () => {
  try {
    const response = await AdminService.getListings();
    listings.value = response.data.listings;
  } catch (error) {
    console.error('Error fetching listings:', error);
  }
};

const fetchAttributes = async () => {
  try {
    const response = await AdminService.getAttributes();
    attributes.value = response.data;
  } catch (error) {
    console.error('Error fetching attributes:', error);
  }
};

const resetForm = () => {
  form.id = null;
  form.attributeName = '';
  form.attributeValue = '';
  form.listingId = null;
  editMode.value = false;
};

const openModal = (attribute = null) => {
  if (attribute) {
    editMode.value = true;
    form.id = attribute.id;
    form.attributeName = attribute.attributeName;
    form.attributeValue = attribute.attributeValue;
    form.listingId = attribute.listingId;
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
  fetchListings();
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
                    <th>Value</th>
                    <th>Deal</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="attribute in attributes" :key="attribute.id">
                    <td>{{ attribute.attributeName }}</td>
                    <td>{{ attribute.attributeValue }}</td>
                    <td>{{ attribute.Listing ? attribute.Listing.title : 'N/A' }}</td>
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
            <label for="name">Name</label>
            <input type="text" class="form-control" id="name" v-model="form.attributeName" required>
          </div>
          <div class="form-group">
            <label for="value">Value</label>
            <input type="text" class="form-control" id="value" v-model="form.attributeValue" required>
          </div>
          <div class="form-group">
            <label for="listing">Deal</label>
            <select class="form-control" id="listing" v-model="form.listingId">
              <option :value="null">-- Select a deal --</option>
              <option v-for="listing in listings" :key="listing.id" :value="listing.id">{{ listing.title }}</option>
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