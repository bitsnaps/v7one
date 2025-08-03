<template>
    <nav id="sidebar" class="sidebar js-sidebar">
        <div class="sidebar-content js-simplebar">
            <a class='sidebar-brand' href='/'>
                <span class="sidebar-brand-text align-middle">
                    <img class="img-fluid logo" src="/logo.png" alt="Icon"> Dashboard
                </span>
            </a>

            <ul class="sidebar-nav">
                <li class="sidebar-header">
                    Pages
                </li>
                <li class="sidebar-item">
                    <router-link to="/user/dashboard" class="sidebar-link">
                        <i class="align-middle fas fa-sliders-h"></i> <span class="align-middle">Dashboard</span>
                    </router-link>
                </li>

                <li class="sidebar-item">
                     <router-link to="/user/listings" class="sidebar-link">
                        <i class="align-middle fas fa-list"></i> <span class="align-middle">Deals</span>
                    </router-link>
                </li>

                 <li class="sidebar-item">
                     <router-link to="/user/messages" class="sidebar-link">
                        <i class="align-middle fas fa-comment-alt"></i> <span class="align-middle">Messages</span>
                    </router-link>
                </li>

                <li class="sidebar-item">
                    <router-link to="/user/notifications" class="sidebar-link">
                       <i class="align-middle fas fa-bell"></i> <span class="align-middle">Notifications</span>
                   </router-link>
               </li>

            </ul>

        </div>
    </nav>
</template>

<script setup>
</script>

<style scoped>
.sidebar-item > .router-link-active {
  background: #f8f9fa;
  color: #212529;
}
.sidebar-item > .router-link-active i,
.sidebar-item > .router-link-active span {
    color: #212529;
}
</style>