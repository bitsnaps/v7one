import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import DefaultLayout from '@/layouts/Default.vue';
import AdminLayout from '@/layouts/Admin.vue';
import UserLayout from '@/layouts/User.vue';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Contact from '@/views/Contact.vue';
import PostDeal from '@/views/PostDeal.vue';
import Pricing from '@/views/Pricing.vue';
import SignIn from '@/views/SignIn.vue';
import CategoryView from '@/views/CategoryView.vue';
import NotFound from '@/views/NotFound.vue';
import DealDetail from '@/views/DealDetail.vue';
import ValidateEmail from '@/views/ValidateEmail.vue'
import SubscriptionSuccess from '@/views/SubscriptionSuccess.vue';
import AdminDashboard from '@/components/admin/AdminDashboard.vue';
import AdminUsers from '@/components/admin/Users.vue';
import AdminCategories from '@/components/admin/Categories.vue';
import AdminListings from '@/components/admin/Listings.vue';
import AdminMessages from '@/components/admin/Messages.vue';
import Profile from '@/components/Profile.vue';
import AdminAttributes from '@/components/admin/Attributes.vue';
import AdminAttributeValues from '@/components/admin/AttributeValues.vue';
import AdminMedia from '@/components/admin/Media.vue';
import AdminNotifications from '@/components/admin/Notifications.vue';
import UserDashboard from '@/components/user/UserDashboard.vue';
import UserListings from '@/components/user/UserListings.vue';
import UserMessages from '@/components/user/UserMessages.vue';
import UserNotifications from '@/components/user/UserNotifications.vue';
import UserListingMedia from '@/components/user/UserListingMedia.vue';

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
        meta: { requiresAuth: true },
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
        path: 'validate-email',
        name: 'ValidateEmail',
        component: ValidateEmail,
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
      {
       path: 'subscription-success',
       name: 'SubscriptionSuccess',
       component: SubscriptionSuccess,
       meta: { requiresAuth: true },
     },
      {
        path: 'cookies',
        name: 'Cookies',
        component: () => import('@/views/Cookies.vue'),
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('@/views/Help.vue'),
      },
      {
        path: 'faqs',
        name: 'Faqs',
        component: () => import('@/views/Faq.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
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
        path: 'attributes',
        name: 'AdminAttributes',
        component: AdminAttributes,
      },
      {
        path: 'attribute-values',
        name: 'AdminAttributeValues',
        component: AdminAttributeValues,
      },
      {
        path: 'listings',
        name: 'AdminListings',
        component: AdminListings,
      },
      {
        path: 'listings/:listingId/media',
        name: 'AdminMedia',
        component: AdminMedia,
      },
      {
        path: 'messages',
        name: 'AdminMessages',
        component: AdminMessages,
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: Profile,
      },
      {
        path: 'notifications',
        name: 'AdminNotifications',
        component: AdminNotifications,
      },
    ],
  },
  {
    path: '/user',
    component: UserLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/user/dashboard',
      },
      {
        path: 'dashboard',
        name: 'UserDashboard',
        component: UserDashboard,
      },
      {
        path: 'listings',
        name: 'UserListings',
        component: UserListings,
      },
      {
        path: 'listings/:listingId/media',
        name: 'UserListingMedia',
        component: UserListingMedia,
      },
      {
        path: 'messages',
        name: 'UserMessages',
        component: UserMessages,
      },
      {
        path: 'notifications',
        name: 'UserNotifications',
        component: UserNotifications,
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: Profile,
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
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL), // an attempt to fix the "404 Not Found" in Vue3 SPA which adds the "#" at the end of the route
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !auth.isLoggedIn) {
    next({
      path: '/signin',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
});

export default router;