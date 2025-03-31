import "vuetify/lib/styles/main.css";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import App from "./CoreProductApp.vue";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { router } from "./router";
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
app
  .use(vuetify)
  .use(router)
  .use(VueQueryPlugin, { enableDevtoolsV6Plugin: true })
  .mount("#app");
