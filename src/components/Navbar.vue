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
        <h1 class="m-0 text-primary"><span class="gold-gradient">One</span></h1>
      </router-link>
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span class="navbar-toggler-icon"></span>
      </button>
      <BCollapse id="navbarCollapse" class="navbar-collapse" :is-nav="true" v-model="isNavCollapsed">
        <div class="navbar-nav ms-auto">
          <router-link to="/" class="nav-item nav-link">Home</router-link>
          <router-link to="/about" class="nav-item nav-link">About</router-link>
          <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Deals</a>
                <div class="dropdown-menu rounded-0 m-0">
                    <router-link to="/category/real-estate" class="dropdown-item">Real Estate</router-link>
                    <router-link to="/category/cars" class="dropdown-item">Cars</router-link>
                    <router-link to="/category/other-deals" class="dropdown-item">Other Deals</router-link>
                </div>
            </div>
          <!-- BNavItemDropdown text="Deals" menu-class="rounded-0 m-0">
            <BDropdownItem to="/category/real-estate">Real Estate</BDropdownItem>
            <BDropdownItem to="/category/cars">Cars</BDropdownItem>
            <BDropdownItem to="/category/other-deals">Other Deals</BDropdownItem>
          </BNavItemDropdown -->
          <!-- <router-link to="/signup" class="nav-item nav-link">Sign Up</router-link> -->
          <router-link to="/contact" class="nav-item nav-link">Contact</router-link>
          <router-link to="/signin" class="nav-item nav-link">Sign In</router-link>
        </div>
        <router-link to="/post-deal" class="btn btn-primary px-3 d-none d-lg-flex">Post a Deal</router-link> <!-- Assuming a route /post-deal -->
      </BCollapse>
    </nav>
  </div>
</template>

<style scoped>
.nav-bar {
    position: relative;
    margin-top: 45px;
    padding: 0 3rem;
    transition: .5s;
    z-index: 9999;
}

.nav-bar.sticky-top {
    position: sticky;
    padding: 0;
    z-index: 9999;
}

.navbar {
    box-shadow: 0 0 30px rgba(0, 0, 0, .08);
}

.navbar .dropdown-toggle::after {
    border: none;
    content: "\f107";
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    vertical-align: middle;
    margin-left: 5px;
    transition: .5s;
}

.navbar .dropdown-toggle[aria-expanded=true]::after {
    transform: rotate(-180deg);
}

.navbar-light .navbar-nav .nav-link {
    margin-right: 30px;
    padding: 25px 0;
    color: #FFFFFF;
    font-size: 15px;
    text-transform: uppercase;
    outline: none;
}

.navbar-light .navbar-nav .nav-link:hover,
.navbar-light .navbar-nav .nav-link.active {
    color: var(--primary);
}

@media (max-width: 991.98px) {
    .nav-bar {
        margin: 0;
        padding: 0;
    }

    .navbar-light .navbar-nav .nav-link  {
        margin-right: 0;
        padding: 10px 0;
    }

    .navbar-light .navbar-nav {
        border-top: 1px solid #EEEEEE;
    }
}

.navbar-light .navbar-brand {
    height: 75px;
}

.navbar-light .navbar-nav .nav-link {
    color: var(--dark);
    font-weight: 500;
}

@media (min-width: 992px) {
    .navbar .nav-item .dropdown-menu {
        display: block;
        top: 100%;
        margin-top: 0;
        transform: rotateX(-75deg);
        transform-origin: 0% 0%;
        opacity: 0;
        visibility: hidden;
        transition: .5s;
        
    }

    .navbar .nav-item:hover .dropdown-menu {
        transform: rotateX(0deg);
        visibility: visible;
        transition: .5s;
        opacity: 1;
    }
}
</style>
