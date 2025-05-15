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
        <!-- Navbar Start -->
        <Navbar v-if="showNavbar" />
        <!-- Navbar End -->

        <router-view />

        <!-- Footer Start -->
        <Footer />
        <!-- Footer End -->

        <!-- Back to Top -->
        <a v-if="showBackToTop" @click.prevent="scrollToTop" href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="fa fa-arrow-up"></i></a>
</template>