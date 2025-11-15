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
    ],
    // sidebar: [
    //   {
    //     text: "Sidebar section",
    //     items: [
    //       { text: "Item 1", link: "/item-1" },
    //       { text: "Item 2", link: "/item-2" },
    //       { text: "Item 3", link: "/item-3" },
    //     ],
    //   },
    // ],

    socialLinks: [
      // { icon: "github", link: "https://github.com/sderickson/saf-2025" },
    ],
  },
});
