import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Workflow Documentation",
  srcDir: "./content",
  description: "Workflow Documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
    ],

    socialLinks: [
      // { icon: "github", link: "https://github.com/sderickson/saf-2025" },
    ],
  },
});
