/**
 * Structured-data (JSON-LD) builders. Every page emits one connected @graph:
 * Organization → WebSite → WebPage (+ BreadcrumbList) → main entity
 * (WebApplication for calculators, Article for guides). Node ids are stable
 * URLs with fragments so the pieces reference each other.
 */
import fs from 'node:fs';
import path from 'node:path';
import { site, type Person } from '../site.config';

export type Node = Record<string, unknown>;

export const abs = (path: string) => new URL(path, site.url).href;
export const ids = {
  organization: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  author: `${site.url}/#author`,
  reviewer: `${site.url}/#reviewer`,
  page: (path: string) => `${abs(path)}#webpage`,
  breadcrumb: (path: string) => `${abs(path)}#breadcrumb`,
  main: (path: string) => `${abs(path)}#main`,
};

const personNode = (p: Person, id: string): Node => ({
  '@type': 'Person',
  '@id': id,
  name: p.name,
  ...(p.jobTitle ? { jobTitle: p.jobTitle } : {}),
  ...(p.url ? { url: p.url, sameAs: [p.url] } : {}),
  worksFor: { '@id': ids.organization },
});

/** Site-wide nodes included on every page. */
export function siteNodes(): Node[] {
  const nodes: Node[] = [
    {
      '@type': 'Organization',
      '@id': ids.organization,
      name: site.name,
      url: `${site.url}/`,
      logo: { '@type': 'ImageObject', url: `${site.url}/icon-512.png`, width: 512, height: 512 },
      email: site.email,
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: site.email, availableLanguage: 'English' },
      ...(site.social.length ? { sameAs: site.social } : {}),
    },
    {
      '@type': 'WebSite',
      '@id': ids.website,
      name: site.name,
      url: `${site.url}/`,
      description: site.tagline,
      inLanguage: 'en-US',
      publisher: { '@id': ids.organization },
    },
  ];
  if (site.author.name) nodes.push(personNode(site.author, ids.author));
  if (site.reviewer.name) nodes.push(personNode(site.reviewer, ids.reviewer));
  return nodes;
}

/** The credited author: the named person if configured, otherwise the organization. */
export const authorRef = () => ({ '@id': site.author.name ? ids.author : ids.organization });

export function breadcrumbNode(path: string, items: { name: string; path: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    '@id': ids.breadcrumb(path),
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export interface PageNodeOptions {
  path: string;
  name: string;
  description: string;
  type?: string;
  dateModified?: string;
  datePublished?: string;
  /** Adds lastReviewed / reviewedBy (YMYL pages). */
  reviewed?: boolean;
  /** @id of the page's main entity (e.g. the calculator or article). */
  mainEntity?: string;
  hasBreadcrumb?: boolean;
}

export function webPageNode(o: PageNodeOptions): Node {
  return {
    '@type': o.type ?? 'WebPage',
    '@id': ids.page(o.path),
    url: abs(o.path),
    name: o.name,
    description: o.description,
    isPartOf: { '@id': ids.website },
    inLanguage: 'en-US',
    primaryImageOfPage: { '@type': 'ImageObject', url: ogImageUrl(o.path) },
    ...(o.hasBreadcrumb !== false ? { breadcrumb: { '@id': ids.breadcrumb(o.path) } } : {}),
    ...(o.datePublished ? { datePublished: o.datePublished } : {}),
    ...(o.dateModified ? { dateModified: o.dateModified } : {}),
    ...(o.reviewed && o.dateModified ? { lastReviewed: o.dateModified } : {}),
    ...(o.reviewed && site.reviewer.name ? { reviewedBy: { '@id': ids.reviewer } } : {}),
    ...(o.mainEntity ? { mainEntity: { '@id': o.mainEntity } } : {}),
    author: authorRef(),
    publisher: { '@id': ids.organization },
  };
}

/** Key used for a page's share image in public/og/ ("home", "credit-card-payoff-calculator", "guides-foo"). */
export const ogKey = (path: string) => path.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home';

/** Share image URL for a path: its own image when one exists in public/og/, else the default. */
export function ogImageUrl(pagePath: string): string {
  const key = ogKey(pagePath);
  return abs(fs.existsSync(path.join(process.cwd(), 'public', 'og', `${key}.jpg`)) ? `/og/${key}.jpg` : '/og-image.png');
}
