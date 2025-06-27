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

      <div class="row">
        <div class="col-12 col-lg-8 col-xxl-9 d-flex">
          <div class="card flex-fill">
            <div class="card-header">
              <h5 class="card-title mb-0">Recent Listings</h5>
            </div>
            <table class="table table-hover my-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th class="d-none d-xl-table-cell">Category</th>
                  <th class="d-none d-xl-table-cell">User</th>
                  <th>Status</th>
                  <th class="d-none d-md-table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="listing in recentListings" :key="listing.id">
                  <td>{{ listing.title }}</td>
                  <td class="d-none d-xl-table-cell">{{ listing.category }}</td>
                  <td class="d-none d-xl-table-cell">{{ listing.user }}</td>
                  <td><span :class="['badge', {'bg-success': listing.status === 'approved', 'bg-warning': listing.status === 'pending', 'bg-danger': listing.status === 'rejected'}]">{{ listing.status }}</span></td>
                  <td class="d-none d-md-table-cell">{{ listing.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-12 col-lg-4 col-xxl-3 d-flex">
          <div class="card flex-fill w-100">
            <div class="card-header">
              <h5 class="card-title mb-0">Recent Users</h5>
            </div>
            <div class="card-body d-flex w-100">
              <div class="align-self-center chart chart-lg">
                <table class="table table-hover my-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in recentUsers" :key="user.id">
                      <td>{{ user.name }}</td>
                      <td>{{ user.email }}</td>
                    </tr>
                  </tbody>
                </table>
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
import AdminService from '../../services/AdminService';

const stats = ref({
  totalUsers: 0,
  totalListings: 0,
  totalCategories: 0,
  pendingListings: 0,
});

const recentListings = ref([]);
const recentUsers = ref([]);

const fetchStats = async () => {
  try {
    const response = await AdminService.getDashboardStats();
    stats.value = response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  }
};

const fetchRecentData = async () => {
  try {
    const listingsResponse = await AdminService.getRecentListings();
    recentListings.value = listingsResponse.data;

    const usersResponse = await AdminService.getRecentUsers();
    recentUsers.value = usersResponse.data;
  } catch (error) {
    console.error('Error fetching recent data:', error);
  }
};

onMounted(() => {
  fetchStats();
  fetchRecentData();
  // We need to manually trigger feather icons replacement
  if (window.feather) {
    window.feather.replace();
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>