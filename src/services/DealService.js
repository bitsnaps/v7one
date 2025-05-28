import { apiClient } from '../helpers/utils';

export default {
  getDeals(params) {
    return apiClient.get('/api/deals', { params });
  },
  getCategories() {
    return apiClient.get('/api/categories');
  },
  getDealBySlug(slug) {
    // Assuming your API has an endpoint like /api/deals/:slug
    // If not, this needs to be adjusted or the backend needs to support it.
    // For now, let's filter from all deals as a fallback if no direct endpoint exists.
    // This is not efficient for a real backend but works with the current mock API structure.
    return apiClient.get('/api/deals').then(response => {
      const deal = response.data.find(d => d.slug === slug);
      if (deal) {
        return { data: deal }; // Mimic Axios response structure
      }
      return Promise.reject(new Error('Deal not found'));
    });
  },
  getDealById(id) {
    return apiClient.get(`/api/deals/${id}`);
  },
  postDeal(dealData) {
    return apiClient.post('/api/contact', dealData); // Assuming '/api/contact' is the endpoint for posting deals based on previous context
  },
  login(credentials) {
    return apiClient.post('/api/login', credentials);
  },
  signup(userData) {
    return apiClient.post('/api/signup', userData);
  }
};
