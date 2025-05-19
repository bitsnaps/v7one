<script setup>
import { ref, computed } from 'vue'; // Added computed for dynamic flag path
import { useI18n } from 'vue-i18n';

const isNavCollapsed = ref(false);

const { locale, availableLocales, t } = useI18n();

const switchLanguage = (newLocale) => {
  locale.value = newLocale;
  localStorage.setItem('user-preferred-language', newLocale);
  // Close navbar on mobile after language selection
  if (window.innerWidth < 992) { // Assuming 992px is your lg breakpoint
    isNavCollapsed.value = true;
  }  
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

          <BNavItemDropdown class="deals-dropdown" menu-class="rounded-0 m-0" toggle-class="nav-link-style">
            <template #button-content>
              <span class="lang-name-sm">{{ $t('app.deals', 'Deals') }}</span>
            </template>
            <BDropdownItem to="/category/real-estate" link-class="custom-dropdown-item" @click="isNavCollapsed = true">{{ $t('app.real-estate', 'Real Estate') }}</BDropdownItem>
            <BDropdownItem to="/category/cars" link-class="custom-dropdown-item" @click="isNavCollapsed = true">{{ $t('app.cars', 'Cars') }}</BDropdownItem>
            <BDropdownItem to="/category/other-deals" link-class="custom-dropdown-item" @click="isNavCollapsed = true">{{ $t('app.other-deals', 'Other Deals') }}</BDropdownItem>
          </BNavItemDropdown>

          <router-link to="/contact" class="nav-item nav-link" @click="isNavCollapsed = true">{{ $t('app.contact', 'Contact') }}</router-link>
          <router-link to="/signin" class="nav-item nav-link" @click="isNavCollapsed = true">{{ $t('app.sign-in', 'Sign In') }}</router-link>

          <BNavItemDropdown class="language-dropdown" menu-class="rounded-0 m-0 dropdown-menu-end" toggle-class="nav-link-style">
            <template #button-content>
              <img :src="currentFlag" alt="Selected language" width="20" height="10" class="me-1 lang-flag-sm" /> <!-- Adjusted size and class -->
              <span class="lang-name-sm">{{ languageOptions[locale]?.name || locale.toUpperCase() }}</span>
            </template>
            <BDropdownItem
              v-for="availableLocale in availableLocales"
              :key="`locale-${availableLocale}`"
              @click="switchLanguage(availableLocale)"
              link-class="custom-dropdown-item">
              <img :src="languageOptions[availableLocale]?.flag || `/img/flags/${availableLocale}.svg`" :alt="languageOptions[availableLocale]?.name" width="20" height="10" class="me-2 lang-flag-sm" /> <!-- Adjusted size and class -->
              {{ languageOptions[availableLocale]?.name || availableLocale.toUpperCase() }}
            </BDropdownItem>
          </BNavItemDropdown>

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

.language-dropdown .lang-flag-sm {
    width: 20px; /* Slightly smaller flag for better fit */
    height: auto; /* Maintain aspect ratio, or set fixed height e.g. 10px */
    object-fit: contain;
}

/* Adjust font size for language name in toggle if needed on smaller screens or generally */
.language-dropdown .lang-name-sm {
    font-size: 0.9em; /* Example: slightly smaller font */
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
    color: var(--dark);
    font-weight: 500;
    font-size: 15px;
    text-transform: uppercase;
    outline: none;
}


/* Styles for BNavItemDropdown toggle to match other nav-links */
:deep(.navbar-nav .nav-item .nav-link-style.dropdown-toggle) {
    color: var(--dark) !important; /* Override BNavItemDropdown default color */
    font-weight: 500;
    text-transform: uppercase;
    font-size: 15px;
    padding-top: 25px;
    padding-bottom: 25px;
    padding-right: 25px;
    display: flex;
    align-items: center;
}

/* Ensure the caret color matches */
:deep(.navbar-nav .nav-item .nav-link-style.dropdown-toggle::after) {
    border: none;
    content: "\f107";
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    vertical-align: middle;
    margin-left: 5px;
    transition: .5s;
    color: inherit; /* Inherit color from the toggle button */
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
    :deep(.navbar-nav .nav-item .nav-link-style.dropdown-toggle) {
        padding: 10px 0; /* Match mobile padding of other nav-links */
        margin-right: 0;
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


/* Apply Tajawal font for Arabic language */
html[dir="rtl"] .navbar-nav .nav-link,
html[dir="rtl"] :deep(.navbar-nav .nav-item .nav-link-style.dropdown-toggle),
html[dir="rtl"] .navbar-brand h1,
html[dir="rtl"] .language-dropdown .lang-name-sm,
html[dir="rtl"] .language-dropdown .dropdown-item,
html[dir="rtl"] .btn-primary,
html[dir="rtl"] .deals-dropdown .lang-name-sm,
html[dir="rtl"] .deals-dropdown .dropdown-item
{ /* Ensure buttons also use the font if they contain text */
  font-family: "Tajawal", sans-serif !important;
}
</style>
