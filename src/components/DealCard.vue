<script setup>
import { computed } from 'vue';

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
    const attributesConfig = attributeConfig[props.deal.categoryType] || [];
    if (!props.deal.attributes) return [];
    return attributesConfig.map(attrConfig => ({
        name: attrConfig.name,
        value: props.deal.attributes[attrConfig.name.toLowerCase()] || 'N/A',
        icon: attrConfig.icon || 'fa fa-tag'
    }));
});

</script>

<template>
    <div class="property-item rounded overflow-hidden">
        <div class="position-relative overflow-hidden">
            <router-link :to="{ name: 'DealDetail', params: { id: deal.id } }">
                <img class="img-fluid" :src="deal.image || '/img/deal.svg'" :alt="deal.title">
            </router-link>
            <div class="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">{{ $t('dealsListing.' + deal.type?.toLowerCase().replace('_', ''), deal.type) }}</div>
            <div class="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">{{ $t('dealsListing.types.' + deal.category, deal.category) }}</div>
        </div>
        <div class="p-4 pb-0">
            <h5 class="text-primary mb-3">{{ deal.price || $t('common.priceOnRequest', 'Price on request') }}</h5>
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
</style>