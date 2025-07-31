import { defineStore } from 'pinia';
import DealService from '../services/DealService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token'),
    // subscription: null,
    error: null,
    loading: false,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user && !!state.token,
    authError: (state) => state.error,
    isLoading: (state) => state.loading,
    // subscription: (state) => state.subscription,
  },
  actions: {
    setUser(userData) {
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    },
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await DealService.login(credentials);

        if (response.data.success) {
          this.user = response.data.user;
          this.token = response.data.token;
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);
          // await this.fetchUserSubscription();
          return true;
        } else {
          this.error = response.data.message || 'Login failed';
          return false;
        }
      } catch (error) {
        if (error.response?.data?.errorCode === 'EMAIL_NOT_VERIFIED') {
          this.error = 'Please verify your email address before logging in. Check your inbox for the verification link.';
        } else {
          this.error = error.response?.data?.message || error.message || 'An unexpected error occurred during login.';
        }
        return false;
      } finally {
        this.loading = false;
      }
    },
    async signup(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await DealService.signup(userData);
        if (response.data.success) {
          return true;
        } else {
          this.error = response.data.message || 'Signup failed';
          return false;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'An unexpected error occurred during signup.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      this.user = null;
      this.token = null;
      // this.subscription = null;
      this.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // redirect to home page (will be done at component level)
      // router.push('/signin');
    },
    /*async fetchUserSubscription() {
      if (!this.token) return;
      try {
        const response = await DealService.getUserSubscription();
        if (response.data.success && response.data.data) {
          this.subscription = response.data.data;
        }
      } catch (error) {
        console.error('Failed to fetch user subscription:', error);
      }
    },*/
    async updateProfile(profileData) {
      this.loading = true;
      this.error = null;
      try {
        // The component now uses UserService directly.
        // This action can be simplified or removed if not used elsewhere.
        const response = await UserService.updateProfile(profileData);
        this.setUser(response.data);
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'An unexpected error occurred.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async resetPassword(email) {
      this.loading = true;
      this.error = null;
      try {
        const response = await DealService.requestPasswordReset(email);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while resetting the password.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
    clearError() {
      this.error = null;
    }
  },
});