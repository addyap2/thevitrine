# The Vitrine: launch verification

For maintainers publishing changes to https://thevitrine.fr. This checklist
records the 22 October 2026 audit fixes and separates verified behavior from
checks that require a person or an external account.

## Implemented

- The fixed header stays visible. The collapsed menu scrolls within short
  screens and closes with Escape, outside taps and navigation.
- Every main page has a skip link and focus target. Language-switch accessible
  names contain the visible abbreviation. Legal placeholders have readable
  contrast. Empty portfolio filters explain the result and offer a reset.
- French and English remain at stable addresses without automatic language
  redirects. Metadata, alternate languages and structured data remain intact.
  Search titles are shorter without changing editorial headings.
- Case-study URLs survive display-title changes. Sitemap dates reflect content
  updates rather than screenshot refreshes. Three case studies include genuine
  mobile captures. The authenticated Student Mark Tracker capture is labelled
  as a sign-in screen; no private dashboard content is exposed.
- Contact and questionnaire pages show an email fallback when JavaScript fails
  or is disabled. The questionnaire draft expires after seven days, can be
  cleared, validates restored values, and never restores consent.
- Both forms enforce JSON byte limits, signed timestamps, honeypots, rate
  limits and replay protection. Shared Redis protection is connected in
  production and preview. Redis keys contain hashed identifiers and expire.
- Email requests have deadlines and duplicate-send protection. The interface
  reports confirmation-email failures separately from successful team receipt.
- Vercel Analytics is connected. Query parameters are stripped. Conversion
  counters contain fixed event names and language only, expire after 90 days,
  and respect Do Not Track in the browser. Privacy copy describes these tools.
- The questionnaire footer offers contact rather than linking back to itself.
  About-page copy includes individuals, associations, institutions and companies.
- Privacy and takedown contact: formations@antonyaddy.com. Publication director:
  Antony Addy. Existing portraits are retained; blog stock imagery stays removed.

## Verification

- `npm test`: eight regression tests covering body limits, origins, tokens,
  duplicate-send headers, deadlines, email failure paths and shared protection.
- `npm run build`: 71 pages, including the noindex 404; 70 sitemap URLs.
- Chromium and WebKit: menu at 844 × 390, widths 320/390/768/1100/1440,
  filter recovery, partial-email success state and JavaScript-disabled fallback.
- Axe WCAG 2.1 AA: nine page types in each engine, no automated violations.
  Automated checks do not replace a screen-reader review.
- Shared production Redis: verified rate-limit enforcement and nonce replay
  rejection using isolated test keys; no customer or team email was sent.

## Before and after each deployment

- [ ] Run form tests and build. Confirm the expected Git commit and project.
- [ ] Check the production homepage, both languages, contact and questionnaire.
- [ ] Check a blog post, legal page, case study, 404, sitemap and robots.txt.
- [ ] Verify all navigation and primary CTAs on a real iPhone and Android phone.
- [ ] Check Safari, Chrome, Edge and Firefox; include a short landscape screen.
- [ ] Check keyboard focus, skip links, 200% zoom, reduced motion and VoiceOver
      or NVDA. Safari may need its keyboard-navigation preference enabled.
- [ ] Confirm real portraits and project screenshots load; no broken assets,
      unwanted stock images, console errors or blocked scripts.
- [ ] Recheck mobile performance with Lighthouse. Use real-user Analytics for
      trends; a laboratory score is not proof of field Core Web Vitals.
- [ ] Confirm Analytics receives page views and Redis receives aggregate events.
      Do not put names, email addresses or form values in event properties.
- [ ] Verify canonical/alternate tags, article dates, share images and sitemap.
      Inspect indexing and sitemap processing in Search Console separately.
- [ ] Check Redis availability and Resend acceptance/delivery logs. Send a
      controlled real submission only when the recipients expect the test.
- [ ] Check Vercel runtime errors after deployment. Configure and test an alert
      destination if email failures must trigger an active notification.
- [ ] Confirm production secrets are present and never committed. Keep Upstash
      on the free plan with automatic upgrades disabled; monitor its quota.
- [ ] Confirm www and old-domain redirects, HTTPS, security headers and the
      deployment rollback path. Avoid changing DNS during a routine release.

## Owner information still required

Julien's legal status, registration number (or confirmation that none applies),
postal address, email and telephone remain placeholders. Obtain and verify the
facts before treating the legal notice as complete.

No client outcomes, testimonials or performance claims are invented. Add dated,
approved evidence when available. Prices, delivery commitments, hosting,
maintenance and support terms remain unpublished until agreed; the site routes
these questions to a tailored quote rather than making unsupported promises.

Inbox deletion after the stated retention period is an operational obligation;
the website cannot delete mail from personal inboxes. Assign responsibility for
that review and for responding to privacy requests.
