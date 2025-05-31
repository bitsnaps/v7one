<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DealService from '@/services/DealService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const deal = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  const dealId = route.params.id;
  if (dealId) {
    try {
      loading.value = true;
      error.value = null;
      const response = await DealService.getDealById(dealId);
      if (!response.data.success){
        error.value = response.data.message;
        throw new Error(response.data.message);
      }
      deal.value = response.data.deal;
    } catch (err) {
      console.error('Failed to fetch deal:', err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }
});

</script>

<template>
  <div class="container-xxl py-5">
    <div class="container">
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ $t('dealDetail.errorLoading') }}: {{ error.message }}
      </div>
      <div v-else-if="deal">
        <div class="row g-5 align-items-center">
          <div class="col-lg-6">
            <div class="about-img position-relative overflow-hidden p-5 pe-0">
              <img class="img-fluid w-100" :src="deal.image || '/img/deal.svg'" :alt="deal.title">
            </div>
          </div>
          <div class="col-lg-6">
            <h1 class="mb-4">{{ deal.title }}</h1>
            <p class="mb-4">{{ deal.description }}</p>
            <p><i class="fa fa-check text-primary me-3"></i>{{ $t('dealDetail.price') }}: {{ deal.price }}</p>
            <p><i class="fa fa-check text-primary me-3"></i>{{ $t('dealDetail.location') }}: {{ deal.location }}</p>
            <p><i class="fa fa-check text-primary me-3"></i>{{ $t('dealDetail.category') }}: {{ deal.category?.name || $t('dealDetail.notAvailable') }}</p>
            <a class="btn btn-primary py-3 px-5 mt-3" href="">{{ $t('dealDetail.contactSeller') }}</a>
          </div>
          <div class="col-lg-6">
            <router-link to="/" class="btn btn-outline-secondary">
              {{ t('common.backToHome', 'Back to Home') }}
            </router-link>
          </div>
        </div>
      </div>
      <div v-else class="alert alert-warning" role="alert">
        {{ $t('dealDetail.dealNotFound') }}
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Add any component-specific styles here */
</style>