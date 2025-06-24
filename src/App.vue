<script setup>
import Navbar from './components/Navbar.vue';
import './assets/css/main.css'; // Import global styles
import Footer from './components/Footer.vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed, ref, onMounted, onUnmounted, watchEffect } from 'vue';

const route = useRoute();
const showNavbar = computed(() => !['/signup', '/signin'].includes(route.path) && !route.path.startsWith('/admin'));

const { locale } = useI18n();

// Watch for locale changes and update HTML dir attribute
watchEffect(() => {
  document.documentElement.lang = locale.value;
  document.documentElement.dir = locale.value === 'ar' ? 'rtl' : 'ltr';
});

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