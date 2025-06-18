<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import DealService from '@/services/DealService';

const deals = ref([]);
const activeTab = ref('featured'); // 'featured', 'FOR_SALE', 'FOR_RENT'
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

const displayedDeals = computed(() => {
  // If search query parameters are present, filtering is primarily done by the backend.
  // The tabs can act as additional client-side filters on the already (potentially) filtered results.
  return deals.value.filter(deal => activeTab.value === 'featured'? deal.isFeatured: deal.type === activeTab.value);
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
                            <a class="btn btn-outline-primary" :class="{ active: activeTab === 'featured' }" @click.prevent="activeTab = 'featured'" href="#">{{ $t('dealsListing.featured', 'Featured') }}</a>
                        </li>
                        <li class="nav-item me-2">
                            <a class="btn btn-outline-primary" :class="{ active: activeTab === 'FOR_SALE' }" @click.prevent="activeTab = 'FOR_SALE'" href="#">{{ $t('dealsListing.forsale', 'For Sell') }}</a>
                        </li>
                        <li class="nav-item me-0">
                            <a class="btn btn-outline-primary" :class="{ active: activeTab === 'FOR_RENT' }" @click.prevent="activeTab = 'FOR_RENT'" href="#">{{ $t('dealsListing.forrent', 'For Rent') }}</a>
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
                      <DealCard :deal="deal" />
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