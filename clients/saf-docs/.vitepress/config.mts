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

const packagesToSkip = [
  "@saflib/cron-db",
  "@saflib/cron-spec",
  "@saflib/cron-vue",
  "@saflib/email-vue",
  "@saflib/email-spec",
  "@saflib/identity-common",
  "@saflib/identity-db",
  "@saflib/identity-grpc",
  "@saflib/identity-http",
  "@saflib/identity-rpcs",
  "@saflib/identity-spec",
  "@saflib/auth-links",
  "@saflib/auth",
  "@saflib/processes", // This needs work
];

const sidebar = Object.entries(
  getDocsByPackage(resolve(__dirname, "../../../saflib")),
)
  .map(([_, packageInfo]) => packageInfoToSidebar(packageInfo))
  .filter((item): item is sidebarItem => item !== undefined)
  .filter((item): item is sidebarItem => !packagesToSkip.includes(item.text));

sidebar.sort((a, b) => {
  if (a.text > b.text) {
    return 1;
  }
  if (a.text < b.text) {
    return -1;
  }
  return 0;
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SAF Documentation",
  srcDir: "../../saflib",
  description: "Reference and Guide for Scott's Application Framework",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Workflows", link: "https://workflows.saf-demo.online/" },
      { text: "Blog", link: "https://scotterickson.info/" },
    ],
    sidebar: [
      { text: "General", items: [
        { text: "Overview", link: "/" },
        { text: "Best Practices", link: "/best-practices" },
        { text: "Automated Workflows", link: "/workflows" },
      ]},
      { text: "Repositories", items: [
        { text: "Source", link: "https://github.com/sderickson/saflib" },
        { text: "Template", link: "https://github.com/sderickson/saf-template" },
      ]},
      ...sidebar,
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/sderickson" },
    ],
  },
});
