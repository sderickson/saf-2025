import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [vue(), vuetify(), vueDevTools()],
  server: {
    strictPort: true,
    host: true,

    // For debugging, see top answer here:
    // https://stackoverflow.com/questions/64677212/how-to-configure-proxy-in-vite
    proxy: {
      "^/auth/.+": {
        rewrite: () => "http://localhost:5173/auth/",
        target: "http://localhost:5173",
      },
      "^/app/.+": {
        rewrite: () => "http://localhost:5173/app/",
        target: "http://localhost:5173",
      },
    },
  },
});
