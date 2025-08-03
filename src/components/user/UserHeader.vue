<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import UserService from '@/services/UserService';
 
const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.user);
const messages = ref([]);
const notifications = ref([]);

const fetchMessages = async () => {
  try {
    //const response = await UserService.getRecentMessages();
    //messages.value = response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

const fetchNotifications = async () => {
  try {
    const response = await UserService.getNotifications();
    notifications.value = response.data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

onMounted(() => {
  fetchMessages();
  fetchNotifications();
});

const logout = async () => {
  try {
    authStore.logout();
    await router.push('/');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

const toggleSidebar = () => {
  const sidebar = document.querySelector('.js-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
  }
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 300);
};
</script>

<template>
    <nav class="navbar navbar-expand navbar-light navbar-bg">
        <a class="sidebar-toggle js-sidebar-toggle" @click="toggleSidebar">
            <i class="hamburger align-self-center"></i>
        </a>

        <div class="navbar-collapse collapse">
            <ul class="navbar-nav navbar-align">
               <li class="nav-item dropdown">
                   <a class="nav-icon dropdown-toggle" href="#" id="alertsDropdown" data-bs-toggle="dropdown">
                       <div class="position-relative">
                           <i class="align-middle far fa-bell"></i>
                           <span class="indicator">{{ notifications.length }}</span>
                       </div>
                   </a>
                   <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0" aria-labelledby="alertsDropdown">
                       <div class="dropdown-menu-header">
                           {{ notifications.length }} New Notifications
                       </div>
                       <div class="list-group">
                           <a v-for="notification in notifications" :key="notification.id" href="#" class="list-group-item" :class="{'bg-white': notification.isRead}">
                               <div class="row g-0 align-items-center">
                                   <div class="col-2">
                                       <i class="text-success fa-flag" :class="{'far': notification.isRead, 'fa': !notification.isRead }"></i>
                                   </div>
                                   <div class="col-10">
                                       <div class="text-dark">{{ notification.type }}</div>
                                       <div class="text-muted small mt-1">{{ notification.message }}</div>
                                       <div class="text-muted small mt-1">{{ new Date(notification.createdAt).toLocaleString() }}</div>
                                   </div>
                               </div>
                           </a>
                       </div>
                       <div class="dropdown-menu-footer">
                           <router-link to="/user/notifications" class="text-muted">Show all notifications</router-link>
                       </div>
                   </div>
               </li>

                <li class="nav-item dropdown">
                    <a class="nav-icon dropdown-toggle" href="#" id="messagesDropdown" data-bs-toggle="dropdown">
                        <div class="position-relative">
                            <i class="align-middle far fa-comment-alt"></i>
                            <span v-if="messages.length > 0" class="indicator">{{ messages.length }}</span>
                        </div>
                    </a>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0" aria-labelledby="messagesDropdown">
                        <div class="dropdown-menu-header">
                            <div class="position-relative">
                                {{ messages.length }} New Messages
                            </div>
                        </div>
                        <div class="list-group">
                            <a v-for="message in messages" :key="message.id" href="#" class="list-group-item">
                                <div class="row g-0 align-items-center">
                                    <div class="col-2">
                                        <img :src="message.avatar" class="avatar img-fluid rounded-circle" :alt="message.sender">
                                    </div>
                                    <div class="col-10 ps-2">
                                        <div class="text-dark">{{ message.sender }}</div>
                                        <div class="text-muted small mt-1">{{ message.content }}</div>
                                        <div class="text-muted small mt-1">{{ new Date(message.time).toLocaleString() }}</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="dropdown-menu-footer">
                            <router-link to="/user/messages" class="text-muted">Show all messages</router-link>
                        </div>
                    </div>
                </li>
                
                <li class="nav-item dropdown">
                    <a class="nav-icon pe-md-0 dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="true">
                        <img :src="user?.profilePictureUrl || '/img/user.svg'" class="avatar img-fluid rounded" :alt="user?.displayName || 'user'">
                    </a>
                    <div class="dropdown-menu dropdown-menu-end" data-bs-popper="static">
                        <router-link class="dropdown-item" to="/user/profile">
                            <i class="align-middle far fa-user me-2"></i>
                             Profile
                        </router-link>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" @click.prevent="logout">
                            <i class="align-middle fas fa-arrow-right-from-bracket me-2"></i>
                            {{ $t('app.logout', 'Logout') }}
                        </a>
                    </div>
				</li>              
            </ul>
        </div>
    </nav>
</template>