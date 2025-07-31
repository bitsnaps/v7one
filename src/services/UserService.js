import { apiClient } from '../helpers/utils';

export default {
  getProfile() {
    return apiClient.get('/api/user/profile');
  },

  updateProfile(data) {
    return apiClient.put('/api/user/profile', data);
  },

  uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/api/user/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteAvatar() {
    return apiClient.delete('/api/user/profile/avatar');
  },

  getDashboardStats() {
    return apiClient.get('/api/user/dashboard/stats');
  },

  getRecentDeals() {
    return apiClient.get('/api/user/dashboard/recent-deals');
  },

  getListings(page = 1, search = '') {
    return apiClient.get(`/api/user/listings?page=${page}&search=${search}`);
  },

  getListing(id) {
    return apiClient.get(`/api/user/listings/${id}`);
  },

  getListingMedia(listingId) {
    return apiClient.get(`/api/user/listings/${listingId}/media`);
  },

  updateListingMedia(listingId, media) {
    return apiClient.post(`/api/user/listings/${listingId}/media`, { media });
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
    return apiClient.post('/api/upload', formData, {
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

  getNotifications() {
    return apiClient.get('/api/user/notifications');
  },

  markNotificationAsRead(id) {
    return apiClient.post(`/api/user/notifications/${id}/mark-read`);
  },

  deleteNotification(id) {
    return apiClient.delete(`/api/user/notifications/${id}`);
  },

  getSubscription() {
    return apiClient.get('/api/user/subscription');
  },
};
