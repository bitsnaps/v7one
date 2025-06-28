<template>
    <nav id="sidebar" class="sidebar js-sidebar">
        <div class="sidebar-content js-simplebar">
            <a class='sidebar-brand' href='/'>
                <span class="sidebar-brand-text align-middle">
                    Dashboard
                </span>
            </a>

            

            <ul class="sidebar-nav">
                <li class="sidebar-header">
                    Pages
                </li>
                <li class="sidebar-item active">
                    <router-link to="/admin/dashboard" class="sidebar-link">
                        <i class="align-middle" data-feather="sliders"></i> <span class="align-middle">Dashboard</span>
                    </router-link>
                </li>

                <li class="sidebar-item">
                     <router-link to="/admin/users" class="sidebar-link">
                        <i class="align-middle" data-feather="users"></i> <span class="align-middle">Users</span>
                    </router-link>
                </li>

                 <li class="sidebar-item">
                     <router-link to="/admin/categories" class="sidebar-link">
                        <i class="align-middle" data-feather="grid"></i> <span class="align-middle">Categories</span>
                    </router-link>
                </li>

                <li class="sidebar-item">
                     <router-link to="/admin/listings" class="sidebar-link">
                        <i class="align-middle" data-feather="list"></i> <span class="align-middle">Listings</span>
                    </router-link>
                </li>
                 <li class="sidebar-item">
                     <router-link to="/admin/messages" class="sidebar-link">
                        <i class="align-middle" data-feather="message-square"></i> <span class="align-middle">Messages</span>
                    </router-link>
                </li>

            </ul>

        </div>
    </nav>
</template>

<script setup>
</script>

<style scoped>
</style>