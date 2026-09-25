import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/site.config.ts';

/** Wrap Markdown tables in a horizontally scrollable container so they never overflow on phones. */
function rehypeWrapTables() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === 'element' && child.tagName === 'table') {
        return { type: 'element', tagName: 'div', properties: { className: ['table-scroll'] }, children: [child] };
      }
      walk(child);
      return child;
    });
  };
  return (tree) => walk(tree);
}

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    rehypePlugins: [rehypeWrapTables],
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/404\/?$/.test(page),
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
});
