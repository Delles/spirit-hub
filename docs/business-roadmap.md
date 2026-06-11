# SpiritHub.ro Business Roadmap

**Status:** production app, pre-monetization foundation  
**Goal:** turn SpiritHub.ro from a learning project into a small, measurable media/tool business.

---

## Positioning

SpiritHub.ro should be treated as a Romanian spiritual self-discovery utility, not as a generic
"mystic content" site. The strongest wedge is:

- fast mobile tools,
- Romanian-language UX with diacritics,
- instant results without account friction,
- daily return loops,
- shareable outputs.

The business should start as an SEO and ad-supported tool site, then add owned audience and paid
upgrades only after traffic and retention are proven.

---

## Current Product Reality

Already shipped in this repo:

- Homepage with daily widgets: daily number, oracle message, biorhythm/energy, quick tools.
- Numerology calculators: life path, destiny/name number, daily number, compatibility.
- Biorhythm tools: calculator, critical days, daily energy.
- Daily oracle message page.
- SEO guide section under `/ghiduri` with six high-intent Romanian guides.
- OG image endpoints for shareable results.
- Vercel Analytics and Speed Insights.
- Health check endpoint.
- Sitemap and robots.
- Legal/trust pages: About, Privacy, Terms.
- Optional AdSense integration that stays disabled until env vars are configured.

Not currently shipped, despite older docs mentioning them:

- Dream interpretation routes.
- Newsletter capture.
- Paid product or checkout.
- Automated tests or CI.
- Consent management platform.

---

## Revenue Strategy

### Phase 1: Ad-Supported Utility Site

Primary revenue: Google AdSense or Ezoic once traffic is eligible.

Use restrained placements:

- one inline result ad after a successful calculator result,
- one content-footer ad on long educational pages,
- no forced interstitials,
- no layout-shifting ad blocks,
- no ads before the user receives the result.

Target metrics before aggressive optimization:

- 10,000 monthly pageviews,
- 2.0+ pages per session,
- 60%+ mobile Core Web Vitals pass rate,
- AdSense approval,
- first $10/month revenue.

### Phase 2: Owned Audience

Add a simple daily email or browser notification loop only after the core pages rank.

Ideas:

- "Energia zilei" daily email.
- Weekly biorhythm forecast reminder.
- Monthly numerology theme.

Primary metric: subscribers per 1,000 visitors, not raw subscriber count.

### Phase 3: Paid Upgrade

Do not build payments first. Wait for traffic and repeated tool usage.

Potential paid offers:

- personalized PDF numerology report,
- compatibility report for couples,
- annual biorhythm calendar,
- premium "deep insight" interpretation.

Start with a one-time purchase before subscriptions.

---

## 30-Day Execution Plan

### Week 1: Monetization Readiness

- Configure AdSense account and publisher id.
- Add real `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT`.
- Add one real result-page slot id with `NEXT_PUBLIC_ADSENSE_SLOT_RESULT_INLINE`.
- Add consent management if personalized ads are enabled in GDPR regions.
- Submit sitemap in Google Search Console.
- Verify `spirithub.ro` ownership in Search Console.

### Week 2: SEO Surface Area

- Status: shipped as `/ghiduri` static guide pages.
- Add 6 high-intent article pages or static guide pages:
  - "Ce este calea vieții în numerologie?"
  - "Cum se calculează numărul destinului?"
  - "Compatibilitate numerologică: cum se interpretează scorul?"
  - "Ce este bioritmul?"
  - "Zile critice în bioritm: ce înseamnă?"
  - "Energia zilei: cum să o folosești?"
- Link each article to the relevant calculator.
- Add FAQ schema where the article genuinely answers common questions.

Next SEO expansion should come from Search Console queries after the sitemap is submitted and has
collected impressions.

### Week 3: Retention

- Add "revino mâine" CTA on daily pages.
- Add localStorage shortcut for last used birth date, with clear privacy wording.
- Add one share CTA per result page and track share-button clicks if analytics supports it.

### Week 4: Measurement and Safety

- Add Vitest for core numerology and biorhythm functions.
- Add one Playwright smoke test for homepage and top calculator flows.
- Add GitHub Actions CI once tests exist.
- Review Search Console queries and choose the next 10 pages from real impressions.

---

## 90-Day Targets

- 25,000 monthly pageviews.
- 20+ indexed SEO pages.
- AdSense or Ezoic live.
- $25-$75 monthly revenue.
- 5%+ returning visitor rate.
- Core calculators protected by automated tests.
- A documented weekly operating rhythm.

---

## Weekly Operating Rhythm

Spend 60-90 minutes per week:

- 15 min: Search Console query review.
- 15 min: analytics and revenue review.
- 30 min: publish or improve one content page.
- 15 min: inspect errors, broken pages, and Core Web Vitals.
- 15 min: decide the next small experiment.

Make decisions from search queries and behavior, not from feature excitement alone.

---

## Business Principles

- The first business is traffic plus trust, not software complexity.
- Do not add accounts until there is a clear user benefit.
- Do not add paid features until free users show repeat behavior.
- Romanian SEO pages should lead back to tools, not exist as isolated blog content.
- Keep the site calm and fast; intrusive monetization will damage the main advantage.
