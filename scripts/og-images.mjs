#!/usr/bin/env node
/**
 * Share images: renders a 1200×630 JPEG for every indexable page of the built
 * site into public/og/<key>.jpg. Social networks and chat apps show it when a
 * page is shared. Pages without an image fall back to /og-image.png (see
 * ogImageUrl in src/lib/seo.ts), so new pages never break.
 *
 *   npm run build && npm run og && npm run build
 *
 * Re-run after changing page titles or adding pages, and commit public/og/.
 * Needs a Chromium that Playwright can drive. If you don't have one:
 *   npm i --no-save playwright && npx playwright install chromium
 * or point CHROMIUM_PATH at an installed Chrome/Chromium.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const OUT = path.resolve('public/og');

let chromium;
for (const mod of ['playwright', 'playwright-core']) {
  try {
    ({ chromium } = await import(mod));
    break;
  } catch {}
}
if (!chromium) {
  console.error('Playwright is not installed. Run:\n  npm i --no-save playwright && npx playwright install chromium');
  process.exit(1);
}
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('No build found in dist/. Run "npm run build" first.');
  process.exit(1);
}

/* ------------------------------------------------------------------------ */
/* Read page data from the built HTML                                         */
/* ------------------------------------------------------------------------ */

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : NAMED[e.toLowerCase()] ?? m,
  );
const text = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const firstSentence = (s) => (s.length > 150 ? (s.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? s) : s);

/** Same rule as ogKey() in src/lib/seo.ts. */
const ogKey = (urlPath) => urlPath.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}

// Calculator cards (on /calculators/) carry each tool's one-line summary and icon.
const cards = new Map();
const calculatorsHtml = fs.readFileSync(path.join(DIST, 'calculators/index.html'), 'utf8');
for (const m of calculatorsHtml.matchAll(/<a class="tool-card" href="([^"]+)"[^>]*>\s*<span class="ico">(<svg[\s\S]*?<\/svg>)<\/span>\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)) {
  cards.set(m[1], { icon: m[2], title: text(m[3]), short: text(m[4]) });
}

function pageData(file) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(DIST, file).split(path.sep).join('/');
  const urlPath = rel === 'index.html' ? '/' : `/${rel.replace(/index\.html$/, '')}`;
  if (/<meta name="robots" content="noindex/.test(html)) return null;

  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}')['@graph'] ?? [];
  const crumbs = graph.find((n) => n['@type'] === 'BreadcrumbList')?.itemListElement?.map((i) => i.name) ?? [];
  const article = graph.find((n) => n['@type'] === 'Article');
  const itemList = graph.find((n) => n['@type'] === 'ItemList');
  const h1 = text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '');
  const lede = text(html.match(/<(?:p|div) class="lede[^"]*"[^>]*>([\s\S]*?)<\/(?:p|div)>/)?.[1] ?? '');
  const siteName = decode(html.match(/<meta property="og:site_name" content="([^"]*)"/)?.[1] ?? '');
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  const card = cards.get(urlPath);

  const base = { key: ogKey(urlPath), siteName, title: h1 };
  if (card) {
    return { ...base, eyebrow: crumbs[1] ?? '', subtitle: card.short, icon: card.icon, tags: ['Free', 'No sign-up', 'Runs privately in your browser'] };
  }
  if (article) {
    const minutes = html.match(/(\d+) min read/)?.[1];
    const book = html.match(/<div class="avatar">(<svg[\s\S]*?<\/svg>)<\/div>/)?.[1];
    return {
      ...base,
      eyebrow: `Guide · ${article.articleSection ?? ''}`,
      subtitle: '',
      icon: book,
      tags: [minutes ? `${minutes}-minute read` : 'Guide', 'Worked examples', 'Official sources'],
    };
  }
  if (itemList && urlPath !== '/calculators/' && urlPath !== '/guides/') {
    const icon = html.match(/<a class="tool-card"[^>]*>\s*<span class="ico">(<svg[\s\S]*?<\/svg>)/)?.[1];
    const count = itemList.numberOfItems;
    return { ...base, eyebrow: 'Calculators', subtitle: description, long: true, icon, tags: [`${count} free calculators`, 'Formulas explained', 'Official sources'] };
  }
  return {
    ...base,
    eyebrow: '',
    subtitle: firstSentence(lede),
    icon: null,
    tags: ['Free calculators', 'No sign-up', 'Official sources'],
  };
}

/* ------------------------------------------------------------------------ */
/* Template                                                                   */
/* ------------------------------------------------------------------------ */

const LOGO =
  '<svg width="52" height="52" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#3cc7b1"/><path d="M8 22.5v-4M13 22.5v-8M18 22.5v-6" stroke="#04201b" stroke-width="2.6" stroke-linecap="round"/><path d="M17 11.5 20.5 15 25 8.5" fill="none" stroke="#04201b" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const template = (d) => `<!doctype html>
<html><head><meta charset="utf-8">
<style>${fontCss}</style>
<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;position:relative;background:#0b111b;color:#e8edf4;
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;--w:${d.icon ? 820 : 1010}px}
.bg{position:absolute;inset:0;background:radial-gradient(900px 520px at 88% 10%,rgba(60,199,177,.30),transparent 60%),radial-gradient(760px 520px at -5% 105%,rgba(76,95,213,.24),transparent 60%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:48px 48px;-webkit-mask-image:radial-gradient(ellipse at 80% 20%,#000 10%,transparent 70%)}
.wrap{position:relative;height:100%;padding:60px 72px 58px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:16px;font-size:34px;font-weight:700;letter-spacing:-.02em}
.eyebrow{font-size:22px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#3cc7b1;margin-top:58px;max-width:var(--w)}
h1{font-size:70px;line-height:1.08;letter-spacing:-.03em;font-weight:800;margin-top:14px;max-width:var(--w)}
.eyebrow:empty{display:none}
.eyebrow:empty+h1{margin-top:62px}
.sub{font-size:30px;line-height:1.36;font-weight:500;color:#b6c1cf;margin-top:22px;max-width:var(--w);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.sub:empty{display:none}
.sub.long{font-size:27px;-webkit-line-clamp:3}
.tags{margin-top:auto;display:flex;gap:12px;flex-wrap:wrap}
.tags span{font-size:21px;font-weight:600;padding:9px 18px;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);color:#dfe7f1}
.tile{position:absolute;right:72px;top:146px;width:188px;height:188px;border-radius:44px;display:grid;place-items:center;
  background:linear-gradient(150deg,rgba(60,199,177,.26),rgba(60,199,177,.06));border:1px solid rgba(60,199,177,.38);box-shadow:0 40px 90px -40px rgba(60,199,177,.65)}
.tile svg{width:100px;height:100px;color:#5fd6c3;stroke-width:1.5}
</style></head>
<body><div class="bg"></div><div class="grid"></div>
${d.icon ? `<div class="tile">${d.icon}</div>` : ''}
<div class="wrap">
  <div class="brand">${LOGO}${esc(d.siteName)}</div>
  <div class="eyebrow">${esc(d.eyebrow)}</div>
  <h1>${esc(d.title)}</h1>
  <p class="sub${d.long ? ' long' : ''}">${esc(d.subtitle)}</p>
  <div class="tags">${d.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
</div></body></html>`;

/** Shrink the title until the text block clears the tags row and the title fits in three lines. */
function fit() {
  const h1 = document.querySelector('h1');
  const sub = document.querySelector('.sub');
  const tags = document.querySelector('.tags');
  const bottom = () => (sub.textContent ? sub : h1).getBoundingClientRect().bottom;
  const lines = () => Math.round(h1.getBoundingClientRect().height / (parseFloat(getComputedStyle(h1).fontSize) * 1.08));
  let size = 70;
  while (size > 42 && (bottom() > tags.getBoundingClientRect().top - 30 || lines() > 3)) {
    size -= 2;
    h1.style.fontSize = `${size}px`;
  }
  if (bottom() > tags.getBoundingClientRect().top - 30) sub.style.webkitLineClamp = '1';
}

/* ------------------------------------------------------------------------ */
/* Render                                                                     */
/* ------------------------------------------------------------------------ */

const pages = walk(DIST)
  .filter((f) => f.endsWith('index.html'))
  .map(pageData)
  .filter(Boolean);

/** Inter from Google Fonts, embedded as data URIs so every render uses the same font, offline or not. */
async function loadFontCss() {
  try {
    const res = await fetch('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let css = await res.text();
    for (const [, url] of css.matchAll(/url\((https:[^)]+)\)/g)) {
      const font = Buffer.from(await (await fetch(url)).arrayBuffer());
      const type = url.endsWith('.woff2') ? 'font/woff2' : url.endsWith('.woff') ? 'font/woff' : 'font/ttf';
      css = css.replace(url, `data:${type};base64,${font.toString('base64')}`);
    }
    return css;
  } catch (e) {
    console.warn(`Could not download the Inter font (${e.message}); using a fallback font.`);
    return '';
  }
}
const fontCss = await loadFontCss();

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const d of pages) {
  await page.setContent(template(d));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(fit);
  await page.screenshot({ path: path.join(OUT, `${d.key}.jpg`), type: 'jpeg', quality: 86 });
  // The home page design doubles as the site-wide fallback image.
  if (d.key === 'home') await page.screenshot({ path: path.resolve('public/og-image.png') });
}
await browser.close();

// Remove images for pages that no longer exist.
const keep = new Set(pages.map((d) => `${d.key}.jpg`));
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.jpg') && !keep.has(f)) fs.rmSync(path.join(OUT, f));

console.log(`Wrote ${pages.length} share images to ${path.relative(process.cwd(), OUT)}/ and public/og-image.png. Rebuild the site to use them.`);
