import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import { createBootstrap } from 'bootstrap-vue-next'
// Add the necessary CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import './style.css'
import App from './App.vue';
import router from './router'; // Import the router


const i18n = createI18n({
    // something vue-i18n options here ...
  })
  
const app = createApp(App)
app.use(createBootstrap()) // Add Bootstrap5
app.use(i18n)
app.use(router)
app.mount('#app');
