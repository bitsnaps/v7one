<script setup>
import { ref, onMounted } from 'vue';

const teamMembers = ref([]);

const fetchTeamMembers = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  teamMembers.value = [
    {
      id: 1,
      name: 'Alice Wonderland',
      designation: 'Chief Deal Strategist',
      image: '/img/user.svg', // Placeholder, ideally unique images
      socials: [
        { icon: 'fab fa-facebook-f', link: '#' },
        { icon: 'fab fa-twitter', link: '#' },
        { icon: 'fab fa-instagram', link: '#' },
      ],
    },
    {
      id: 2,
      name: 'Bob The Builder',
      designation: 'Lead Negotiation Expert',
      image: '/img/user.svg', // Placeholder
      socials: [
        { icon: 'fab fa-facebook-f', link: '#' },
        { icon: 'fab fa-twitter', link: '#' },
        { icon: 'fab fa-instagram', link: '#' },
      ],
    },
    {
      id: 3,
      name: 'Charlie Brown',
      designation: 'Market Research Analyst',
      image: '/img/user.svg', // Placeholder
      socials: [
        { icon: 'fab fa-facebook-f', link: '#' },
        { icon: 'fab fa-twitter', link: '#' },
        { icon: 'fab fa-instagram', link: '#' },
      ],
    },
    {
      id: 4,
      name: 'Diana Prince',
      designation: 'Client Relations Manager',
      image: '/img/user.svg', // Placeholder
      socials: [
        { icon: 'fab fa-facebook-f', link: '#' },
        { icon: 'fab fa-twitter', link: '#' },
        { icon: 'fab fa-instagram', link: '#' },
      ],
    },
  ];
};

onMounted(() => {
  fetchTeamMembers();
});
</script>
<template>
        <div class="container-xxl py-5">
            <div class="container">
                <div class="text-center mx-auto mb-5" style="max-width: 600px;">
                    <h1 class="mb-3">Meet Our Deal Specialists</h1>
                    <p>Our dedicated team at V7 works tirelessly to find and secure the best deals across various sectors for you. Discover the experts making it happen.</p>
                </div>
                <div class="row g-4">
                    <div v-for="member in teamMembers" :key="member.id" class="col-lg-3 col-md-6">
                        <div class="team-item rounded overflow-hidden">
                            <div class="position-relative">
                                <img class="img-fluid" :src="member.image" :alt="member.name">
                                <div class="position-absolute start-50 top-100 translate-middle d-flex align-items-center">
                                    <a v-for="social in member.socials" :key="social.icon" class="btn rounded-circle mx-1" :href="social.link"><i :class="social.icon"></i></a>
                                </div>
                            </div>
                            <div class="text-center p-4 mt-3">
                                <h5 class="fw-bold mb-0">{{ member.name }}</h5>
                                <small>{{ member.designation }}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>