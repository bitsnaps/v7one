<script setup>
import { ref, onMounted } from 'vue';
import { BCarousel, BCarouselSlide } from 'bootstrap-vue-next';

const testimonials = ref([]);
const slide = ref(0);

const fetchTestimonials = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  testimonials.value = [
    {
      id: 1,
      text: 'V7 helped me find the perfect apartment in downtown. The process was smooth and their agents were very professional!',
      clientName: 'Sarah L.',
      profession: 'Software Engineer',
      image: '/img/client1.svg', // Placeholder image path
    },
    {
      id: 2,
      text: 'I sold my car through V7 within a week! They handled everything, and I got a great price. Highly recommended!',
      clientName: 'John B.',
      profession: 'Marketing Manager',
      image: '/img/client2.svg', // Placeholder image path
    },
    {
      id: 3,
      text: 'Finding a reliable contractor for my home renovation was a challenge until I used V7. Their platform connected me with top-notch professionals.',
      clientName: 'Maria G.',
      profession: 'Architect',
      image: '/img/client3.svg', // Placeholder image path
    },
  ];
};

onMounted(() => {
  fetchTestimonials();
});

</script>
<template>
        <div class="container-xxl py-5">
            <div class="container">
                <div class="text-center mx-auto mb-5" style="max-width: 600px;">
                    <h1 class="mb-3">What Our Users Say!</h1>
                    <p>Discover how V7 is making a difference in finding properties, vehicles, and services. Real stories from our satisfied users.</p>
                </div>
                <BCarousel
                    id="testimonialCarousel"
                    v-model="slide"
                    :interval="4000"
                    controls
                    indicators
                    ride="carousel"
                    class="testimonial-carousel"
                    v-if="testimonials.length > 0"
                >
                    <BCarouselSlide v-for="testimonial in testimonials" :key="testimonial.id">
                        <div class="testimonial-item bg-light rounded p-3">
                            <div class="bg-white border rounded p-4">
                                <p>{{ testimonial.text }}</p>
                                <div class="d-flex align-items-center">
                                    <img class="img-fluid flex-shrink-0 rounded" :src="testimonial.image" :alt="testimonial.clientName" style="width: 45px; height: 45px; object-fit: cover;">
                                    <div class="ps-3">
                                        <h6 class="fw-bold mb-1">{{ testimonial.clientName }}</h6>
                                        <small>{{ testimonial.profession }}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BCarouselSlide>
                </BCarousel>
                <div v-else class="text-center">
                    <p>Loading testimonials...</p>
                </div>
            </div>
        </div>
</template>

<style scoped>
/* Add any component-specific styles here */
.testimonial-item {
  min-height: 220px; /* Adjust as needed */
}
</style>