<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const pricingPlans = [
  {
    level: 'Basic',
    price: 'Free',
    features: [
      'Upload photos',
      'Free ad on social media platforms',
      'Normal pricing',
    ],
    sponsoredAd: 'Not available',
    bgColor: 'bg-light',
    btnClass: 'btn-outline-primary'
  },
  {
    level: 'Silver',
    price: '20,000 DZD',
    features: [
      'All in Basic package plus:',
      'Upload M additional photos',
      'Professional video',
      'Documentation',
    ],
    sponsoredAd: 'Local',
    bgColor: 'bg-light',
    btnClass: 'btn-primary'
  },
  {
    level: 'Gold',
    price: '30,000 DZD',
    features: [
      'All in Silver package plus:',
      'Special professional video',
      'Special documentation',
    ],
    sponsoredAd: 'International',
    bgColor: 'bg-light',
    btnClass: 'btn-warning'
  },
  {
    level: 'Special',
    price: '1%',
    features: [
      'All in Gold package plus:',
      'Consulting services',
    ],
    sponsoredAd: 'Special',
    bgColor: 'bg-light',
    btnClass: 'btn-success'
  },
];
</script>

<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="display-4 fw-bold">{{ t('pricing.title') }}</h1>
      <p class="lead text-muted">{{ t('pricing.description') }}</p>
      <p class="text-muted">(*) {{ t('pricing.note') }}</p>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      <div class="col" v-for="(plan, index) in pricingPlans" :key="index">
        <div :class="['card', 'h-100', 'shadow-sm', plan.bgColor]">
          <div class="card-header text-center py-3">
            <h4 class="my-0 fw-normal">{{ t(`pricing.plans.${plan.level.toLowerCase()}.level`) }}</h4>
          </div>
          <div class="card-body d-flex flex-column">
            <h1 class="card-title pricing-card-title text-center">
              {{ plan.price === 'Free' ? t('pricing.free') : plan.price.startsWith('1%') ? `1% ${t('pricing.ofDealValue')}` : plan.price }}
              <small v-if="plan.price !== 'Free' && !plan.price.startsWith('1%')" class="text-muted fw-light">/ {{ t('pricing.month') }}</small>
            </h1>
            <ul class="list-unstyled mt-3 mb-4 flex-grow-1">
              <li v-for="(feature, fIndex) in plan.features" :key="fIndex" class="mb-2">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                {{ t(`pricing.plans.${plan.level.toLowerCase()}.features[${fIndex}]`) }}
              </li>
            </ul>
            <p class="text-center text-danger fw-bold">{{ t('pricing.sponsoredAd') }}: {{ t(`pricing.plans.${plan.level.toLowerCase()}.sponsoredAd`) }}</p>
            <button type="button" :class="['w-100', 'btn', 'btn-lg', plan.btnClass]">
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