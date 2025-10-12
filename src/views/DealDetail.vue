<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DealService from '@/services/DealService';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { BTabs, BTab } from 'bootstrap-vue-next';
import { formatPrice } from '@/helpers/utils';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const deal = ref(null);
const loading = ref(true);
const error = ref(null);
const messages = ref([]);
const newMessage = ref('');

const isOwner = computed(() => {
  return auth.isLoggedIn && deal.value && auth.user.id === deal.value.seller.id;
});

const deleteDeal = async () => {
    if (confirm('Are you sure you want to delete this deal?')) {
        try {
            await DealService.deleteDeal(deal.value.id);
            router.push('/');
        } catch (err) {
            console.error('Failed to delete deal:', err);
            error.value = err;
        }
    }
};

const sendMessage = async () => {
    if (!newMessage.value.trim()) return;

    try {
        await DealService.sendMessage({
            dealId: deal.value.id,
            content: newMessage.value,
            receiverId: deal.value.seller.id,
        });
        newMessage.value = '';
        fetchDealDetails();
    } catch (err) {
        console.error('Failed to send message:', err);
        error.value = err;
    }
};

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

// Media carousel state for detail view
const mediaList = computed(() => {
  const m = deal.value && Array.isArray(deal.value.media) ? deal.value.media.slice() : [];
  if (m.length) return m.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return deal.value?.image ? [{ id: 'fallback', url: deal.value.image, type: 'IMAGE', isPrimary: true, order: 0 }] : [];
});
const currentIndex = ref(0);
watch(() => deal.value?.id, () => { currentIndex.value = 0; });
const hasMultiple = computed(() => mediaList.value.length > 1);
const currentMedia = computed(() => mediaList.value.length ? mediaList.value[currentIndex.value % mediaList.value.length] : null);
const next = () => { if (mediaList.value.length) currentIndex.value = (currentIndex.value + 1) % mediaList.value.length; };
const prev = () => { if (mediaList.value.length) currentIndex.value = (currentIndex.value - 1 + mediaList.value.length) % mediaList.value.length; };
const goTo = (i) => { if (i >= 0 && i < mediaList.value.length) currentIndex.value = i; };

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
            <div class="about-img position-relative overflow-hidden p-5 pe-0 detail-carousel-container">
                <template v-if="currentMedia">
                    <img v-if="currentMedia.type === 'IMAGE'" class="img-fluid w-100 detail-media" :src="currentMedia.url" :alt="deal.title">
                    <div v-else class="position-relative">
                        <video class="img-fluid w-100 detail-media" :src="currentMedia.url" preload="metadata" playsinline controls></video>
                    </div>
                </template>
                <img v-else class="img-fluid w-100 detail-media" :src="deal.image || '/img/deal.svg'" :alt="deal.title">

                <button v-if="hasMultiple" class="detail-carousel-control prev" @click.stop.prevent="prev" aria-label="Previous">
                    <i class="fa fa-chevron-left"></i>
                </button>
                <button v-if="hasMultiple" class="detail-carousel-control next" @click.stop.prevent="next" aria-label="Next">
                    <i class="fa fa-chevron-right"></i>
                </button>
                <div v-if="hasMultiple" class="detail-carousel-dots">
                    <span v-for="(m, i) in mediaList" :key="m.id + '_' + i" :class="['dot', { active: i === currentIndex }]" @click.stop.prevent="goTo(i)"></span>
                </div>
            </div>
          </div>
          <div class="col-lg-6">
            <h1 class="mb-4">{{ deal.title }}</h1>
            <b-tabs content-class="mt-3">
              <b-tab title="Details" active>
                <p class="mb-4">{{ deal.description }}</p>
                <p><i class="fa fa-check text-primary me-3"></i>{{ $t('dealDetail.price') }}: {{ formatPrice(deal.price) }}</p>
                <p><i class="fa fa-check text-success me-3"></i>{{ $t('dealDetail.location') }}: {{ deal.location }}</p>
                <p><i class="fa fa-check text-info me-3"></i>{{ $t('dealDetail.category') }}: {{ (typeof(deal.category)=='object' && deal.category.length?deal.category[0]:deal.category) || $t('dealDetail.notAvailable') }}</p>
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
                <div v-if="auth.isLoggedIn && !isOwner" class="mt-3">
                  <textarea v-model="newMessage" class="form-control" rows="3" placeholder="Type your message..."></textarea>
                  <button @click="sendMessage" class="btn btn-primary mt-2">{{ $t('dealDetail.send', 'Send') }}</button>
                </div>
              </b-tab>
            </b-tabs>
            <div class="mt-4 d-flex justify-content-between">
              <button v-if="isOwner" class="btn btn-danger py-3 px-5" @click="deleteDeal">{{ $t('dealDetail.deleteDeal', 'Delete Deal') }}</button>
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
.detail-carousel-container { position: relative; }
.detail-media { width: 100%; height: 380px; object-fit: cover; display: block; border-radius: 6px; }
.detail-carousel-control { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.45); border: 0; color: #fff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 99; }
.detail-carousel-control.prev { left: 12px; }
.detail-carousel-control.next { right: 12px; }
.detail-carousel-dots { position: absolute; left: 50%; transform: translateX(-50%); bottom: 12px; display: flex; gap: 8px; }
.detail-carousel-dots .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.6); cursor: pointer; }
.detail-carousel-dots .dot.active { background: #ffffff; }
.play-icon-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: rgba(255,255,255,0.9); font-size: 48px; pointer-events: none; }
</style>