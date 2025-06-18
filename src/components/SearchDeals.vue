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
    filtered = filtered.filter(deal => deal.isFeatured);
  } else {
    filtered = filtered.filter(deal => deal.type === activeTab.value);
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
                            <DealCard :deal="deal" />
                        </div>
                    </div>
                </div>
                <div v-else-if="!searchLoading && searchResults.length === 0 && (searchKeyword || selectedDealType || selectedLocation)" class="text-center">
                    <p>{{ $t('home.noDealsFound', 'No deals found matching your criteria.') }}</p>
                </div>
            </div>
        </div>
</template>