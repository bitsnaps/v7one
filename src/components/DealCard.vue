<script setup>

defineProps({
    deal: Object
})

</script>

<template>
    <div class="property-item rounded overflow-hidden">
        <div class="position-relative overflow-hidden">
            <router-link :to="{ name: 'DealDetail', params: { id: deal.id } }">
                    <img class="img-fluid" :src="deal.image || '/img/deal.svg'" :alt="deal.title">
                </router-link>
            <div class="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">{{ $t('dealsListing.' + deal.type?.toLowerCase().replace('_', ''), deal.type) }}</div>
            <div class="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">{{ $t('dealsListing.types.' + deal.category[0], deal.category[0]) }}</div>
        </div>
        <div class="p-4 pb-0">
            <h5 class="text-primary mb-3">{{ deal.price || $t('common.priceOnRequest', 'Price on request') }}</h5>
            <router-link class="d-block h5 mb-2" :to="{ name: 'DealDetail', params: { id: deal.id } }">{{ deal.title }}</router-link>
            <p><i class="fa fa-map-marker-alt text-primary me-2"></i>{{ deal.location || $t('common.unknown', 'N/A')}}</p>
        </div>
        <div class="d-flex border-top">
            <small class="flex-fill text-center border-end py-2"><i class="fa fa-ruler-combined text-primary me-2"></i>{{ deal.sqft || 'N/A' }}</small>
            
            <small class="flex-fill text-center border-end py-2"><i class="fa fa-bed text-primary me-2"></i>{{ deal.beds || 'N/A' }}</small>

            <small class="flex-fill text-center py-2"><i class="fa fa-bath text-primary me-2"></i>{{ deal.baths || 'N/A' }}</small>
        </div>
    </div>    
</template>

<style scoped>
</style>