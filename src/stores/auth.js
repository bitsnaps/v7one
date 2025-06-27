import { defineStore } from 'pinia';
import DealService from '../services/DealService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token'),
    error: null,
    loading: false,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user && !!state.token,
    authError: (state) => state.error,
    isLoading: (state) => state.loading,
  },
  actions: {
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
          return true;
        } else {
          this.error = response.data.message || 'Login failed';
          return false;
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'An unexpected error occurred during login.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async signup(userData) {
      this.loading = true;
      this.error = null;
      try {
        // const response = await axios.post(`${API_URL}/signup`, userData);
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = { 
          data: { 
            success: true, 
            message: 'Signup successful' 
          }
        };

        if (response.data.success) {
          // Optionally log the user in directly after signup
          // Or redirect to login page
          return true;
        } else {
          this.error = response.data.message || 'Signup failed';
          return false;
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'An unexpected error occurred during signup.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      this.user = null;
      this.token = null;
      this.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // redirect to home page (will be done at component level)
      // router.push('/signin');
    },
    clearError() {
      this.error = null;
    }
  },
});