<script setup>
import { useAuthStore } from '../../stores/auth';
import { ref, onMounted, computed } from 'vue';
import UserService from '../../services/UserService';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const profileData = ref({});
const selectedFile = ref(null);
const fileInput = ref(null);

const fetchProfile = async () => {
  try {
    const response = await UserService.getProfile();
    authStore.setUser(response.data);
    profileData.value = { ...response.data };
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    alert('Failed to load profile data.');
  }
};

onMounted(fetchProfile);

const onFileChange = (e) => {
  selectedFile.value = e.target.files[0];
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const uploadAvatar = async () => {
  if (!selectedFile.value) {
    alert('Please select a file to upload.');
    return;
  }
  try {
    const response = await UserService.uploadAvatar(selectedFile.value);
    // Update the user's profile picture URL in the store and component
    const updatedUser = { ...user.value, profilePictureUrl: response.data.profilePictureUrl };
    authStore.setUser(updatedUser);
    profileData.value.profilePictureUrl = response.data.profilePictureUrl;
    selectedFile.value = null; // Clear the selection
    alert('Avatar updated successfully!');
  } catch (error) {
    console.error('Failed to upload avatar:', error);
    alert('Failed to upload avatar.');
  }
};

const deleteAvatar = async () => {
  if (!confirm('Are you sure you want to delete your profile picture?')) {
    return;
  }
  try {
    await UserService.deleteAvatar();
    const updatedUser = { ...user.value, profilePictureUrl: null };
    authStore.setUser(updatedUser);
    profileData.value.profilePictureUrl = null;
    alert('Avatar deleted successfully!');
  } catch (error) {
    console.error('Failed to delete avatar:', error);
    alert('Failed to delete avatar.');
  }
};

const saveChanges = async () => {
  try {
    const response = await UserService.updateProfile(profileData.value);
    authStore.setUser(response.data);
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Failed to update profile:', error);
    alert(`Error: ${error.response?.data?.error || 'Failed to update profile'}`);
  }
};

const resetPassword = async () => {
  // This function seems to be from the original code, but there's no backend for it.
  // I will leave it as is.
  alert('Password reset functionality is not implemented in the backend.');
};

const profilePicture = computed(() => {
  return profileData.value.profilePictureUrl || '/img/user.svg';
});
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0">

      <h1 class="h3 mb-3"><strong>User Profile</strong></h1>

      <div class="row">
        <div class="col-md-4 col-xl-3">
          <div class="card mb-3">
            <div class="card-header">
              <h5 class="card-title mb-0">Profile Details</h5>
            </div>
            <div class="card-body text-center">
              <img :src="profilePicture" :alt="profileData.displayName" class="img-fluid rounded-circle mb-2" width="128" height="128" />
              <h5 class="card-title mb-0">{{ profileData.displayName }}</h5>
              <div class="text-muted mb-2">{{ profileData.isAdmin ? 'Administrator' : 'User' }}</div>
              <div>
                <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" style="display: none;" />
                <button class="btn btn-primary btn-sm" @click="triggerFileInput">Change</button>
                <button class="btn btn-secondary btn-sm" @click="uploadAvatar" :disabled="!selectedFile">Upload</button>
                <button class="btn btn-danger btn-sm" @click="deleteAvatar" v-if="profileData.profilePictureUrl">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-8 col-xl-9">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Account Information</h5>
            </div>
            <div class="card-body h-100">
              <form @submit.prevent="saveChanges">
                <!-- <div class="row">
                  <div class="mb-3 col-md-6">
                    <label class="form-label" for="inputFirstName">First name</label>
                    <input type="text" class="form-control" id="inputFirstName" v-model="profileData.firstName" placeholder="First name">
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label" for="inputLastName">Last name</label>
                    <input type="text" class="form-control" id="inputLastName" v-model="profileData.lastName" placeholder="Last name">
                  </div>
                </div> -->
                <div class="mb-3">
                  <label class="form-label" for="inputDisplayName">Display Name</label>
                  <input type="text" class="form-control" id="inputDisplayName" v-model="profileData.displayName" placeholder="Display Name">
                </div>
                <div class="mb-3">
                  <label class="form-label" for="inputEmail4">Email</label>
                  <input type="email" class="form-control" id="inputEmail4" v-model="profileData.email" placeholder="Email" disabled>
                </div>
                 <div class="row">
                  <div class="mb-3 col-md-6">
                    <label class="form-label" for="inputRole">Role</label>
                    <input type="text" class="form-control" id="inputRole" :value="user.isAdmin ? 'Administrator' : 'User'" disabled>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label" for="inputStatus">Status</label>
                    <input type="text" class="form-control" id="inputStatus" :value="user.isActive ? 'Active' : 'Inactive'" disabled>
                  </div>
                </div>
                <div class="d-flex justify-content-between">
                  <button type="submit" class="btn btn-primary">Save Changes</button>
                  <button type="button" class="btn btn-light" @click="resetPassword">Reset Password</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>