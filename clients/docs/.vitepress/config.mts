import { defineConfig } from "vitepress";

import { docsByPackage } from "./parse.ts";

const sidebar = Object.entries(docsByPackage)
  .filter(([_, files]) => files.docs.length > 0)
  .map(([packageName, files]) => ({
    text: packageName,
    items: files.docs,
  }));

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SAF Documentation",
  description: "Reference and Guide for Scott's Application Framework",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],
    sidebar: [
      {
        text: "Overview",
        link: "/saflib/",
      },
      ...sidebar,
    ],
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: "github", link: "https://github.com/sderickson/saf-2025" },
    ],
  },
});
