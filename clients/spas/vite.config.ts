import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import vueDevTools from "vite-plugin-vue-devtools";
import path from "path";
import ignore from "rollup-plugin-ignore";

function makeConfig() {
  return defineConfig({
    base: "/",
    appType: "mpa",
    plugins: [vue(), vuetify(), vueDevTools()],
    build: {
      rollupOptions: {
        input: {
          app: path.resolve(__dirname, "app/index.html"),
          auth: path.resolve(__dirname, "auth/index.html"),
          landing: path.resolve(__dirname, "index.html"),
          admin: path.resolve(__dirname, "admin/index.html"),
        },
        plugins: [ignore(["**/*.test.ts"])],
      },
    },
    resolve: {
      alias: {
        clients: path.resolve(__dirname, "./"),
        "@saflib/specs-apis": path.resolve(__dirname, "../specs/apis/dist"),
      },
    },
    server: {
      strictPort: true,
      host: true,
      /*
       * For development, page urls should all return the same index.html
       * file, but nothing else should be proxied. The regexes below all
       * target urls without a file extension. So, no SPA routes should have "."
       * in them.
       */
      proxy: {},
    },
  });
}

export default makeConfig();
