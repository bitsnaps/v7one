<script setup>
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const user = authStore.user;

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
              <div class="mb-3">
                <strong>Display Name:</strong>
                <p>{{ user.displayName }}</p>
              </div>
              <div class="mb-3">
                <strong>Email:</strong>
                <p>{{ user.email }}</p>
              </div>
                <div class="mb-3">
                <strong>Role:</strong>
                <p>{{ user.isAdmin ? 'Administrator' : 'User' }}</p>
              </div>
               <div class="mb-3">
                <strong>Status:</strong>
                <p>{{ user.isActive ? 'Active' : 'Inactive' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>