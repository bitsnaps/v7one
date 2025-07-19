<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import DealService from '../services/DealService';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const pricingPlans = ref([]);
const message = ref('');

async function subscribeToPlan(planId) {
  if (!authStore.isLoggedIn) {
    router.push({ name: 'SignIn', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  try {
    const response = await DealService.subscribeToPlan(planId);
    if (response.data.success) {
      router.push({ name: 'SubscriptionSuccess' });
    }
  } catch (error) {
    if (error.response?.status === 409) {
      message.value = t('pricing.alreadySubscribed');
    } else {
      message.value = error.response?.data?.message || t('pricing.subscriptionError');
    }
  }
}

onMounted(async () => {
  try {
    const response = await DealService.getPricingPlans();
    if (response.data.success) {
      pricingPlans.value = response.data.data.map(plan => ({
        ...plan,
        level: plan.name,
        price: plan.price === null ? `${plan.pricePercentage}%` : plan.price === 0 ? 'Free' : `${plan.price} DZD`,
        features: JSON.parse(JSON.stringify(plan.features)),
        sponsoredAd: plan.sponsoredAdType,
        bgColor: 'bg-light',
        btnClass: getButtonClass(plan.name)
      }));
    }
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
  }
});

function getButtonClass(level) {
  switch (level) {
    case 'Basic':
      return 'outline-primary';
    case 'Silver':
      return 'primary';
    case 'Gold':
      return 'warning';
    case 'Special':
      return 'success';
    default:
      return 'secondary';
  }
}
</script>

<template>
  <div class="container py-5">
    <div v-if="message" class="alert alert-info">{{ message }}</div>
    <div class="text-center mb-5">
      <h1 class="display-4 fw-bold">{{ t('pricing.title') }}</h1>
      <p class="lead text-muted">{{ t('pricing.description') }}</p>
      <p class="text-muted">(*) {{ t('pricing.note') }}</p>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      <div class="col" v-for="(plan, index) in pricingPlans" :key="index">
        <div :class="['card', 'h-100', 'shadow-sm', plan.bgColor]">
          <div :class="`card-header text-center py-3 bg-${plan.btnClass}`">
            <h4 class="my-0 fw-normal">{{ t(`pricing.plans.${plan.level.toLowerCase()}.level`) }}</h4>
          </div>
          <div class="card-body d-flex flex-column">
            <h1 class="card-title pricing-card-title text-center">
              {{ plan.price === 'Free' ? t('pricing.free') : plan.price.startsWith('1%') ? `1% ${t('pricing.ofDealValue')}` : plan.price }}
              <small v-if="plan.price !== 'Free' && !plan.price.startsWith('1%')" class="text-muted fw-light"></small>
            </h1>
            <ul class="list-unstyled mt-3 mb-4 flex-grow-1">
              <li v-for="(feature, fIndex) in plan.features" :key="fIndex" class="mb-2">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                {{ t(`pricing.plans.${plan.level.toLowerCase()}.features[${fIndex}]`) }}
              </li>
            </ul>
            <p class="text-center text-danger fw-bold">{{ t('pricing.sponsoredAd') }}: {{ t(`pricing.plans.${plan.level.toLowerCase()}.sponsoredAd`) }}</p>
            <button type="button" :class="['w-100', 'btn', 'btn-lg', `btn-${plan.btnClass}`]" @click="subscribeToPlan(plan.id)">
              {{ t('pricing.choosePlan') }}
            </button>
          </div>
        </div>
    </div>
</div>
  </div>
</template>

<style scoped>
.card {
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card-header {
  background-color: rgba(0,0,0,.03);
  border-bottom: 1px solid rgba(0,0,0,.125);
}

.pricing-card-title small {
  font-size: 0.8em;
}
</style>