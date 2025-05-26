<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t } = useI18n();

const deals = ref([]);
const loading = ref(true);
const error = ref(null);
const categorySlug = computed(() => route.params.slug);
const categoryInfo = ref(null);

const fetchDeals = async () => {
  loading.value = true;
  error.value = null;
  deals.value = [];
  
  try {
    // Fetch deals from API
    const response = await fetch(`${import.meta.env.DEV ? 'http://localhost:3000' : ''}/api/deals`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const results = await response.json();
    if (results.success && results.data) {
      // Filter deals by category if a specific category is selected
      if (categorySlug.value && categorySlug.value !== 'all') {
        deals.value = results.data.filter(deal => {
          // Check if deal has category array and includes the category slug
          return deal.category && deal.category.some(cat => 
            cat === categorySlug.value || 
            cat.includes(categorySlug.value) ||
            (categorySlug.value === 'real-estate' && ['featured', 'for-sale', 'for-rent'].some(c => deal.category.includes(c)))
          );
        });
      } else {
        deals.value = results.data;
      }
    } else {
      throw new Error(results.message || 'Failed to fetch deals: Invalid data format');
    }
  } catch (e) {
    console.error('Failed to fetch deals:', e);
    error.value = e.message || t('common.error');
    deals.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchCategoryInfo = async () => {
  if (!categorySlug.value || categorySlug.value === 'all') {
    categoryInfo.value = {
      name: t('categoryView.allCategories', 'All Categories'),
      description: t('categoryView.allCategoriesDesc', 'Browse all available deals')
    };
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.DEV ? 'http://localhost:3000' : ''}/api/categories`);
    if (response.ok) {
      const results = await response.json();
      if (results.success && results.data) {
        const category = results.data.find(cat => cat.slug === categorySlug.value);
        if (category) {
          categoryInfo.value = category;
        } else {
          categoryInfo.value = {
            name: categorySlug.value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: t('categoryView.categoryDesc', 'Browse deals in this category')
          };
        }
      }
    }
  } catch (e) {
    console.error('Failed to fetch category info:', e);
    categoryInfo.value = {
      name: categorySlug.value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: t('categoryView.categoryDesc', 'Browse deals in this category')
    };
  }
};

const retryFetch = () => {
  fetchDeals();
  fetchCategoryInfo();
};

// Watch for route changes
watch(() => route.params.slug, () => {
  fetchCategoryInfo();
  fetchDeals();
}, { immediate: true });

onMounted(() => {
  fetchCategoryInfo();
  fetchDeals();
});
</script>

<template>
  <div class="container-xxl bg-white p-0">
    <!-- Spinner Start -->
    <div v-if="loading && !error" id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem" role="status">
        <span class="sr-only">{{ t('common.loading', 'Loading...') }}</span>
      </div>
    </div>
    <!-- Spinner End -->

    <!-- Header Start -->
    <div class="container-fluid nav-bar bg-transparent">
      <div class="container">

        <!-- Generic Filter Start -->
        <div class="row g-4 mb-5 mt-2 justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="p-4 rounded bg-light filter-container">
              <h5 class="text-center mb-3">{{ t('common.filterDeals', 'Filter Deals') }}</h5>
              <!-- Actual filter controls will go here -->
              <p class="text-muted text-center">{{ t('common.filterPlaceholderText', 'Filter options will be available soon.') }}</p>
            </div>
          </div>
        </div>
        <!-- Generic Filter End -->

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{ t('common.loading') }}</span>
          </div>
          <p class="mt-2">{{ t('common.loading') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-5">
          <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">{{ t('common.error') }}</h4>
            <p>{{ error }}</p>
            <hr>
            <button @click="retryFetch" class="btn btn-outline-danger">
              {{ t('common.retry') }}
            </button>
          </div>
        </div>

        <!-- No Deals Found State -->
        <div v-else-if="deals.length === 0" class="text-center py-5">
          <div class="alert alert-info" role="alert">
            <h4 class="alert-heading">{{ t('categoryView.noDeals', 'No Deals Found') }}</h4>
            <p>{{ t('categoryView.noDealsDesc', 'No deals are available in this category at the moment.') }}</p>
            <hr>
          </div>
        </div>

        <!-- Deals Grid -->
        <div v-else class="row g-4">
          <div v-for="deal in deals" :key="deal.id" class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div class="property-item rounded overflow-hidden">
              <div class="position-relative overflow-hidden">
                <a href="#">
                  <img class="img-fluid" :src="deal.image" :alt="deal.title">
                </a>
                <div class="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">
                  {{ t('dealsListing.status.' + deal.status.toLowerCase().replace(/\s+/g, ''), deal.status) }}
                </div>
                <div class="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">
                  {{ t('dealsListing.types.' + deal.type.toLowerCase().replace(/\s+/g, ''), deal.type) }}
                </div>
              </div>
              <div class="p-4 pb-0">
                <h5 class="text-primary mb-3">{{ deal.price }}</h5>
                <a class="d-block h5 mb-2" href="#">{{ deal.title }}</a>
                <p><i class="fa fa-map-marker-alt text-primary me-2"></i>{{ deal.location }}</p>
              </div>
              <div class="d-flex border-top">
                <small class="flex-fill text-center border-end py-2">
                  <i class="fa fa-ruler-combined text-primary me-2"></i>{{ deal.sqft }}
                </small>
                <small class="flex-fill text-center border-end py-2">
                  <i class="fa fa-bed text-primary me-2"></i>{{ deal.beds }}
                </small>
                <small class="flex-fill text-center py-2">
                  <i class="fa fa-bath text-primary me-2"></i>{{ deal.baths }}
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination (if needed in the future) -->
        <div v-if="deals.length > 0" class="row mt-5">
          <div class="col-12">
            <nav aria-label="Deals pagination">
              <!-- Pagination component can be added here -->
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.property-item {
  transition: transform 0.3s ease;
}

.property-item:hover {
  transform: translateY(-5px);
}

.alert {
  border: none;
  border-radius: 10px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Generic Filter Styles */
.filter-container {
  border: 1px solid #dee2e6; /* Light border for the filter box */
}
</style>