<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import DealService from '@/services/DealService';

const { t } = useI18n();

// Reactive data
const categories = ref([]);
const loading = ref(true);
const error = ref(null);

// Active tab tracking
const activeTab = ref('real-estate');

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

// Fetch categories from API
const fetchCategories = async () => {
  try {
    loading.value = true;
    const response = await DealService.getCategories();
    if (response.data && response.data.success) {
      categories.value = response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch categories');
    }
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching categories:', err);
  } finally {
    loading.value = false;
  }
};

// Group categories by type
const realEstateCategories = computed(() => {
  return categories.value.filter(cat => cat.type === 'real-estate');
});

const carCategories = computed(() => {
  return categories.value.filter(cat => cat.type === 'cars');
});

const otherCategories = computed(() => {
  return categories.value.filter(cat => cat.type === 'other');
});

// Load categories on component mount
onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="container-xxl py-5">
    <div class="container">
      <div class="text-center mx-auto mb-5" style="max-width: 600px;">
        <h1 class="mb-3">{{ $t('dealsCategories.title', 'Deal Categories') }}</h1>
        <p>{{ $t('dealsCategories.description', "Explore various categories of deals available on our platform. Find what you're looking for quickly and easily.") }}</p>
      </div>
      
      <!-- Tabs Navigation -->
      <ul class="nav nav-tabs mb-4 justify-content-center">
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'real-estate' }" @click="setActiveTab('real-estate')">
            {{ $t('dealsCategories.tabs.realEstate', 'Real Estate') }}
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'cars' }" @click="setActiveTab('cars')">
            {{ $t('dealsCategories.tabs.cars', 'Cars') }}
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'other' }" @click="setActiveTab('other')">
            {{ $t('dealsCategories.tabs.otherDeals', 'Other Deals') }}
          </button>
        </li>
      </ul>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="d-flex justify-content-center align-items-center">
          <svg class="spinner me-3" width="40" height="40" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke="#00B98E" stroke-width="2" stroke-miterlimit="10" stroke-dasharray="31.416" stroke-dashoffset="31.416">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
          </svg>
          <span>{{ $t('common.loadingCategories', 'Loading categories...') }}</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-5">
        <div class="alert alert-danger" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ $t('common.error', 'Error loading categories') }}: {{ error }}
        </div>
        <button class="btn btn-primary" @click="fetchCategories()">
          {{ $t('common.retry', 'Try Again') }}
        </button>
      </div>

      <!-- Tab Content -->
      <div v-else>
        <div v-if="activeTab === 'real-estate'">
          <div v-if="realEstateCategories.length === 0" class="text-center py-5">
            <p class="text-muted">{{ $t('dealsCategories.noCategories', 'No categories found for this section.') }}</p>
          </div>
          <div v-else class="row g-4">
            <div v-for="category in realEstateCategories" :key="category.id" class="col-lg-3 col-sm-6">
              <router-link class="cat-item d-block bg-light text-center rounded p-3" :to="`/category/${category.slug}`">
                <div class="rounded p-4">
                  <div class="icon mb-3">
                    <img class="img-fluid" :src="category.iconUrl" :alt="category.name + ' Icon'">
                  </div>
                  <h6>{{ $t('dealsCategories.categories.' + category.name.toLowerCase().replace(/\s+/g, '-'), category.name) }}</h6>
                  <span>{{ category.count }} {{ $t('dealsCategories.dealsSuffix', 'Deals') }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'cars'">
          <div v-if="carCategories.length === 0" class="text-center py-5">
            <p class="text-muted">{{ $t('dealsCategories.noCategories', 'No categories found for this section.') }}</p>
          </div>
          <div v-else class="row g-4">
            <div v-for="category in carCategories" :key="category.id" class="col-lg-4 col-sm-6">
              <router-link class="cat-item d-block bg-light text-center rounded p-3" :to="`/category/${category.slug}`">
                <div class="rounded p-4">
                  <div class="icon mb-3">
                    <img class="img-fluid" :src="category.iconUrl" :alt="category.name + ' Icon'">
                  </div>
                  <h6>{{ $t('dealsCategories.categories.' + category.name.toLowerCase().replace(/\s+/g, '-'), category.name) }}</h6>
                  <span>{{ category.count }} {{ $t('dealsCategories.dealsSuffix', 'Deals') }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'other'">
          <div v-if="otherCategories.length === 0" class="text-center py-5">
            <p class="text-muted">{{ $t('dealsCategories.noCategories', 'No categories found for this section.') }}</p>
          </div>
          <div v-else class="row g-4">
            <div v-for="category in otherCategories" :key="category.id" class="col-lg-4 col-sm-6">
              <router-link class="cat-item d-block bg-light text-center rounded p-3" :to="`/category/${category.slug}`">
                <div class="rounded p-4">
                  <div class="icon mb-3">
                    <img class="img-fluid" :src="category.iconUrl" :alt="category.name + ' Icon'">
                  </div>
                  <h6>{{ $t('dealsCategories.categories.' + category.name.toLowerCase().replace(/\s+/g, '-'), category.name) }}</h6>
                  <span>{{ category.count }} {{ $t('dealsCategories.dealsSuffix', 'Deals') }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*** Category ***/
.cat-item div {
    background: #FFFFFF;
    border: 1px dashed rgba(0, 185, 142, .3);
    transition: .5s;
}

.cat-item:hover div {
    background: var(--primary);
    border-color: transparent;
}

.cat-item div * {
    transition: .5s;
}
.cat-item img.img-fluid {
    height: 48px; /* Standardized icon height */
    width: 48px; /* Standardized icon width */
    object-fit: contain;
}
.cat-item:hover div * {
    color: #FFFFFF !important;
}

/*** Property List ***/
.nav-pills .nav-item .btn {
    color: var(--dark);
}

.nav-pills .nav-item .btn:hover,
.nav-pills .nav-item .btn.active {
    color: #FFFFFF;
}

/*** Loading Spinner ***/
.spinner {
    animation: rotate 2s linear infinite;
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}
</style>