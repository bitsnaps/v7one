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
  getUsers(page = 1, search = '') {
    return apiClient.get(`/api/admin/users?page=${page}&search=${search}`);
  },
};
