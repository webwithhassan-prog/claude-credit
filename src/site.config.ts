/**
 * Central site settings. Change these values before going live —
 * everything else (head tags, ads.txt, robots.txt, legal pages) reads from here.
 */
export const site = {
  /** Brand name shown in the header, titles and legal pages. */
  name: 'Calcvera',
  /** Short tagline used on the home page and in meta descriptions. */
  tagline: 'Free, accurate money calculators with clear explanations. No sign-up, and your numbers stay in your browser.',
  /** Production URL without a trailing slash. Must match `site` in astro.config.mjs. */
  url: 'https://www.calcvera.com',
  /** Public contact address (shown on Contact / Privacy pages). */
  email: 'hello@calcvera.com',
  /** Legal entity or owner name used in the Terms and Privacy Policy. */
  owner: 'Calcvera',
  /** Country whose law governs the Terms of Use (e.g. 'Pakistan'). Empty = generic wording. */
  jurisdiction: '',
  /** Year the site launched (footer copyright range). */
  since: 2026,

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
} as const;

export type SiteConfig = typeof site;
