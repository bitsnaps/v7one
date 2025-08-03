
<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import AdminService from '@/services/AdminService';
 
const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.user);
const messages = ref([]);
const notifications = ref([]);

const fetchMessages = async () => {
  try {
    const response = await AdminService.getRecentMessages();
    messages.value = response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

const fetchNotifications = async () => {
  try {
    const response = await AdminService.getNotifications();
    notifications.value = response.data.notifications || [];
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
    // Optionally, inform the user that logout failed.
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

        <!-- Search form -->
        <!-- <form class="d-none d-sm-inline-block">
            <div class="input-group input-group-navbar">
                <input type="text" class="form-control" placeholder="Search…" aria-label="Search">
                <button class="btn" type="button">
                    <i class="align-middle" data-feather="search"></i>
                </button>
            </div>
        </form> -->

        <div class="navbar-collapse collapse">
            <ul class="navbar-nav navbar-align">
                <!-- Notifications -->
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
                           <router-link  to="/admin/notifications" class="text-muted">Show all notifications</router-link>
                       </div>
                   </div>
               </li>

                <!-- Messages -->
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
                            <router-link to="/admin/messages" class="text-muted">Show all messages</router-link>
                        </div>
                    </div>
                </li>
                
                <!-- Languages
                <li class="nav-item dropdown">
							<a class="nav-flag dropdown-toggle" href="#" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="true">
								<img src="https://flagcdn.com/us.svg" alt="English">
							</a>
							<div class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown" data-bs-popper="static">
								<a class="dropdown-item" href="#">
									<img src="https://flagcdn.com/us.svg" alt="English" width="20" class="align-middle me-1">
									<span class="align-middle">English</span>
								</a>
								<a class="dropdown-item" href="#">
									<img src="https://flagcdn.com/dz.svg" alt="العربية" width="20" class="align-middle me-1">
									<span class="align-middle">العربية</span>
								</a>
								<a class="dropdown-item" href="#">
									<img src="https://flagcdn.com/fr.svg" alt="Français" width="20" class="align-middle me-1">
									<span class="align-middle">Français</span>
								</a>
							</div>
				</li -->

                <li class="nav-item dropdown">
                    <a class="nav-icon pe-md-0 dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="true">
                        <img :src="user?.profilePictureUrl || '/img/user.svg'" class="avatar img-fluid rounded" :alt="user?.displayName || 'user'">
                    </a>
                    <div class="dropdown-menu dropdown-menu-end" data-bs-popper="static">
                        <router-link class="dropdown-item" to="/admin/profile">
                            <i class="align-middle far fa-user me-2"></i>
                            Profile</router-link>
                        <!-- <a class="dropdown-item" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pie-chart align-middle me-1"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg> Analytics</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="/pages-settings"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings align-middle me-1"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Settings &amp;
                            Privacy</a>
                        <a class="dropdown-item" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle align-middle me-1"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Help Center</a> -->
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

<style scoped>
</style>