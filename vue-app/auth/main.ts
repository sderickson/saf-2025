import { createApp } from 'vue'
import App from './AuthApp.vue'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify();
console.log('checking...');

createApp(App).use(vuetify).mount('#app')
