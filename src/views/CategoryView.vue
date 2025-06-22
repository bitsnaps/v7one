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
const currentPage = ref(1);
const totalPages = ref(0);
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
        label: t('filters.propertyType', 'Property Type'),
        options: [
          { value: 'all', text: t('filters.allTypes', 'All Types') },
          { value: 'apartment', text: t('filters.apartment', 'Apartment') },
          { value: 'villa', text: t('filters.villa', 'Villa') },
          { value: 'house', text: t('filters.house', 'House') },
          { value: 'office', text: t('filters.office', 'Office') },
          { value: 'building', text: t('filters.building', 'Building') },
          { value: 'townhouse', text: t('filters.townhouse', 'Townhouse') },
          { value: 'shop', text: t('filters.shop', 'Shop') },
          { value: 'garage', text: t('filters.garage', 'Garage') },
        ],
      },
      // Add more real-estate specific filters here, e.g., beds, baths
    ];
  } else if (categorySlug.value === 'cars') {
    return [
      {
        id: 'vehicleType',
        label: t('filters.vehicleType', 'Vehicle Type'),
        options: [
          { value: 'all', text: t('filters.allTypes', 'All Types') },
          { value: 'sedan', text: t('filters.carSedan', 'Sedan') },
          { value: 'suv', text: t('filters.carSuv', 'SUV') },
          { value: 'truck', text: t('filters.carTruck', 'Truck') },
          // Add more vehicle types
        ],
      },
    ];
  }
  // Add other categories and their specific filters
  return []; // Default to no specific filters
});

const fetchDeals = async (page = 1) => {
  loading.value = true;
  error.value = null;

  try {
    const params = {
      page: page,
      limit: 9, // Or your desired limit
      category_slug: categorySlug.value !== 'all' ? categorySlug.value : undefined
    };
    const response = await DealService.getDeals(params);
    if (response.data && response.data.success) {
      deals.value = response.data.data;
      totalPages.value = response.data.totalPages;
      currentPage.value = page;
    } else {
      throw new Error(response.data.message || 'Failed to fetch deals');
    }
  } catch (e) {
    console.error('Failed to fetch deals:', e);
    error.value = e.message || t('common.error');
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
          // Ensure deal.category is treated as a string for comparison
          const category = String(deal.category || '').toLowerCase().replace(/\s+/g, '');
          return category === filterValue;
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
watch(() => route.params.slug, (newSlug) => {
  searchQuery.value = ''; // Reset search query on category change
  fetchCategoryInfo(); // This will also reset activeFilters
  fetchDeals(1); // Fetch first page for new category
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
            <label for="searchQueryInput" class="form-label">{{ t('filters.searchLabel', 'Search by Name') }}</label>
            <input type="text" class="form-control" id="searchQueryInput" :placeholder="t('filters.searchPlaceholder', 'Enter deal name...')" v-model="searchQuery">
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

            <DealCard :deal="deal" />

          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="row mt-5">
          <div class="col-12 text-center">
            <nav aria-label="Deals pagination">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="fetchDeals(currentPage - 1)">{{ t('common.previous') }}</a>
                </li>
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                  <a class="page-link" href="#" @click.prevent="fetchDeals(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="fetchDeals(currentPage + 1)">{{ t('common.next') }}</a>
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