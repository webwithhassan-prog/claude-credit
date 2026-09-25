import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { categoryById } from '../../data/categories';
import { site } from '../../site.config';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** RFC 822 date at noon UTC, so the calendar day is the same in every time zone. */
const rfc822 = (isoDate: string) => new Date(`${isoDate}T12:00:00Z`).toUTCString();

export const GET: APIRoute = async () => {
  const guides = (await getCollection('guides')).sort(
    (a, b) => b.data.published.localeCompare(a.data.published) || a.data.title.localeCompare(b.data.title),
  );
  const feedUrl = `${site.url}/guides/rss.xml`;
  const latest = guides.map((g) => g.data.updated).sort().at(-1) ?? site.legalUpdated;

  const items = guides
    .map((g) => {
      const url = `${site.url}/guides/${g.id}/`;
      return `    <item>
      <title>${esc(g.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(g.data.description)}</description>
      <pubDate>${rfc822(g.data.published)}</pubDate>
      <category>${esc(categoryById(g.data.category).name)}</category>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${site.name} guides`)}</title>
    <link>${site.url}/guides/</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>${esc(`Plain-English guides to debt, home equity, business financing, taxes and benefits from ${site.name}.`)}</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822(latest)}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
