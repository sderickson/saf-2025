import { defineConfig } from "vitepress";
import { loadEnv } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientRoot = resolve(__dirname, "..");

// VitePress/Vite can leave import.meta.env.VITE_* as undefined in the client
// bundle unless we define them explicitly from .env* files.
const mode = process.argv.some((arg) => /(^|\/)build$/.test(arg))
  ? "production"
  : "development";
const env = loadEnv(mode, clientRoot, "VITE_");

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Workflow Documentation",
  srcDir: "./content",
  description: "Documentation for saflib workflows",
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
      { text: "SAF", link: "https://docs.saf-demo.online/" },
      { text: "Blog", link: "https://blog.scotterickson.info/" },
    ],
    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/" },
          { text: "Quick Start", link: "/quick-start" },
        ],
      },
      {
        text: "Writing Workflows",
        items: [
          { text: "Scope and Design", link: "/scope-and-design" },
          { text: "Directory structure", link: "/directory-structure" },
          { text: "Templates", link: "/templates" },
          { text: "Steps", link: "/steps" },
          { text: "Documentation", link: "/documentation" },
          { text: "Complex Workflows", link: "/complex-workflows" },
        ],
      },
      {
        text: "Running Workflows",
        items: [
          { text: "Manual testing", link: "/manual-testing" },
          { text: "With an Agent", link: "/with-an-agent" },
          { text: "With Version Control", link: "/with-version-control" },
          { text: "In CI", link: "/in-ci" },
          {
            text: "Monitoring and Iterating",
            link: "/monitoring-and-iterating",
          },
        ],
      },
      {
        text: "More Resources",
        items: [
          { text: "Reference", link: "/reference" },
          { text: "Development", link: "/development" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/sderickson" }],
  },
});
