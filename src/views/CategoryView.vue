<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import DealService from '@/services/DealService';

const route = useRoute();
const { t } = useI18n();

const deals = ref([]);
const allCategories = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(0);
const categorySlug = computed(() => route.params.slug);
const categoryInfo = ref(null);
const searchQuery = ref('');
const activeFilters = ref({}); // To store active filters, e.g., { propertyType: 'apartment' }

const attributeFilters = computed(() => {
  const filters = {};
  
  deals.value.forEach(deal => {
    if (deal.attributes) {
      // deal.attributes looks like this: {sqft: '2500', baths: '3', beds: '4'}
      // loop through each key/value attribute
      /*deal.attributes.forEach(attr => {
        // Simple check to avoid adding complex objects or arrays as filters
        if (typeof attr.value === 'string' || typeof attr.value === 'number') {
          if (!filters[attr.name]) {
            filters[attr.name] = {
              id: attr.name,
              label: attr.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Prettify label
              options: new Set(['all']) // Use a Set to store unique values
            };
          }
          filters[attr.name].options.add(attr.value);
        }
      });*/
      // replace the above code with a loop like so: Object.entries(deal.attributes).forEach
      Object.entries(deal.attributes).forEach(([key, value]) => {
        if (!filters[key]) {
          filters[key] = {
            id: key,
            label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Prettify label
            options: new Set(['all']) // Use a Set to store unique values
          };
        }
        filters[key].options.add(value);
      });
    }
  });

  // Convert sets to arrays of objects for the template
  return Object.values(filters).map(filter => ({
    ...filter,
    options: Array.from(filter.options).map(value => ({
      value: value,
      text: value === 'all' ? t('filters.all', 'All') : value
    }))
  }));
});

// Mock filter options based on category - this would ideally come from an API or be more dynamic
const categoryFilterOptions = computed(() => {
  if (!categorySlug.value || !allCategories.value.length) {
    return [];
  }
  
  // Find sub-categories that match the current category slug (which is the parent's type)
  const subCategories = allCategories.value.filter(cat => cat.type === categorySlug.value);
  if (subCategories.length > 0) {
    return [
      {
        id: 'propertyType',
        label: t('filters.propertyType', 'Property Type'),
        options: [
          { value: 'all', text: t('filters.allTypes', 'All Types') },
          ...subCategories.map(cat => ({ value: cat.slug, text: t(`filters.${cat.name.toLowerCase()}`, cat.name) }))
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
      limit: 9,
    };

    // Add specific category filter if one is selected
    const activeCategoryFilter = activeFilters.value.propertyType || 'all';
    if (activeCategoryFilter && activeCategoryFilter !== 'all') {
      params.category = activeCategoryFilter;
    }

    const response = await DealService.getDeals(categorySlug.value, params);
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

  const activeFilterKeys = Object.keys(activeFilters.value).filter(
    key => activeFilters.value[key] && activeFilters.value[key] !== 'all'
  );

  if (activeFilterKeys.length > 0) {
    items = items.filter(deal => {
      return activeFilterKeys.every(filterKey => {
        const filterValue = activeFilters.value[filterKey];
        
        // Client-side filtering for attributes, as the main category filtering is now server-side
        if (deal.attributes && deal.attributes.hasOwnProperty(filterKey)) {
          return String(deal.attributes[filterKey]) === String(filterValue);
        }

        // This part is tricky. The main category filter is now on the backend.
        // We might need to adjust how we think about client-side filtering.
        // For now, let's assume attribute filters are the only ones applied client-side.
        // The 'propertyType' is are now handled by the backend via the 'category' param.
        if (filterKey === 'propertyType') {
          return true; // Assume backend has already filtered this
        }

        return false;
      });
    });
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
      allCategories.value = response.data.data;
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

// Watch for route changes and filter changes
watch([() => route.params.slug, activeFilters], ([newSlug, newFilters], [oldSlug, oldFilters]) => {
  // Reset search and filters when the main category slug changes
  if (newSlug !== oldSlug) {
    searchQuery.value = '';
    activeFilters.value = {};
    fetchCategoryInfo();
    fetchDeals(1);
  } else {
    // Otherwise, just refetch deals for the current page when filters change
    fetchDeals(currentPage.value);
  }
}, { deep: true, immediate: true });

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
              <!-- <select class="form-select" :id="filterGroup.id" v-model="activeFilters[filterGroup.id]" @change="fetchDeals(1)"> -->
              <select class="form-select" :id="filterGroup.id" v-model="activeFilters[filterGroup.id]">
                <option v-for="option in filterGroup.options" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </template>
        </div>
        <!-- Generic Filter End -->

        <!-- Sidebar Dynamic Attribute Filters Begin -->
        <div class="row g-3 mb-5 mt-2 justify-content-center align-items-end">
          <template v-for="filterGroup in attributeFilters" :key="filterGroup.id">
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
        <!-- Sidebar Dynamic Attribute Filters End -->

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