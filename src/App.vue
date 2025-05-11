<script setup>
import Navbar from './components/Navbar.vue';
import { useRoute } from 'vue-router';
import { computed, ref, onMounted, onUnmounted } from 'vue';

const route = useRoute();
// const showNavbar = computed(() => !['/signup', '/signin'].includes(route.path));
const showNavbar = computed(() => true);

const isLoading = ref(true);
const showBackToTop = ref(false);

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 100); // Minimal delay for spinner
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div v-if="isLoading" id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>

  <div v-else class="container-xxl bg-white p-0">
    <Navbar v-if="showNavbar" />
    <router-view />

    <!-- Footer Start -->
    <div class="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
      <div class="container py-5">
        <div class="row g-5">
          <div class="col-lg-4 col-md-6">
            <h5 class="text-white mb-4">Get In Touch</h5>
            <p class="mb-2"><i class="fa fa-map-marker-alt me-3"></i>Ain Benian, Algiers</p>
            <p class="mb-2"><i class="fa fa-phone-alt me-3"></i>+213 1234567890</p>
            <p class="mb-2"><i class="fa fa-envelope me-3"></i>contact@v7one.com</p>
            <div class="d-flex pt-2">
              <a class="btn btn-outline-light btn-social ms-2" href=""><i class="fab fa-twitter"></i></a>
              <a class="btn btn-outline-light btn-social ms-2" href=""><i class="fab fa-facebook-f"></i></a>
              <a class="btn btn-outline-light btn-social ms-2" href=""><i class="fab fa-youtube"></i></a>
              <a class="btn btn-outline-light btn-social ms-2" href=""><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <h5 class="text-white mb-4">Quick Links</h5>
            <router-link class="btn btn-link text-white-50" to="/about">About Us</router-link>
            <router-link class="btn btn-link text-white-50" to="/contact">Contact Us</router-link>
            <a class="btn btn-link text-white-50" href="">Our Services</a> <!-- Placeholder -->
            <a class="btn btn-link text-white-50" href="">Privacy Policy</a> <!-- Placeholder -->
            <a class="btn btn-link text-white-50" href="">Terms & Condition</a> <!-- Placeholder -->
          </div>
          <div class="col-lg-4 col-md-6">
            <h5 class="text-white mb-4">Newsletter</h5>
            <p>Stay updated with the latest deals and news from V7.</p>
            <div class="position-relative mx-auto" style="max-width: 400px;">
              <input class="form-control bg-transparent w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email">
              <button type="button" class="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="copyright">
          <div class="row">
            <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <router-link class="border-bottom" to="/">v7</router-link> 2025, All Right Reserved.
            </div>
            <div class="col-md-6 text-center text-md-end">
              <div class="footer-menu">
                <router-link to="/">Home</router-link>
                <a href="">Cookies</a> <!-- Placeholder -->
                <a href="">Help</a> <!-- Placeholder -->
                <a href="">FQAs</a> <!-- Placeholder -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer End -->

    <!-- Back to Top -->
    <a v-if="showBackToTop" @click.prevent="scrollToTop" href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>
  </div>
</template>

<style>
/* Assuming these files are in public/css and public/lib respectively */
/* These should ideally be linked in app/index.html or imported in main.ts */
/* @import '/css/bootstrap.min.css'; 
@import '/css/style.css'; */

/* Ensure Font Awesome and Bootstrap Icons are linked in app/index.html for icons to work */

/* Global styles from template's style.css that might be needed if not fully covered by style.css import */
:root {
    --primary: #00B98E;
    --light: #EFFDF5;
    --dark: #0E2E50;
}

.fw-medium {
    font-weight: 600 !important;
}

.fw-semi-bold {
    font-weight: 700 !important;
}

.back-to-top {
    position: fixed;
    display: none; /* Initially hidden, Vue controls visibility */
    right: 45px;
    bottom: 45px;
    z-index: 99;
}

/* Add other global styles or utility classes from the template if needed */

/* Styles for Navbar.vue are in Navbar.vue itself */

/* Styles for specific sections from template (e.g., Header, Search, Category) would go into their respective components */

</style>
