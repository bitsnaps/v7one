<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import AdminService from '../../services/AdminService';

const attributeValues = ref([]);
const attributes = ref([]);
const listings = ref([]);
const editMode = ref(false);
const showModal = ref(false);

const searchQuery = ref('');

const searchBy = ref('value');

const form = reactive({
  id: null,
  listingId: null,
  attributeId: null,
  value: ''
});

const modalTitle = computed(() => (editMode.value ? 'Edit Attribute Value' : 'Add Attribute Value'));

const filteredAttributes = computed(() => {
  if (!form.listingId) {
    return attributes.value;
  }
  const selectedListing = listings.value.find(l => l.id === form.listingId);
  if (!selectedListing) {
    return attributes.value;
  }
  return attributes.value.filter(attr => attr.categoryId === selectedListing.categoryId);
});

const fetchAttributeValues = async () => {
  try {
    const response = await AdminService.getAttributeValues(searchQuery.value, searchBy.value);
    attributeValues.value = response.data;
  } catch (error) {
    console.error('Error fetching attribute values:', error);
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

const fetchListings = async () => {
  try {
    const response = await AdminService.getListings();
    listings.value = response.data.listings;
  } catch (error) {
    console.error('Error fetching listings:', error);
  }
};

const resetForm = () => {
  form.id = null;
  form.listingId = null;
  form.attributeId = null;
  form.value = '';
  editMode.value = false;
};

const openModal = (value = null) => {
  if (value) {
    editMode.value = true;
    form.id = value.id;
    form.listingId = value.listingId;
    form.attributeId = value.attributeId;
    form.value = value.value;
  } else {
    resetForm();
  }
  showModal.value = true;
};

const saveAttributeValue = async () => {
  try {
    if (editMode.value) {
      await AdminService.updateAttributeValue(form.id, form);
    } else {
      await AdminService.createAttributeValue(form);
    }
    fetchAttributeValues();
    showModal.value = false;
  } catch (error) {
    console.error(`Error saving attribute value:`, error);
  }
};

const deleteAttributeValue = async (id) => {
  if (confirm('Are you sure you want to delete this attribute value?')) {
    try {
      await AdminService.deleteAttributeValue(id);
      fetchAttributeValues();
    } catch (error) {
      console.error('Error deleting attribute value:', error);
    }
  }
};

let debounceTimer;
watch([searchQuery, searchBy], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchAttributeValues();
  }, 300);
});

onMounted(() => {
  fetchAttributeValues();
  fetchAttributes();
  fetchListings();
});
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0">
      <h1 class="h3 mb-3">Attribute Values</h1>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Attribute Values</h5>
              <div class="card-tools">
                <button class="btn btn-sm btn-primary" @click="openModal()">Add New</button>
              </div>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-md-4">
                  <input type="text" class="form-control" placeholder="Search..." v-model="searchQuery">
                </div>
                <div class="col-md-3">
                  <select class="form-control" v-model="searchBy">
                    <option value="value">Value</option>
                    <option value="listing">Listing</option>
                    <option value="attribute">Attribute</option>
                  </select>
                </div>
              </div>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th>Attribute</th>
                    <th>Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="value in attributeValues" :key="value.id">
                    <td>{{ value.listing ? value.listing.title : 'N/A' }}</td>
                    <td>{{ value.attribute ? value.attribute.name : 'N/A' }}</td>
                    <td>{{ value.value }}</td>
                    <td>
                      <button class="btn btn-sm btn-secondary me-2" @click="openModal(value)">Edit</button>
                      <button class="btn btn-sm btn-danger" @click="deleteAttributeValue(value.id)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <b-modal v-model="showModal" :title="modalTitle" @hidden="resetForm" no-footer no-close-on-backdrop>
        <form @submit.prevent="saveAttributeValue">
          <div class="form-group">
            <label for="listing">Listing</label>
            <select class="form-control" id="listing" v-model="form.listingId" required>
              <option :value="null">-- Select Listing --</option>
              <option v-for="listing in listings" :key="listing.id" :value="listing.id">{{ listing.title }}</option>
            </select>
          </div>
          <div class="form-group mt-2">
            <label for="attribute">Attribute</label>
            <select class="form-control" id="attribute" v-model="form.attributeId" required>
              <option :value="null">-- Select Attribute --</option>
              <option v-for="attribute in filteredAttributes" :key="attribute.id" :value="attribute.id">{{ attribute.name }}</option>
            </select>
          </div>
          <div class="form-group mt-2">
            <label for="value">Value</label>
            <input type="text" class="form-control" id="value" v-model="form.value" required>
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