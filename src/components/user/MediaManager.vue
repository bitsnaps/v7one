<script setup>
import { ref, watch } from 'vue';
import UserService from '@/services/UserService';

const props = defineProps({
  listingId: {
    type: String,
    required: false,
  },
  media: {
    type: Array,
    default: () => [],
  },
  maxPhotos: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['update:media']);

const localMedia = ref([]);

watch(() => props.media, (newMedia) => {
  localMedia.value = newMedia ? [...newMedia] : [];
}, { immediate: true, deep: true });

const handleFileUpload = async (event) => {
  const files = event.target.files;
  if (!files.length) return;

  if (props.maxPhotos > 0 && (localMedia.value.length + files.length) > props.maxPhotos) {
    alert(`You can only upload a maximum of ${props.maxPhotos} photos.`);
    return;
  }

  const uploadPromises = Array.from(files).map(file => {
    return UserService.uploadFile(file).then(response => {
      if (response.data.success) {
        return {
          mediaUrl: response.data.url,
          mediaType: response.data.type,
          isPrimary: false,
          order: 0
        };
      }
    });
  });

  try {
    const newMediaFiles = await Promise.all(uploadPromises);
    const validMediaFiles = newMediaFiles.filter(Boolean);
    localMedia.value.push(...validMediaFiles);
    emit('update:media', localMedia.value);
  } catch (error) {
    console.error('Error uploading files:', error);
  }
};

const removeMedia = (index) => {
  localMedia.value.splice(index, 1);
  emit('update:media', localMedia.value);
};

const setPrimary = (index) => {
  localMedia.value.forEach((media, i) => {
    media.isPrimary = i === index;
  });
  emit('update:media', localMedia.value);
};

</script>

<template>
  <div class="media-manager">
    <div class="mb-3">
      <label for="media-upload" class="form-label">Upload Media</label>
      <input type="file" id="media-upload" class="form-control" multiple @change="handleFileUpload" :disabled="maxPhotos > 0 && localMedia.length >= maxPhotos">
      <div v-if="maxPhotos > 0" class="form-text">
        You can upload up to {{ maxPhotos }} photos. ({{ maxPhotos - localMedia.length }} remaining)
      </div>
    </div>

    <div v-if="localMedia.length" class="row">
      <div v-for="(media, index) in localMedia" :key="index" class="col-md-3 mb-3">
        <div class="card">
          <img v-if="media.mediaType === 'IMAGE'" :src="`/public/${media.mediaUrl}`" class="card-img-top" alt="Media preview">
          <div v-else class="card-img-top d-flex align-items-center justify-content-center bg-light" style="height: 150px;">
            <span>Video</span>
          </div>
          <div class="card-body">
            <button class="btn btn-sm btn-danger me-2" @click="removeMedia(index)">Remove</button>
            <button class="btn btn-sm" :class="media.isPrimary ? 'btn-success' : 'btn-secondary'" @click="setPrimary(index)">
              <i class="fas fa-star me-1"></i>
              {{ media.isPrimary ? 'Primary' : 'Set Primary' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-muted">
      No media uploaded yet.
    </div>
  </div>
</template>

<style scoped>
.card-img-top {
  height: 150px;
  object-fit: cover;
}
</style>