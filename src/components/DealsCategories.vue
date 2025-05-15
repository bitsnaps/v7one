<script setup>
import { ref } from 'vue';

// Group categories by type
const realEstateCategories = [
  { name: 'Apartment', icon: '/img/icon-apartment.png', count: 123, link: '/category/apartments' },
  { name: 'Villa', icon: '/img/icon-villa.png', count: 123, link: '/category/villas' },
  { name: 'Home', icon: '/img/icon-house.png', count: 123, link: '/category/homes' },
  { name: 'Office', icon: '/img/icon-housing.png', count: 45, link: '/category/offices' },
  { name: 'Building', icon: '/img/icon-building.png', count: 30, link: '/category/buildings' },
  { name: 'Townhouse', icon: '/img/icon-neighborhood.png', count: 67, link: '/category/townhouses' },
  { name: 'Shop', icon: '/img/icon-condominium.png', count: 88, link: '/category/shops' },
  { name: 'Garage', icon: '/img/icon-luxury.png', count: 20, link: '/category/garages' }
];

const carCategories = [
  { name: 'Sedan', icon: '/img/icon-car.png', count: 120, link: '/category/cars/sedan' },
  { name: 'SUV', icon: '/img/icon-car.png', count: 85, link: '/category/cars/suv' },
  { name: 'Truck', icon: '/img/icon-car.png', count: 45, link: '/category/cars/truck' }
];

const otherCategories = [
  { name: 'Electronics', icon: '/img/icon-electronics.png', count: 150, link: '/category/electronics' },
  { name: 'Services', icon: '/img/icon-services.png', count: 90, link: '/category/services' },
  { name: 'Other Deals', icon: '/img/icon-deal.png', count: 110, link: '/category/other-deals' }
];

// For backward compatibility
const dealCategories = [...realEstateCategories, ...carCategories, ...otherCategories];

// Active tab tracking
const activeTab = ref('real-estate');

const setActiveTab = (tab) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="container-xxl py-5">
    <div class="container">
      <div class="text-center mx-auto mb-5" style="max-width: 600px;">
        <h1 class="mb-3">Deal Categories</h1>
        <p>Explore various categories of deals available on our platform. Find what you're looking for quickly and easily.</p>
      </div>
      
      <!-- Tabs Navigation -->
      <ul class="nav nav-tabs mb-4 justify-content-center">
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'real-estate' }" @click="setActiveTab('real-estate')">
            Real Estate
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'cars' }" @click="setActiveTab('cars')">
            Cars
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'other' }" @click="setActiveTab('other')">
            Other Deals
          </button>
        </li>
      </ul>
      
      <!-- Tab Content -->
      <div v-if="activeTab === 'real-estate'">
        <div class="row g-4">
          <div v-for="(category, index) in realEstateCategories" :key="index" class="col-lg-3 col-sm-6">
            <router-link class="cat-item d-block bg-light text-center rounded p-3" :to="category.link">
              <div class="rounded p-4">
                <div class="icon mb-3">
                  <img class="img-fluid" :src="category.icon" :alt="category.name + ' Icon'">
                </div>
                <h6>{{ category.name }}</h6>
                <span>{{ category.count }} Deals</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      
      <div v-if="activeTab === 'cars'">
        <div class="row g-4">
          <div v-for="(category, index) in carCategories" :key="index" class="col-lg-4 col-sm-6">
            <router-link class="cat-item d-block bg-light text-center rounded p-3" :to="category.link">
              <div class="rounded p-4">
                <div class="icon mb-3">
                  <img class="img-fluid" :src="category.icon" :alt="category.name + ' Icon'">
                </div>
                <h6>{{ category.name }}</h6>
                <span>{{ category.count }} Deals</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      
      <div v-if="activeTab === 'other'">
        <div class="row g-4">
          <div v-for="(category, index) in otherCategories" :key="index" class="col-lg-4 col-sm-6">
            <router-link class="cat-item d-block bg-light text-center rounded p-3" :to="category.link">
              <div class="rounded p-4">
                <div class="icon mb-3">
                  <img class="img-fluid" :src="category.icon" :alt="category.name + ' Icon'">
                </div>
                <h6>{{ category.name }}</h6>
                <span>{{ category.count }} Deals</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*** Category ***/
.cat-item div {
    background: #FFFFFF;
    border: 1px dashed rgba(0, 185, 142, .3);
    transition: .5s;
}

.cat-item:hover div {
    background: var(--primary);
    border-color: transparent;
}

.cat-item div * {
    transition: .5s;
}
.cat-item img.img-fluid {
    height: 48px; /* Standardized icon height */
    width: 48px; /* Standardized icon width */
    object-fit: contain;
}
.cat-item:hover div * {
    color: #FFFFFF !important;
}

/*** Property List ***/
.nav-pills .nav-item .btn {
    color: var(--dark);
}

.nav-pills .nav-item .btn:hover,
.nav-pills .nav-item .btn.active {
    color: #FFFFFF;
}
</style>