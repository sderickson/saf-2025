import "@mdi/font/css/materialdesignicons.css";
import "vuetify/lib/styles/main.css";

import { createApp } from "vue";
import App from "./AdminApp.vue"; // Use the correct component name
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import router from "./router"; // Corrected path
import { VueQueryPlugin } from "@tanstack/vue-query";

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(VueQueryPlugin, { enableDevtoolsV6Plugin: true });
app.mount("#app");
