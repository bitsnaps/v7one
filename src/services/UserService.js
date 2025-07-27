import { apiClient } from '../helpers/utils';

export default {
  getDashboardStats() {
    return apiClient.get('/api/user/dashboard/stats');
  },

  getRecentDeals() {
    return apiClient.get('/api/user/dashboard/recent-deals');
  },

  getListings(page = 1, search = '') {
    return apiClient.get(`/api/user/listings?page=${page}&search=${search}`);
  },

  createListing(data) {
    return apiClient.post('/api/user/listings', data);
  },

  updateListing(id, data) {
    return apiClient.put(`/api/user/listings/${id}`, data);
  },

  deleteListing(id) {
    return apiClient.delete(`/api/user/listings/${id}`);
  },

  getCategories() {
    return apiClient.get('/api/user/categories');
  },

  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getConversations() {
    return apiClient.get('/api/user/conversations');
  },

  getConversationDetails(id) {
    return apiClient.get(`/api/user/conversations/${id}`);
  },

  replyToConversation(id, content) {
    return apiClient.post(`/api/user/conversations/${id}/reply`, { content });
  },
};
