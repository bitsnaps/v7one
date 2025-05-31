<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import DealService from '@/services/DealService';

const deals = ref([]);
const activeTab = ref('featured'); // 'featured', 'for-sale', 'for-rent'
const loading = ref(true);
const error = ref(null);
const route = useRoute();

const { t } = useI18n();

const fetchDeals = async (queryParams = {}) => {
  loading.value = true;
  error.value = null;
  deals.value = []; // Clear previous deals
  try {
    const response = await DealService.getDeals(queryParams);
    if (response.data && response.data.success) {
      deals.value = response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch deals: Invalid data format');
    }
  } catch (e) {
    console.error('Failed to fetch deals:', e);
    error.value = e.message || t('common.error');
    deals.value = []; // Ensure deals are empty on error
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDeals(route.query);
});

watch(() => route.query, (newQuery) => {
  fetchDeals(newQuery);
});

const retryFetch = () => {
  fetchDeals();
};

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};

const displayedDeals = computed(() => {
  // If search query parameters are present, filtering is primarily done by the backend.
  // The tabs can act as additional client-side filters on the already (potentially) filtered results.
  let filtered = deals.value;

  // Apply tab-based filtering
  if (activeTab.value === 'featured') {
    filtered = filtered.filter(deal => deal.category && deal.category.includes('featured'));
  }
  if (activeTab.value === 'for-sale') {
    filtered = filtered.filter(deal => deal.status === 'For Sell');
  }
  if (activeTab.value === 'for-rent') {
    filtered = filtered.filter(deal => deal.status === 'For Rent');
  }
  return filtered;
});

</script>

<template>
        <div class="container-xxl py-5" v-if="searchLoading || searchError || searchResults.length > 0">
            <div class="container">
                <div v-if="searchLoading" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p>{{ $t('home.searchingDeals', 'Searching for deals...') }}</p>
                </div>
                <div v-else-if="searchError" class="alert alert-danger" role="alert">
                    {{ $t('home.searchError', 'Error fetching deals:') }} {{ searchError }}
                </div>
                <div v-else-if="searchResults.length > 0">
                    <h2 class="mb-4 text-center">{{ $t('home.searchResultsTitle', 'Search Results') }}</h2>
                    <div class="row g-4">
                        <div v-for="deal in searchResults" :key="deal.id" class="col-lg-4 col-md-6">
                            <div class="property-item rounded overflow-hidden">
                                <div class="position-relative overflow-hidden">
                                    <router-link :to="{ name: 'DealDetail', params: { id: deal.id } }">
                                      <img class="img-fluid" :src="deal.image || '/img/deal.svg'" :alt="deal.title">
                                    </router-link>
                                    <div class="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">{{ deal.status || $t('common.status.unknown', 'N/A') }}</div>
                                    <div class="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">{{ deal.type || $t('common.type.unknown', 'N/A') }}</div>
                                </div>
                                <div class="p-4 pb-0">
                                    <h5 class="text-primary mb-3">{{ deal.price || $t('common.priceOnRequest', 'Price on request') }}</h5>
                                    <router-link class="d-block h5 mb-2" :to="{ name: 'DealDetail', params: { id: deal.id } }">{{ deal.title }}</router-link>
                                    <p><i class="fa fa-map-marker-alt text-primary me-2"></i>{{ deal.location || $t('common.location.unknown', 'N/A') }}</p>
                                </div>
                                <div class="d-flex border-top">
                                    <small class="flex-fill text-center border-end py-2" v-if="deal.sqft"><i class="fa fa-ruler-combined text-primary me-2"></i>{{ deal.sqft }}</small>
                                    <small class="flex-fill text-center border-end py-2" v-if="deal.beds"><i class="fa fa-bed text-primary me-2"></i>{{ deal.beds }}</small>
                                    <small class="flex-fill text-center py-2" v-if="deal.baths"><i class="fa fa-bath text-primary me-2"></i>{{ deal.baths }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="!searchLoading && searchResults.length === 0 && (searchKeyword || selectedDealType || selectedLocation)" class="text-center">
                    <p>{{ $t('home.noDealsFound', 'No deals found matching your criteria.') }}</p>
                </div>
            </div>
        </div>
</template>