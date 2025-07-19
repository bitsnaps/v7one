<template>
  <main class="content">
<div class="container-fluid p-0">
    <h1 class="h3 mb-3">Notifications</h1>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Notifications</h5>
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <button class="btn btn-primary" @click="openModal(null)">
                  <i class="fas fa-plus"></i> Create Notification
                </button>
                 <button class="btn btn-danger" @click="bulkDelete" :disabled="selectedNotifications.length === 0">
                    <i class="fas fa-trash"></i> Delete Selected
                  </button>
                  <button class="btn btn-info" @click="markAllAsRead">
                    <i class="fas fa-check-double"></i> Mark all as Read
                  </button>
              </div>
              <div class="col-md-6">
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="Search..." v-model="searchQuery" @keyup.enter="fetchNotifications">
                  <button class="btn btn-outline-secondary" type="button" @click="fetchNotifications">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th><input type="checkbox" @change="selectAll" /></th>
                    <th>User</th>
                    <th>Message</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="notification in notifications" :key="notification.id">
                    <td><input type="checkbox" v-model="selectedNotifications" :value="notification.id" /></td>
                    <td>{{ notification.User?.displayName || 'N/A' }}</td>
                    <td>{{ notification.message }}</td>
                    <td><span class="badge" :class="getBadgeClass(notification.type)">{{ notification.type }}</span></td>
                    <td>
                      <span v-if="notification.isRead" class="badge bg-success">Read</span>
                      <span v-else class="badge bg-warning">Unread</span>
                    </td>
                    <td>{{ new Date(notification.createdAt).toLocaleDateString() }}</td>
                    <td>
                      <button class="btn btn-sm btn-primary" @click="openModal(notification)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-danger" @click="deleteNotification(notification.id)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
             <div class="d-flex justify-content-center mt-3">
                <nav aria-label="Page navigation">
                  <ul class="pagination">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <a class="page-link" href="#" @click.prevent="fetchNotifications(currentPage - 1)">Previous</a>
                    </li>
                    <li v-for="page in pages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                      <a class="page-link" href="#" @click.prevent="fetchNotifications(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === pages }">
                      <a class="page-link" href="#" @click.prevent="fetchNotifications(currentPage + 1)">Next</a>
                    </li>
                  </ul>
                </nav>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="notificationModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveNotification">
              <div class="mb-3">
                <label for="user" class="form-label">User</label>
                <select id="user" class="form-select" v-model="currentNotification.userId">
                  <option v-for="user in users" :key="user.id" :value="user.id">{{ user.displayName }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="type" class="form-label">Type</label>
                <select id="type" class="form-select" v-model="currentNotification.type">
                  <option value="NEW_SUBSCRIPTION">New Subscription</option>
                  <option value="SUBSCRIPTION_CANCELLED">Subscription Cancelled</option>
                  <option value="USER_REPORT">User Report</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="message" class="form-label">Message</label>
                <textarea id="message" class="form-control" v-model="currentNotification.message"></textarea>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="isRead" v-model="currentNotification.isRead">
                <label class="form-check-label" for="isRead">
                  Mark as Read
                </label>
              </div>
              <button type="submit" class="btn btn-primary">{{ modalSaveButtonText }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  </main>
</template>

<script>
import AdminService from '@/services/AdminService';
import { Modal } from 'bootstrap';

export default {
  name: 'AdminNotifications',
  data() {
    return {
      notifications: [],
      users: [],
      searchQuery: '',
      currentPage: 1,
      pages: 1,
      selectedNotifications: [],
      currentNotification: {
        id: null,
        userId: '',
        type: 'NEW_SUBSCRIPTION',
        message: '',
        isRead: false
      },
      modal: null,
      isEditMode: false
    };
  },
  computed: {
    modalTitle() {
      return this.isEditMode ? 'Edit Notification' : 'Create Notification';
    },
    modalSaveButtonText() {
      return this.isEditMode ? 'Save Changes' : 'Create';
    }
  },
  methods: {
    async fetchNotifications(page = 1) {
      try {
        const response = await AdminService.getNotifications(page, this.searchQuery);
        this.notifications = response.data.notifications;
        this.currentPage = response.data.currentPage;
        this.pages = response.data.pages;
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    },
    async fetchUsers() {
      try {
        const response = await AdminService.getUsers(1, '');
        this.users = response.data.users;
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    },
    getBadgeClass(type) {
        switch (type) {
            case 'NEW_SUBSCRIPTION':
            return 'bg-success';
            case 'SUBSCRIPTION_CANCELLED':
            return 'bg-danger';
            case 'USER_REPORT':
            return 'bg-warning';
            default:
            return 'bg-secondary';
        }
    },
    openModal(notification) {
      if (notification) {
        this.isEditMode = true;
        this.currentNotification = { ...notification };
      } else {
        this.isEditMode = false;
        this.resetCurrentNotification();
      }
      this.modal.show();
    },
    resetCurrentNotification() {
      this.currentNotification = {
        id: null,
        userId: '',
        type: 'NEW_SUBSCRIPTION',
        message: '',
        isRead: false
      };
    },
    async saveNotification() {
      try {
        if (this.isEditMode) {
          await AdminService.updateNotification(this.currentNotification.id, this.currentNotification);
        } else {
          await AdminService.createNotification(this.currentNotification);
        }
        this.fetchNotifications(this.currentPage);
        this.modal.hide();
      } catch (error) {
        console.error('Failed to save notification:', error);
      }
    },
    async deleteNotification(id) {
      if (confirm('Are you sure you want to delete this notification?')) {
        try {
          await AdminService.deleteNotification(id);
          this.fetchNotifications(this.currentPage);
        } catch (error) {
          console.error('Failed to delete notification:', error);
        }
      }
    },
    selectAll(event) {
      if (event.target.checked) {
        this.selectedNotifications = this.notifications.map(n => n.id);
      } else {
        this.selectedNotifications = [];
      }
    },
    async bulkDelete() {
      if (confirm(`Are you sure you want to delete ${this.selectedNotifications.length} notifications?`)) {
        try {
          await AdminService.deleteNotifications(this.selectedNotifications);
          this.selectedNotifications = [];
          this.fetchNotifications(this.currentPage);
        } catch (error) {
          console.error('Failed to delete notifications:', error);
        }
      }
    },
    async markAllAsRead() {
        if (confirm('Are you sure you want to mark all notifications as read?')) {
            try {
                await AdminService.markAllNotificationsAsRead();
                this.fetchNotifications(this.currentPage);
            } catch (error) {
                console.error('Failed to mark all notifications as read:', error);
            }
        }
    }
  },
  mounted() {
    this.fetchNotifications();
    this.fetchUsers();
    this.modal = new Modal(document.getElementById('notificationModal'));
  }
};
</script>