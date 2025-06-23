import { apiClient } from '../helpers/utils';

export default {
  getDeals(type = 'all', params) {
    const url = type ? `/api/deals/${type}` : '/api/deals';
    return apiClient.get(url, { params });
  },
  getCategories() {
    return apiClient.get('/api/categories');
  },

  getDealById(id) {
    return apiClient.get(`/api/deal/${id}`);
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
