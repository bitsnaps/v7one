import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Contact from '@/views/Contact.vue';
import PostDeal from '@/views/PostDeal.vue';
import Pricing from '@/views/Pricing.vue';
import SignIn from '@/views/SignIn.vue';
import CategoryView from '@/views/CategoryView.vue';
import NotFound from '@/views/NotFound.vue';
import DealDetail from '@/views/DealDetail.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
  },
  {
    path: '/post-deal',
    name: 'post-deal',
    component: PostDeal,
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('@/views/SignUp.vue'),
  },
  {
    path: '/category/:type',
    name: 'CategoryView',
    component: CategoryView,
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing,
    props: true,
  },
  {
    path: '/deal/:id',
    name: 'DealDetail',
    component: DealDetail,
    props: true,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;