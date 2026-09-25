# AdSense Approval & Compliance Requirements for Free Online Tools/Calculator Sites (2025-2026)

> **How this was researched (read first).** support.google.com, developers.google.com, blog.google, web.archive.org, reddit.com, medium.com, indiehackers.com, toolpod.dev, searchenginejournal.com, seroundtable.com, webnots.com, adstimate.com and nearly every other site were **blocked** by the egress proxy for direct fetch. Only GitHub was reachable. The session's shared WebSearch budget (200 calls) also ran out partway through. So:
> - "Official" findings below come from **WebSearch result summaries restricted to support.google.com / developers.google.com** and are cited to the official URL the summary drew on. Treat the wording as a **close paraphrase, not verbatim**.
> - Anecdotal reports (Reddit/IndieHackers/blogs) are known only from search summaries. They are marked **[anecdotal]**.
> - Things I know from background knowledge but could **not** verify this session are listed **only under Gaps**, labelled **[unverified background]**. Please verify them before publishing.

## 1. Official AdSense eligibility and program policies (age, ownership, domains/subdomains, languages, content-quality violations), and what they mean for tool pages

### Takeaway
The official hard requirements are few: be 18 or older, own the site and be able to edit its HTML `<head>`, have content primarily in a supported language, and comply with the program and publisher policies. In practice, tool sites are rejected on the subjective content rules: "low value content", "Google-served ads on screens without publisher-content", and the "Valuable inventory" family (no content / under construction / templated). A calculator page that is only inputs and a button is exactly what these rules target. Free-host subdomains such as github.io, netlify.app, vercel.app and pages.dev can technically be added because they are on the Public Suffix List. Path-based project sites (`user.github.io/project/`) cannot.

### Cited Findings
**Age and account**
- Publishers must be at least 18. Someone under 18 can have a parent or guardian apply with the parent's own Google Account. — [AdSense Help: Age requirement](https://support.google.com/adsense/answer/14230?hl=en); [AdSense Help: Eligibility requirements](https://support.google.com/adsense/answer/9724?hl=en)
- Eligibility page (summary): "If you have your own content that meets Google's policies and you're 18 or over, you can sign up"; content must be "high-quality, original, and attract an audience." — [AdSense Help: Eligibility requirements](https://support.google.com/adsense/answer/9724?hl=en)

**Site ownership / HTML access**
- You must be able to access the site's HTML source and place the AdSense code between the `<head>` tags. The site must comply with the AdSense Program policies before you sign up. — [AdSense Help: Eligibility](https://support.google.com/adsense/answer/9724?hl=en); [AdSense Help: Owning the site you want to use](https://support.google.com/adsense/answer/91205?hl=en)

**Top-level domain vs subdomain (github.io / netlify.app / vercel.app / pages.dev)**
- AdSense "Site management" change: "you'll only be able to add subdomains on platforms that are already part of the public suffix list (e.g., site.appspot.com)". Subdomains of a site you already have can no longer be added or managed separately, and existing ones are removed. — [AdSense Help: Site management is changing in AdSense](https://support.google.com/adsense/answer/12170421?hl=en)
- I checked the current Public Suffix List source (fetched Sept 2026). **github.io, gitlab.io, netlify.app, vercel.app, pages.dev, workers.dev, web.app, firebaseapp.com, onrender.com, surge.sh, appspot.com and blogspot.com are all PSL entries.** So `yourname.github.io` or `yourtools.pages.dev` is technically addable as its own AdSense site. — [Public Suffix List (official GitHub repo)](https://raw.githubusercontent.com/publicsuffix/list/main/public_suffix_list.dat)
- Publishers keep asking about path-based GitHub Pages URLs, for example "How can I put ads on something like https://superspruce.github.io/xyz/ if it's not a valid TLD?" and "not accepting subdomain of my github page". — [AdSense Community thread 41784423](https://support.google.com/adsense/thread/41784423?hl=en); [AdSense Community thread 120486831](https://support.google.com/adsense/thread/120486831/how-to-add-my-github-website-domain-in-adsense-its-not-accepting-subdomain-of-my-github-page?hl=en)
- A GitHub code search found about 48,000 `ads.txt` files containing Google's AdSense certification ID `f08c47fec0942fa0` with `DIRECT`. They include root-level GitHub Pages user sites such as `daliansky.github.io` and `clashv2ray-hub.github.io`, which shows ads.txt can be served at the root of a `*.github.io` user site. — [GitHub: daliansky/daliansky.github.io](https://github.com/daliansky/daliansky.github.io); [GitHub: clashv2ray-hub/clashv2ray-hub.github.io](https://github.com/clashv2ray-hub/clashv2ray-hub.github.io)

**Supported languages**
- You choose the site's primary language at sign-up. Placing Google ad code on pages whose content is primarily in an unsupported language is **not permitted** under the Google Publisher Policies. — [AdSense Help: Languages Google publisher products support](https://support.google.com/adsense/answer/9727?hl=en); [Publisher Policies Help: Unsupported languages](https://support.google.com/publisherpolicies/answer/10436912?hl=en)

**"Google-served ads on screens without publisher-content" (a Google Publisher Policy)**
- Google does not allow Google-served ads on screens "without publisher-content or with low-value content, or that are under construction". It may limit or disable ad serving on such pages until they are fixed. — [Publisher Policies Help: Google-served ads on screens without publisher-content](https://support.google.com/publisherpolicies/answer/11112688?hl=en)
- Examples in that policy: no ads on "dead end" or no-content screens (Thank You, Exit, Error pages); no ads in apps "where the sole focus of the interaction is the user looking away from the screen, for example, a flashlight app"; and "Don't place ads on automatically generated content without manual review or curation." — [Publisher Policies Help: same page](https://support.google.com/publisherpolicies/answer/11112688?hl=en)

**"Site isn't ready to show ads" / "low value content"**
- Official reasons a site "isn't ready": ad code missing or incomplete; site unreachable; site "doesn't have enough unique content or provide a good user experience"; policy violations. Google says the site must provide "enough valuable content to users and has a good user experience and navigational elements." Review "usually takes a few days, but in some cases can take 2-4 weeks." — [AdSense Help: What to do when your site is not ready to show ads](https://support.google.com/adsense/answer/12176698?hl=en)
- An AdSense Community guide (written by volunteer Product Experts, not official policy) says low-value assessments reflect the site's E-E-A-T. It applies "a special, more demanding standard" to YMYL topics such as money/finance and health. — [AdSense Community guide: How can you solve the "low value content" disapproval](https://support.google.com/adsense/community-guide/241032356/how-can-you-solve-the-low-value-content-adsense-disapproval-challenge?hl=en)

**"Valuable inventory: no content" / "templated"**
- Common causes reported for "Valuable inventory: no content": too little or low-quality content; content Google can't crawl or render (for example, robots.txt blocking crawlers); mirroring or framing others' content without adding value. [anecdotal / SEO-blog synthesis] — [MonetizeMore: Valuable Inventory Templated Page violation](https://www.monetizemore.com/blog/how-deal-with-valuable-inventory-templated-page-violation-adsense/); [okeyravi.com](https://okeyravi.com/fix-valuable-inventory-under-construction-no-content-violation/); [AdSense Community thread 18802067](https://support.google.com/adsense/thread/18802067/valuable-inventory-no-content-policy-violation-for-my-blog-site?hl=en)
- There is a separate "Valuable Inventory: **Templated Page**" violation (MonetizeMore article title). This is directly relevant to programmatic tool sites, where hundreds of near-identical pages differ only by a unit or number. — [MonetizeMore](https://www.monetizemore.com/blog/how-deal-with-valuable-inventory-templated-page-violation-adsense/)

### Inferences
- For a calculator page, "publisher-content" should be read as human-written, page-specific text around the widget. That means what the tool calculates, the formula or method, a worked example, how to read the result, and FAQs. An inputs-and-button screen is a "screen without publisher-content" in all but name. The "flashlight app" example shows that Google treats pure-utility screens as low value.
- JavaScript-rendered tools where the explanatory text is also injected client-side risk the crawl/render failures behind "no content". Server-render or statically generate the explanatory text as plain HTML.
- Result, thank-you and error screens in multi-step tools (for example a "your results" route) should carry no ads, or should include real content.
- Programmatic long-tail pages (for example "X kg to lbs" for every X) are high-risk for "templated page" and "auto-generated content without manual review". Keep one strong page per tool rather than thousands of variants.
- A PSL-listed free subdomain is technically allowed, but a custom domain is the safer choice. It is portable, can hold `/ads.txt` at the root, and avoids "shared host" trust questions. This is my judgement; I found no official statement that free subdomains are disfavored.

### Gaps
- I could not fetch the verbatim AdSense Program Policies (answer/48182) or the Eligibility page.
- The full list of supported languages (answer/9727) was not visible in search summaries.
- I found no official Google statement on whether free-host subdomains (github.io etc.) are approved less often than custom domains.
- [unverified background] The "Valuable inventory" sub-types commonly shown in AdSense include "No content", "Under construction", "Templated page", "Scraped content" and "Replicated content". Only "No content" and "Templated page" are confirmed by titles above.

## 2. Content depth that successful tool-site owners report needing (pages/tools, words per tool, blog posts) — first-hand reports 2024-2026

### Takeaway
There is no official number of pages or words. First-hand reports show that even a well-built tool site can be rejected for "low value content". One developer-tools site had 65+ tools with explanations and FAQs, 15 blog posts, an About page and a privacy policy, and was still rejected. The consistent advice is substantial unique text on every tool page (explanation, method, examples, FAQs), a set of in-depth guides, clear trust pages, and some age and organic traffic before applying. All of it is anecdotal.

### Cited Findings
- **Toolpod (developer-utilities site) [anecdotal, first-hand]:** 65+ developer utilities; tool pages with explanations, use cases, FAQs and related tools; 15 blog posts; About page and privacy policy. **Still rejected** for "low value content" with no specifics. The owner concluded that "low value content" is Google's catch-all rejection for new sites. They switched focus to traffic via SEO and community (Reddit) and considered Ezoic, which accepts lower-traffic sites, or Carbon Ads (developer audience). — [Toolpod Blog: I Got Rejected by Google AdSense: What 'Low Value Content' Really Means](https://toolpod.dev/blog/adsense-rejection-low-value-content) (known via search summary; direct fetch blocked)
- **dev.to post "I applied for AdSense and got rejected for low value content" [anecdotal]:** the search summary attributes these claims to it: tool sites get flagged because "too many spammy utility sites have damaged the category, making Google's algorithms skeptical by default"; Google considers site age ("wanting 3-6 months of history") and prefers sites that already have visitors. — [dev.to/bdubs](https://dev.to/bdubs/i-applied-for-adsense-and-got-rejected-for-low-value-content-hog) (fetch blocked; attribution comes from a blended search summary)
- **Medium "How I'm Making My Simple Tool AdSense-Ready: Overcoming Google's Low-Value Content Obstacle" (Code Bee) [anecdotal]:** only the title could be confirmed. It shows the same single-tool rejection pattern. — [Medium/ILLUMINATION](https://medium.com/illumination/how-im-making-my-simple-tool-adsense-ready-overcoming-google-s-low-value-content-obstacle-52f7cb3d8c58)
- **SEO-blog guidance on tool pages [opinion]:** "A calculator or converter tool that simply shows the tool interface without explaining how it works or when to use it is considered low value content". Recommended fixes: explanations of how it works, common use cases, FAQs and related tools. Content "at least 800–1500 words" with examples and images. — search summary drawing on [genieegroup.com](https://genieegroup.com/blog/adsense-low-value-content/), [ytservice.co.in](https://ytservice.co.in/adsense-low-value-content-fix/), [adsenseaudit.net](https://adsenseaudit.net/guides/low-value-content-adsense) (the summary did not say which of these three each claim came from)
- **Low-reliability claim:** "65% of rejections were fixed by removing 'Thin Content' and then adding 5 pages of unique, data-driven research", and Google's "AI-driven crawlers are looking for Information Gain." No methodology is given and the site sells AdSense services. **Treat as marketing, not data.** — [adstimate.com (2026 update)](https://adstimate.com/blog/low-value-content-fix.html)
- **"Valuable inventory: no content" fix advice [anecdotal/low-quality blogs]:** "Successful applications typically have 20+ comprehensive posts"; "3-5 comprehensive 'pillar' articles (2000+ words)". — search summary of [okeyravi.com](https://okeyravi.com/resolve-valuable-inventory-not-enough-content/) and [patelinfomatic.co.in](https://patelinfomatic.co.in/Blog/solving-valuable-inventory-no-content-errors.html)
- **Indie Hackers (AllInOneTools owner) [anecdotal]:** most rejections come from "missing important pages, low content clarity, poor structure, unclear trust signals, and technical gaps". — [Indie Hackers post](https://www.indiehackers.com/post/i-stopped-paying-others-to-audit-my-adsense-eligibility-i-built-a-tool-to-check-it-myself-SxdwVPb1GLv670cnQauX)
- Other Indie Hackers advice [anecdotal]: sites are often rejected for "too little text and/or being deemed 'under construction'". — [Indie Hackers: Adsense rejection](https://www.indiehackers.com/post/adsense-rejection-2015c176e9)

### Inferences
- The benchmark that comes up again and again (all anecdotal) for a new tools site before applying:
  - roughly 15-30 finished tool pages, each with several hundred to 1,000+ words of unique, page-specific explanation (method/formula, a worked example, how to interpret results, limitations, FAQs, related tools);
  - plus about 10-20 in-depth guides or articles;
  - plus trust pages;
  - plus a few months of age and some organic traffic.

  Nobody guarantees approval at any threshold. Toolpod had more than this and was still rejected, which suggests traffic, age and trust signals matter as much as word count.
- Toolpod's outcome also shows that exact-match "boilerplate" FAQs across dozens of tools may not count. Page-specific depth (unique examples, original data or methodology) is more likely what "information gain" advice means.
- Consider applying with a smaller set of very strong pages. Noindex, or keep off the sitemap, any unfinished or stub tools while under review.

### Gaps
- Reddit (r/Adsense, r/webdev, r/SEO) and YouTube could not be searched or fetched (Reddit is blocked for the search tool's user agent and for egress). **I have no verified Reddit case studies** with numbers (tools count, words per page, time to approval).
- I found no reliable 2024-2026 dataset of approval rates by site type.
- I could not confirm whether Toolpod was later approved.

## 3. Required / recommended pages (About, Contact, Privacy Policy, Terms, Disclaimer) and exactly what the privacy policy must say

### Takeaway
The privacy policy is the only page with mandated content, under AdSense's "Required content" policy. It must disclose that third-party vendors, including Google, use cookies to serve ads based on users' prior visits to your site and other sites; that Google's advertising cookies enable it and its partners to serve such ads; and how users can opt out (Google Ads Settings, and aboutads.info for other vendors). About, Contact, Terms and Disclaimer pages are not named as mandatory in anything I could verify. They are strongly and consistently recommended as trust signals, and a disclaimer is essential for finance, health and legal calculators.

### Cited Findings
- **Required privacy-policy disclosures (AdSense "Required content"):** disclose that "third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites." If you haven't opted out of third-party ad serving, disclose that other vendors' or ad networks' cookies may be used and name the vendors and networks serving ads on your site. Tell users they may opt out of personalized advertising via **Ads Settings**, or opt out of third-party vendors' cookies at **www.aboutads.info**. — [AdSense Help: Required content](https://support.google.com/adsense/answer/1348695?hl=en)
- Third-party ad vendors on AdSense are certified by Google. Its certification policies govern cookie use and require vendors not to associate cookies with personal information without explicit opt-in. — [AdSense Help: Display ads from qualified third party vendors](https://support.google.com/adsense/answer/94145)
- Related official pages: [How AdSense uses cookies](https://support.google.com/adsense/answer/7549925?hl=en); [Google Publisher Policies](https://support.google.com/adsense/answer/10502938?hl=en)
- Missing important pages and "unclear trust signals" are commonly cited rejection causes [anecdotal]. — [Indie Hackers (AllInOneTools)](https://www.indiehackers.com/post/i-stopped-paying-others-to-audit-my-adsense-eligibility-i-built-a-tool-to-check-it-myself-SxdwVPb1GLv670cnQauX)

### Inferences
- Minimum privacy-policy checklist for an AdSense tool site:
  - (a) Google and third-party vendors use cookies to serve ads based on prior visits to this and other sites;
  - (b) Google's advertising cookies (DoubleClick/IDE-type) let Google and partners serve ads based on visits here and elsewhere;
  - (c) opt-out links: Google Ads Settings and aboutads.info (plus youronlinechoices.eu for EU users, [unverified background]);
  - (d) a list of other ad networks and vendors, or a link to Google's partner list;
  - (e) the consent mechanism for EEA/UK/CH, and US state opt-out rights (see section 4);
  - (f) analytics (GA4) disclosures if used;
  - (g) whether tool inputs are processed client-side or stored. This matters for calculators handling salary, health or loan figures.
- Recommended pages: About (who runs the site, their credentials), Contact (working email or form), Privacy, Terms, Disclaimer (not financial, medical or legal advice), Cookie policy or "Privacy choices" link, and, for YMYL tools, a Methodology/Sources page.

### Gaps
- I could not fetch the verbatim "Required content" text, so exact wording such as "Google's use of advertising cookies enables it and its partners to serve ads…" is **[unverified background]**, though it is the widely quoted phrasing.
- No official source was found saying About, Contact or Terms pages are *mandatory*.
- [unverified background] If Google Analytics Advertising Features are used, GA policy also requires privacy-policy disclosures — see [GA4 policy requirements for Advertising Features](https://support.google.com/analytics/answer/2700409?hl=en) (title only confirmed).

## 4. Consent: EEA/UK/Switzerland (Google-certified CMP + IAB TCF v2.2) and US state privacy laws

### Takeaway
Serving personalized ads to EEA and UK users has required a **Google-certified CMP integrated with IAB TCF** since **16 Jan 2024**, and to Swiss users since **31 July 2024**. Without one, you are not eligible to serve personalized ads there. AdSense's own **Privacy & messaging → European regulations message** is itself a Google-certified TCF CMP, so it satisfies the requirement. For US states, Privacy & messaging offers a **US state regulations message** that is regularly updated for new state laws, and AdSense supports IAB's Global Privacy Platform (GPP). It is a compliance tool, not a legal guarantee.

### Cited Findings
- EEA and UK: from 16 January 2024, a Google-certified CMP integrated with the TCF is required when serving personalized ads. Switzerland: from 31 July 2024. If requirements aren't met, "you will not be eligible to serve personalized ads." Publishers should pick a CMP from Google's certified list. — [AdSense Help: Google consent management requirements… (for publishers)](https://support.google.com/adsense/answer/13554116?hl=en); [for CMPs](https://support.google.com/adsense/answer/13554020?hl=en); [Google blog announcement](https://blog.google/products/adsense/new-consent-management-platform-requirements-for-serving-ads-in-the-eea-and-uk/)
- AdSense for Search (Search Ads publisher products) began enforcing the same CMP requirements on **1 Feb 2024**. — [AdSense Help](https://support.google.com/adsense/answer/14316211?hl=en)
- The European regulations messages in Ad Manager, AdSense and AdMob "Privacy & messaging" are **certified in accordance with the TCF requirement**. The Google CMP displays on sites configured for European or US regulations messages and "also supports privacy messages for users in US states." — [AdSense Help: How the Google CMP works](https://support.google.com/adsense/answer/16918505?hl=en); [AdSense Help: Publish my European regulations message for me using Google's CMP](https://support.google.com/adsense/answer/13790256?hl=en)
- The US state regulations messages in Privacy & messaging were updated to support new state laws in **Indiana, Kentucky and Rhode Island**. A new toggle targets a message to "All current and future supported US States". — [AdSense Help: US state regulations messages update](https://support.google.com/adsense/answer/16789138?hl=en)
- AdSense supports the IAB's Global Privacy Platform (GPP) (title confirmed). — [AdSense Help: Supporting the IAB's Global Privacy Platform](https://support.google.com/adsense/answer/14126816?hl=en)
- An official page exists for fixing EU User Consent Policy consent-audit issues, which shows Google audits consent implementations. — [AdSense Help: Fix issues with your EU User Consent Policy consent audit](https://support.google.com/adsense/answer/16758589?hl=en)
- **TCF v2.2** is the current spec: "Final v.2.2 May 2023". v2.2 deprecated the `getTCData` API command. Later 2.2 revisions added CTV support (Jan 2024) and a `disclosedVendors` consistency update (Feb 2026). — [IAB Tech Lab CMP API v2 spec (GitHub)](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md)

### Inferences
- For a small tools site with global/Tier-1 traffic, the simplest compliant setup is:
  1. Enable the AdSense **European regulations message** (Google's certified TCF CMP) for EEA/UK/CH.
  2. Enable the **US state regulations message** targeted to "All current and future supported US States".
  3. Add a persistent "Privacy choices" / "Do not sell or share" link, and mention both in the privacy policy.
- Using a third-party CMP (for example Cookiebot or CookieYes) is fine only if it is on Google's certified list and runs TCF v2.2. ([unverified background] "Funding Choices" was the earlier name of Google's own Privacy & messaging tool.)
- A generic cookie banner that is not a certified TCF CMP does *not* meet Google's requirement. EEA/UK/CH traffic would then get limited or non-personalized ads at best.

### Gaps
- I could not verify whether Google's US state message alone satisfies every state law, such as honoring Global Privacy Control signals. Google frames these as tools that "support publisher compliance", and legal responsibility stays with the publisher.
- [unverified background] Without valid TCF consent, Google may serve "limited ads" (LTD) or no ads to EEA/UK/CH users, which reduces revenue.
- [unverified background] Google's EU User Consent Policy (policies.google.com/technologies/partner-sites / eu-user-consent-policy) applies separately to consent for cookies and personalized ads.

## 5. ads.txt, Auto ads vs manual units, and ad placement near calculator inputs/buttons

### Takeaway
ads.txt should sit at the root of the domain you add in AdSense. Missing it triggers an "Earnings at risk" warning. For tool sites the main placement risk is ads next to interactive elements (buttons, inputs, drop-downs, "Calculate" or "Next" buttons, result areas). Google names these as accidental-click risks and can issue violations even when the layout is unintentional. For games it recommends at least **150 px** between ads and the play area. Google also offers "Confirmed Click" on placements that generate accidental clicks.

### Cited Findings
- AdSense shows an "Earnings at risk — One or more of your sites does not have an ads.txt file. Fix this now to avoid a severe impact to your revenue" warning when ads.txt is missing or wrong. — [AdSense Community threads, e.g. 7401901](https://support.google.com/adsense/thread/7401901/earnings-at-risk-%E2%80%93-one-or-more-of-your-sites-does-not-have-an-ads-txt-file?hl=en); [thread 342719523](https://support.google.com/adsense/thread/342719523/earnings-at-risk-warning-%E2%80%93-how-to-fix-ads-txt-file-issues?hl=en)
- Standard AdSense ads.txt line format, as used in about 48,000 public GitHub ads.txt files: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`. — [GitHub example: Dhruv-Techapps/acf-docs ads.txt](https://github.com/Dhruv-Techapps/acf-docs)
- **Ad placement policies:** publishers "should be careful when placing links, play buttons, download buttons, navigation buttons (e.g. 'Previous' or 'Next'), game windows, video players, drop-down menus or applications near ads because they might lead to accidental clicks". **Even an unintentional layout that causes accidental clicks can draw a violation.** Ads should be "away from interactive elements", should not mimic surrounding content, and should not be placed under misleading headings. — [AdSense Help: Ad placement policies](https://support.google.com/adsense/answer/1346295?hl=en-GB)
- For gameplay pages, Google "strongly recommends a distance of at least 150 pixels between the ads and the edge of a game", because users clicking rapidly cause invalid clicks. — [AdSense Help: AdSense for content ads on gameplay pages](https://support.google.com/adsense/answer/2768340?hl=en-GB)
- **Confirmed Click** adds an extra confirmation (for example a "Visit site" button) on placements that may generate accidental clicks. — [AdSense Help: About Confirmed Click](https://support.google.com/adsense/answer/10025624?hl=en-GB)
- Official resources on invalid traffic and violations that close accounts: [Top invalid traffic and policy violations that lead to account closure](https://support.google.com/adsense/answer/2660562?hl=en); [AdSense policy FAQs](https://support.google.com/adsense/answer/3394713?hl=en)

### Inferences
- **Calculator layout rules** (derived from the policies above):
  - no ad unit directly adjacent to input fields, sliders, "Calculate", "Reset", "Copy" or "Download" buttons, or the result box;
  - leave generous spacing (use about 150 px as a conservative benchmark borrowed from the gaming guidance);
  - put ads below the result and explanation, or in the article text further down;
  - never label ads in a way that looks like a tool control or result ("Download", "Next step");
  - on mobile, watch anchor and vignette ads covering inputs.
- **Auto ads** are easy but can drop in-content ads next to form elements. On tool pages, either use manual units or exclude the tool container area and turn down ad load.
- Since users interact heavily with tool pages (many clicks), accidental-click risk is structurally higher than on blogs. Monitor CTR spikes; an unusually high CTR is an invalid-traffic red flag.

### Gaps
- I could not fetch the official ads.txt guide (support.google.com/adsense/answer/7532444, URL [unverified background]) or verify whether ads.txt is formally *required for approval*.
  - [unverified background] Google calls ads.txt "highly recommended" rather than mandatory.
  - [unverified background] For PSL subdomains such as `x.github.io`, ads.txt belongs at that subdomain's root.
- [unverified background] AdSense site verification can be done by pasting the AdSense code snippet, the ads.txt snippet, or a meta tag. Current options were not verified.
- I found no official statement specifically about Auto ads on form-heavy pages. The Auto ads advice above is an inference.

## 6. Technical requirements & site age/traffic: sitemap, robots.txt, Search Console, CWV, HTTPS, indexing/traffic before applying, and country rules (India/China/Pakistan 6-month rule)

### Takeaway
Officially, the site must be reachable and crawlable. "Site unreachable" and ad-code problems are listed reasons for "not ready". No official page I could reach lists a minimum traffic level or site age. The historical **6-month site-age rule for India and China** is disputed. The current official eligibility summary does not mention it, while many SEO blogs still say it applies. Treat it as possibly outdated but still plausibly used informally. No official rule was found for Pakistan.

### Cited Findings
- Official "not ready" reasons include: ad code missing or incomplete, **site unreachable**, not enough unique content or poor UX/navigation, and policy violations. — [AdSense Help: What to do when your site is not ready to show ads](https://support.google.com/adsense/answer/12176698?hl=en)
- Robots.txt blocking Googlebot or AdSense crawlers, or content that can't be rendered, is a commonly reported cause of "Valuable inventory: no content" [anecdotal]. — [search summary of okeyravi.com / patelinfomatic](https://okeyravi.com/fix-valuable-inventory-under-construction-no-content-violation/)
- **6-month rule — conflicting:**
  - A search restricted to support.google.com found the official eligibility page "doesn't mention a specific six-month site age requirement". It states only the 18+ age requirement, content that meets policies, and "high-quality, original" content that attracts an audience. — [AdSense Help: Eligibility](https://support.google.com/adsense/answer/9724?hl=en)
  - SEO blogs still say "In some locations, including China and India, Google requires publishers to have owned their sites for 6 months", while noting Indian and Chinese publishers are often approved earlier. — [WebNots](https://www.webnots.com/what-are-the-eligibility-criteria-for-google-adsense/); [ShoutMeLoud](https://www.shoutmeloud.com/how-to-get-google-adsense-approval-new-blog.html); [Techulator](https://www.techulator.com/resources/9134-Websites-blogs-wait-6-months-before-applying-AdSense.aspx); [HubPages forum](https://hubpages.com/community/forum/121515/adsense-requires-6-month-old-site-for-approval-for-india--china)
  - Community threads keep asking about it. — [AdSense Community: Is it true… 6 months old if you are an Indian?](https://support.google.com/adsense/thread/56698949?hl=en); [Adsense 6 month rule](https://support.google.com/adsense/thread/228983435/adsense-6-month-rule?hl=en)
- A separate official "AdSense availability" page exists (title only confirmed). — [AdSense Help: AdSense availability](https://support.google.com/adsense/answer/13402307?hl=en)
- Site age and traffic [anecdotal]: Google "wants 3-6 months of history" and prefers sites with visitors. — [dev.to/bdubs (via search summary)](https://dev.to/bdubs/i-applied-for-adsense-and-got-rejected-for-low-value-content-hog)

### Inferences
- Pre-application technical checklist:
  - HTTPS on the canonical domain;
  - a robots.txt that does not block Googlebot or Mediapartners-Google;
  - an XML sitemap submitted in Search Console, with the key tool and guide pages **indexed**;
  - no broken pages or 404s in the navigation;
  - clear menus, including a footer with legal and trust pages;
  - fast, mobile-friendly pages (good Core Web Vitals);
  - explanatory text server-rendered.

  Indexing and some organic traffic are not official requirements, but they are the most common anecdotal predictor of approval.
- For a publisher in Pakistan or India, the conservative plan is to budget for the site being about 3-6 months old with steady organic traffic before applying, even if the rule is no longer formally enforced.

### Gaps
- I could not verify whether the 6-month India/China rule was formally removed, or when.
- I found **no official source on any Pakistan-specific eligibility rule**.
- No official source found that requires Search Console, sitemaps, Core Web Vitals or HTTPS for AdSense approval. These are Google Search best practices.
  - [unverified background] INP replaced FID as a Core Web Vital in March 2024.
  - [unverified background] CWV "good" thresholds are LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Ads injected without reserved space are a common CLS source on tool pages.

## 7. YMYL / E-E-A-T for finance, health and legal calculators

### Takeaway
Google applies a stricter standard to "Your Money or Your Life" topics. The AdSense Product Expert guide says low-value assessments reflect site E-E-A-T, with "a special, more demanding standard" for money/finance and health. Google Search wants people-first content that demonstrates E-E-A-T. For loan, mortgage, tax, BMI, pregnancy, dosage or legal-deadline calculators, that means visible authorship and credentials, a methodology page, citations to primary sources (IRS, CFPB, CDC/NIH, statutes), last-updated dates, and disclaimers.

### Cited Findings
- The AdSense Community guide on low-value content says Google assesses a site's foundation of E-E-A-T, with "a special, more demanding standard for sites focusing on life-critical issues, including money/finance and health, under the Your Money or Your Life (YMYL) extension." (Volunteer Product Expert guide, not official policy.) — [AdSense Community guide](https://support.google.com/adsense/community-guide/241032356/how-can-you-solve-the-low-value-content-adsense-disapproval-challenge?hl=en)
- Google Search: produce "original, high-quality, people-first content demonstrating qualities E-E-A-T". If using generative AI, the work must meet Search Essentials and spam policies. Consider disclosing how automation was used where users would expect it. — [Google Search Central: Guidance on Generative AI Content](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content); [Creating Helpful, Reliable, People-First Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

### Inferences
- YMYL calculator page template:
  - H1 plus the tool;
  - "How this calculator works" with the formula and assumptions;
  - a worked example;
  - "Sources" linking primary authorities (for example IRS publications and current-year tax brackets, CFPB for loans and APR, Fed/Freddie Mac for rates, CDC/WHO for BMI);
  - "Last reviewed [date] by [named person, credential]";
  - a disclaimer ("for educational purposes, not financial/medical/legal advice");
  - a link to a site-wide Methodology & Editorial Policy page and author bio pages.
- Year-sensitive tools (tax, contribution limits, minimum wage) need annual updates. Stale figures damage trust and could be seen as misleading. Show the tax year prominently.
- If you can't provide credible expertise, avoid launching with a heavy YMYL mix (health dosage, legal). Start with lower-risk utilities (unit conversion, date/time, text/dev tools) plus well-sourced mainstream finance tools.

### Gaps
- I could not fetch the Search Quality Rater Guidelines PDF (static.googleusercontent.com blocked).
  - [unverified background] The January 2025 QRG update added guidance on rating low-effort/AI-generated main content and on scaled content abuse, expired domain abuse and site reputation abuse as "Lowest" signals.
  - [unverified background] A further QRG update followed in September 2025. Neither was verified here.
- No official AdSense policy requiring author bios or disclaimers was found. These are E-E-A-T best practices.

## 8. Google Search 2024-2026: scaled content abuse, site reputation abuse, helpful content in core updates — implications for programmatic tool pages and AI-written content

### Takeaway
Since March 2024, Google's spam policies target "scaled content abuse": many pages generated mainly to manipulate rankings, "no matter how it's created", explicitly including AI-generated pages that add no value. The helpful-content system is no longer a separate update and now runs inside core ranking. Core updates in 2025 (March, June, December) and 2026 (March, May) were volatile. Site reputation abuse was tightened in November 2024 and adjusted for the EEA in August 2026. For tool sites this means: don't mass-generate near-duplicate tool or landing pages or AI filler articles, and don't host third-party content to rank.

### Cited Findings
- **Scaled content abuse:** "when many pages are generated for the primary purpose of manipulating search rankings and not helping users… typically focused on creating large amounts of unoriginal content that provides little to no value to users, no matter how it's created." Examples:
  - using generative AI to generate many pages without adding value;
  - scraping feeds or search results to generate pages, including through automated transformations (synonymizing, translating);
  - stitching content from different pages without adding value;
  - creating multiple sites to hide the scaled nature;
  - pages that make little sense but contain keywords.

  — [Google Search Central: Spam policies](https://developers.google.com/search/docs/essentials/spam-policies); [Search Central Blog: March 2024 core update and new spam policies](https://developers.google.com/search/blog/2024/03/core-update-spam-policies)
- AI content: automation has long produced helpful content (sports scores, weather, transcripts), but using automation including AI "to generate content with the primary purpose of manipulating ranking" violates spam policies. Consider disclosing how automated content was created. — [Search Central Blog: Google Search's guidance about AI-generated content (Feb 2023)](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content); [Using gen-AI content](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)
- **Site reputation abuse (Nov 19, 2024 clarification):** "publishing third-party pages on a site in an attempt to abuse search rankings by taking advantage of the host site's ranking signals". "No amount of first-party involvement" (white-label, licensing, partial ownership) changes the third-party nature. — [Search Central Blog: Updating our site reputation abuse policy](https://developers.google.com/search/blog/2024/11/site-reputation-abuse)
- **Aug 28, 2026 update:** following discussion with the European Commission, from Aug 30, 2026 site-reputation manual actions still affect the violating section of a site for searchers outside the EEA. Inside the EEA there is no ranking manual action; instead Google may separate the section so it "ranks on its own merits". Search Console still notifies site owners and reconsideration is still available. — [Search Central Blog: Update to the Site Reputation Policy](https://developers.google.com/search/blog/2026/08/update-site-reputation-policy); coverage: [Search Engine Journal](https://www.searchenginejournal.com/google-updates-site-reputation-abuse-policy-removes-penalties-in-eea/587423/)
- **Core updates:** 2025: March (Mar 13-27), June (Jun 30-Jul 17), December (Dec 11-29). 2026: March (Mar 27-Apr 8), May (May 21-Jun 2). The helpful content system "was merged into the core algorithm" and now runs continuously. — [Dataslayer (third-party)](https://www.dataslayer.ai/blog/google-core-update-december-2025-what-changed-and-how-to-fix-your-rankings); [Search Engine Land: May 2026 core update complete](https://searchengineland.com/google-may-2026-core-update-rollout-is-now-complete-479119); [SERoundtable: March 2026 core update](https://www.seroundtable.com/google-march-2026-core-update-41121.html)
- A Brafton article titled "August 2026 Google Update: What It Is & How To Respond" exists. I could not confirm what that update was. — [Brafton](https://www.brafton.com/blog/seo/august-2026-google-update-what-it-is-how-to-respond/)
- Google published an AI-search optimization guide in May 2026 (title only confirmed). — [Search Central Blog: A new resource for optimizing for generative AI in Google Search](https://developers.google.com/search/blog/2026/05/a-new-resource-for-optimizing); [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

### Inferences
- **Programmatic tool pages:** a tool that computes a real answer for arbitrary inputs is not scaled content abuse. Generating thousands of static pages per input value or keyword ("100 cm to inches", "101 cm to inches"…) with templated text is the textbook pattern the policy describes, and it doubles as an AdSense "templated page" risk. Prefer one canonical tool page per function, with dynamic results, and noindex or canonicalize parameterized result URLs.
- **AI-written explanations:** allowed if edited, accurate and page-specific. Mass AI "SEO articles" around each tool are risky for both Search (scaled content) and AdSense ("automatically generated content without manual review or curation"). Human review and original elements (worked examples, screenshots, test data, methodology) are the safeguard.
- AI Overviews and answer engines increasingly answer simple conversions directly. Tools with interactive depth (multi-input, charts, saved or shareable results) will hold traffic better than one-line conversions. This is a strategic inference and was not verified with data.
- Don't host guest or sponsored "third-party" sections to rank for unrelated topics (site reputation abuse).

### Gaps
- [unverified background] Google said the March 2024 changes would cut low-quality, unoriginal content in results by about 40%, later reported as 45%. The blog URL is confirmed but the figure was not fetched.
- [unverified background] Site reputation abuse enforcement started 5 May 2024. Expired domain abuse is also a named spam policy since March 2024.
- Whether there was an August/September 2026 core update is unconfirmed.

## 9. Country-specific eligibility and payment considerations (South Asia publishers targeting global/Tier-1 traffic)

### Takeaway
I could verify very little here because the budget ran out and official pages were blocked. Officially confirmed: an "AdSense availability" page exists, and the 6-month India/China rule is disputed (section 6). Payment and tax specifics for Pakistan and India are **unverified background** only and must be checked in the official AdSense payments and tax help before relying on them.

### Cited Findings
- AdSense availability page (country availability) exists; its content was not visible. — [AdSense Help: AdSense availability](https://support.google.com/adsense/answer/13402307?hl=en)
- 6-month site-age rule for India/China: conflicting status (see section 6). — [WebNots](https://www.webnots.com/what-are-the-eligibility-criteria-for-google-adsense/); [AdSense Help: Eligibility](https://support.google.com/adsense/answer/9724?hl=en)

### Inferences
- A South-Asia-based publisher targeting Tier-1 traffic should expect the same content, consent and policy bar as anyone else. The extra friction is mainly in verification (address PIN by post, identity) and in payments and tax.

### Gaps
All of the following are **[unverified background]**; none was verified this session:
- **Payment threshold** is US$100 (or local equivalent).
- A **PIN** is mailed once earnings reach about $10. Identity verification may also be required.
- Payment methods by country: EFT/wire (SWIFT) is standard for Pakistan and India. Western Union was discontinued years ago. Check the "payment methods by country" help page.
- **US tax withholding** (since June 2021) applies to non-US publishers on earnings from **US viewers**:
  - up to 24% of *total* earnings if no tax info is submitted;
  - otherwise 30% on US-sourced earnings, or a treaty rate if a W-8BEN claims treaty benefits (India's commonly cited rate is 15%).

  Pakistan's applicable rate could not be verified. A Tier-1/US-heavy tools site will be materially affected by this, so submit the W-8BEN before the first payment.
- Pakistan-specific eligibility restrictions: none found.

## 10. Actionable approval & compliance checklist for a tools/calculator site (synthesis of sections 1-9)

### Takeaway
Approval depends less on hard eligibility than on showing that every ad-bearing page carries real, original publisher content and that the site is trustworthy, crawlable and consent-compliant. The checklist below maps each item to its source. Items marked **[anec]** are community-derived and **[inf]** are my inferences.

### Cited Findings
**Account and domain**
- [ ] Applicant is 18+ (or a parent or guardian applies) — [AdSense age](https://support.google.com/adsense/answer/14230?hl=en)
- [ ] You control the HTML `<head>` of the site — [Eligibility](https://support.google.com/adsense/answer/9724?hl=en)
- [ ] Custom domain preferred. A PSL-listed subdomain (github.io, pages.dev, netlify.app, vercel.app) is technically addable; a path-based site isn't — [Site management](https://support.google.com/adsense/answer/12170421?hl=en); [PSL](https://raw.githubusercontent.com/publicsuffix/list/main/public_suffix_list.dat)
- [ ] Primary content language is a supported one — [Languages](https://support.google.com/adsense/answer/9727?hl=en); [Unsupported languages](https://support.google.com/publisherpolicies/answer/10436912?hl=en)

**Content (the decisive part)**
- [ ] No ad-bearing screen without publisher content: every tool page has substantial page-specific text, and no ads on result, thank-you or error screens — [Publisher-content policy](https://support.google.com/publisherpolicies/answer/11112688?hl=en)
- [ ] No auto-generated or templated page farms, and nothing AI-generated without manual review — [Publisher-content policy](https://support.google.com/publisherpolicies/answer/11112688?hl=en); [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies); [MonetizeMore templated](https://www.monetizemore.com/blog/how-deal-with-valuable-inventory-templated-page-violation-adsense/)
- [ ] Each tool page covers: what it does, how it works (formula), worked example, interpreting results, FAQs, related tools — [anec] [genieegroup](https://genieegroup.com/blog/adsense-low-value-content/) / [Toolpod](https://toolpod.dev/blog/adsense-rejection-low-value-content)
- [ ] Supporting guides or blog posts with real depth. Community figures range from 15 to 20+ posts, but even this was not enough for Toolpod — [anec] [Toolpod](https://toolpod.dev/blog/adsense-rejection-low-value-content); [okeyravi](https://okeyravi.com/resolve-valuable-inventory-not-enough-content/)
- [ ] Good UX and navigation — [Not ready to show ads](https://support.google.com/adsense/answer/12176698?hl=en)
- [ ] YMYL tools: author and credentials, methodology, primary-source citations, last-reviewed date, disclaimer — [AdSense Community guide (YMYL)](https://support.google.com/adsense/community-guide/241032356/how-can-you-solve-the-low-value-content-adsense-disapproval-challenge?hl=en); [Helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

**Legal and consent**
- [ ] Privacy policy with the Google/third-party cookie disclosure and opt-out links (Ads Settings, aboutads.info), plus any other vendors named — [Required content](https://support.google.com/adsense/answer/1348695?hl=en)
- [ ] EEA/UK/CH: a Google-certified TCF v2.2 CMP (the AdSense Privacy & messaging European regulations message qualifies) — [CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en); [Google CMP](https://support.google.com/adsense/answer/16918505?hl=en); [IAB TCF v2.2](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md)
- [ ] US: US state regulations message set to "All current and future supported US States" — [US state messages update](https://support.google.com/adsense/answer/16789138?hl=en)
- [ ] About, Contact, Terms, Disclaimer pages — [anec] [Indie Hackers](https://www.indiehackers.com/post/i-stopped-paying-others-to-audit-my-adsense-eligibility-i-built-a-tool-to-check-it-myself-SxdwVPb1GLv670cnQauX)

**Ads setup**
- [ ] `/ads.txt` at the site root with the `google.com, pub-…, DIRECT, f08c47fec0942fa0` line — [Earnings at risk threads](https://support.google.com/adsense/thread/7401901/earnings-at-risk-%E2%80%93-one-or-more-of-your-sites-does-not-have-an-ads-txt-file?hl=en)
- [ ] Ads kept away from inputs, buttons, drop-downs and result boxes (≥150 px as a conservative benchmark); nothing that mimics tool UI; consider Confirmed Click — [Ad placement policies](https://support.google.com/adsense/answer/1346295?hl=en-GB); [Gameplay 150 px](https://support.google.com/adsense/answer/2768340?hl=en-GB); [Confirmed Click](https://support.google.com/adsense/answer/10025624?hl=en-GB)

**Technical and timing**
- [ ] Site reachable, crawlable (robots.txt allows Google), content renders without JS barriers — [Not ready to show ads](https://support.google.com/adsense/answer/12176698?hl=en); [anec] [okeyravi](https://okeyravi.com/fix-valuable-inventory-under-construction-no-content-violation/)
- [ ] Some age (3-6 months) and organic traffic before applying — [anec] [dev.to/bdubs](https://dev.to/bdubs/i-applied-for-adsense-and-got-rejected-for-low-value-content-hog); India/China 6-month rule disputed — [WebNots](https://www.webnots.com/what-are-the-eligibility-criteria-for-google-adsense/)
- [ ] Expect review to take days, sometimes 2-4 weeks — [Not ready to show ads](https://support.google.com/adsense/answer/12176698?hl=en)

### Inferences
- [inf] Recommended sequencing:
  1. Build 15-30 strong tool pages plus 10-20 guides.
  2. Publish trust and legal pages.
  3. Verify indexing in Search Console and wait for some organic traffic, typically 2-4+ months.
  4. Set up the CMP and ads.txt.
  5. Apply.
  6. If rejected for low value content, don't re-apply immediately. Strengthen the thinnest pages, prune or noindex stubs, and add original data or methodology.
- [inf] Fallbacks if AdSense stays out of reach: networks with lower entry bars (Ezoic was named by the Toolpod owner) or niche networks (Carbon Ads for developer tools) — [Toolpod](https://toolpod.dev/blog/adsense-rejection-low-value-content)

### Gaps
- All items marked [anec] rest on community reports that I could not fetch in full.
- There is no official numeric threshold for pages, words, traffic or site age.
- Payment and tax items are unverified (section 9).
