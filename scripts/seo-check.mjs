#!/usr/bin/env node
/**
 * SEO checker for the built site (run after `npm run build`).
 *
 *   npm run seo
 *
 * Checks every HTML page in dist/ for the basics search engines care about:
 * title and meta description (present, sensible length, unique), exactly one
 * H1, a correct absolute canonical URL, valid JSON-LD, working internal links
 * and in-page anchors, image alt text, heading order, Open Graph tags, and
 * that the sitemap and the set of indexable pages match.
 *
 * Errors make the script exit with code 1 (so CI fails); warnings don't.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.argv[2] ?? 'dist');
const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

if (!fs.existsSync(DIST)) {
  console.error(`No build found at ${DIST}. Run "npm run build" first.`);
  process.exit(1);
}

/* ------------------------------------------------------------------------ */
/* Helpers                                                                    */
/* ------------------------------------------------------------------------ */

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
    return NAMED[e.toLowerCase()] ?? m;
  });

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? decode(m[2] ?? m[3] ?? '') : null;
};

/** Visible text of an HTML fragment, whitespace-collapsed. */
const text = (html) =>
  decode(html.replace(/<(script|style|template|noscript)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
const norm = (s) => s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/\s+/g, ' ').trim();

/** URL path for a file in dist ("/about/" for about/index.html). */
function urlPathFor(file) {
  const rel = path.relative(DIST, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

/** dist file that serves a URL path, or null. */
function fileFor(urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  const candidates = clean.endsWith('/')
    ? [path.join(DIST, clean, 'index.html')]
    : [path.join(DIST, clean), path.join(DIST, clean, 'index.html'), path.join(DIST, `${clean}.html`)];
  return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) ?? null;
}

/* ------------------------------------------------------------------------ */
/* Site origin (from robots.txt) and sitemap                                   */
/* ------------------------------------------------------------------------ */

const robots = fs.existsSync(path.join(DIST, 'robots.txt')) ? fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8') : '';
const sitemapLine = robots.match(/^Sitemap:\s*(\S+)/im);
if (!sitemapLine) err('robots.txt', 'missing or has no Sitemap: line');
const origin = sitemapLine ? new URL(sitemapLine[1]).origin : 'https://example.com';

const sitemapFiles = walk(DIST).filter((f) => /sitemap-\d+\.xml$/.test(f));
const sitemapUrls = new Set();
for (const f of sitemapFiles) {
  for (const m of fs.readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const u = new URL(m[1]);
    if (u.origin !== origin) err('sitemap', `URL on a different origin: ${m[1]}`);
    if (sitemapUrls.has(u.pathname)) err('sitemap', `duplicate URL: ${u.pathname}`);
    sitemapUrls.add(u.pathname);
    if (!fileFor(u.pathname)) err('sitemap', `URL has no page: ${u.pathname}`);
    if (!u.pathname.endsWith('/')) warn('sitemap', `URL without trailing slash: ${u.pathname}`);
  }
}
if (!sitemapFiles.length) err('sitemap', 'no sitemap-N.xml files found');

/* ------------------------------------------------------------------------ */
/* Pages                                                                      */
/* ------------------------------------------------------------------------ */

const pages = walk(DIST).filter((f) => f.endsWith('.html'));
const titles = new Map();
const descriptions = new Map();
const indexable = new Set();
let checkedLinks = 0;

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const page = urlPathFor(file);
  const is404 = /\/404(\.html|\/)?$/.test(page);
  const idList = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const ids = new Set(idList);
  if (ids.size !== idList.length) {
    const dupes = [...new Set(idList.filter((id, i) => idList.indexOf(id) !== i))];
    err(page, `duplicate id${dupes.length > 1 ? 's' : ''}: ${dupes.join(', ')}`);
  }

  // Robots
  const robotsMeta = [...html.matchAll(/<meta[^>]+name="robots"[^>]*>/gi)].map((m) => attr(m[0], 'content') ?? '');
  const noindex = robotsMeta.some((c) => /noindex/i.test(c));
  if (!noindex) indexable.add(page);
  if (is404 && !noindex) err(page, '404 page should be noindex');

  // Title
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decode(titleMatch[1].trim()) : '';
  if (!title) err(page, 'missing <title>');
  else {
    if (title.length > 65) warn(page, `title is ${title.length} chars (may be truncated): "${title}"`);
    if (title.length < 20) warn(page, `title is short (${title.length} chars): "${title}"`);
    if (!noindex) titles.set(title, [...(titles.get(title) ?? []), page]);
  }

  // Description
  const descTag = html.match(/<meta[^>]+name="description"[^>]*>/i);
  const desc = descTag ? attr(descTag[0], 'content') ?? '' : '';
  if (!desc) err(page, 'missing meta description');
  else {
    if (desc.length > 165) warn(page, `description is ${desc.length} chars (may be truncated)`);
    if (desc.length < 70) warn(page, `description is short (${desc.length} chars)`);
    if (!noindex) descriptions.set(desc, [...(descriptions.get(desc) ?? []), page]);
  }

  // Canonical
  const canonTag = html.match(/<link[^>]+rel="canonical"[^>]*>/i);
  const canonical = canonTag ? attr(canonTag[0], 'href') : null;
  if (!canonical) err(page, 'missing canonical');
  else if (!is404) {
    const expected = `${origin}${page}`;
    if (canonical !== expected) err(page, `canonical is ${canonical}, expected ${expected}`);
  }

  // Document basics
  if (!/<html\b[^>]*\slang="[a-z]{2}(-[A-Z]{2})?"/i.test(html)) err(page, 'missing <html lang>');
  if (!/<meta[^>]+name="viewport"/i.test(html)) err(page, 'missing viewport meta');

  // Headings
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1s.length !== 1) err(page, `has ${h1s.length} <h1> elements (expected 1)`);
  else if (!text(h1s[0][1])) err(page, 'empty <h1>');
  const levels = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      warn(page, `heading jumps from h${levels[i - 1]} to h${levels[i]}`);
      break;
    }
  }

  // Words glued to links or bold text, e.g. "an error?<a>Tell us</a>" (from whitespace-stripping HTML compression).
  const body = html.slice(html.search(/<body[\s>]/i)).replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
  const glued = [
    ...body.matchAll(/[A-Za-z0-9?!.,;:)\u2019\u201d]<(a|strong|em|code|time)\b[^>]*>([^<]{0,24})/g),
    ...body.matchAll(/<\/(a|strong|em|code|time)>([A-Za-z0-9(\u2018\u201c][^<]{0,24})/g),
  ];
  for (const g of glued.slice(0, 3)) err(page, `missing space next to <${g[1]}>: "${decode(g[0].replace(/<[^>]+>/g, ''))}"`);

  // Images
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    if (attr(m[0], 'alt') === null) err(page, `image without alt: ${m[0].slice(0, 80)}`);
  }

  // Open Graph
  for (const prop of ['og:title', 'og:description', 'og:image', 'og:url']) {
    if (!new RegExp(`property="${prop}"`).test(html)) warn(page, `missing ${prop}`);
  }
  const ogUrl = html.match(/<meta[^>]+property="og:url"[^>]*>/i);
  if (ogUrl && canonical && attr(ogUrl[0], 'content') !== canonical) warn(page, 'og:url differs from canonical');
  const ogImage = html.match(/<meta[^>]+property="og:image"[^>]*>/i);
  const ogImageUrl = ogImage ? attr(ogImage[0], 'content') ?? '' : '';
  if (ogImageUrl.startsWith(origin) && !fileFor(new URL(ogImageUrl).pathname)) err(page, `og:image file not found: ${ogImageUrl}`);
  if (ogImage && !/^https:\/\//.test(ogImageUrl)) err(page, `og:image must be an absolute https URL: ${ogImageUrl}`);
  if (!noindex && ogImageUrl.endsWith('/og-image.png')) warn(page, 'uses the default share image (run "npm run og" to create one)');

  // JSON-LD: one or more blocks, each either a node, an array of nodes, or { @context, @graph: [...] }.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (!blocks.length && !is404) warn(page, 'no JSON-LD structured data');
  const visible = norm(text(html.slice(html.search(/<body[\s>]/i))));
  for (const m of blocks) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      err(page, `invalid JSON-LD: ${e.message}`);
      continue;
    }
    for (const top of Array.isArray(data) ? data : [data]) {
      if (top['@context'] !== 'https://schema.org') err(page, 'JSON-LD block without @context "https://schema.org"');
      const nodes = Array.isArray(top['@graph']) ? top['@graph'] : [top];
      const byId = new Map();
      for (const node of nodes) {
        if (!node['@id']) continue;
        if (byId.has(node['@id'])) err(page, `JSON-LD @id defined twice: ${node['@id']}`);
        byId.set(node['@id'], node);
      }
      // Every { "@id": … } reference must point at a node in the same graph.
      const refs = (v) => {
        if (Array.isArray(v)) return v.forEach(refs);
        if (!v || typeof v !== 'object') return;
        if (Object.keys(v).length === 1 && v['@id'] && !byId.has(v['@id'])) err(page, `JSON-LD reference to unknown @id: ${v['@id']}`);
        Object.values(v).forEach(refs);
      };
      nodes.forEach(refs);

      for (const node of nodes) {
        const type = node['@type'];
        if (!type) err(page, `JSON-LD node without @type${node['@id'] ? `: ${node['@id']}` : ''}`);
        for (const k of ['datePublished', 'dateModified', 'lastReviewed']) {
          if (node[k] && Number.isNaN(Date.parse(node[k]))) err(page, `${type} has an invalid ${k}: ${node[k]}`);
        }
        if (/Page$/.test(type) && type !== 'FAQPage' && node.url && canonical && !is404 && node.url !== canonical) {
          err(page, `${type} url ${node.url} differs from canonical ${canonical}`);
        }
        if (type === 'BreadcrumbList') {
          const items = node.itemListElement ?? [];
          items.forEach((it, i) => {
            if (it.position !== i + 1) err(page, 'BreadcrumbList positions are not sequential');
            if (!it.name) err(page, 'BreadcrumbList item without name');
            if (!it.item || !String(it.item).startsWith(origin)) err(page, `BreadcrumbList item not on site origin: ${it.item}`);
            else if (!fileFor(new URL(it.item).pathname)) err(page, `BreadcrumbList item has no page: ${it.item}`);
          });
          if (items.length && canonical && items.at(-1).item !== canonical) err(page, 'last BreadcrumbList item is not this page');
        }
        if (type === 'FAQPage') {
          for (const q of node.mainEntity ?? []) {
            if (!q.name || !q.acceptedAnswer?.text) err(page, 'FAQPage question without name or answer');
            else if (!visible.includes(norm(q.name))) err(page, `FAQ question not visible on the page: "${q.name}"`);
          }
        }
      }
      if (!is404 && top['@graph'] && canonical && !byId.has(`${canonical}#webpage`)) err(page, 'JSON-LD graph has no WebPage node for this URL');
    }
  }

  // Links
  for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
    const href = attr(m[0], 'href');
    if (href === null) continue;
    if (href.startsWith('#')) {
      checkedLinks++;
      if (href.length > 1 && !ids.has(decodeURIComponent(href.slice(1)))) err(page, `anchor #${href.slice(1)} has no matching id`);
      continue;
    }
    if (/^(mailto:|tel:|javascript:)/i.test(href)) continue;
    const isInternal = href.startsWith('/') && !href.startsWith('//');
    const isSameOrigin = href.startsWith(origin);
    if (isInternal || isSameOrigin) {
      checkedLinks++;
      const p = isSameOrigin ? new URL(href).pathname + new URL(href).hash : href;
      const target = fileFor(p);
      if (!target) err(page, `broken internal link: ${href}`);
      else {
        const [pathPart, hash] = p.split('#');
        if (!pathPart.endsWith('/') && !/\.[a-z0-9]+$/i.test(pathPart)) warn(page, `internal link without trailing slash: ${href}`);
        if (hash) {
          const targetIds = new Set([...fs.readFileSync(target, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]));
          if (!targetIds.has(hash)) err(page, `link ${href} points to a missing anchor`);
        }
      }
      if (/\starget="_blank"/i.test(m[0])) warn(page, `internal link opens a new tab: ${href}`);
    } else if (/^https?:/i.test(href)) {
      if (/\starget="_blank"/i.test(m[0]) && !/noopener/i.test(attr(m[0], 'rel') ?? '')) warn(page, `external link without rel=noopener: ${href}`);
    }
  }

  // Weight
  const kb = Buffer.byteLength(html) / 1024;
  if (kb > 150) warn(page, `HTML is ${kb.toFixed(0)} KB`);
}

/* ------------------------------------------------------------------------ */
/* Cross-page checks                                                          */
/* ------------------------------------------------------------------------ */

for (const [t, ps] of titles) if (ps.length > 1) err(ps.join(', '), `duplicate title "${t}"`);
for (const [d, ps] of descriptions) if (ps.length > 1) err(ps.join(', '), `duplicate description "${d.slice(0, 60)}…"`);
for (const p of indexable) if (!sitemapUrls.has(p) && !/404/.test(p)) err(p, 'indexable page missing from sitemap');
for (const p of sitemapUrls) if (!indexable.has(p)) err(p, 'sitemap lists a noindex page');

/* ------------------------------------------------------------------------ */
/* Report                                                                     */
/* ------------------------------------------------------------------------ */

console.log(`SEO check: ${pages.length} pages, ${sitemapUrls.size} sitemap URLs, ${checkedLinks} internal links checked.`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
}
if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  process.exit(1);
}
console.log(warnings.length ? '\nNo errors.' : '\nAll checks passed.');
