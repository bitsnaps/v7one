<script>
import AdminService from '@/services/AdminService';

export default {
  data() {
    return {
      listing: null,
      mediaItems: [],
      showAddMediaModal: false,
      editingMedia: null,
      currentMedia: {
        mediaUrl: '',
        mediaType: 'IMAGE',
        isPrimary: false,
        order: 0,
        listingId: this.$route.params.listingId
      }
    };
  },
  created() {
    this.fetchListingDetails();
    this.fetchMedia();
  },
  methods: {
    fetchListingDetails() {
      AdminService.getListing(this.$route.params.listingId)
        .then(response => {
          this.listing = response.data;
        })
        .catch(error => {
          console.error("Error fetching listing details:", error);
        });
    },
    fetchMedia() {
      AdminService.getListingMedia(this.$route.params.listingId)
        .then(response => {
          this.mediaItems = response.data;
        })
        .catch(error => {
          console.error("Error fetching media:", error);
        });
    },
    editMedia(media) {
      this.editingMedia = media;
      this.currentMedia = { ...media };
      this.showAddMediaModal = true;
    },
    closeModal() {
      this.showAddMediaModal = false;
      this.editingMedia = null;
      this.currentMedia = {
        mediaUrl: '',
        mediaType: 'IMAGE',
        isPrimary: false,
        order: 0,
        listingId: this.$route.params.listingId
      };
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      AdminService.uploadFile(file)
        .then(response => {
          this.currentMedia.mediaUrl = response.data.url;
          this.currentMedia.mediaType = response.data.type;
        })
        .catch(error => {
          console.error("Error uploading file:", error);
        });
    },
    saveMedia() {
      if (this.editingMedia) {
        AdminService.updateListingMedia(this.editingMedia.id, this.currentMedia)
          .then(() => {
            this.fetchMedia();
            this.closeModal();
          })
          .catch(error => {
            console.error("Error updating media:", error);
          });
      } else {
        AdminService.addListingMedia(this.currentMedia)
          .then(() => {
            this.fetchMedia();
            this.closeModal();
          })
          .catch(error => {
            console.error("Error adding media:", error);
          });
      }
    },
    deleteMedia(id) {
      if (confirm('Are you sure you want to delete this media?')) {
        AdminService.deleteListingMedia(id)
          .then(() => {
            this.fetchMedia();
          })
          .catch(error => {
            console.error("Error deleting media:", error);
          });
      }
    }
  }
};
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0">
      <h1 class="h3 mb-3">Media Management</h1>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Media for Listing: {{ listing ? listing.title : '...' }}</h5>
            </div>
            <div class="card-body">
              <button class="btn btn-primary mb-3" @click="showAddMediaModal = true">Add Media</button>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>URL</th>
                    <th>Type</th>
                    <th>Primary</th>
                    <th>Order</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="media in mediaItems" :key="media.id">
                    <td>
                      <img v-if="media.mediaType === 'IMAGE'" :src="media.mediaUrl" width="50" height="50" />
                      <span v-else>Video</span>
                    </td>
                    <td>{{ media.mediaUrl }}</td>
                    <td>{{ media.mediaType }}</td>
                    <td>{{ media.isPrimary ? 'Yes' : 'No' }}</td>
                    <td>{{ media.order }}</td>
                    <td>
                      <button class="btn btn-sm btn-info" @click="editMedia(media)">Edit</button>
                      <button class="btn btn-sm btn-danger" @click="deleteMedia(media.id)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Media Modal -->
      <div v-if="showAddMediaModal" class="modal-backdrop show"></div>
      <div v-if="showAddMediaModal" class="modal show" style="display: block;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingMedia ? 'Edit' : 'Add' }} Media</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveMedia">
                <div class="mb-3">
                  <label class="form-label">Media File</label>
                  <input type="file" class="form-control" @change="handleFileUpload">
                </div>
                <div class="mb-3">
                  <label class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="currentMedia.isPrimary">
                    <span class="form-check-label">Primary Media</span>
                  </label>
                </div>
                <div class="mb-3">
                  <label class="form-label">Order</label>
                  <input type="number" class="form-control" v-model.number="currentMedia.order">
                </div>
                <button type="submit" class="btn btn-primary">Save</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
  </template>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1040;
  }
  
  .modal {
    z-index: 1050;
  }
  </style>