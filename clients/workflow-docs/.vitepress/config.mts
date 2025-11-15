import { defineConfig } from "vitepress";
import { resolve } from "path";

interface sidebarItem {
  text: string;
  link?: string;
  items?: sidebarItem[];
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Workflow Documentation",
  srcDir: "./content",
  description: "Documentation for saflib workflows",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: "Docs", link: "/" },
      // { text: "Template", link: "https://github.com/sderickson/saf-template" },
      // { text: "Demo", link: "https://saf-demo.online/" },
      // { text: "Lib", link: "https://github.com/sderickson/saflib" },
    ],
    // sidebar: [
    //   {
    //     text: "Overview",
    //     link: "/",
    //   },
    //   {
    //     text: "Best Practices",
    //     link: "/best-practices",
    //   },
    //   {
    //     text: "Automated Workflows",
    //     link: "/workflows",
    //   },
    // ],

    socialLinks: [
      { icon: "github", link: "https://github.com/sderickson/saf-2025" },
    ],
  },
});
