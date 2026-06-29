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
- Outcome: Deployed from commit `051319e3124c1d1ea0294186aef2a0a65395d9d0`; Vercel deployment
  `dpl_CPxyCegGdww38xgT4C2Kx8vmT1co` reached `READY`, and production `/bioritm` returned `200` with
  the expected title and description. Google recrawl and CTR measurement are pending.

## 2026-06-29 - Build compatibility topic authority

- Evidence: `/numerologie/compatibilitate` earned 5 clicks from 83 impressions at 6.02% CTR in the
  latest seven-day Search Console export, so its snippet already matches intent. Owner SERP evidence
  showed the result ranking near the bottom of the visible results, making authority and supporting
  content the larger constraint.
- Decision: Preserve the calculator metadata and strengthen the surrounding compatibility topic
  cluster with transparent methodology and reciprocal internal links.
- Change made: Expanded the compatibility guide to explain its required inputs and the exact scoring
  method, added practical interpretation guidance, linked the guide with the calea vieții and numărul
  destinului guides, and added a contextual guide link below the compatibility calculator.
- Expected result: Stronger topical relevance and crawl paths for the compatibility calculator,
  plus clearer trust signals for users who want to understand the percentage before or after use.
- Review date: 2026-07-13, using Search Console page/query data for compatibility terms and guide
  impressions.
- Outcome: Deployed from commit `79917dd4cb3470660351d9d26b8965585a1a299a`; Vercel deployment
  `dpl_GB7KFPSC8K9h9Z6vWmUYJWn45feb` reached `READY`. The calculator and guide both returned `200`;
  production preserves the calculator title and exposes the new guide link and scoring method.
