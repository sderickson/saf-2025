import { defineConfig } from "vitepress";
import { loadEnv } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { getDocsByPackage, type packageInfo, type suiteInfo } from "./parse.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientRoot = resolve(__dirname, "..");

// VitePress/Vite can leave import.meta.env.VITE_* as undefined in the client
// bundle unless we define them explicitly from .env* files.
const mode = process.argv.some((arg) => /(^|\/)build$/.test(arg))
  ? "production"
  : "development";
const env = loadEnv(mode, clientRoot, "VITE_");

interface sidebarItem {
  text: string;
  link?: string;
  items?: sidebarItem[];
}

const packageInfoToSidebar = (
  packageInfo: packageInfo | suiteInfo,
): sidebarItem | undefined => {
  const sidebar: sidebarItem[] = packageInfo.docs;
  if (sidebar.length > 0) {
    return {
      text: packageInfo.name,
      items: sidebar,
    };
  }
  return undefined;
};

const packagesToSkip = [
  "@saflib/saflib", // This needs work
];

const { packages, suites } = getDocsByPackage(
  resolve(__dirname, "../../../saflib"),
);

const sidebar = [...packages, ...suites]
  .map((entry) => packageInfoToSidebar(entry))
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
  // Typedoc copies hand-written docs into ref/_media with paths relative to
  // docs/, so those copies have systematically broken relative links. Prefer
  // the originals under docs/ (see generate-typedoc media link rewrite).
  srcExclude: ["**/docs/ref/_media/**"],
  description: "Reference and Guide for Scott's Application Framework",
  ignoreDeadLinks: "localhostLinks",
  vite: {
    envDir: clientRoot,
    define: {
      "import.meta.env.VITE_POSTHOG_PROJECT_API_KEY": JSON.stringify(
        env.VITE_POSTHOG_PROJECT_API_KEY ?? "",
      ),
      "import.meta.env.VITE_POSTHOG_PROJECT_HOST": JSON.stringify(
        env.VITE_POSTHOG_PROJECT_HOST ?? "https://us.i.posthog.com",
      ),
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Workflows", link: "https://workflows.saf-demo.online/" },
      { text: "Blog", link: "https://blog.scotterickson.info/" },
    ],
    sidebar: [
      {
        text: "General",
        items: [
          { text: "Overview", link: "/" },
          { text: "Getting Started", link: "/getting-started" },
          { text: "Best Practices", link: "/best-practices" },
        ],
      },
      {
        text: "Repositories",
        items: [
          { text: "Source", link: "https://github.com/sderickson/saflib" },
          {
            text: "Template",
            link: "https://github.com/sderickson/saflib-template",
          },
        ],
      },
      ...sidebar,
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/sderickson" }],
  },
});
