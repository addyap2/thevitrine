# The Vitrine: audit and launch checklist

Audit of 22 October 2026. All measurements are from the production build
(`npm run build`), served locally and tested with Lighthouse 12 and Playwright
(Chromium and WebKit).

## Results

| | Before | After |
|---|---|---|
| Lighthouse mobile: performance / accessibility / best practices / SEO | 75 / 100 / 100 / 100 | **95 / 100 / 100 / 100** |
| Lighthouse desktop | 98 / 100 / 100 / 100 | **100 / 100 / 100 / 100** |
| First contentful paint (mobile, slow 4G) | 2.8 s | **1.4 s** |
| Largest contentful paint (mobile, slow 4G) | 5.6 s | **2.9 s** |
| Page weight on first load (mobile) | 963 KB | **434 KB** |
| Requests to third parties | Google Fonts (2) | **none** |
| Layout shift | 0 | 0 |

## Findings

Severity: **High** means real users lose content, speed, leads or legal cover.
**Medium** hurts a clear group of users or a key path. **Low** is polish or
hygiene.

### Fixed

| # | Severity | Area | Issue and impact | Fix |
|---|---|---|---|---|
| 1 | High | Speed | Google Fonts' stylesheet blocked rendering for about 2 s on mobile, and every visit sent the visitor's IP address to Google (a GDPR complaint risk for a French site). | Fonts are now downloaded at build time and served from this site, preloaded, with size-matched fallbacks (Astro `fonts`). Fraunces keeps its optical-size axis and now has its real italic. |
| 2 | High | Speed | Every card and the hero sent 1280px JPEGs (about 85 KB each) to phones that show them at 300–400px. | `scripts/images.mjs` makes 480, 800 and 1280px WebP copies at build time. Cards and the hero use `srcset`/`sizes`, about 12 KB per image on phones. |
| 3 | High | Resilience | Content is hidden until the script reveals it. If the script failed (network, extension, old browser), most of the page stayed invisible. | Safety net: if the main script hasn't run within 3 s, everything is shown. Tested by stripping the scripts: nothing stays hidden. |
| 4 | High | Conversion | Julien's "Get in touch" opened his homepage, not his contact details. | Now links to `julienb.vercel.app/#contact` (email and phone). |
| 5 | Medium | Conversion | While browsing 24 sites, the only route to contact was the far bottom of the page. | Once the filter bar pins, a "Start your project" button rides along with it ("Contact" on phones). |
| 6 | Medium | SEO / social | The share image was whichever client screenshot came first. `og:type`, site name, image size and alt text, and the Twitter card were missing. | Dedicated 1200×630 share images rendered from the hero in each language (`public/og/`, `npm run og`), plus the full set of tags. |
| 7 | Medium | Security | No security headers and no content security policy, so the site could be framed (clickjacking), with no limits on script sources. | `vercel.json` sends nosniff, a referrer policy, a permissions policy, `frame-ancestors 'none'`, `X-Frame-Options`, COOP and HSTS. Astro adds a hash-based CSP to every page. Checked: no violations. |
| 8 | Medium | Speed | Hashed assets and screenshots were revalidated on every visit. | Hashed `/_astro/` files are cached for a year (immutable); screenshots and share images for a day, with a week of stale-while-revalidate. |
| 9 | Medium | Accessibility | The focus ring was rust on navy in the hero and contact sections, too faint to see (WCAG 1.4.11). | The focus ring takes the lamp colour on night surfaces. Checked with the keyboard. |
| 10 | Medium | Accessibility | Tabbing through cards could land focus under the pinned filter bar (WCAG 2.4.11). | Links and buttons in the work section get a scroll margin that clears the bar. |
| 11 | Medium | Error handling | Unknown addresses showed Vercel's generic 404, with no way back. | Bilingual, on-brand 404 page with links home (`noindex`). |
| 12 | Low | SEO | No `robots.txt` or sitemap. | Both are generated from `site`, with hreflang alternates in the sitemap. |
| 13 | Low | SEO | No structured data. | Organization JSON-LD naming both founders. |
| 14 | Low | Brand | The rust favicon didn't match the identity; there was no home-screen icon or theme colour. | Night-and-lamp favicon, 180px Apple touch icon, `theme-color`. |
| 15 | Low | Mobile | After a tap, cards and contact cards stayed lifted (sticky hover). | The lift only applies where there's a real pointer (`hover: hover`). |
| 16 | Low | Browsers | Glass blur (language switch, contact cards) was missing in Safari before version 18. | Added `-webkit-backdrop-filter`. |
| 17 | Low | Accessibility | The hero heading sat outside any landmark. | The hero is now the page's `<header>`. |
| 18 | Low | Error handling | A screenshot that failed to load showed a broken-image icon. | It's removed, leaving the frame's dusk tone. |

Caught during testing and fixed before shipping: the new pinned button made
the page scroll sideways by 57 px on phones in both WebKit and Chromium.

### Open: needs a decision from you

| # | Severity | Area | Issue | Recommendation |
|---|---|---|---|---|
| A | High | Legal | French law (LCEN, art. 6) requires *mentions légales* on a professional site: publisher name and status (SIRET if any), publication director, host (Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA) and a contact. | The page is built (`/mentions-legales/` and `/en/legal-notice/`, linked from the footer and the 404 page), with publishers, host, intellectual property, privacy and cookies, and external links. Antony's details, the publication director and the contact are filled in. Julien's fields show as "to be completed" placeholders until they're added to `src/data/legal.ts`; the build log warns about them. No cookie banner is needed while the site sets no tracking cookies. |
| B | High | Analytics | There is no analytics, so you can't tell how many visitors reach a contact link. | Turn on **Vercel Web Analytics** (no cookies, so no banner). Then I'll add its script and track clicks on the CTAs and contact cards. Custom events need a Vercel Pro plan; otherwise Plausible does the same. |
| C | Medium | Deployment | ~~The site URL is still `thevitrine-eta.vercel.app`.~~ Live on **thevitrine.fr** since 22 October 2026. | `site` in `astro.config.mjs` is `https://thevitrine.fr`. In Vercel (Settings → Domains), `www.thevitrine.fr` and `thevitrine-eta.vercel.app` redirect permanently (308) to it, path included. Submit HSTS preload only once the domain has settled. |
| D | Medium | Conversion | Both contact cards leave the site. There's no direct email, phone or WhatsApp. | Add a direct link to each card (Julien already publishes his email and phone on his site). Your call, for spam and privacy reasons. |
| E | Medium | Conversion | Antony's card on the English page opens `antonyaddy.com/contact?sujet=sites`. | Check that page works for English speakers, or point the English page at an English contact page. |
| F | Low | Content | The "Code" links speak to developers, but your visitors are restaurants and shops. | Keep them, make them less prominent, or remove them. |
| G | Low | Speed | Mobile largest paint is 2.9 s on Lighthouse's slow-4G profile: the headline repaints when Fraunces arrives. | Acceptable (real connections are faster). `font-display: optional` would remove the repaint, but slow connections would then keep Georgia. |
| H | Low | Polish | Screenshots far down the page show a plain dusk frame while loading. | Tiny blurred previews built at build time. |

## Launch checklist

Ticked items were verified in this audit. Unticked ones are still to do.

### Mobile and fallbacks
- [x] No sideways scrolling at 360 and 390px (WebKit and Chromium)
- [x] Filter tabs scroll sideways on phones; the pinned bar shows "Contact" instead of the count
- [x] Without JavaScript, all content is visible and the filters' chosen states still show
- [x] If the scripts fail, everything is revealed within 3 s
- [x] Reduced motion: no travel, slideshow paused, indicators jump instead of sliding
- [x] No sticky hover lift after a tap on touch screens
- [ ] Try it on a real iPhone (Safari) and a mid-range Android (Chrome)

### Calls to action
- [x] Hero: "See the 24 sites" and "Start your project" both reach their sections
- [x] Pinned filter bar: "Start your project" reaches the contact section
- [x] Antony's card opens his contact page; Julien's opens his contact section
- [ ] Decide on direct email, phone or WhatsApp links (D)
- [ ] Check the English route to Antony's contact page (E)
- [ ] Send yourselves a test enquiry through each route

### Assets
- [x] Responsive WebP for every screenshot, built automatically
- [x] Share images for English and French (1200×630)
- [x] Favicon, Apple touch icon, theme colour
- [ ] Refresh screenshots now and then: `npm run sync -- --refresh`
- [ ] After changing the hero, re-render the share images: `npm run og`

### Performance
- [x] Lighthouse mobile 95 or better, desktop 100
- [x] No third-party requests; fonts self-hosted and preloaded
- [x] Long-term caching for hashed assets
- [x] No layout shift (CLS 0 on mobile, under 0.01 on desktop)
- [ ] Re-run Lighthouse against the live URL after deploying

### Accessibility
- [x] Lighthouse accessibility 100 on both languages
- [x] Logical keyboard order: language switch, hero CTAs, window, pause, filters, cards
- [x] Visible focus on every surface
- [x] Focus never hidden under the pinned bar
- [x] The slideshow pauses on hover, focus, hidden tab, or with its button (WCAG 2.2.2)
- [x] The filter count is announced (`aria-live`); filters use `aria-pressed`
- [ ] A quick pass with VoiceOver (Safari) on desktop and iPhone

### Cross-browser
- [x] Chromium: full test (filters, pinning, CTA, CSP, no console errors)
- [x] WebKit (Safari's engine): filters, overflow, pinned bar, no errors
- [ ] Firefox: check by hand (its test browser wouldn't start in this environment)
- [ ] Safari 16–17 on an older iPhone, if you have one

### SEO and metadata
- [x] Title, description, canonical and hreflang (en, fr, x-default) on both pages
- [x] Open Graph and Twitter card tags with a dedicated image and alt text
- [x] `robots.txt` and `sitemap.xml`, generated from `site`
- [x] Organization structured data
- [x] Lighthouse SEO 100
- [ ] Add the site to Google Search Console and submit the sitemap
- [ ] Check share previews (LinkedIn Post Inspector, WhatsApp) once live

### SEO (audit of 22 October 2026)
- [x] One URL per page: trailing slash everywhere; `/en`, `/index.html` and `/en/index.html` redirect permanently
- [x] Titles and descriptions target "création de sites vitrines" (Var, Côte d'Azur) and "websites for small businesses" (French Riviera, Bristol)
- [x] H1 starts with the keyword line; section counts moved out of the headings
- [x] Descriptive alt text on every screenshot
- [x] "What we do" section (who, what, where, how)
- [x] Structured data: Organization, both founders, WebSite, service offer, 24-item portfolio
- [x] Sitemap includes the legal pages and `lastmod` dates
- [ ] Fill the placeholders in `src/data/business.ts`: `priceFrom` and `timescale` (adds a price line to the page and the offer), `profiles` (Google Business Profile, Malt… for `sameAs`)
- [x] Phase 3: 25 case studies drafted in French and English (`/realisations/<projet>/`, `/en/work/<project>/`), written only from what each live site shows
- [x] All 25 case studies published (indexed, in the sitemap, card titles link to them)
- [x] Driving school: 30 years of experience confirmed (its own site's hero still says 17; worth fixing there)
- [x] Florian Bozzetti (osteopath, Julien) added to the Vitrine, with a draft case study
- [ ] Phase 4: custom domain, links from antonyaddy.com and Julien's site, client-site credits, directory listings, Search Console and Bing Webmaster Tools

### FAQ
- [x] Homepage FAQ (9 questions, French and English) with FAQPage structured data
- [ ] Answer the hidden questions in `src/data/faq.ts`: hosting and domain name, editing the site yourself, what happens after launch

### Blog
- [x] Blog at `/blog/` and `/en/blog/`, with 5 draft articles in each language (in `src/content/blog/`)
- [x] All five articles published in both languages (indexed, in the sitemap, "Blog" link in the homepage footer)
- [x] The articles' links to case studies now point to published, indexable pages

### Forms
- [x] Project questionnaire (`/devis/`, `/en/quote/`) and contact form (`/contact/`, `/en/contact/`), emailing Antony and Julien through Resend (`api/devis.js`, `api/contact.js`), with a confirmation to the sender
- [x] Spam protection: signed one-time token, honeypot, minimum fill time, origin check, rate limits, link limit on messages
- [x] Privacy notice describes both forms
- [ ] `RESEND_API_KEY` is set for Production only: add it to Preview too if you want forms to work on preview deployments

### Analytics
- [ ] Turn on Vercel Web Analytics or Plausible (B)
- [ ] Track clicks on the hero CTAs, the pinned button and both contact cards

### Error handling and resilience
- [x] Bilingual 404 page with links home
- [x] Failed screenshots fall back to the empty frame
- [x] The daily sync keeps the old screenshot if a site can't be reached
- [ ] Watch the "Sync projects" GitHub Action for failures (GitHub emails on failure)

### Security and legal
- [x] Security headers and a hash-based CSP; no violations
- [x] No cookies except the language choice (first-party, functional)
- [x] External links use `rel="noopener"`
- [x] Mentions légales page published, with Antony's details
- [ ] Add Julien's details to `src/data/legal.ts` (status, SIRET, address, email, phone)
- [ ] If analytics is added, update the privacy section of the legal page
- [ ] Once live, confirm the headers on securityheaders.com

### Deployment
- [x] `npm run build` passes cleanly (WebP copies, fonts, CSP and both pages)
- [x] `vercel.json` sets the build command to `npm run build`, so the WebP step runs on Vercel
- [x] Custom domain thevitrine.fr live (DNS at Vercel), `site` updated; www and the old vercel.app address redirect permanently via Vercel's domain settings (C)
- [ ] After the first deploy: open `/`, `/en/`, `/sitemap.xml`, `/robots.txt`, `/og/fr.jpg` and an unknown address, and check that French and English browsers land on the right page
