import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import { createI18n } from 'vue-i18n'
// Add the necessary CSS
// import 'font-awesome/css/font-awesome.min.css' // Font-awesome (npm)
// import 'bootstrap/dist/css/bootstrap.css' // Default Bootstrap
import './assets/css/bootstrap.min.css' // Customized Boostswatch (Minty)
// import 'bootstrap-icons/font/bootstrap-icons.min.css' // Default Bootstrap
// import './assets/css/bootstrap-icons.min.css' // Bootstrap-icons
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import './style.css'
import App from './App.vue'
import router from './router'

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      // en: import('./locales/en.json'),
      fr: import('./locales/fr.json'),
      ar: import('./locales/ar.json')
    },
    // legacy: false,
    // globalInjection: true
  })

const app = createApp(App);

app.use(createBootstrap()) // Add Bootstrap5
app.use(router)
app.use(i18n)
app.mount('#app')
