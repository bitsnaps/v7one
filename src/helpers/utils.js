/**
 * Add helper functions
 */
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  // In production, use same origin or configured URL
  return import.meta.env.VITE_API_BASE_URL || window.location.origin;
};

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();
    if (error.response && error.response.status === 401) {
      authStore.logout();
      // It's better to handle redirection in the component or router
      // to avoid circular dependencies and keep this file focused on API logic.
      // For instance, you could emit an event or have a global state that the UI reacts to.
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);


const formatPrice = (price) => {
  const number = parseFloat(price);
  if (isNaN(number)) {
      return price;
  }
  return number.toFixed(2);
};


export { getApiBaseUrl, apiClient, formatPrice };
