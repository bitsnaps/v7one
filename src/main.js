import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
// Add the necessary CSS
// import 'bootstrap/dist/css/bootstrap.css' // Default Bootstrap
import './assets/css/bootstrap.min.css' // Customized Boostswatch (Minty)
// import './assets/css/bootstrap-icons.min.css' // Bootstrap-icons
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App);

app.use(createBootstrap()) // Add Bootstrap5
app.use(router)
app.mount('#app')
