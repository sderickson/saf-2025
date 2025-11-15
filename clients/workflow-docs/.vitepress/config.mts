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
    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/introduction" },
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
          { text: "Monitoring and Iterating", link: "/monitoring-and-iterating" },
        ],
      },
      {
        text: "Development",
        items: [
          { text: "Roadmap", link: "/roadmap" },
          { text: "Contributing", link: "/contributing" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Library", link: "/library" },
          { text: "Examples", link: "/examples" },
        ],
      },
    ],

    socialLinks: [
      // { icon: "github", link: "https://github.com/sderickson/saf-2025" },
    ],
  },
});
