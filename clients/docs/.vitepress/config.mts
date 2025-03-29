import { defineConfig } from 'vitepress'

import { readdirSync, statSync } from 'fs'
import { join, resolve } from 'path'

function findMarkdownFiles(dir: string): string[] {
  const files: string[] = []
  const items = readdirSync(dir)
  
  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath))
    } else if (item.endsWith('.md')) {
      files.push(fullPath)
    }
  }
  
  return files
}

const saflibPath = resolve(__dirname, '../saflib');
const markdownFiles = findMarkdownFiles(saflibPath);
console.log("markdownFiles", markdownFiles);

// interface package {
//   name: string;
//   docs: string[];
//   index: string;
//   group: string;
// }

const docsByPackage: Record<string, string[]> = markdownFiles.reduce((acc, file) => {
  const relativePath = file.replace(saflibPath, '');
  const packageName = relativePath.split('/').slice(1, 2).join('/');
  if (!acc[packageName]) {
    acc[packageName] = [];
  }
  acc[packageName].push(`/saflib/${relativePath}`);
  return acc;
}, {});
console.log("docsByPackage", docsByPackage);

const sidebar = Object.entries(docsByPackage).map(([packageName, files]) => ({
  text: packageName,
  items: (files).map((file) => ({ text: file.split('/').pop(), link: file })),
}));

console.log("sidebar", JSON.stringify(sidebar, null, 2));

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SAF Documentation",
  description: "Reference and Guide for Scott's Application Framework",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
    sidebar,
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
      { icon: 'github', link: 'https://github.com/sderickson/saf-2025' }
    ]
  }
})
