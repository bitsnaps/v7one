<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import DealService from '@/services/DealService';

const route = useRoute();
const { t } = useI18n();

const deals = ref([]);
const loading = ref(true);
const error = ref(null);
const categorySlug = computed(() => route.params.slug);
const categoryInfo = ref(null);
const searchQuery = ref('');
const activeFilters = ref({}); // To store active filters, e.g., { propertyType: 'apartment' }

// Mock filter options based on category - this would ideally come from an API or be more dynamic
const categoryFilterOptions = computed(() => {
  if (categorySlug.value === 'real-estate') {
    return [
      {
        id: 'propertyType',
        label: t('categoryView.filters.propertyType', 'Property Type'),
        options: [
          { value: 'all', text: t('categoryView.filters.allTypes', 'All Types') },
          { value: 'apartment', text: t('categoryView.filters.apartment', 'Apartment') },
          { value: 'villa', text: t('categoryView.filters.villa', 'Villa') },
          { value: 'house', text: t('categoryView.filters.house', 'House') },
          { value: 'office', text: t('categoryView.filters.office', 'Office') },
          { value: 'building', text: t('categoryView.filters.building', 'Building') },
          { value: 'townhouse', text: t('categoryView.filters.townhouse', 'Townhouse') },
          { value: 'shop', text: t('categoryView.filters.shop', 'Shop') },
          { value: 'garage', text: t('categoryView.filters.garage', 'Garage') },
        ],
      },
      // Add more real-estate specific filters here, e.g., beds, baths
    ];
  } else if (categorySlug.value === 'cars-bikes-boats') {
    return [
      {
        id: 'vehicleType',
        label: t('categoryView.filters.vehicleType', 'Vehicle Type'),
        options: [
          { value: 'all', text: t('categoryView.filters.allTypes', 'All Types') },
          { value: 'car-sedan', text: t('categoryView.filters.carSedan', 'Sedan') },
          { value: 'car-suv', text: t('categoryView.filters.carSuv', 'SUV') },
          { value: 'car-truck', text: t('categoryView.filters.carTruck', 'Truck') },
          // Add more vehicle types
        ],
      },
    ];
  }
  // Add other categories and their specific filters
  return []; // Default to no specific filters
});

const fetchDeals = async () => {
  loading.value = true;
  error.value = null;
  deals.value = [];
  
  try {
    const response = await DealService.getDeals(); // Pass params if your service/API supports it for pre-filtering
    if (response.data && response.data.success) {
      let fetchedDeals = response.data.data;
      // Initial category filtering (pre-search/dynamic filters)
      if (categorySlug.value && categorySlug.value !== 'all') {
        deals.value = fetchedDeals.filter(deal => {
          return deal.category && deal.category.some(cat => 
            cat === categorySlug.value || 
            cat.includes(categorySlug.value) ||
            (categorySlug.value === 'real-estate' && ['featured', 'for-sale', 'for-rent'].some(c => deal.category.includes(c)))
          );
        });
      } else {
        deals.value = fetchedDeals;
      }
    } else {
      throw new Error(response.data.message || 'Failed to fetch deals: Invalid data format');
    }
  } catch (e) {
    console.error('Failed to fetch deals:', e);
    error.value = e.message || t('common.error');
    deals.value = [];
  } finally {
    loading.value = false;
  }
};

const filteredDeals = computed(() => {
  let items = deals.value;

  // Filter by search query (name/title)
  if (searchQuery.value) {
    items = items.filter(deal => 
      deal.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Apply active dynamic filters
  for (const filterKey in activeFilters.value) {
    const filterValue = activeFilters.value[filterKey];
    if (filterValue && filterValue !== 'all') { // 'all' means no filter for this criteria
      items = items.filter(deal => {
        // This is a simplified example. Real-world scenarios might need more complex logic
        // depending on how filterable attributes are stored in the deal object.
        // Assuming deal.attributes is an object like { propertyType: 'apartment', color: 'red' }
        // Or deal.type for a primary type like in current mock data
        if (filterKey === 'propertyType' || filterKey === 'vehicleType') {
          return deal.type && deal.type.toLowerCase().replace(/\s+/g, '') === filterValue;
        }
        // Add more specific filter logic here based on filterKey
        return true; // Fallback if filterKey isn't handled
      });
    }
  }
  return items;
});

const fetchCategoryInfo = async () => {
  if (!categorySlug.value || categorySlug.value === 'all') {
    categoryInfo.value = {
      name: t('categoryView.allCategories', 'All Categories'),
      description: t('categoryView.allCategoriesDesc', 'Browse all available deals')
    };
    // Reset filters when viewing all categories or if no specific category
    activeFilters.value = {}; 
    return;
  }

  try {
    const response = await DealService.getCategories();
    if (response.data && response.data.success) {
      const category = response.data.data.find(cat => cat.slug === categorySlug.value);
      if (category) {
        categoryInfo.value = category;
      } else {
        categoryInfo.value = {
          name: categorySlug.value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: t('categoryView.categoryDesc', 'Browse deals in this category')
        };
      }
    }
  } catch (e) {
    console.error('Failed to fetch category info:', e);
    categoryInfo.value = {
      name: categorySlug.value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: t('categoryView.categoryDesc', 'Browse deals in this category')
    };
  }
  // Reset filters when category changes
  activeFilters.value = {}; 
};

const retryFetch = () => {
  fetchDeals();
  fetchCategoryInfo();
};

// Watch for route changes
watch(() => route.params.slug, () => {
  searchQuery.value = ''; // Reset search query on category change
  fetchCategoryInfo(); // This will also reset activeFilters
  fetchDeals();
}, { immediate: true });

onMounted(() => {
  // Initial fetch is handled by the watcher with immediate: true
});
</script>

<template>
  <div class="container-xxl bg-white p-0">
    <!-- Spinner Start -->
    <div v-if="loading && !error && !filteredDeals.length" id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem" role="status">
        <span class="sr-only">{{ t('common.loading', 'Loading...') }}</span>
      </div>
    </div>
    <!-- Spinner End -->

    <!-- Header Start -->
    <div class="container-fluid nav-bar bg-transparent">
      <div class="container">
        <!-- Generic Filter Start -->
        <div class="row g-3 mb-5 mt-2 justify-content-center align-items-end">
          <!-- Search Bar -->
          <div class="col-md-6 col-lg-5">
            <label for="searchQueryInput" class="form-label">{{ t('categoryView.filters.searchLabel', 'Search by Name') }}</label>
            <input type="text" class="form-control" id="searchQueryInput" :placeholder="t('categoryView.filters.searchPlaceholder', 'Enter deal name...')" v-model="searchQuery">
          </div>

          <!-- Dynamic Filters -->
          <template v-for="filterGroup in categoryFilterOptions" :key="filterGroup.id">
            <div class="col-md-6 col-lg-3">
              <label :for="filterGroup.id" class="form-label">{{ filterGroup.label }}</label>
              <select class="form-select" :id="filterGroup.id" v-model="activeFilters[filterGroup.id]">
                <option v-for="option in filterGroup.options" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </template>
        </div>
        <!-- Generic Filter End -->

        <!-- Category Info -->
        <!-- <div v-if="categoryInfo && !loading && !error" class="text-center mx-auto mb-5" style="max-width: 600px;">
          <h1 class="mb-3">{{ categoryInfo.name }}</h1>
          <p>{{ categoryInfo.description }}</p>
        </div> -->

        <!-- Loading State (only if initial deals are loading and no filters applied yet) -->
        <div v-if="loading && deals.length === 0" class="text-center py-5">
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

        <!-- No Deals Found State (after applying filters or initial load) -->
        <div v-else-if="filteredDeals.length === 0" class="text-center py-5">
          <div class="alert alert-info" role="alert">
            <h4 class="alert-heading">{{ t('categoryView.noDeals', 'No Deals Found') }}</h4>
            <p>{{ t('categoryView.noDealsDesc', 'No deals match your current criteria. Try adjusting your search or filters.') }}</p>
            <hr>
            <router-link v-if="categorySlug !== 'all'" :to="{ name: 'CategoryView', params: { slug: 'all' } }" class="btn btn-primary me-2">
              {{ t('categoryView.viewAllDeals', 'View All Deals') }}
            </router-link>
            <!-- <router-link to="/" class="btn btn-outline-secondary">
              {{ t('common.backToHome', 'Back to Home') }}
            </router-link> -->
          </div>
        </div>

        <!-- Deals Grid -->
        <div v-else class="row g-4">
          <div v-for="deal in filteredDeals" :key="deal.id" class="col-lg-4 col-md-6">
            <div class="property-item rounded overflow-hidden">
              <div class="position-relative overflow-hidden">
                <a href="#"> <!-- Consider making this a router-link to a deal details page -->
                  <img class="img-fluid" :src="deal.image || '/img/deal.svg'" :alt="deal.title">
                </a>
                <div class="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">
                  {{ t('dealsListing.status.' + (deal.status ? deal.status.toLowerCase().replace(/\s+/g, '') : 'unknown'), deal.status || 'N/A') }}
                </div>
                <div class="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">
                  {{ t('dealsListing.types.' + (deal.type ? deal.type.toLowerCase().replace(/\s+/g, '') : 'unknown'), deal.type || 'N/A') }}
                </div>
              </div>
              <div class="p-4 pb-0">
                <h5 class="text-primary mb-3">{{ deal.price }}</h5>
                <a class="d-block h5 mb-2" href="#">{{ deal.title }}</a>
                <p><i class="fa fa-map-marker-alt text-primary me-2"></i>{{ deal.location }}</p>
              </div>
              <div class="d-flex border-top">
                <small class="flex-fill text-center border-end py-2">
                  <i class="fa fa-ruler-combined text-primary me-2"></i>{{ deal.sqft || 'N/A' }}
                </small>
                <small class="flex-fill text-center border-end py-2">
                  <i class="fa fa-bed text-primary me-2"></i>{{ deal.beds || 'N/A' }}
                </small>
                <small class="flex-fill text-center py-2">
                  <i class="fa fa-bath text-primary me-2"></i>{{ deal.baths || 'N/A' }}
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination (Placeholder - implement if needed) -->
        <div v-if="filteredDeals.length > 0" class="row mt-5">
          <div class="col-12 text-center">
            <nav aria-label="Deals pagination">
              <ul class="pagination justify-content-center">
                <li class="page-item disabled">
                  <a class="page-link" href="#" tabindex="-1" aria-disabled="true">{{ t('common.previous') }}</a>
                </li>
                <li class="page-item active" aria-current="page">
                  <a class="page-link" href="#">1</a>
                </li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item">
                  <a class="page-link" href="#">{{ t('common.next') }}</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
    <!-- Category End -->
  </div>
</template>

<style scoped>
.filter-container {
  transition: all 0.3s ease-in-out;
}

.filter-container:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

/* Add any additional styles for filters if needed */
.form-label {
  font-weight: 500;
}

/* Ensure consistent spacing for filter elements */
.g-3 > [class*="col-"] {
    padding-top: 0.5rem; /* Adjust as needed */
    padding-bottom: 0.5rem; /* Adjust as needed */
}

.property-item img {
  height: 200px; /* Or your desired fixed height */
  object-fit: cover; /* Ensures the image covers the area, cropping if necessary */
  width: 100%;
}

</style>