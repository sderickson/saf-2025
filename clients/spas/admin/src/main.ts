import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles"; // Correct path for Vuetify 3 styles

import { createApp } from "vue";
import App from "./AdminApp.vue"; // Use the correct component name
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components"; // Import components
import * as directives from "vuetify/directives"; // Import directives
import router from "./router"; // Corrected path
import { VueQueryPlugin } from "@tanstack/vue-query";

const vuetify = createVuetify({
  components, // Add components
  directives, // Add directives
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "light",
  },
});

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(VueQueryPlugin);
app.mount("#app");
