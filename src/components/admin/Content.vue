<template>
  <h1 class="h3 mb-3">Content Management</h1>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">Content</h5>
          <div class="card-tools">
            <button class="btn btn-sm btn-primary" @click="openModal()">Add New</button>
          </div>
        </div>
        <div class="card-body table-responsive p-0">
          <table class="table table-hover text-nowrap">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="contentItem in content" :key="contentItem.id">
                <td>{{ contentItem.id }}</td>
                <td>{{ contentItem.title }}</td>
                <td>{{ contentItem.slug }}</td>
                <td>
                  <button class="btn btn-sm btn-primary" @click="openModal(contentItem)">Edit</button>
                  <button class="btn btn-sm btn-danger" @click="deleteContent(contentItem.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="contentModal" tabindex="-1" role="dialog" aria-labelledby="contentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="contentModalLabel">{{ editMode ? 'Edit' : 'Add' }} Content</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="editMode ? updateContent() : createContent()">
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" class="form-control" id="title" v-model="form.title">
            </div>
            <div class="form-group">
              <label for="slug">Slug</label>
              <input type="text" class="form-control" id="slug" v-model="form.slug">
            </div>
            <div class="form-group">
              <label for="body">Body</label>
              <textarea class="form-control" id="body" rows="10" v-model="form.body"></textarea>
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

const content = ref([]);
const editMode = ref(false);
const form = reactive({
  id: null,
  title: '',
  slug: '',
  body: '',
});

const fetchContent = async () => {
  try {
    const response = await axios.get('/api/admin/content');
    content.value = response.data;
  } catch (error) {
    console.error('Error fetching content:', error);
  }
};

const openModal = (contentItem = null) => {
  editMode.value = !!contentItem;
  if (contentItem) {
    form.id = contentItem.id;
    form.title = contentItem.title;
    form.slug = contentItem.slug;
    form.body = contentItem.body;
  } else {
    form.id = null;
    form.title = '';
    form.slug = '';
    form.body = '';
  }
  $('#contentModal').modal('show');
};

const createContent = async () => {
  try {
    await axios.post('/api/admin/content', form);
    fetchContent();
    $('#contentModal').modal('hide');
  } catch (error) {
    console.error('Error creating content:', error);
  }
};

const updateContent = async () => {
  try {
    await axios.put(`/api/admin/content/${form.id}`, form);
    fetchContent();
    $('#contentModal').modal('hide');
  } catch (error) {
    console.error('Error updating content:', error);
  }
};

const deleteContent = async (id) => {
  if (confirm('Are you sure you want to delete this content?')) {
    try {
      await axios.delete(`/api/admin/content/${id}`);
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  }
};

onMounted(() => {
  fetchContent();
});
</script>

<style scoped>
</style>