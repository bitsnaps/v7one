<script setup>
import { ref, computed } from 'vue'; // Added computed for dynamic flag path
import { useI18n } from 'vue-i18n';

const isNavCollapsed = ref(true);

const { locale, availableLocales, t } = useI18n();

const switchLanguage = (newLocale) => {
  locale.value = newLocale;
  localStorage.setItem('user-preferred-language', newLocale);
};

const languageOptions = {
  en: {
    name: 'English',
    flag: '/img/flags/en.svg'
  },
  fr: {
    name: 'Français',
    flag: '/img/flags/fr.svg'
  },
  ar: {
    name: 'العربية',
    flag: '/img/flags/ar.svg'
  }
};

const currentFlag = computed(() => {
  return languageOptions[locale.value]?.flag || `/img/flags/${locale.value}.svg`; // Fallback if not in options
});
</script>

<template>
  <div class="container-fluid nav-bar bg-transparent">
    <nav class="navbar navbar-expand-lg bg-white navbar-light py-0 px-4">
      <router-link to="/" class="navbar-brand d-flex align-items-center text-center">
        <div class="icon p-2 me-2">
          <img class="img-fluid logo" src="/logo.png" alt="Icon">
        </div>
        <h1 class="m-0 text-primary"><span class="gold-gradient">One</span></h1>
      </router-link>
      <button type="button" class="navbar-toggler" @click="isNavCollapsed = !isNavCollapsed" aria-controls="navbarCollapse" :aria-expanded="!isNavCollapsed" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <BCollapse id="navbarCollapse" class="navbar-collapse" :is-nav="true" v-model="isNavCollapsed">
        <div class="navbar-nav ms-auto">
          <router-link to="/" class="nav-item nav-link" @click="isNavCollapsed = true">{{ $t('app.home', 'Home') }}</router-link>
          <router-link to="/about" class="nav-item nav-link" @click="isNavCollapsed = true">{{ $t('app.about', 'About') }}</router-link>
          <div class="nav-item dropdown">
              <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">{{ $t('app.deals', 'Deals') }}</a>
              <ul class="dropdown-menu rounded-0 m-0">
                  <li><router-link to="/category/real-estate" class="dropdown-item" @click="isNavCollapsed = true">{{ $t('app.real-estate', 'Real Estate') }}</router-link></li>
                  <li><router-link to="/category/cars" class="dropdown-item" @click="isNavCollapsed = true">{{ $t('app.cars', 'Cars') }}</router-link></li>
                  <li><router-link to="/category/other-deals" class="dropdown-item" @click="isNavCollapsed = true">{{ $t('app.other-deals', 'Other Deals') }}</router-link></li>
              </ul>
          </div>
          <router-link to="/contact" class="nav-item nav-link" @click="isNavCollapsed = true">{{ $t('app.contact', 'Contact') }}</router-link>
          <router-link to="/signin" class="nav-item nav-link" @click="isNavCollapsed = true">{{ $t('app.sign-in', 'Sign In') }}</router-link>

          <div class="nav-item dropdown language-dropdown">
            <a href="#" class="nav-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
              <img :src="currentFlag" alt="Selected language" width="24" height="12" class="me-2" />
              {{ languageOptions[locale]?.name || locale.toUpperCase() }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end rounded-0 m-0">
              <li v-for="availableLocale in availableLocales" :key="`locale-${availableLocale}`">
                <a href="#" class="dropdown-item d-flex align-items-center" @click.prevent="switchLanguage(availableLocale); isNavCollapsed = true;">
                  <img :src="languageOptions[availableLocale]?.flag || `/img/flags/${availableLocale}.svg`" :alt="languageOptions[availableLocale]?.name" width="24" height="12" class="me-2" />
                  {{ languageOptions[availableLocale]?.name || availableLocale.toUpperCase() }}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <router-link to="/post-deal" class="btn btn-primary px-3 d-none d-lg-flex" @click="isNavCollapsed = true">{{ $t('app.post-deal', 'Post a Deal') }}</router-link>
      </BCollapse>

    </nav>
  </div>
</template>

<style scoped>
.language-dropdown .dropdown-toggle::after {
    margin-left: 0.255em; /* Align with Bootstrap's default */
}

.language-dropdown .dropdown-menu {
    min-width: auto; /* Adjust to content */
}

.language-dropdown .dropdown-item {
    display: flex;
    align-items: center;
}

.language-dropdown .dropdown-item span:first-child {
    line-height: 1; /* Ensure flag SVGs align well */
}

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

.navbar .logo {
  width: 48px;
  height: 48px;
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
