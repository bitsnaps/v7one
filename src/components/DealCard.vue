<script setup>
import { computed, ref, watch } from 'vue';
import { formatPrice } from '@/helpers/utils';

const props = defineProps({
    deal: Object
});

const attributeConfig = {
    'real-estate': [
        { name: 'Sqft', icon: 'fa fa-ruler-combined' },
        { name: 'Beds', icon: 'fa fa-bed' },
        { name: 'Baths', icon: 'fa fa-bath' }
    ],
    'cars': [
        { name: 'Make', icon: 'fa fa-car' },
        { name: 'Model', icon: 'fa fa-car-side' },
        { name: 'Year', icon: 'fa fa-calendar-alt' }
    ],
    // Add other categories and their attributes here
};

const relevantAttributes = computed(() => {
    if (!props.deal.attributes || Object.keys(props.deal.attributes).length === 0) {
        return [];
    }

    const iconConfigForCategory = attributeConfig[props.deal.categoryType] || [];

    return Object.entries(props.deal.attributes)
        .map(([key, value]) => {
            // key is already lowercase from the API
            const attrConfig = iconConfigForCategory.find(c => c.name.toLowerCase() === key);

            return {
                name: key.charAt(0).toUpperCase() + key.slice(1),
                value: value,
                icon: attrConfig ? attrConfig.icon : 'fa fa-tag'
            };
        })
        .filter(attr => attr.value !== 'N/A');
});
// Media carousel state
const mediaList = computed(() => {
    const list = Array.isArray(props.deal.media) ? props.deal.media.slice() : [];
    if (list.length) {
        return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return props.deal.image ? [{ id: 'fallback', url: props.deal.image, type: 'IMAGE', isPrimary: true, order: 0 }] : [];
});

const currentIndex = ref(0);
watch(() => props.deal?.id, () => { currentIndex.value = 0; });

const hasMultiple = computed(() => mediaList.value.length > 1);
const currentMedia = computed(() => mediaList.value.length ? mediaList.value[currentIndex.value % mediaList.value.length] : null);

const next = () => {
    if (!mediaList.value.length) return;
    currentIndex.value = (currentIndex.value + 1) % mediaList.value.length;
};
const prev = () => {
    if (!mediaList.value.length) return;
    currentIndex.value = (currentIndex.value - 1 + mediaList.value.length) % mediaList.value.length;
};
const goTo = (i) => {
    if (i >= 0 && i < mediaList.value.length) currentIndex.value = i;
};


</script>

<template>
    <div class="property-item rounded overflow-hidden">
        <div class="position-relative overflow-hidden">
            <router-link :to="{ name: 'DealDetail', params: { id: deal.id } }">
                <div class="carousel-container">
                    <template v-if="currentMedia">
                        <img v-if="currentMedia.type === 'IMAGE'" class="img-fluid carousel-media" :src="currentMedia.url" :alt="deal.title">
                        <div v-else class="position-relative">
                            <video class="img-fluid carousel-media" :src="currentMedia.url" preload="metadata" playsinline muted></video>
                            <span class="play-icon-overlay"><i class="fa fa-play-circle"></i></span>
                        </div>
                    </template>
                    <img v-else class="img-fluid carousel-media" :src="deal.image || '/img/deal.svg'" :alt="deal.title">
                </div>
            </router-link>
            <button v-if="hasMultiple" class="carousel-control prev" @click.stop.prevent="prev" aria-label="Previous">
                <i class="fa fa-chevron-left"></i>
            </button>
            <button v-if="hasMultiple" class="carousel-control next" @click.stop.prevent="next" aria-label="Next">
                <i class="fa fa-chevron-right"></i>
            </button>
            <div v-if="hasMultiple" class="carousel-dots">
                <span v-for="(m, i) in mediaList" :key="m.id + '_' + i" :class="['dot', { active: i === currentIndex }]" @click.stop.prevent="goTo(i)"></span>
            </div>
            <div class="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">{{ $t('deals.' + deal.type?.toLowerCase().replace('_', ''), deal.type) }}</div>
            <div class="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">{{ $t('deals.types.' + deal.category, deal.category).split('.').pop() }}</div>
        </div>
        <div class="p-4 pb-0">
            <h5 class="text-primary mb-3">{{ formatPrice(deal.price) || $t('common.priceOnRequest', 'Price on request') }}</h5>
            <router-link class="d-block h5 mb-2" :to="{ name: 'DealDetail', params: { id: deal.id } }">{{ deal.title }}</router-link>
            <p><i class="fa fa-map-marker-alt text-primary me-2"></i>{{ deal.location || $t('common.unknown', 'N/A')}}</p>
        </div>
        <div class="d-flex border-top">
            <small v-for="(attr, index) in relevantAttributes" :key="index" class="flex-fill text-center border-end py-2" :title="attr.name">
                <i :class="[attr.icon, 'text-primary me-2']"></i>{{ attr.value }}
            </small>
        </div>
    </div>
</template>

<style scoped>
.carousel-container { position: relative; }
.carousel-media { width: 100%; height: 220px; object-fit: cover; display: block; }
.carousel-control { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.45); border: 0; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.carousel-control.prev { left: 10px; }
.carousel-control.next { right: 10px; }
.carousel-dots { position: absolute; left: 50%; transform: translateX(-50%); bottom: 8px; display: flex; gap: 6px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.6); cursor: pointer; }
.dot.active { background: #ffffff; }
.play-icon-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: rgba(255,255,255,0.9); font-size: 36px; pointer-events: none; }
</style>