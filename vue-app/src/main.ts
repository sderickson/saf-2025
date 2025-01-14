import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify();

createApp(App).use(vuetify).mount('#app')
