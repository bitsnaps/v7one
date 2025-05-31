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
    <div class="container-xxl py-5">
        <div class="container">
            <div class="row g-0 gx-5 align-items-end">
                <div class="col-lg-6">
                    <div class="text-start mx-auto mb-5">
                        <h1 class="mb-3">{{ $t('dealsListing.title', 'Deals Listing') }}</h1>
                        <p>{{ $t('dealsListing.description', "Explore our diverse range of deals. Whether you're looking for a house, villa, apartment, or a commercial space, we've got you covered.") }}</p>
                    </div>
                </div>
                <div class="col-lg-6 text-start text-lg-end">
                    <ul class="nav nav-pills d-inline-flex justify-content-end mb-5">
                        <li class="nav-item me-2">
                            <a class="btn btn-outline-primary" :class="{ active: activeTab === 'featured' }" @click.prevent="setActiveTab('featured')" href="#">{{ $t('dealsListing.tabs.featured', 'Featured') }}</a>
                        </li>
                        <li class="nav-item me-2">
                            <a class="btn btn-outline-primary" :class="{ active: activeTab === 'for-sale' }" @click.prevent="setActiveTab('for-sale')" href="#">{{ $t('dealsListing.tabs.forSell', 'For Sell') }}</a>
                        </li>
                        <li class="nav-item me-0">
                            <a class="btn btn-outline-primary" :class="{ active: activeTab === 'for-rent' }" @click.prevent="setActiveTab('for-rent')" href="#">{{ $t('dealsListing.tabs.forRent', 'For Rent') }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="tab-content">
                <!-- Loading State -->
                <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">{{ $t('common.loading') }}</span>
                    </div>
                    <p class="mt-2">{{ $t('common.loading') }}</p>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-5">
                    <p class="text-danger">{{ $t('common.error') }}: {{ error }}</p>
                    <button @click="retryFetch" class="btn btn-primary mt-2">{{ $t('common.retry') }}</button>
                </div>

                <!-- No Deals Found State -->
                <div v-else-if="displayedDeals.length === 0" class="text-center py-5">
                    <p>{{ $t('dealsListing.noDealsFound', 'No deals found for this category.') }}</p>
                </div>

                <!-- Deals Display -->
                <div v-else class="row g-4">
                    <div v-for="deal in displayedDeals" :key="deal.id" class="col-lg-4 col-md-6">
                        <div class="property-item rounded overflow-hidden">
                            <div class="position-relative overflow-hidden">
                                <router-link :to="{ name: 'DealDetail', params: { id: deal.id } }">
                                      <img class="img-fluid" :src="deal.image || '/img/deal.svg'" :alt="deal.title">
                                    </router-link>
                                <div class="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">{{ $t('dealsListing.status.' + deal.status.toLowerCase().replace(/\s+/g, ''), deal.status) }}</div>
                                <div class="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">{{ $t('dealsListing.types.' + deal.type.toLowerCase().replace(/\s+/g, ''), deal.type) }}</div>
                            </div>
                            <div class="p-4 pb-0">
                                <h5 class="text-primary mb-3">{{ deal.price }}</h5>
                                <router-link class="d-block h5 mb-2" :to="{ name: 'DealDetail', params: { id: deal.id } }">{{ deal.title }}</router-link>
                                <p><i class="fa fa-map-marker-alt text-primary me-2"></i>{{ deal.location }}</p>
                            </div>
                            <div class="d-flex border-top">
                                <small class="flex-fill text-center border-end py-2"><i class="fa fa-ruler-combined text-primary me-2"></i>{{ deal.sqft }}</small>
                                <small class="flex-fill text-center border-end py-2"><i class="fa fa-bed text-primary me-2"></i>{{ deal.beds }}</small>
                                <small class="flex-fill text-center py-2"><i class="fa fa-bath text-primary me-2"></i>{{ deal.baths }}</small>
                            </div>
                        </div>
                    </div>
                    <div v-if="displayedDeals.length === 0" class="col-12 text-center">
                        <p>No deals found for this category.</p>
                    </div>
                </div>
                <div class="col-12 text-center mt-4" v-if="displayedDeals.length > 0">
                    <a class="btn btn-primary py-3 px-5" href="#">{{ $t('dealsListing.browseMoreDeals', 'Browse More Deals') }}</a>
                </div>
            </div>
        </div>
    </div>
</template>