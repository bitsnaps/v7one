<script setup>
import { useAuthStore } from '../../stores/auth';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const user = authStore.user;
const profileData = ref({});

onMounted(() => {
  const
   displayName = user.displayName || '';
  profileData.value = {
    ...user,
    // firstName: displayName.split(' ')[0] || '',
    // lastName: displayName.split(' ').slice(1).join(' ') || '',
  };
});

const saveChanges = async () => {
  const success = await authStore.updateProfile(profileData.value);
  if (success) {
    alert('Profile updated successfully!');
  } else {
    alert(`Error: ${authStore.authError}`);
  }
};

const resetPassword = async () => {
  const result = await authStore.resetPassword(user.email);
  if (result.success) {
    alert('Password reset link has been sent to your email.');
  } else {
    alert(`Error: ${result.message}`);
  }
};
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
              <img src="/adminkit/img/avatars/avatar.jpg" alt="user.displayName" class="img-fluid rounded-circle mb-2" width="128" height="128" />
              <h5 class="card-title mb-0">{{ user.displayName }}</h5>
              <div class="text-muted mb-2">{{ user.isAdmin ? 'Administrator' : 'User' }}</div>
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