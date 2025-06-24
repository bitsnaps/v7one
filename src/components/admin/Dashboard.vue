<template>
  <main class="content">
    <div class="container-fluid p-0">

      <h1 class="h3 mb-3"><strong>Analytics</strong> Dashboard</h1>

      <div class="row">
        <div class="col-xl-12 d-flex">
          <div class="w-100">
            <div class="row">
              <div class="col-sm-3">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col mt-0">
                        <h5 class="card-title">Users</h5>
                      </div>

                      <div class="col-auto">
                        <div class="stat text-primary">
                          <i class="align-middle" data-feather="users"></i>
                        </div>
                      </div>
                    </div>
                    <h1 class="mt-1 mb-3">{{ stats.totalUsers }}</h1>
                  </div>
                </div>
              </div>
              <div class="col-sm-3">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col mt-0">
                        <h5 class="card-title">Listings</h5>
                      </div>

                      <div class="col-auto">
                        <div class="stat text-primary">
                          <i class="align-middle" data-feather="box"></i>
                        </div>
                      </div>
                    </div>
                    <h1 class="mt-1 mb-3">{{ stats.totalListings }}</h1>
                  </div>
                </div>
              </div>
              <div class="col-sm-3">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col mt-0">
                        <h5 class="card-title">Categories</h5>
                      </div>

                      <div class="col-auto">
                        <div class="stat text-primary">
                          <i class="align-middle" data-feather="grid"></i>
                        </div>
                      </div>
                    </div>
                    <h1 class="mt-1 mb-3">{{ stats.totalCategories }}</h1>
                  </div>
                </div>
              </div>
              <div class="col-sm-3">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col mt-0">
                        <h5 class="card-title">Pending Listings</h5>
                      </div>

                      <div class="col-auto">
                        <div class="stat text-primary">
                          <i class="align-middle" data-feather="clock"></i>
                        </div>
                      </div>
                    </div>
                    <h1 class="mt-1 mb-3">{{ stats.pendingListings }}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stats = ref({
  totalUsers: 0,
  totalListings: 0,
  totalCategories: 0,
  pendingListings: 0,
});

const fetchStats = async () => {
  try {
    const response = await axios.get('/api/admin/dashboard/stats');
    stats.value = response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  }
};

onMounted(() => {
  fetchStats();
  // We need to manually trigger feather icons replacement
  if (window.feather) {
    window.feather.replace();
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>