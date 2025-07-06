import { apiClient } from '../helpers/utils';

export default {
  getDashboardStats() {
    return apiClient.get('/api/admin/dashboard/stats');
  },
  getRecentDeals() {
    return apiClient.get('/api/admin/dashboard/recent-deals');
  },
  getRecentUsers() {
    return apiClient.get('/api/admin/dashboard/recent-users');
  },
  getRecentMessages() {
    return apiClient.get('/api/admin/dashboard/recent-messages');
  },
  getUsers(page = 1, search = '') {
    return apiClient.get(`/api/admin/users?page=${page}&search=${search}`);
  },
  createUser(newUser){
    return apiClient.post(`/api/admin/users`, newUser);
  },
  updateUser(id, data) {
    return apiClient.put(`/api/admin/users/${id}`, data);
  },
deleteUser(id) {
    return apiClient.delete(`/api/admin/users/${id}`);
  },
getCategories() {
    return apiClient.get('/api/admin/categories');
  },
createCategory(data) {
    return apiClient.post('/api/admin/categories', data);
  },
  updateCategory(id, data) {
    return apiClient.put(`/api/admin/categories/${id}`, data);
  },
  deleteCategory(id) {
    return apiClient.delete(`/api/admin/categories/${id}`);
  },
getAttributes() {
    return apiClient.get('/api/admin/attributes');
  },
  createAttribute(data) {
    return apiClient.post('/api/admin/attributes', data);
  },
  updateAttribute(id, data) {
    return apiClient.put(`/api/admin/attributes/${id}`, data);
  },
  deleteAttribute(id) {
    return apiClient.delete(`/api/admin/attributes/${id}`);
  },
  getListings(page = 1, search = '') {
    const params = new URLSearchParams();
    if (typeof(page)=='number'){
      params.append('page', page);
    }
    if (search) {
      params.append('search', search);
    }
    return apiClient.get(`/api/admin/listings?${params.toString()}`);
  },

  updateListingStatus(id, status) {
    return apiClient.patch(`/api/admin/listings/${id}/status`, { status });
  },

  createListing(data) {
    return apiClient.post('/api/admin/listings', data);
  },
  updateListing(id, data) {
    return apiClient.put(`/api/admin/listings/${id}`, data);
  },
  getConversations() {
    return apiClient.get('/api/admin/messages');
  },

  getConversationDetails(id) {
    return apiClient.get(`/api/admin/messages/${id}`);
  },

  deleteConversation(id) {
    return apiClient.delete(`/api/admin/messages/${id}`);
  },

  replyToConversation(id, content) {
    return apiClient.post(`/api/admin/messages/${id}/reply`, { content });
  },

  createConversation(data) {
    return apiClient.post('/api/admin/messages', data);
  },
editMessage(messageId, content) {
    return apiClient.put(`/api/admin/messages/${messageId}`, { content });
  },
};
