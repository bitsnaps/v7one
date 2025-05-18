import { createApp } from 'vue';
import { createBootstrap } from 'bootstrap-vue-next';
import { createI18n } from 'vue-i18n';
// Add the necessary CSS
// import 'font-awesome/css/font-awesome.min.css' // Font-awesome (npm)
// import 'bootstrap/dist/css/bootstrap.css' // Default Bootstrap
import './assets/css/bootstrap.min.css'; // Customized Boostswatch (Minty)
// import 'bootstrap-icons/font/bootstrap-icons.min.css' // Default Bootstrap
// import './assets/css/bootstrap-icons.min.css' // Bootstrap-icons
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import './style.css';
import App from './App.vue';
import router from './router';
// import locales 
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';


const supportedLocales = ['en', 'fr', 'ar']; // Define supported locales
const getInitialLocale = () => {
  const savedLocale = localStorage.getItem('user-preferred-language');
  if (savedLocale && supportedLocales.includes(savedLocale)) {
    return savedLocale;
  }

  const browserLanguage = navigator.language.split('-')[0]; // Get 'en' from 'en-US'
  if (supportedLocales.includes(browserLanguage)) {
    return browserLanguage;
  }

  return 'en'; // Fallback to English
};

const initialLocale = getInitialLocale();

const i18n = createI18n({
    locale: initialLocale,
    fallbackLocale: 'en', // Keep 'en' as a general fallback
    // availableLocales: supportedLocales, // Make sure vue-i18n knows about available locales
    messages: { en, fr, ar },
    // legacy: false,
    // globalInjection: true
  })

const app = createApp(App);
app.use(router)
app.use(i18n)
// Initialize Bootstrap
app.use(createBootstrap())
app.mount('#app')
