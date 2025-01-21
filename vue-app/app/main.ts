import { createApp } from "vue";
import App from "./CoreProductApp.vue";
import { createVuetify } from "vuetify";

const vuetify = createVuetify();

createApp(App).use(vuetify).mount("#app");
