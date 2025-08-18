import { defineConfig } from "vitepress";
import { resolve } from "path";
import { getDocsByPackage, type packageInfo } from "./parse.ts";

interface sidebarItem {
  text: string;
  link?: string;
  items?: sidebarItem[];
}

const packageInfoToSidebar = (
  packageInfo: packageInfo,
): sidebarItem | undefined => {
  let sidebar: sidebarItem[] = packageInfo.docs;
  if (sidebar.length > 0) {
    return {
      text: packageInfo.name,
      items: sidebar,
    };
  } else {
    return undefined;
  }
};

const sidebar = Object.entries(
  getDocsByPackage(resolve(__dirname, "../../../saflib")),
)
  .map(([_, packageInfo]) => packageInfoToSidebar(packageInfo))
  .filter((item): item is sidebarItem => item !== undefined);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SAF Documentation",
  srcDir: "../../saflib",
  description: "Reference and Guide for Scott's Application Framework",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Docs", link: "/" },
      { text: "Template", link: "https://github.com/sderickson/saf-template" },
      { text: "Demo", link: "https://saf-demo.online/" },
      { text: "Lib", link: "https://github.com/sderickson/saflib" },
    ],
    sidebar: [
      {
        text: "Overview",
        link: "/",
      },
      {
        text: "Best Practices",
        link: "/best-practices",
      },
      {
        text: "Conventions",
        link: "/conventions",
      },
      ...sidebar,
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/sderickson/saf-2025" },
    ],
  },
});
