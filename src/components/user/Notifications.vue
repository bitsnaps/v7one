<script setup>
import { ref, onMounted } from 'vue';
import UserService from '@/services/UserService';

const notifications = ref([]);

const fetchNotifications = async () => {
  try {
    const response = await UserService.getNotifications();
    notifications.value = response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

const markAsRead = async (notificationId) => {
  try {
    await UserService.markNotificationAsRead(notificationId);
    fetchNotifications();
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

const deleteNotification = async (notificationId) => {
  try {
    await UserService.deleteNotification(notificationId);
    fetchNotifications();
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};

onMounted(() => {
  fetchNotifications();
});
</script>
<template>
  <main class="content">
    <div class="container-fluid p-0">
      
      <h1 class="h3 mb-3">My Notifications</h1>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">All Notifications</h5>
            </div>
            <div class="card-body table-responsive p-0">
              <table class="table table-hover text-nowrap">
                <thead>
                  <tr>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="notification in notifications" :key="notification.id">
                    <td>{{ notification.message }}</td>
                    <td>{{ new Date(notification.createdAt).toLocaleString() }}</td>
                    <td>
                      <span :class="['badge', notification.isRead ? 'bg-success' : 'bg-warning']">
                        {{ notification.isRead ? 'Read' : 'Unread' }}
                      </span>
                    </td>
                    <td>
                      <button v-if="!notification.isRead" class="btn btn-sm btn-info me-2" @click="markAsRead(notification.id)">Mark as Read</button>
                      <button class="btn btn-sm btn-danger" @click="deleteNotification(notification.id)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
</style>