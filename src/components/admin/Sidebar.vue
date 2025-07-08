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
                <li class="sidebar-item" :class="{ 'active': $route.path === '/admin/dashboard' }">
                    <router-link to="/admin/dashboard" class="sidebar-link">
                        <i class="align-middle fas fa-sliders-h"></i> <span class="align-middle">Dashboard</span>
                    </router-link>
                </li>

                <li class="sidebar-item" :class="{ 'active': $route.path === '/admin/users' }">
                     <router-link to="/admin/users" class="sidebar-link">
                        <i class="align-middle fas fa-users"></i> <span class="align-middle">Users</span>
                    </router-link>
                </li>

                 <li class="sidebar-item" :class="{ 'active': $route.path === '/admin/categories' }">
                     <router-link to="/admin/categories" class="sidebar-link">
                        <i class="align-middle fas fa-th-large"></i> <span class="align-middle">Categories</span>
                    </router-link>
                </li>

                 <li class="sidebar-item" :class="{ 'active': $route.path === '/admin/attributes' }">
                     <router-link to="/admin/attributes" class="sidebar-link">
                        <i class="align-middle fas fa-th-large"></i> <span class="align-middle">Attributes</span>
                    </router-link>
                </li>

                <li class="sidebar-item" :class="{ 'active': $route.path === '/admin/attribute-values' }">
                    <router-link to="/admin/attribute-values" class="sidebar-link">
                        <i class="align-middle fas fa-tshirt"></i> <span class="align-middle">Attribute Values</span>
                    </router-link>
                </li>

                <li class="sidebar-item" :class="{ 'active': $route.path === '/admin/listings' }">
                     <router-link to="/admin/listings" class="sidebar-link">
                        <i class="align-middle fas fa-list"></i> <span class="align-middle">Deals</span>
                    </router-link>
                </li>
                <li class="sidebar-item" :class="{ 'active': $route.path.startsWith('/admin/listings/') }">
                    <router-link :to="`/admin/listings/${$route.params.listingId}/media`" class="sidebar-link" v-if="$route.params.listingId">
                        <i class="align-middle fas fa-photo-video"></i> <span class="align-middle">Media</span>
                    </router-link>
                </li>
                 <li class="sidebar-item" :class="{ 'active': $route.path === '/admin/messages' }">
                     <router-link to="/admin/messages" class="sidebar-link">
                        <i class="align-middle fas fa-comment-alt"></i> <span class="align-middle">Messages</span>
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