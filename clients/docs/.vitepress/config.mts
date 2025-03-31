import { defineConfig } from "vitepress";

import { docsByPackage, type packageInfo } from "./parse.ts";

interface sidebarItem {
  text: string;
  link?: string;
  items?: sidebarItem[];
}

const packageInfoToSidebar = (packageInfo: packageInfo): sidebarItem | undefined => {
  let sidebar: sidebarItem[] = packageInfo.docs;
  if (packageInfo.index) {
    sidebar.unshift({
      text: packageInfo.name,
      link: packageInfo.index,
    });
  }
  if (sidebar.length > 0) {
    return {
      text: packageInfo.name,
      items: sidebar,
    };
  } else {
    return undefined;
  }
};

const sidebar = Object.entries(docsByPackage)
  .map(([_, packageInfo]) => packageInfoToSidebar(packageInfo))
  .filter((item): item is sidebarItem => item !== undefined);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SAF Documentation",
  srcDir: "../..",
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
