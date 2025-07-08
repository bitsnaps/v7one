
<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import DealService from '@/services/DealService';
import AdminService from '@/services/AdminService';

export default {
  setup() {
    const auth = useAuthStore();
    const categories = ref([]);
    const attributes = ref([]);
    const attributeValues = ref({});
    const form = ref({
      title: '',
      description: '',
      price: 0,
      categoryId: null,
      listType: 'FOR_SALE',
      priceType: 'FIXED',
      condition: 'NEW',
      locationCity: '',
      locationRegion: '',
    });
    const currentStep = ref(1);
    const dealCreated = ref(null);
    const mediaItems = ref([]);
    const pendingMedia = ref([]);

    onMounted(() => {
      loadCategories();
    });

    const loadCategories = () => {
      DealService.getCategories()
        .then(response => {
          categories.value = response.data.data;
        })
        .catch(error => {
          console.error("Error fetching categories:", error);
        });
    };
    
    const loadAttributes = () => {
        if (!form.value.categoryId) return;
        AdminService.getAttributes(form.value.categoryId)
        .then(response => {
            attributes.value = response.data;
        })
        .catch(error => {
            console.error("Error fetching attributes:", error);
        });
    };

    const nextStep = () => {
      currentStep.value++;
    };
    
    const prevStep = () => {
      currentStep.value--;
    };

    const submitDeal = () => {
      const dealData = {
        ...form.value,
        attributes: attributeValues.value,
      };
      DealService.createDeal(dealData)
        .then(response => {
          dealCreated.value = response.data.deal;
          currentStep.value = 3;
          // Now save attribute values
          for (const attributeId in attributeValues.value) {
              const value = attributeValues.value[attributeId];
              if (value) {
                AdminService.createAttributeValue({
                    listingId: dealCreated.value.id,
                    attributeId: attributeId,
                    value: value,
                });
              }
          }
        })
        .catch(error => {
          console.error("Error creating deal:", error);
        });
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        pendingMedia.value.push({
          file: file,
          url: e.target.result,
          type: file.type.startsWith('video') ? 'VIDEO_URL' : 'IMAGE',
          isPrimary: false,
        });
      };
      reader.readAsDataURL(file);
    };

    const saveMedia = (media) => {
        AdminService.uploadFile(media.file).then(response => {
            const mediaData = {
                listingId: dealCreated.value.id,
                mediaUrl: response.data.url,
                mediaType: response.data.type,
                isPrimary: media.isPrimary,
            };
            AdminService.addListingMedia(mediaData).then(() => {
                pendingMedia.value = pendingMedia.value.filter(item => item !== media);
                loadMedia();
            });
        });
    };

    const removeMedia = (media) => {
        pendingMedia.value = pendingMedia.value.filter(item => item !== media);
    };

    const loadMedia = () => {
      if (dealCreated.value) {
        AdminService.getListingMedia(dealCreated.value.id).then(response => {
          mediaItems.value = response.data;
        });
      }
    };

    return {
      auth,
      form,
      categories,
      attributes,
      attributeValues,
      currentStep,
      dealCreated,
      mediaItems,
      pendingMedia,
      nextStep,
      prevStep,
      submitDeal,
      handleFileUpload,
      loadAttributes,
      saveMedia,
      removeMedia,
      startOver,
    };

    function startOver() {
        Object.assign(form.value, {
            title: '',
            description: '',
            price: 0,
            categoryId: null,
            listType: 'FOR_SALE',
            priceType: 'FIXED',
            condition: 'NEW',
            locationCity: '',
            locationRegion: '',
        });
        attributeValues.value = {};
        attributes.value = [];
        pendingMedia.value = [];
        mediaItems.value = [];
        dealCreated.value = null;
        currentStep.value = 1;
    }
  }
};
</script>

<template>
  <div class="post-deal-container">
    <div class="container">
      <h1 class="page-title">{{ $t('postDeal.title', 'Post your Deal') }}</h1>
      <div v-if="!auth.isLoggedIn" class="not-logged-in">
        <p>
          You must be logged in to post a deal.
          <router-link to="/signin" class="btn btn-primary">Sign In</router-link>
        </p>
      </div>
      <div v-else class="post-deal-content">
        <!-- Step 1: Core Deal Information -->
        <div class="step-card" v-if="currentStep === 1">
          <h3 class="step-title">Step 1: Core Deal Information</h3>
          <form @submit.prevent="nextStep">
            <!-- Form fields for Listing model -->
            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input type="text" class="form-control" id="title" v-model="form.title" required />
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea class="form-control" id="description" v-model="form.description" rows="5" required></textarea>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="price" class="form-label">Price</label>
                <input type="number" class="form-control" id="price" v-model.number="form.price" required />
              </div>
              <div class="col-md-6 mb-3">
                <label for="categoryId" class="form-label">Category</label>
                <select class="form-select" id="categoryId" v-model="form.categoryId" @change="loadAttributes" required>
                  <option disabled :value="null">Select a category</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="listType" class="form-label">Listing Type</label>
                <select class="form-select" id="listType" v-model="form.listType">
                  <option>FOR_SALE</option>
                  <option>FOR_RENT</option>
                  <option>FOR_EXCHANGE</option>
                  <option>SERVICE</option>
                  <option>COMMUNITY</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="priceType" class="form-label">Price Type</label>
                <select class="form-select" id="priceType" v-model="form.priceType">
                  <option>FIXED</option>
                  <option>NEGOTIABLE</option>
                  <option>CONTACT_FOR_PRICE</option>
                  <option>FREE</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="condition" class="form-label">Condition</label>
                <select class="form-select" id="condition" v-model="form.condition">
                  <option>NEW</option>
                  <option>USED_LIKE_NEW</option>
                  <option>USED_GOOD</option>
                  <option>USED_FAIR</option>
                  <option>REFURBISHED</option>
                  <option>FOR_PARTS</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="locationCity" class="form-label">City</label>
                <input type="text" class="form-control" id="locationCity" v-model="form.locationCity" />
              </div>
              <div class="col-md-12 mb-3">
                <label for="locationRegion" class="form-label">Region</label>
                <input type="text" class="form-control" id="locationRegion" v-model="form.locationRegion" />
              </div>
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary" :disabled="!form.categoryId">Next</button>
            </div>
          </form>
        </div>

        <!-- Step 2: Category Attributes -->
        <div class="step-card" v-if="currentStep === 2">
          <h3 class="step-title">Step 2: Attributes</h3>
          <form @submit.prevent="submitDeal">
             <div v-for="attr in attributes" :key="attr.id" class="mb-3">
                <label :for="`attr-${attr.id}`" class="form-label">{{ attr.name }}</label>
                <input :type="attr.type === 'NUMBER' ? 'number' : 'text'" class="form-control" :id="`attr-${attr.id}`" v-model="attributeValues[attr.id]" :required="attr.isRequired" />
            </div>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="button" class="btn btn-secondary" @click="prevStep">Back</button>
              <button type="submit" class="btn btn-primary">Create Deal</button>
            </div>
          </form>
        </div>

        <!-- Step 3: Media Upload -->
        <div class="step-card" v-if="currentStep === 3">
          <h3 class="step-title">Step 3: Upload Media</h3>
          <p class="text-success">Your deal has been created! You can now upload media.</p>
          <div class="mb-3">
            <label for="mediaFile" class="form-label">Upload File</label>
            <input type="file" class="form-control" id="mediaFile" @change="handleFileUpload" />
          </div>
          <div v-if="pendingMedia.length > 0" class="media-preview">
            <h4 class="preview-title">Pending Media:</h4>
            <div class="row">
                <div class="col-6 col-md-4 col-lg-3 mb-3" v-for="(media, index) in pendingMedia" :key="index">
                    <div class="media-item">
                        <img v-if="media.type === 'IMAGE'" :src="media.url" class="img-fluid" />
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="media.isPrimary">
                            <label class="form-check-label">Primary</label>
                        </div>
                        <button class="btn btn-success btn-sm mt-2" @click="saveMedia(media)">Save</button>
                        <button class="btn btn-danger btn-sm mt-2" @click="removeMedia(media)">Remove</button>
                    </div>
                </div>
            </div>
          </div>
          <div v-if="mediaItems.length > 0" class="media-preview mt-4">
            <h4 class="preview-title">Uploaded Media:</h4>
            <div class="row">
              <div class="col-6 col-md-4 col-lg-3 mb-3" v-for="media in mediaItems" :key="media.id">
                <div class="media-item">
                  <img v-if="media.mediaType === 'IMAGE'" :src="`/public/${media.mediaUrl}`" class="img-fluid" />
                  <div v-else class="video-placeholder">
                    <span>{{ media.mediaUrl }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="d-grid mt-4">
            <button class="btn btn-info" @click="startOver">Add Another Deal</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-deal-container {
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: 100vh;
}
.page-title {
  text-align: center;
  margin-bottom: 2rem;
  font-weight: bold;
}
.not-logged-in {
  text-align: center;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.post-deal-content {
  max-width: 800px;
  margin: auto;
}
.step-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}
.step-title {
  margin-bottom: 1.5rem;
  font-weight: 500;
}
.media-preview .preview-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
.media-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}
.media-item img {
  width: 100%;
  height: auto;
  display: block;
}
.video-placeholder {
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #666;
}
</style>