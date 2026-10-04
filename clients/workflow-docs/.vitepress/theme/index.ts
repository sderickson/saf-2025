// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { initPostHogIfConfigured } from "@saflib/vendors-posthog-client/init";
import "./style.css";

// `as Theme` (not `satisfies`) — assigning Layout to Theme crashes TS 6's
// satisfies elaborator when VitePress's nested @vue/* types diverge by path.
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp() {
    if (import.meta.env.SSR) {
      return;
    }

    // Pass VITE_* from app source — Vite does not substitute import.meta.env
    // inside @saflib workspace packages, so reading them in init() alone no-ops.
    initPostHogIfConfigured({
      apiKey: import.meta.env.VITE_POSTHOG_PROJECT_API_KEY,
      apiHost: import.meta.env.VITE_POSTHOG_PROJECT_HOST,
    });
  },
} as Theme;
