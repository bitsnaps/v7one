<script setup>
import { ref } from 'vue';
import { BCollapse, BNavItemDropdown, BDropdownItem } from 'bootstrap-vue-next';

const isNavCollapsed = ref(true); // Initialize as collapsed, Bootstrap's toggler will manage it
</script>

<template>
  <div class="container-fluid nav-bar bg-transparent">
    <nav class="navbar navbar-expand-lg bg-white navbar-light py-0 px-4">
      <router-link to="/" class="navbar-brand d-flex align-items-center text-center">
        <div class="icon p-2 me-2">
          <img class="img-fluid" src="/logo.png" alt="Icon" style="width: 48px; height: 48px;">
        </div>
        <!-- <h1 class="m-0 text-primary">v7 One</h1> -->
      </router-link>
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span class="navbar-toggler-icon"></span>
      </button>
      <BCollapse id="navbarCollapse" class="navbar-collapse" :is-nav="true" v-model="isNavCollapsed">
        <div class="navbar-nav ms-auto">
          <router-link to="/" class="nav-item nav-link">Home</router-link>
          <router-link to="/about" class="nav-item nav-link">About</router-link>
          <BNavItemDropdown text="Deals" menu-class="rounded-0 m-0">
            <BDropdownItem to="/category/real-estate">Real Estate</BDropdownItem>
            <BDropdownItem to="/category/cars">Cars</BDropdownItem>
            <BDropdownItem to="/category/other-deals">Other Deals</BDropdownItem>
          </BNavItemDropdown>
          <router-link to="/contact" class="nav-item nav-link">Contact</router-link>
          <router-link to="/signin" class="nav-item nav-link">Sign In</router-link>
          <router-link to="/signup" class="nav-item nav-link">Sign Up</router-link>
        </div>
        <router-link to="/post-deal" class="btn btn-primary px-3 d-none d-lg-flex">Post a Deal</router-link> <!-- Assuming a route /post-deal -->
      </BCollapse>
    </nav>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
.nav-bar {
    position: relative;
    z-index: 999;
}

.nav-bar.sticky-top {
    position: sticky;
    top: 0;
    z-index: 999;
}

.navbar .dropdown-toggle::after {
    border: none;
    content: "\f107";
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    vertical-align: middle;
    margin-left: 8px;
}

.navbar .nav-item .nav-link {
    margin-right: 30px;
    padding: 25px 0;
    color: var(--dark);
    font-size: 15px;
    font-weight: 500;
    outline: none;
}

.navbar .nav-item .nav-link:hover,
.navbar .nav-item .nav-link.active {
    color: var(--primary);
}

.navbar.sticky-top {
    padding: 10px 50px;
    box-shadow: 0 0 30px rgba(0, 0, 0, .08);
}

.navbar .navbar-brand h1 {
    color: #FFFFFF;
}

.navbar.sticky-top .navbar-brand h1 {
    color: var(--primary);
}

@media (max-width: 991.98px) {
    .navbar .nav-item .nav-link {
        margin-right: 0;
        padding: 10px 0;
    }

    .navbar .navbar-nav {
        border-top: 1px solid #EEEEEE;
    }
}

@media (min-width: 992px) {
    .navbar .nav-item .nav-link::before {
        position: absolute;
        content: "";
        width: 0;
        height: 2px;
        bottom: -1px;
        left: 50%;
        background: var(--primary);
        transition: .5s;
    }

    .navbar .nav-item .nav-link:hover::before,
    .navbar .nav-item .nav-link.active::before {
        width: calc(100% - 2px);
        left: 1px;
    }

    .navbar .nav-item .nav-link.nav-contact::before {
        display: none;
    }
}
</style>
