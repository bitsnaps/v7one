<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { BCarousel, BCarouselSlide, BInputGroup, BFormInput } from 'bootstrap-vue-next';
import DealsCategories from '../components/DealsCategories.vue';
import DealsListing from '../components/DealsListing.vue';
import DealService from '@/services/DealService'; // Import DealService
import Teams from '../components/Teams.vue';
import Testimonial from '../components/Testimonial.vue';
const searchKeyword = ref('');
const selectedDealType = ref(''); // Changed from selectedPropertyType for broader V7 deals
const selectedLocation = ref('');
const searchResults = ref([]);
const searchLoading = ref(false);
const searchError = ref(null);

const router = useRouter();

const carouselItems = [
  { img: '/img/carousel-real-estate.jpg', alt: 'Real Estate' },
  { img: '/img/carousel-car-deal.jpg', alt: 'Car Deal' }, 
  { img: '/img/carousel-trading-deal.jpg', alt: 'Other DealCategories' }
];

const searchDeals = async () => {
  const queryParams = {};
  if (searchKeyword.value) {
    queryParams.keyword = searchKeyword.value;
  }
  if (selectedDealType.value) {
    queryParams.type = selectedDealType.value;
  }
  if (selectedLocation.value) {
    queryParams.location = selectedLocation.value;
  }
  searchLoading.value = true;
  searchError.value = null;
  searchResults.value = []; // Clear previous results

  try {
    const response = await DealService.getDeals(queryParams);
    if (response.data && response.data.success) {
      searchResults.value = response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch deals');
    }
  } catch (e) {
    console.error('Failed to fetch deals:', e);
    searchError.value = e.message || 'An error occurred while fetching deals.';
  } finally {
    searchLoading.value = false;
  }
};


const resetSearch = () => {
  // reset search
  searchKeyword.value = '';
  searchLoading.value = false;
  searchResults.value = [];
  searchError.value = null;
}

</script>

<template>

        <!-- Header Start -->
        <div class="container-fluid header bg-white p-0">
            <div class="row g-0 align-items-center flex-column-reverse flex-md-row">
                <div class="col-md-6 p-5 mt-lg-5">
                    <h1 class="display-5 mb-4">{{ $t('app.hero-find-the', 'Find The ')}} <span class="text-primary">{{ $t('app.hero-perfect-deal', 'Perfect Deal ')}}</span> {{ $t('app.hero-for-you', 'For You')}}</h1>
                    <p class="mb-4 pb-2">{{ $t('home.heroDescription', 'Explore a wide range of real estate, cars, electronics, services, and other interesting deals. v7 is your one-stop marketplace.') }}</p>
                    <router-link to="/deals" class="btn btn-primary py-3 px-5 me-3">{{ $t('home.getStarted', 'Get Started') }}</router-link>
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
        <div class="container-fluid bg-primary mb-5 p-5">
          <div class="container">
            <form @submit.prevent="searchDeals" @reset.prevent="resetSearch">
              <div class="row g-2">
                <div class="col-md-10">
                  <div class="row g-2">
                    <div class="col-md-4">
                      <!-- <input type="text" v-model="searchKeyword" class="form-control border-0 py-3" :placeholder="$t('home.searchKeywordPlaceholder', 'Search Keyword (e.g., \'3-bedroom house\', \'pickup car\')')"> -->
                      <BInputGroup>
                        <template #append>
                          <BButton type="reset" variant="light">X</BButton>
                        </template>
                        <BFormInput v-model="searchKeyword" class="form-control border-0 py-3" :placeholder="$t('home.searchKeywordPlaceholder', 'Search Keyword (e.g., \'3-bedroom house\', \'pickup car\')')" />
                      </BInputGroup>
                    </div>
                    <div class="col-md-4">
                      <select v-model="selectedDealType" class="form-select border-0 py-3">
                        <option value="" selected>{{ $t('home.allDealTypes', 'All Deal Types') }}</option>
                        <option value="real_estate">{{ $t('home.realEstate', 'Real Estate') }}</option>
                        <option value="cars">{{ $t('home.cars', 'Cars') }}</option>
                        <option value="electronics">{{ $t('home.electronics', 'Electronics') }}</option>
                        <option value="services">{{ $t('home.services', 'Services') }}</option>
                        <option value="other">{{ $t('home.otherDeals', 'Other Deals') }}</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <select v-model="selectedLocation" class="form-select border-0 py-3">
                        <option value="" selected>{{ $t('home.locationAny', 'Location (Any)') }}</option>
                        <option value="16">{{ $t('home.algiers', 'Algiers') }}</option>
                        <option value="31">{{ $t('home.oran', 'Oran') }}</option>
                        <option value="23">{{ $t('home.annaba', 'Annaba') }}</option>
                        <option value="-1">{{ $t('home.onlineRemote', 'Online/Remote') }}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="col-md-2">
                  <button type="submit" class="btn btn-dark border-0 w-100 py-3">{{ $t('home.searchButton', 'Search') }}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <!-- Search End -->

        <!-- Search Results Start -->
        <div class="container-xxl py-5" v-if="searchLoading || searchError || searchResults.length > 0">
            <div class="container">
                <div v-if="searchLoading" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p>{{ $t('home.searchingDeals', 'Searching for deals...') }}</p>
                </div>
                <div v-else-if="searchError" class="alert alert-danger" role="alert">
                    {{ $t('home.searchError', 'Error fetching deals:') }} {{ searchError }}
                </div>
                <div v-else-if="searchResults.length > 0">
                    <h2 class="mb-4 text-center">{{ $t('home.searchResultsTitle', 'Search Results') }}</h2>
                    <div class="row g-4">
                        <div v-for="deal in searchResults" :key="deal.id" class="col-lg-4 col-md-6">
                            <div class="property-item rounded overflow-hidden">
                                <div class="position-relative overflow-hidden">
                                    <router-link :to="{ name: 'DealDetail', params: { id: deal.id } }">
                                      <img class="img-fluid" :src="deal.image || '/img/default-deal.jpg'" :alt="deal.title">
                                    </router-link>
                                    <div class="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">{{ deal.status || $t('common.status.unknown', 'N/A') }}</div>
                                    <div class="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">{{ deal.type || $t('common.type.unknown', 'N/A') }}</div>
                                </div>
                                <div class="p-4 pb-0">
                                    <h5 class="text-primary mb-3">{{ deal.price || $t('common.priceOnRequest', 'Price on request') }}</h5>
                                    <router-link class="d-block h5 mb-2" :to="{ name: 'DealDetail', params: { id: deal.id } }">{{ deal.title }}</router-link>
                                    <p><i class="fa fa-map-marker-alt text-primary me-2"></i>{{ deal.location || $t('common.location.unknown', 'N/A') }}</p>
                                </div>
                                <div class="d-flex border-top">
                                    <small class="flex-fill text-center border-end py-2" v-if="deal.sqft"><i class="fa fa-ruler-combined text-primary me-2"></i>{{ deal.sqft }}</small>
                                    <small class="flex-fill text-center border-end py-2" v-if="deal.beds"><i class="fa fa-bed text-primary me-2"></i>{{ deal.beds }}</small>
                                    <small class="flex-fill text-center py-2" v-if="deal.baths"><i class="fa fa-bath text-primary me-2"></i>{{ deal.baths }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="!searchLoading && searchResults.length === 0 && (searchKeyword || selectedDealType || selectedLocation)" class="text-center">
                    <p>{{ $t('home.noDealsFound', 'No deals found matching your criteria.') }}</p>
                </div>
            </div>
        </div>
        <!-- Search Results End -->

        <!-- Property List Start (Show if no search is active or no results from search) -->
        <DealsListing v-if="!searchLoading && !searchError && searchResults.length === 0 && !(searchKeyword || selectedDealType || selectedLocation)"/>
        <!-- Property List End -->

        <!-- Category Start -->
        <DealsCategories />
        <!-- Category End -->

        <!-- About Start -->
        <div class="container-xxl py-5">
          <div class="container">
              <div class="row g-5 align-items-center">
                  <div class="col-lg-6 ">
                      <div class="about-img position-relative overflow-hidden p-5 pe-0">
                          <img class="img-fluid w-100" src="/img/about.svg" alt="About V7 Deals">
                      </div>
                  </div>
                  <div class="col-lg-6 ">
                      <h1 class="mb-4">{{ $t('home.aboutTitle', '#1 Marketplace for Your Deals') }}</h1>
                      <p class="mb-4">{{ $t('home.aboutDescription', 'V7 Deals is your trusted platform for finding and making deals on real estate, cars, and much more. We connect buyers and sellers in a seamless and secure environment, focusing on quality and trust.') }}</p>
                      <p><i class="fa fa-check text-primary me-3"></i>{{ $t('home.aboutFeature1', 'Wide Range of Categories') }}</p>
                      <p><i class="fa fa-check text-primary me-3"></i>{{ $t('home.aboutFeature2', 'Verified Listings & Sellers') }}</p>
                      <p><i class="fa fa-check text-primary me-3"></i>{{ $t('home.aboutFeature3', 'Secure Transaction Options') }}</p>
                      <router-link to="/about" class="btn btn-primary py-3 px-5 mt-3">{{ $t('home.readMore', 'Read More') }}</router-link>
                  </div>
              </div>
          </div>
        </div>
        <!-- About End -->

        <!-- Call to Action Start -->
        <div class="container-xxl py-5">
            <div class="container">
                <div class="bg-light rounded p-3">
                    <div class="bg-white rounded p-4" style="border: 1px dashed rgba(0, 185, 142, .3)">
                        <div class="row g-5 align-items-center">
                            <div class="col-lg-6 ">
                              <router-link to="/signup">
                                <img class="img-fluid rounded w-100" src="/img/call-to-action.svg" alt="Post your deal on V7">
                              </router-link>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-4">
                                    <h1 class="mb-3">{{ $t('home.ctaTitle', 'Have an Item or Service to Offer?') }}</h1>
                                    <p>{{ $t('home.ctaDescription', 'Reach thousands of potential customers by listing your deal on V7. It\'s quick, easy, and effective for real estate, cars, and all kinds of deals.') }}</p>
                                </div>
                                <router-link to="/post-deal" class="btn btn-primary py-3 px-5 me-2"><i class="fa fa-plus-circle me-2"></i>{{ $t('home.postDeal', 'Post a Deal') }}</router-link>
                                <router-link to="/contact" class="btn btn-dark py-3 px-5"><i class="fa fa-phone-alt me-2"></i>{{ $t('home.contactUs', 'Contact Us') }}</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Call to Action End -->

        <!-- Team Start -->
        <Teams />
        <!-- Team End -->

        <!-- Testimonial Start -->
        <Testimonial />
        <!-- Testimonial End -->

</template>

<style scoped>
.about-img img {
    object-fit: cover;
}
</style>