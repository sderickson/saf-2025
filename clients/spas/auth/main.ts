import "@mdi/font/css/materialdesignicons.css";
import "vuetify/lib/styles/main.css";

import { createApp } from "vue";
import App from "./AuthApp.vue";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { defaultRouter } from "@saflib/auth-vue";
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
  .use(defaultRouter)
  .use(VueQueryPlugin, { enableDevtoolsV6Plugin: true })
  .mount("#app");
