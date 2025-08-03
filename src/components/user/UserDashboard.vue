<script setup>
import { ref, onMounted } from 'vue';
import UserService from '@/services/UserService';
import { useRouter } from 'vue-router';

const stats = ref({
  totalDeals: 0,
  pendingDeals: 0,
});

const recentDeals = ref([]);
const authError = ref(null);
const router = useRouter();

const fetchStats = async () => {
  try {
    const response = await UserService.getDashboardStats();
    stats.value = response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      authError.value = 'Your session has expired. Please log in again.';
    } else {
      console.error('Error fetching dashboard stats:', error);
    }
  }
};

const fetchRecentDeals = async () => {
  try {
    const dealsResponse = await UserService.getRecentDeals();
    recentDeals.value = dealsResponse.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      authError.value = 'Your session has expired. Please log in again.';
    } else {
      console.error('Error fetching recent deals:', error);
    }
  }
};

onMounted(() => {
  fetchStats();
  fetchRecentDeals();
});
</script>

<template>
  <main class="content">
    <div v-if="authError" class="container-fluid p-0">
      <b-alert variant="danger">
          {{ authError }}
          <b-button variant="primary" size="lg" class="ms-3" @click="router.push('/signin')">Login</b-button>
      </b-alert>
    </div>
    <div v-else class="container-fluid p-0">
      <h1 class="h3 mb-3"><strong>Analytics</strong> Dashboard</h1>

      <div class="row">
        <div class="col-xl-12 d-flex">
          <div class="w-100">
            <div class="row">
              <div class="col-sm-6">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col mt-0">
                        <h5 class="card-title">Deals</h5>
                      </div>

                      <div class="col-auto">
                        <div class="stat text-primary">
                          <i class="align-middle fas fa-box"></i>
                        </div>
                      </div>
                    </div>
                    <h1 class="mt-1 mb-3">{{ stats.totalDeals }}</h1>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col mt-0">
                        <h5 class="card-title">Pending Deals</h5>
                      </div>

                      <div class="col-auto">
                        <div class="stat text-primary">
                          <i class="align-middle fas fa-clock"></i>
                        </div>
                      </div>
                    </div>
                    <h1 class="mt-1 mb-3">{{ stats.pendingDeals }}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 d-flex">
          <div class="card flex-fill">
            <div class="card-header">
              <h5 class="card-title mb-0">Recent Deals</h5>
            </div>
            <table class="table table-hover my-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th class="d-none d-xl-table-cell">Category</th>
                  <th>Status</th>
                  <th class="d-none d-md-table-cell">Date</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="deal in recentDeals" :key="deal.id">
                  <td>{{ deal.title }}</td>
                  <td class="d-none d-xl-table-cell">{{ deal.category }}</td>
                  <td><span :class="['badge', {'bg-success': deal.status === 'ACTIVE', 'bg-warning': deal.status === 'SOLD', 'bg-danger': deal.status === 'REMOVED'}]">{{ deal.status }}</span></td>
                  <td class="d-none d-md-table-cell">{{ deal.date }}</td>
                  <td>
                    <button class="btn btn-primary btn-sm me-2">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Add your styles here */
</style>