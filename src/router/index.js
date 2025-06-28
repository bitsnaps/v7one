import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/layouts/Default.vue';
import AdminLayout from '@/layouts/Admin.vue';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Contact from '@/views/Contact.vue';
import PostDeal from '@/views/PostDeal.vue';
import Pricing from '@/views/Pricing.vue';
import SignIn from '@/views/SignIn.vue';
import CategoryView from '@/views/CategoryView.vue';
import NotFound from '@/views/NotFound.vue';
import DealDetail from '@/views/DealDetail.vue';
import AdminDashboard from '@/components/admin/Dashboard.vue';
import AdminUsers from '@/components/admin/Users.vue';
import AdminCategories from '@/components/admin/Categories.vue';
import AdminListings from '@/components/admin/Listings.vue';
import AdminMessages from '@/components/admin/Messages.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
      },
      {
        path: 'about',
        name: 'about',
        component: About,
      },
      {
        path: 'contact',
        name: 'contact',
        component: Contact,
      },
      {
        path: 'post-deal',
        name: 'post-deal',
        component: PostDeal,
      },
      {
        path: 'signin',
        name: 'SignIn',
        component: SignIn,
      },
      {
        path: 'signup',
        name: 'SignUp',
        component: () => import('@/views/SignUp.vue'),
      },
      {
        path: 'category/:type',
        name: 'CategoryView',
        component: CategoryView,
        props: true,
      },
      {
        path: 'pricing',
        name: 'Pricing',
        component: Pricing,
        props: true,
      },
      {
        path: 'deal/:id',
        name: 'DealDetail',
        component: DealDetail,
        props: true,
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers,
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: AdminCategories,
      },
      {
        path: 'listings',
        name: 'AdminListings',
        component: AdminListings,
      },
      {
        path: 'messages',
        name: 'AdminMessages',
        component: AdminMessages,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;