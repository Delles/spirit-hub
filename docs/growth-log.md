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
