<script setup>
import { ref } from 'vue';
import { BCarousel, BCarouselSlide } from 'bootstrap-vue-next';

const searchKeyword = ref('');
const selectedDealType = ref(''); // Changed from selectedPropertyType for broader V7 deals
const selectedLocation = ref('');

const dealCategories = [
  { name: 'Apartment', icon: '/img/icon-apartment.png', count: 123, link: '/category/apartments' },
  { name: 'Villa', icon: '/img/icon-villa.png', count: 123, link: '/category/villas' },
  { name: 'Home', icon: '/img/icon-house.png', count: 123, link: '/category/homes' },
  { name: 'Office', icon: '/img/icon-housing.png', count: 45, link: '/category/offices' }, // Adjusted count
  { name: 'Building', icon: '/img/icon-building.png', count: 30, link: '/category/buildings' }, // Adjusted count
  { name: 'Townhouse', icon: '/img/icon-neighborhood.png', count: 67, link: '/category/townhouses' }, // Adjusted count
  { name: 'Shop', icon: '/img/icon-condominium.png', count: 88, link: '/category/shops' }, // Adjusted count
  { name: 'Garage', icon: '/img/icon-luxury.png', count: 20, link: '/category/garages' }, // Adjusted count
  { name: 'Cars', icon: '/img/icon-car.png', count: 250, link: '/category/cars' }, // Added for V7 Deals
  { name: 'Electronics', icon: '/img/icon-electronics.png', count: 150, link: '/category/electronics' }, // Added for V7 Deals
  { name: 'Services', icon: '/img/icon-services.png', count: 90, link: '/category/services' }, // Added for V7 Deals
  { name: 'Other Deals', icon: '/img/icon-deal.png', count: 110, link: '/category/other-deals' } // Added for V7 Deals
];

const carouselItems = [
  { img: '/img/carousel-real-estate.jpg', alt: 'Real Estate' },
  { img: '/img/carousel-car-deal.jpg', alt: 'Car Deal' }, 
  { img: '/img/carousel-trading-deal.jpg', alt: 'Other Deals' } // Example for V7 Deals, assuming carousel-3.jpg exists
];

const searchDeals = () => {
  console.log('Searching for:', searchKeyword.value, selectedDealType.value, selectedLocation.value);
  // Implement search logic here, possibly navigating to a search results page
  // router.push({ name: 'SearchResults', query: { keyword: searchKeyword.value, type: selectedDealType.value, location: selectedLocation.value } });
};
</script>

<template>
    <!-- Header Start -->
    <div class="container-fluid header bg-white p-0">
      <div class="row g-0 align-items-center flex-column-reverse flex-md-row">
        <div class="col-md-6 p-5 mt-lg-5">
          <h1 class="display-5 mb-4">Find The <span class="text-primary">Perfect Deal</span> For You</h1>
          <p class="mb-4 pb-2">Explore a wide range of real estate, cars, electronics, services, and other interesting deals. v7 is your one-stop marketplace.</p>
          <router-link to="/deals" class="btn btn-primary py-3 px-5 me-3">Get Started</router-link>
        </div>
        <div class="col-md-6">
          <BCarousel controls indicators ride="carousel" :interval="5000">
            <BCarouselSlide v-for="(item, index) in carouselItems" :key="index" :img-src="item.img" :alt="item.alt" />
          </BCarousel>
        </div>
      </div>
    </div>
    <!-- Header End -->

    <!-- Search Start -->
    <div class="container-fluid bg-primary mb-5 " style="padding: 35px;">
      <div class="container">
        <form @submit.prevent="searchDeals">
          <div class="row g-2">
            <div class="col-md-10">
              <div class="row g-2">
                <div class="col-md-4">
                  <input type="text" v-model="searchKeyword" class="form-control border-0 py-3" placeholder="Search Keyword (e.g., 'luxury car', '3-bedroom house')">
                </div>
                <div class="col-md-4">
                  <select v-model="selectedDealType" class="form-select border-0 py-3">
                    <option value="" selected>All Deal Types</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="cars">Cars</option>
                    <option value="electronics">Electronics</option>
                    <option value="services">Services</option>
                    <option value="other">Other Deals</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <select v-model="selectedLocation" class="form-select border-0 py-3">
                    <option value="" selected>Location (Any)</option>
                    <option value="new_york">New York</option>
                    <option value="london">London</option>
                    <option value="tokyo">Tokyo</option>
                    <option value="online">Online/Remote</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-md-2">
              <button type="submit" class="btn btn-dark border-0 w-100 py-3">Search</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- Search End -->

    <!-- Category Start -->
    <div class="container-xxl py-5">
      <div class="container">
        <div class="text-center mx-auto mb-5" style="max-width: 600px;">
          <h1 class="mb-3">Deal Categories</h1>
          <p>Explore various categories of deals available on our platform. Find what you're looking for quickly and easily.</p>
        </div>
        <div class="row g-4">
          <div v-for="(category, index) in dealCategories" :key="index" class="col-lg-3 col-sm-6">
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
    <!-- Category End -->

    <!-- About Start (Simplified for Home Page) -->
    <div class="container-xxl py-5">
        <div class="container">
            <div class="row g-5 align-items-center">
                <div class="col-lg-6 ">
                    <div class="about-img position-relative overflow-hidden p-5 pe-0">
                        <img class="img-fluid w-100" src="/img/about.svg" alt="About V7 Deals">
                    </div>
                </div>
                <div class="col-lg-6 ">
                    <h1 class="mb-4">#1 Marketplace for Your Deals</h1>
                    <p class="mb-4">V7 Deals is your trusted platform for finding and making deals on real estate, cars, and much more. We connect buyers and sellers in a seamless and secure environment, focusing on quality and trust.</p>
                    <p><i class="fa fa-check text-primary me-3"></i>Wide Range of Categories</p>
                    <p><i class="fa fa-check text-primary me-3"></i>Verified Listings & Sellers</p>
                    <p><i class="fa fa-check text-primary me-3"></i>Secure Transaction Options</p>
                    <router-link to="/about" class="btn btn-primary py-3 px-5 mt-3">Read More</router-link>
                </div>
            </div>
        </div>
    </div>
    <!-- About End -->

    <!-- Call To Action Start -->
    <div class="container-xxl py-5">
        <div class="container">
            <div class="bg-light rounded p-3">
                <div class="bg-white rounded p-4" style="border: 1px dashed rgba(0, 185, 142, .3)">
                    <div class="row g-5 align-items-center">
                        <div class="col-lg-6 ">
                            <img class="img-fluid rounded w-100" src="/img/call-to-action.svg" alt="Post your deal on V7">
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-4">
                                <h1 class="mb-3">Have an Item or Service to Offer?</h1>
                                <p>Reach thousands of potential customers by listing your deal on V7. It's quick, easy, and effective for real estate, cars, and all kinds of deals.</p>
                            </div>
                            <router-link to="/post-deal" class="btn btn-primary py-3 px-5 me-2"><i class="fa fa-plus-circle me-2"></i>Post Your Deal</router-link>
                            <router-link to="/contact" class="btn btn-dark py-3 px-5"><i class="fa fa-phone-alt me-2"></i>Contact Us</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Call To Action End -->
</template>

<style scoped>
.carousel-item-vue img {
  width: 100%;
  height: 100%; 
  object-fit: cover;
  min-height: 400px; /* Ensure a minimum height */
  max-height: 600px; /* Adjust as needed */
}

.cat-item img.img-fluid {
    height: 48px; /* Standardized icon height */
    width: 48px; /* Standardized icon width */
    object-fit: contain;
}
.about-img img {
    object-fit: cover;
}
</style>