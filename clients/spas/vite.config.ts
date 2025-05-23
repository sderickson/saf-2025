import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import vueDevTools from "vite-plugin-vue-devtools";
import type { ProxyOptions } from "vite";
import path from "path";
import ignore from "rollup-plugin-ignore";
const DEBUG_PROXY = true;

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
      proxy: {
        "^/auth/[^\\.]+$": {
          rewrite: () => "http://localhost:5173/auth/",
          target: "http://localhost:5173",
          configure: proxyLogger,
        },
        "^/app/[^\\.]+$": {
          rewrite: () => "http://localhost:5173/app/",
          target: "http://localhost:5173",
          configure: proxyLogger,
        },
        "^/admin/[^\\.]+$": {
          rewrite: () => "http://localhost:5173/admin/",
          target: "http://localhost:5173",
          configure: proxyLogger,
        },
      },
    },
  });
}

// Utils

const log = (...args: unknown[]) => {
  // same format as vite's dev server logs
  console.log(getTimeFormatted(), "[vite.config.ts]", ...args);
};

const getTimeFormatted = () => {
  const date = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return formatter.format(date);
};

const proxyLogger: ProxyOptions["configure"] = (proxy, _options) => {
  if (DEBUG_PROXY) {
    proxy.on("error", (err, _req, _res) => {
      log("Proxy error", err);
    });
    proxy.on("proxyRes", (proxyRes, req, _res) => {
      if ("originalUrl" in req) {
        log(
          "Proxy",
          `<${proxyRes.statusCode}>`,
          req.originalUrl,
          "=>",
          req.url,
        );
      }
    });
  }
};

export default makeConfig();
