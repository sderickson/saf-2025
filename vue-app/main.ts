import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createApp } from "vue";
import App from "./landing/LandingApp.vue";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

createApp(App).use(vuetify).mount("#app");
