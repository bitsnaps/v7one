<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { useRoute } from 'vue-router';
import { computed, ref, onMounted, onUnmounted } from 'vue';

const route = useRoute();
const showNavbar = computed(() => !['/signup', '/signin'].includes(route.path));
// const showNavbar = computed(() => true);

const isLoading = ref(true);
const showBackToTop = ref(false);

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  /*/ Minimal delay for spinner
  setTimeout(() => {
    isLoading.value = false;
  }, 100);*/
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="container-xxl bg-white p-0">
    <Navbar v-if="showNavbar" />
    <router-view />

    <Footer />

    <!-- Back to Top -->
    <a v-if="showBackToTop" @click.prevent="scrollToTop" href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>
  </div>
</template>

<style>
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
</style>
