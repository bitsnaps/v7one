<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import UserService from '@/services/UserService';
import MediaManager from './MediaManager.vue';

const route = useRoute();
const listingId = route.params.listingId;
const media = ref([]);
const listing = ref(null);
const subscription = ref(null);
const maxPhotos = ref(0);

const fetchListingAndMedia = async () => {
  try {
    const listingResponse = await UserService.getListing(listingId);
    listing.value = listingResponse.data;
    const mediaResponse = await UserService.getListingMedia(listingId);
    media.value = mediaResponse.data;
    const subscriptionResponse = await UserService.getSubscription();
    subscription.value = subscriptionResponse.data;
    if (subscription.value && subscription.value.PricingPlan) {
      maxPhotos.value = subscription.value.PricingPlan.maxPhotosN;
    }
  } catch (error) {
    console.error('Error fetching listing and media:', error);
  }
};

const handleMediaUpdate = async (updatedMedia) => {
  try {
    await UserService.updateListingMedia(listingId, updatedMedia);
    media.value = updatedMedia;
  } catch (error) {
    console.error('Error updating media:', error);
  }
};

onMounted(fetchListingAndMedia);
</script>

<template>
  <main class="content">
    <div class="container-fluid p-0">
      <h1 class="h3 mb-3">Manage Media for <span v-if="listing">{{ listing.title }}</span></h1>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Media</h5>
              <button class="btn btn-primary btn-sm float-end" @click="handleMediaUpdate(media)">Save Changes</button>
            </div>
            <div class="card-body">
              <MediaManager :listing-id="listingId" :media="media" :max-photos="maxPhotos" @update:media="media = $event" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>