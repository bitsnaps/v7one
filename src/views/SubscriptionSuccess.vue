<template>
  <div class="container py-5 text-center">
    <div class="alert alert-success">
      <h4 class="alert-heading">{{ t('pricing.subscriptionSuccess.title') }}</h4>
      <p>{{ t('pricing.subscriptionSuccess.message') }}</p>
    </div>
    <router-link to="/" class="btn btn-primary">{{ t('pricing.subscriptionSuccess.homeButton') }}</router-link>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>