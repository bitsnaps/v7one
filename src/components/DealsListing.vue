<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const deals = ref([]);
const activeTab = ref('tab-1'); // 'tab-1', 'tab-2', 'tab-3'

const { t } = useI18n();

const fetchDeals = async () => {
  // Fetch deals from API (replace with actual API endpoint in production)
  // check if running of dev mode
  const data = await fetch(`${import.meta.env.DEV?'http://localhost:8080':''}/api/deals`);
  // check for data
  if (!data.ok) {
    console.error('Failed to fetch deals');
    deals.value = [];
    return;
  }

  deals.value = await data.json();

  /*/ Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  deals.value = [
    {
      id: 1,
      title: 'Luxury Villa with Ocean View',
      image: '/img/deals/property-1.jpg', // Corrected path
      price: '$2,500,000',
      status: 'For Sell',
      type: 'Villa',
      location: '123 Ocean Drive, Miami, FL',
      sqft: '5000 Sqft',
      beds: '5 Bed',
      baths: '6 Bath',
      category: ['tab-1', 'tab-2'] // Featured and For Sell
    },
    {
      id: 2,
      title: 'Modern Downtown Apartment',
      image: '/img/deals/property-2.jpg', // Corrected path
      price: '$3,500/month',
      status: 'For Rent',
      type: 'Apartment',
      location: '456 Main Street, New York, NY',
      sqft: '1200 Sqft',
      beds: '2 Bed',
      baths: '2 Bath',
      category: ['tab-1', 'tab-3'] // Featured and For Rent
    },
    {
      id: 3,
      title: 'Spacious Family House',
      image: '/img/deals/property-3.jpg', // Corrected path
      price: '$750,000',
      status: 'For Sell',
      type: 'House',
      location: '789 Suburb Lane, Chicago, IL',
      sqft: '2500 Sqft',
      beds: '4 Bed',
      baths: '3 Bath',
      category: ['tab-2'] // For Sell
    },
    {
      id: 4,
      title: 'Cozy Studio for Rent',
      image: '/img/deals/property-4.jpg', // Corrected path
      price: '$1,800/month',
      status: 'For Rent',
      type: 'Studio',
      location: '101 City Center, San Francisco, CA',
      sqft: '600 Sqft',
      beds: '1 Bed',
      baths: '1 Bath',
      category: ['tab-3'] // For Rent
    },
    {
      id: 5,
      title: 'Commercial Office Space',
      image: '/img/deals/office-1.jpg', // Corrected path
      price: '$1,200,000',
      status: 'For Sell',
      type: 'Office',
      location: '202 Business Park, Austin, TX',
      sqft: '10000 Sqft',
      beds: 'N/A',
      baths: '4 Bath',
      category: ['tab-1', 'tab-2'] // Featured and For Sell
    },
    {
      id: 6,
      title: 'Charming Suburban Home for Rent',
      image: '/img/deals/property-5.jpg', // Corrected path
      price: '$4,000/month',
      status: 'For Rent',
      type: 'Home',
      location: '303 Quiet Street, Seattle, WA',
      sqft: '1800 Sqft',
      beds: '3 Bed',
      baths: '2.5 Bath',
      category: ['tab-3'] // For Rent
    },
    {
      id: 7,
      title: 'Sleek Sports Car',
      image: '/img/deals/car-1.jpg',
      price: '$85,000',
      status: 'For Sell',
      type: 'Automobile',
      location: 'Prestige Motors, LA',
      sqft: 'N/A',
      beds: 'N/A',
      baths: 'N/A',
      category: ['tab-1', 'tab-2']
    },
    {
      id: 8,
      title: 'Vintage Collector Watch',
      image: '/img/deals/watch-1.jpg',
      price: '$22,000',
      status: 'For Sell',
      type: 'Luxury Item',
      location: 'Timeless Pieces Boutique',
      sqft: 'N/A',
      beds: 'N/A',
      baths: 'N/A',
      category: ['tab-2']
    },
    {
      id: 9,
      title: 'High-End Gaming Laptop Rental',
      image: '/img/deals/laptop-1.jpg',
      price: '$200/week',
      status: 'For Rent',
      type: 'Electronics',
      location: 'Tech Rentals Co.',
      sqft: 'N/A',
      beds: 'N/A',
      baths: 'N/A',
      category: ['tab-1', 'tab-3']
    }
  ];*/
};

onMounted(() => {
  fetchDeals();
});

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};

const displayedDeals = computed(() => {
  if (activeTab.value === 'tab-1') {
    return deals.value.filter(deal => deal.category.includes('tab-1'));
  }
  if (activeTab.value === 'tab-2') {
    return deals.value.filter(deal => deal.status === 'For Sell');
  }
  if (activeTab.value === 'tab-3') {
    return deals.value.filter(deal => deal.status === 'For Rent');
  }
  return [];
});

</script>

<template>
    <div class="container-xxl py-5">
        <div class="container">
            <div class="row g-0 gx-5 align-items-end">
                <div class="col-lg-6">
                    <div class="text-start mx-auto mb-5">
                        <h1 class="mb-3">{{ $t('dealsListing.title', 'Deals Listing') }}</h1>
                        <p>{{ $t('dealsListing.description', "Explore our diverse range of deals. Whether you're looking for a house, villa, apartment, or a commercial space, we've got you covered.") }}</p>
                    </div>
                </div>
                <div class="col-lg-6 text-start text-lg-end">
                    <ul class="nav nav-pills d-inline-flex justify-content-end mb-5">
                        <li class="nav-item me-2">
                            <a class="btn btn-outline-primary" :class="{ active: activeTab === 'tab-1' }" @click.prevent="setActiveTab('tab-1')" href="#">{{ $t('dealsListing.tabs.featured', 'Featured') }}</a>
                        </li>
                        <li class="nav-item me-2">
                            <a class="btn btn-outline-primary" :class="{ active: activeTab === 'tab-2' }" @click.prevent="setActiveTab('tab-2')" href="#">{{ $t('dealsListing.tabs.forSell', 'For Sell') }}</a>
                        </li>
                        <li class="nav-item me-0">
                            <a class="btn btn-outline-primary" :class="{ active: activeTab === 'tab-3' }" @click.prevent="setActiveTab('tab-3')" href="#">{{ $t('dealsListing.tabs.forRent', 'For Rent') }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="tab-content">
                <div class="row g-4">
                    <div v-for="deal in displayedDeals" :key="deal.id" class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div class="property-item rounded overflow-hidden">
                            <div class="position-relative overflow-hidden">
                                <a href="#"><img class="img-fluid" :src="deal.image" :alt="deal.title"></a>
                                <div class="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">{{ $t('dealsListing.status.' + deal.status.toLowerCase().replace(/\s+/g, ''), deal.status) }}</div>
                                <div class="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">{{ $t('dealsListing.types.' + deal.type.toLowerCase().replace(/\s+/g, ''), deal.type) }}</div>
                            </div>
                            <div class="p-4 pb-0">
                                <h5 class="text-primary mb-3">{{ deal.price }}</h5>
                                <a class="d-block h5 mb-2" href="#">{{ deal.title }}</a>
                                <p><i class="fa fa-map-marker-alt text-primary me-2"></i>{{ deal.location }}</p>
                            </div>
                            <div class="d-flex border-top">
                                <small class="flex-fill text-center border-end py-2"><i class="fa fa-ruler-combined text-primary me-2"></i>{{ deal.sqft }}</small>
                                <small class="flex-fill text-center border-end py-2"><i class="fa fa-bed text-primary me-2"></i>{{ deal.beds }}</small>
                                <small class="flex-fill text-center py-2"><i class="fa fa-bath text-primary me-2"></i>{{ deal.baths }}</small>
                            </div>
                        </div>
                    </div>
                    <div v-if="displayedDeals.length === 0" class="col-12 text-center">
                        <p>No deals found for this category.</p>
                    </div>
                </div>
                <div class="col-12 text-center mt-4 wow fadeInUp" data-wow-delay="0.1s" v-if="displayedDeals.length > 0">
                    <a class="btn btn-primary py-3 px-5" href="#">{{ $t('dealsListing.browseMoreDeals', 'Browse More Deals') }}</a>
                </div>
            </div>
        </div>
    </div>
</template>