import { apiClient } from '../helpers/utils';

export default {
  getDashboardStats() {
    return apiClient.get('/api/admin/dashboard/stats');
  },
  getRecentListings() {
    return apiClient.get('/api/admin/dashboard/recent-listings');
  },
  getRecentUsers() {
    return apiClient.get('/api/admin/dashboard/recent-users');
  },
};
