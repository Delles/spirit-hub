# SpiritHub Growth Log

Use this file for dated decisions that affect traffic, SEO, retention, or revenue.

## Entry Template

```md
## YYYY-MM-DD - Decision title

- Evidence:
- Decision:
- Change made:
- Expected result:
- Review date:
- Outcome:
```

## 2026-06-11 - Establish biorhythm as first SEO wedge

- Evidence: Search Console exports showed biorhythm-related demand and existing impressions.
- Decision: Improve `/bioritm` and related content before spreading effort across unrelated topics.
- Change made: Added guide content, improved SEO copy, and strengthened calculator-oriented paths.
- Expected result: Better click-through rate and more qualified organic traffic to the biorhythm tool.
- Review date: After Search Console has 7 to 14 days of post-sitemap data.
- Outcome: Pending.

## 2026-06-11 - Queue compatibility page CTR improvement

- Evidence: Search Console review showed `/numerologie/compatibilitate` with 40 impressions, average
  position 8.12, and 0 clicks. Sitemap evidence now shows `Success` with 10 discovered pages.
- Decision: Send the next dev task to the engineering lane for `/numerologie/compatibilitate` SEO
  and page-clarity improvements before running a broad subjective site audit.
- Change made: Dev lane updated compatibility metadata, visible calculator-focused copy, and matching
  FAQ/schema copy. Commits: `d2df048c8d2e3ded9560e4e9205bc327bd3c9234` and
  `5d152d358875df79fd9c78f39887f3c915173c71`.
- Expected result: Better query match for `compatibilitate numerologica calculator` and improved
  click-through once Google recrawls.
- Review date: 2026-06-18 to 2026-06-25.
- Outcome: Deployed to production. Vercel deployment for `5d152d358875df79fd9c78f39887f3c915173c71`
  was `READY`; `/numerologie/compatibilitate` returned `200`; no production warnings/errors appeared
  in the runtime log query.

## 2026-06-29 - Tighten biorhythm calculator search snippet

- Evidence: The 2026-06-21 to 2026-06-27 Search Console export showed `/bioritm` at 166 impressions,
  4 clicks, 2.41% CTR, and average position 7.95. `bioritm calcul` had 125 impressions and no clicks;
  `calculator bioritm` had 37 impressions and no clicks. Owner SERP screenshots also showed
  SpiritHub below several calculator competitors.
- Decision: Test a shorter exact-intent title and an action-led description on `/bioritm` only.
  Keep the existing H1, introductory calculator copy, and calculator behavior unchanged.
- Change made: Shortened the title to `Calculator Bioritm Online Gratuit | SpiritHub.ro` and rewrote
  the description around entering a birth date and receiving the three cycles plus critical days.
- Expected result: A clearer, less truncation-prone snippet and higher CTR for biorhythm calculator
  queries without changing ranking-page behavior.
- Review date: 2026-07-13, using a fresh seven-day Search Console query/page export and owner SERP
  screenshots for the same biorhythm queries.
- Outcome: Pending deployment and Google recrawl.
