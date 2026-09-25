import fs from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { site } from './src/site.config.ts';
import { tools } from './src/data/tools.ts';
import { glossaryUpdated } from './src/data/glossary.ts';

/** Guide slug → { category, updated } from each guide's frontmatter. */
const guides = Object.fromEntries(
  fs
    .readdirSync('./src/content/guides')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const fm = fs.readFileSync(`./src/content/guides/${f}`, 'utf8').split('---')[1] ?? '';
      const field = (k) => fm.match(new RegExp(`^${k}:\\s*['"]?([^'"\\n]+)`, 'm'))?.[1].trim();
      return [f.replace(/\.md$/, ''), { category: field('category'), updated: field('updated') }];
    }),
);
const newest = (dates) => dates.filter(Boolean).sort().at(-1);

/**
 * Real "last modified" date for a sitemap URL: the review date of a calculator or guide, the newest
 * date among the pages a hub lists, and the policy date for the legal and about pages.
 */
function lastmodFor(pathname) {
  const slug = pathname.replace(/^\/|\/$/g, '');
  const tool = tools.find((t) => t.slug === slug);
  if (tool) return tool.updated;
  if (slug.startsWith('guides/')) return guides[slug.slice('guides/'.length)]?.updated;
  const inCategory = tools.filter((t) => t.category === slug);
  if (inCategory.length) {
    const categoryGuides = Object.values(guides).filter((g) => g.category === slug);
    return newest([...inCategory.map((t) => t.updated), ...categoryGuides.map((g) => g.updated)]);
  }
  if (slug === 'guides') return newest(Object.values(guides).map((g) => g.updated));
  if (slug === 'calculators') return newest(tools.map((t) => t.updated));
  if (slug === 'glossary') return glossaryUpdated;
  if (slug === 'methodology') return newest(tools.map((t) => t.updated));
  if (slug === '' || slug === 'sitemap') return newest([...tools.map((t) => t.updated), ...Object.values(guides).map((g) => g.updated)]);
  return site.legalUpdated;
}

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

/**
 * In-article ad for guides: one manual AdSense unit before the third H2, only in articles with at least
 * five sections and only when the publisher ID and the inContent slot are set in site.config.ts.
 * Mirrors src/components/AdSlot.astro, which markdown content can't use directly.
 */
function rehypeInArticleAd() {
  const client = site.adsense.client;
  const slot = site.adsense.slots.inContent;
  const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });
  return (tree) => {
    if (!client || !slot) return;
    const h2s = tree.children.filter((n) => n.type === 'element' && n.tagName === 'h2');
    if (h2s.length < 5) return;
    const ad = el('aside', { className: ['ad-slot'], ariaLabel: 'Advertisement' }, [
      el('span', { className: ['ad-label'] }, [{ type: 'text', value: 'Advertisement' }]),
      el('ins', {
        className: ['adsbygoogle'],
        style: 'display:block',
        dataAdClient: client,
        dataAdSlot: slot,
        dataAdFormat: 'auto',
        dataFullWidthResponsive: 'true',
      }),
      el('script', {}, [{ type: 'text', value: '(window.adsbygoogle = window.adsbygoogle || []).push({});' }]),
    ]);
    tree.children.splice(tree.children.indexOf(h2s[2]), 0, ad);
  };
}

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Astro 7's default ('jsx') deletes line breaks next to tags, gluing words to links and bold text
  // ("an error?Tell us"). `true` compresses HTML while keeping the spaces that affect rendering.
  compressHTML: true,
  markdown: {
    processor: unified({ rehypePlugins: [rehypeWrapTables, rehypeInArticleAd] }),
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/404\/?$/.test(page),
      serialize(item) {
        const lastmod = lastmodFor(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
