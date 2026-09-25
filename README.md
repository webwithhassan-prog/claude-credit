# Calcvera — money calculators that show their work

A fast, static website of **23 free financial calculators**, built to rank in Google and to pass Google AdSense review. Every calculator runs in the visitor's browser, explains its formula with a worked example, cites official sources, and is backed by unit-tested math.

> Live address: **https://www.calcvera.net**. The brand name, domain and contact email are all set in one file, `src/site.config.ts`.

## What's inside

| Category | Calculators |
|---|---|
| **Debt & Credit** | Credit card payoff · Debt payoff (avalanche vs snowball) · Debt-to-income ratio · Credit utilization · Balance transfer · Debt consolidation |
| **Home Equity & Real Estate** | HELOC payment · Home equity (how much can I borrow) · Cash-out refinance vs HELOC · DSCR loan · Rental property (cash flow, cap rate) · BRRRR |
| **Business Financing** | Merchant cash advance (factor rate → APR) · Invoice factoring · Equipment loan |
| **Tax Deductions 2025–2026** | Schedule 1-A (all four combined) · Car loan interest · No tax on overtime · No tax on tips · Senior $6,000 deduction |
| **Health & Benefits** | ACA subsidy 2026 · IRMAA 2026 · SSDI back pay |

Plus **23 in-depth guides** in `src/content/guides/`, written in Markdown. Each is linked from the home page, its category hub and its related calculators:
- 2026 ACA subsidy cliff
- Factor rate vs APR
- HELOC vs cash-out refinance
- HELOC draw period ending
- Schedule 1-A explained
- Section 179 vs bonus depreciation
- Avalanche vs snowball
- Balance transfer vs personal loan
- How credit card interest is calculated
- How to appeal IRMAA
- After SSDI approval
- How lenders calculate DTI
- DSCR loans explained
- Cap rate vs cash-on-cash return
- Invoice factoring vs line of credit
- HELOC requirements
- What is a good DSCR?
- Rental property expenses investors underestimate
- Paying your card before the statement date
- MCA stacking and consolidation
- Equipment financing vs leasing
- How to calculate qualified overtime
- No tax on tips: which jobs qualify

Plus a **financial glossary** of 70 plain-English terms at `/glossary/`, linked from every calculator and guide.

Plus the trust pages AdSense reviewers look for:
- **Company:** About, Editorial policy, Contact.
- **Legal:** Privacy policy (with Google's required advertising-cookie disclosures), Cookie policy, Terms of use, Disclaimer.
- **Navigation:** category hubs, an all-calculators index, an HTML site map and a custom 404 page.

These niches were chosen from the research in [`reports/AdSense tool site niches.md`](reports/AdSense%20tool%20site%20niches.md). The notes behind it are in `research_notes/`.

### Built-in quality features

- **Fast and light.** Pages are static HTML with no framework JavaScript and no chart library. Each calculator's script is small and bundled per page.
- **Works everywhere.** Layouts are tested at 320, 375, 414, 768, 1024 and 1440 px wide, in light and dark mode.
- **SEO.** See [`docs/SEO-PLAYBOOK.md`](docs/SEO-PLAYBOOK.md) for what's built in and what to do after launch.
  - Each page has a unique title, description and canonical URL.
  - One connected JSON-LD graph per page: `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, plus `WebApplication` and `FAQPage` for calculators, `Article` for guides and `DefinedTermSet` for the glossary.
  - A sitemap with real per-page "last updated" dates, `robots.txt` and an RSS feed for guides.
  - A share image for every page, dense internal linking, and `noindex` on the free `*.pages.dev` copies.
  - `npm run seo` checks all of this on every build, and CI fails if something breaks.
- **AdSense-ready.**
  - Add your publisher ID and the site automatically adds the AdSense verification tag and loader script, and generates `ads.txt`.
  - Manual ad slots sit well away from calculator buttons, per AdSense's accidental-click policy.
- **Private.** Inputs never leave the browser. "Copy link to results" stores the inputs after the `#` in the URL, which browsers never send to servers.
- **Accessible.**
  - Every input has a label, and the controls are standard buttons and inputs, so keyboard use works.
  - Focus outlines, a skip link and live-region results.
  - Charts include text alternatives.

## Quick start

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm test         # unit tests for all calculation engines
npm run check    # TypeScript / Astro type check
npm run build    # production build into ./dist
npm run seo      # SEO check of the build (titles, links, structured data, sitemap…)
npm run og       # regenerate share images in public/og/ (needs Playwright; see the script)
                 # npm run og -- --missing  renders only pages without an image
npm run preview  # serve the production build locally
```

## Configure before launch

Edit **`src/site.config.ts`**:

| Setting | What to put there |
|---|---|
| `name`, `tagline` | Your brand name and tagline |
| `url` | The production URL, currently `https://www.calcvera.net` (no trailing slash) |
| `email` | A real inbox you check. AdSense and users need to reach you |
| `owner`, `jurisdiction` | Legal owner name and governing-law country for the Terms |
| `adsense.client` | Your AdSense publisher ID, e.g. `ca-pub-1234567890123456` |
| `adsense.slots` | Optional manual ad unit IDs. Leave empty to rely on Auto ads |
| `googleSiteVerification` | Optional Search Console HTML-tag token |
| `author`, `reviewer` | Optional real people shown in bylines, on the About page and in structured data. Never invent names or credentials |

If you rename the brand, update the logo in `src/components/Logo.astro` and the icons in `public/`, then run `npm run build && npm run og && npm run build` to regenerate the share images.

## Deploy (free)

Any static host works. The build output is the `dist/` folder.

**Cloudflare Pages (recommended):**
1. Push this repo to GitHub.
2. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git** and pick the repo.
3. Framework preset: **Astro**. Build command `npm run build`. Output `dist`.
4. Add your custom domain under **Custom domains**. HTTPS is automatic.

`public/_headers` adds security and caching headers on Cloudflare Pages and Netlify. On Cloudflare Pages it also tells search engines not to index the free `*.pages.dev` address, so only your own domain appears in Google. For the www redirect, Search Console and Bing setup, follow [`docs/SEO-PLAYBOOK.md`](docs/SEO-PLAYBOOK.md).

**Netlify / Vercel:** import the repo; both detect Astro automatically.

## Getting approved by Google AdSense

Follow these steps in order. They come from the research report's approval findings.

1. **Use your own domain.** A custom domain is the safest choice and looks more trustworthy than a free subdomain.
2. **Fill in `site.config.ts`** with a real contact email and owner name.
3. **Verify the figures** in [`docs/DATA-SOURCES.md`](docs/DATA-SOURCES.md) against the official links. The build environment could not reach government websites.
4. **Add a real person.** The site is "Your Money or Your Life" (YMYL) content. Put your real name, and ideally a qualified reviewer such as a CPA or financial planner, on the About page. Never invent credentials.
5. **Deploy, then set up Google Search Console.** Add the site, submit `https://www.calcvera.net/sitemap-index.xml`, and wait for pages to be indexed.
6. **Let it age a little.** Owners commonly report better approval odds once a site has some organic traffic and a few months of history. Publishing a few guide articles meanwhile helps too.
7. **In AdSense:**
   - Add the site.
   - Paste your `ca-pub-…` ID into `adsense.client`.
   - Redeploy. The verification tag, loader script and `ads.txt` go live automatically.
   - Request review.
8. **Set up consent messages.** In AdSense → **Privacy & messaging**, create the **European regulations** message (Google-certified; required for EEA/UK/Swiss visitors) and the **U.S. state regulations** message.
9. **After approval**, pick one approach:
   - Turn on **Auto ads**, and exclude the calculator area if ads land too close to the buttons.
   - Or create display units for the `inContent`, `endOfContent` and `sidebar` slots.

Never click your own ads or ask others to click them.

## Project structure

```
src/
  site.config.ts          ← brand, domain, email, AdSense IDs (edit me)
  data/categories.ts      ← categories and their intro text
  data/tools.ts           ← tool registry: slugs, titles, SEO meta, updated dates
  data/glossary.ts        ← glossary terms and which calculators/guides they link to
  content/guides/*.md     ← guides (Markdown)
  lib/seo.ts              ← structured-data (JSON-LD) builders and share image lookup
  lib/calc/*.ts           ← pure calculation engines (unit tested)
  lib/ui/*.ts             ← browser helpers: form binding, formatting, charts, rows
  components/             ← header, footer, ad slot, FAQ, form fields…
  layouts/                ← BaseLayout (SEO head), ToolLayout, GuideLayout, ProseLayout
  pages/                  ← one .astro file per calculator + legal/company pages
  styles/global.css       ← design tokens (light/dark) and all styles
tests/                    ← vitest suites for every engine and the glossary
scripts/seo-check.mjs     ← SEO checker for the build (npm run seo)
scripts/og-images.mjs     ← share image generator (npm run og)
public/                   ← icons, share images (og/), _headers
docs/DATA-SOURCES.md      ← every official figure used, with its source
docs/SEO-PLAYBOOK.md      ← search setup after launch and ongoing SEO work
reports/, research_notes/ ← the niche research behind this site
```

## Adding a guide

Create `src/content/guides/<slug>.md` with this frontmatter, then write the article in Markdown. Tables are wrapped for mobile automatically.

```yaml
---
title: 'Your title'
seoTitle: 'Optional shorter title for Google (60 characters max)'
description: 'A 140–160 character summary.'
category: debt-credit          # a category id from src/data/categories.ts
related: ['debt-payoff-calculator']   # tool slugs; the first gets a call-to-action box
published: '2026-10-01'
updated: '2026-10-01'
---
```

To link glossary terms from the guide, add its slug to those terms' `guides` lists in `src/data/glossary.ts`. Then run `npm run build && npm run og -- --missing && npm run build` to create its share image, and `npm run seo` to check it.

## Adding a calculator

1. Add an entry to `src/data/tools.ts` (slug, title, SEO title and description, category, icon, date).
2. Put the math in `src/lib/calc/` and add tests in `tests/`.
3. Create `src/pages/<slug>.astro` using `ToolLayout` and `Calc`. Copy a similar page as a starting point.
4. Write at least 800–1,500 words of genuinely useful explanation: how to use it, how the rules work, a worked example, a FAQ and sources.
5. Add its slug to the relevant terms' `tools` lists in `src/data/glossary.ts` (a test requires at least one).
6. Run `npm test && npm run check && npm run build && npm run seo`, then `npm run og && npm run build` for its share image.

## Yearly update calendar

These figures change every year. Update them and each page's `updated` date in `tools.ts`.

| When | What | Where in the code |
|---|---|---|
| Aug–Sep | IRS applicable percentage table for next year's ACA credits | `lib/calc/benefits.ts` → `APPLICABLE_*` |
| Oct | IRS tax brackets and standard deduction (inflation Rev. Proc.) | `lib/calc/tax.ts` → `BRACKETS`, `STANDARD_DEDUCTION` |
| Oct | SSA cost-of-living adjustment and substantial gainful activity amounts | SSDI page text |
| Nov | CMS Part B premium and IRMAA brackets | `lib/calc/benefits.ts` → `IRMAA` |
| Jan | HHS poverty guidelines (used for the next ACA plan year) | `lib/calc/benefits.ts` → `FPL_*` |

The 2025–2028 deductions (tips, overtime, car loan interest, seniors) expire after tax year 2028 unless Congress extends them.

## Roadmap

These come from the research report's backlog:
- **v1.1:**
  - A reverse mortgage (HECM) calculator. It needs HUD's principal limit factor tables, which you download from HUD and load as JSON.
  - A few more guides, for about 20 in total.
- **v2:**
  - Legal cost estimators (divorce, DUI, alimony).
  - Heat pump vs gas and EV vs gas savings.
  - The RAP student-loan plan.
  - UK, Canada and Australia rule variants.
  - German-language rule calculators.
