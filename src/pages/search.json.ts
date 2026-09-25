import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { categories, categoryById } from '../data/categories';
import { glossary } from '../data/glossary';
import { tools } from '../data/tools';

/**
 * Search index for the header search (src/components/SiteSearch.astro).
 * Fetched only when a visitor opens search. Keys are short to keep it small:
 * t = title, u = URL, k = kind, d = description, x = extra keywords.
 */
export interface SearchItem {
  t: string;
  u: string;
  k: 'Calculator' | 'Guide' | 'Topic' | 'Glossary' | 'Page';
  d: string;
  x?: string;
}

const firstSentence = (s: string) => s.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? s;

export const GET: APIRoute = async () => {
  const guides = await getCollection('guides');
  const items: SearchItem[] = [
    ...tools.map((t) => ({
      t: t.title,
      u: `/${t.slug}/`,
      k: 'Calculator' as const,
      d: t.short,
      x: `${categoryById(t.category).name} ${t.metaTitle}`,
    })),
    ...guides.map((g) => ({
      t: g.data.title,
      u: `/guides/${g.id}/`,
      k: 'Guide' as const,
      d: g.data.description,
      x: categoryById(g.data.category).name,
    })),
    ...categories.map((c) => ({ t: `${c.name} calculators`, u: `/${c.id}/`, k: 'Topic' as const, d: c.description })),
    ...glossary.map((g) => ({ t: g.term, u: `/glossary/#${g.id}`, k: 'Glossary' as const, d: firstSentence(g.definition) })),
    { t: 'All calculators', u: '/calculators/', k: 'Page', d: 'Every calculator on the site, by topic.' },
    { t: 'Guides', u: '/guides/', k: 'Page', d: 'Plain-English guides to the rules behind our calculators.' },
    { t: 'Financial glossary', u: '/glossary/', k: 'Page', d: 'Definitions of the money terms used across the site.' },
    { t: 'Methodology and data sources', u: '/methodology/', k: 'Page', d: 'The formulas and official figures our calculators use.', x: 'how we calculate sources data' },
    { t: 'About us', u: '/about/', k: 'Page', d: 'Who we are and how we build our calculators.' },
    { t: 'Editorial policy', u: '/editorial-policy/', k: 'Page', d: 'Our standards, sources and corrections process.' },
    { t: 'Contact us', u: '/contact/', k: 'Page', d: 'Report an error or suggest a calculator.', x: 'email' },
    { t: 'Privacy policy', u: '/privacy-policy/', k: 'Page', d: 'What data we collect and your choices.', x: 'cookies ads' },
    { t: 'Terms of use', u: '/terms/', k: 'Page', d: 'The terms that apply when you use the site.' },
    { t: 'Disclaimer', u: '/disclaimer/', k: 'Page', d: 'Our calculators are estimates, not professional advice.' },
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
