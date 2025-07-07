<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DealService from '@/services/DealService';
import { useI18n } from 'vue-i18n';
import { BTabs, BTab } from 'bootstrap-vue-next';

const { t } = useI18n();
const route = useRoute();
const deal = ref(null);
const loading = ref(true);
const error = ref(null);
const messages = ref([]);

const fetchDealDetails = async () => {
  const dealId = route.params.id;
  if (!dealId) return;

  try {
    loading.value = true;
    error.value = null;
    const dealResponse = await DealService.getDealById(dealId);
    if (!dealResponse.data.success) {
      throw new Error(dealResponse.data.message);
    }
    deal.value = dealResponse.data.deal;

    const messagesResponse = await DealService.getDealMessages(dealId);
    if (messagesResponse.data.success) {
      messages.value = messagesResponse.data.conversations;
    }
  } catch (err) {
    console.error('Failed to fetch deal details:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDealDetails);

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
            <b-tabs content-class="mt-3">
              <b-tab title="Details" active>
                <p class="mb-4">{{ deal.description }}</p>
                <p><i class="fa fa-check text-primary me-3"></i>{{ $t('dealDetail.price') }}: {{ deal.price }}</p>
                <p><i class="fa fa-check text-primary me-3"></i>{{ $t('dealDetail.location') }}: {{ deal.location }}</p>
                <p><i class="fa fa-check text-primary me-3"></i>{{ $t('dealDetail.category') }}: {{ deal.category?.name || $t('dealDetail.notAvailable') }}</p>
              </b-tab>
              <b-tab title="Attributes">
                <ul class="list-group">
                  <li v-for="(value, key) in deal.attributes" :key="key" class="list-group-item d-flex justify-content-between align-items-center">
                    {{ key.charAt(0).toUpperCase() + key.slice(1) }}
                    <span class="badge bg-primary rounded-pill">{{ value }}</span>
                  </li>
                </ul>
              </b-tab>
              <b-tab title="Messages">
                <div v-if="messages.length === 0" class="alert alert-info">No messages yet.</div>
                <ul v-else class="list-group">
                  <li v-for="conversation in messages" :key="conversation.id" class="list-group-item">
                    <h5>Conversation with {{ conversation.userOne.id === deal.seller.id ? conversation.userTwo.displayName : conversation.userOne.displayName }}</h5>
                    <ul class="list-group">
                        <li v-for="message in conversation.messages" :key="message.id" class="list-group-item">
                            <strong>{{ message.sender.displayName }}:</strong> {{ message.content }}
                        </li>
                    </ul>
                  </li>
                </ul>
              </b-tab>
            </b-tabs>
            <div class="mt-4 d-flex justify-content-between">
              <a class="btn btn-primary py-3 px-5" href="">{{ $t('dealDetail.contactSeller') }}</a>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="alert alert-warning" role="alert">
        {{ $t('dealDetail.dealNotFound') }}
      </div>

      <div class="mt-4">        
        <router-link to="/" class="btn btn-outline-success">
                    {{ t('common.backToHome', 'Back to Home') }}
        </router-link>
      </div>

    </div>
  </div>
</template>


<style scoped>
/* Add any component-specific styles here */
</style>