/**
 * Central site settings. Change these values before going live —
 * everything else (head tags, structured data, ads.txt, robots.txt, legal
 * pages) reads from here.
 */

export interface Person {
  /** Full real name. Leave empty to credit the "editorial team" instead. */
  name: string;
  /** Short role or credential line, e.g. "Personal finance writer" or "CPA". */
  jobTitle: string;
  /** One to three sentences shown on the About page. */
  bio: string;
  /** A profile that proves who you are (LinkedIn, professional site). */
  url: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  url: string;
  email: string;
  owner: string;
  jurisdiction: string;
  since: number;
  /** ISO date the About/Privacy/Terms/Disclaimer/Cookie/Editorial pages were last revised. */
  legalUpdated: string;
  author: Person;
  reviewer: Person;
  /** Official social/profile URLs for the brand (used as Organization "sameAs"). */
  social: string[];
  adsense: {
    client: string;
    slots: { inContent: string; endOfContent: string; sidebar: string };
  };
  googleSiteVerification: string;
}

export const site: SiteConfig = {
  /** Brand name shown in the header, titles and legal pages. */
  name: 'Calcvera',
  /** Short tagline used on the home page and in meta descriptions. */
  tagline: 'Free, accurate money calculators with clear explanations. No sign-up, and your numbers stay in your browser.',
  /** Production URL without a trailing slash. Must match `site` in astro.config.mjs. */
  url: 'https://www.calcvera.net',
  /** Public contact address (shown on Contact / Privacy pages). */
  email: 'hello@calcvera.net',
  /** Legal entity or owner name used in the Terms and Privacy Policy. */
  owner: 'Calcvera',
  /** Country whose law governs the Terms of Use (e.g. 'Pakistan'). Empty = generic wording. */
  jurisdiction: '',
  /** Year the site launched (footer copyright range). */
  since: 2026,
  legalUpdated: '2026-09-25',

  /**
   * E-E-A-T: Google looks for real, accountable people behind money content.
   * Fill these in with REAL details only — never invent names or credentials.
   * When `author.name` is set, pages show "By <name>" and structured data
   * names a Person; when `reviewer.name` is set, pages show "Reviewed by …".
   */
  author: {
    name: '',
    jobTitle: '',
    bio: '',
    url: '',
  },
  reviewer: {
    name: '',
    jobTitle: '',
    bio: '',
    url: '',
  },
  /** e.g. ['https://x.com/calcvera', 'https://www.linkedin.com/company/calcvera'] */
  social: [],

  /**
   * Google AdSense. Leave `client` empty until you have an AdSense account.
   * Once set (e.g. 'ca-pub-1234567890123456') the site automatically:
   *  - adds the AdSense verification meta tag + loader script to every page,
   *  - serves a correct /ads.txt,
   *  - renders the manual ad slots below (if slot IDs are filled in).
   */
  adsense: {
    client: '',
    /** Manual ad unit IDs from AdSense → Ads → By ad unit. Leave empty to use Auto ads only. */
    slots: {
      /** Mid-article, between explanatory sections (well away from calculator controls). */
      inContent: '',
      /** After the FAQ, before sources. */
      endOfContent: '',
      /** Desktop sidebar under "Related calculators". */
      sidebar: '',
    },
  },

  /** Optional Google Search Console HTML-tag verification token. */
  googleSiteVerification: '',
};
