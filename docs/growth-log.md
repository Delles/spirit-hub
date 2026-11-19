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

## 2026-07-06 - Strengthen the numerology calculator hub

- Evidence: The 2026-06-28 to 2026-07-04 Search Console export showed 18 clicks from 712
  impressions, up from 12 clicks and 637 impressions in the prior seven days. `/numerologie`
  appeared 19 times at average position 9.63 but earned no clicks. Generic queries including
  `numerologie calculator online` and `numerologie gratis` also appeared on page one without a
  click. The larger `/bioritm` and compatibility experiments remain inside their measurement window
  through 2026-07-13.
- Decision: Improve only the generic `/numerologie` hub so the active landing-page experiments stay
  isolated.
- Change made: Aligned the title, description, H1, Open Graph, and Twitter metadata with the page's
  four free calculators; added input-based tool-selection guidance, an explicit interpretation
  boundary, and direct links to the three matching methodology guides.
- Expected result: Better generic numerology CTR, stronger crawl paths between the hub, calculators,
  and guides, and clearer trust signals before visitors choose a tool.
- Review date: 2026-07-20, using page/query data for `/numerologie` and generic numerology terms.
- Outcome: Deployed from commit `490604335bb1370538e72471c966306ce1c22d85`; Vercel deployment
  `dpl_3j1UD646nDArXHBSVcUzPBkUCJx5` reached `READY`. Production `/numerologie` returned `200` with
  the expected title, description, trust copy, and methodology-guide links.

## 2026-07-13 - Strengthen biorhythm topic authority

- Evidence: The latest seven-day Search Console export fell to 14 clicks from 740 impressions
  (1.89% CTR), compared with 18 clicks from 712 impressions (2.53% CTR) in the prior period.
  `/bioritm` fell from 7 to 3 clicks, from 1.85% to 0.92% CTR, and from average position 7.60 to
  8.55. Core queries still rank within click range: `calcul bioritm` had 166 impressions at position
  8.78, `bioritm calcul` 145 at 8.08, and `bioritm online` 86 at 6.10. In contrast,
  `/numerologie/compatibilitate` improved from 2 to 4 clicks and from 2.04% to 4.88% CTR after its
  topic-authority iteration. Fresh Vercel Analytics also shows `/bioritm` leading usage with 17
  visitors and 19 views.
- Decision: Preserve the exact-intent `/bioritm` metadata and calculator behavior. Reuse the
  compatibility pattern by strengthening biorhythm methodology content and reciprocal internal
  links instead of guessing at another snippet without a fresh owner SERP screenshot.
- Change made: Expanded `Ce este bioritmul?` with the implemented sine-cycle formula, percentage
  meaning, calculator workflow, and interpretation boundary. Added contextual links among the main
  biorhythm guide, critical-days guide, daily-energy guide, and calculator.
- Expected result: Better topical relevance and crawl paths for the biorhythm cluster, followed by
  improved average position and more clicks from the existing high-impression calculator queries.
- Review date: 2026-07-27. Do not change the biorhythm guides or `/bioritm` SEO copy before then
  unless a production defect appears.
- Outcome: Shipped in commit `5e2bc9be0e44f7f43bd2d81006796e06469ba073`. Typecheck, lint,
  and production build passed; Vercel deployment `dpl_HFfCCewh8JJuwDm3Tpq6Bo3hgftA` reached `READY`.
  The production methodology guide returned `200` with the new formula, trust boundary, and links.

## 2026-07-13 - Make `/bioritm` own calculator intent

- Evidence: Fresh owner SERP screenshots showed the homepage ranking for `calcul bioritm` with its
  generic `SpiritHub.ro - Numerologie și Ghidaj Zilnic` result, while the correct `/bioritm` URL
  appeared for `bioritm calcul`. Search Console showed 166 impressions and 0.60% CTR for
  `calcul bioritm`, plus 145 impressions and 0.69% CTR for `bioritm calcul`; `/bioritm` had 327
  impressions at 0.92% CTR overall. This makes page ownership and result differentiation the
  immediate bottleneck, not lack of demand.
- Decision: Keep the SpiritHub brand and make `/bioritm` the single exact-intent calculator owner.
  The owner explicitly approved an immediate test, overriding the earlier no-edit window.
- Change made: Removed biorhythm calculator targeting from the root fallback metadata and the
  homepage's dedicated exact-match SEO paragraph. Repositioned `/bioritm` around a personal
  biorhythm calculation with a physical, emotional, and intellectual graph for today and the next
  seven days, aligned across title, description, social metadata, H1, and introduction.
- Expected result: Google should consolidate the two core calculator queries on `/bioritm`, while
  its more specific result earns more clicks at the current page-one positions.
- Review date: 2026-07-27. In a query-filtered Pages export, `/bioritm` should receive the majority
  of impressions for both `calcul bioritm` and `bioritm calcul`. Avoid overlapping edits to the
  homepage and `/bioritm` until then.
- Outcome: Shipped in commit `36f541a662affe125c9eeb764c5a6ddc7636ed99`. Typecheck, lint,
  and production build passed. Vercel deployment `dpl_AbCcjkZAdcBvjysr1qnLDgFSCFBN` reached
  `READY`; production `/` and `/bioritm` returned `200` with the expected distinct metadata.

## 2026-07-20 - Deepen numărul destinului topic authority

- Evidence: Fresh owner SERP screenshots now show `/bioritm`, rather than the homepage, for both
  `calcul bioritm` and `bioritm calcul`, at roughly the fifth and sixth organic results. This is the
  first direct evidence that the 2026-07-13 page-ownership change is working, but the page remains
  inside its no-overlap window through 2026-07-27. A read-only Excel audit of the fresh Search
  Console workbook shows the Chart total improving from 13 clicks / 734 impressions / 1.77% CTR to
  19 / 706 / 2.69%. `/bioritm` improved from 3 / 327 / 0.92% / position 8.55 to 5 / 450 / 1.11% /
  6.57. `calcul bioritm` improved from 1 / 166 / 0.60% / 8.78 to 2 / 187 / 1.07% / 6.25, while
  `bioritm calcul` improved in position from 8.08 to 6.35 but remained weak at 1 click / 181
  impressions / 0.55% CTR. `/numerologie/nume-destin` held 18 impressions, improved slightly from
  position 16.56 to 15.39, but fell from 1 click to 0. This confirms it as the clearest isolated
  zero-click calculator surface outside the active biorhythm experiment. Fresh Vercel Analytics
  also shows `/bioritm` at 15 visitors / 26 views versus 17 / 19, while the destiny calculator moved
  from 1 / 1 to 2 / 3 and its guide recorded 1 / 2. Search Console's Chart and Pages sheets do not
  reconcile exactly (the current Pages rows sum to 20 clicks / 721 impressions), so site totals use
  Chart and individual URL decisions use the corresponding Pages rows.
- Decision: Preserve the homepage and `/bioritm` experiment until 2026-07-27. Use the small but real
  destiny-number calculator/guide activity to strengthen that non-overlapping topic cluster without
  rewriting calculator metadata or behavior.
- Change made: Expanded the destiny-number guide with the exact 1–9 letter mapping used in code,
  Romanian-diacritic handling, an `Ion Popescu` worked example, master-number reduction, and a clear
  symbolic/non-scientific boundary. Added a contextual link from the calculator to the methodology
  guide and a reciprocal guide link to the life-path explanation.
- Expected result: Stronger topical relevance and trust for the destiny-number cluster, clearer
  crawl paths between calculator and guide, and more qualified transitions from explanation to tool.
- Review date: 2026-08-03. Do not make another overlapping destiny-number guide or calculator-copy
  edit before then unless a production defect appears.
- Outcome: Shipped in commit `68e8c5b5f05fbdddecb4120695d4f56f7e9e2117`. `bun test` (13
  tests), `bun run typecheck`, `bun run lint`, and `bun run build` passed. Vercel deployment
  `dpl_7UoBEYmYjrJ8ppXgHUtNvYxQBsin` reached `READY`; both changed production paths returned `200`,
  the calculator exposed the guide link, and the guide exposed the worked example and interpretation
  boundary.

## 2026-11-19 - Owner audit, /bioritm/compatibilitate launch, indexing fix, and Romanian /unslop

- Evidence:
  - Live Search Console (`sc-domain:spirithub.ro`, 3 months): `242` clicks, `6,575` impressions, `3.7%` CTR, `9.1` avg position; sitemap `Success` (`20` URLs, last read `2026-11-16`); `120` clicks in last 28 days (`2026-11-18` milestone email).
  - Unserved query cluster: `compatibilitate bioritm` (`145` imp, pos `15.3`), `bioritm compatibilitate` (`93` imp, pos `9.4`), `calcul bioritm compatibilitate` (`43` imp, pos `8.9`) = `281` impressions, `7` clicks with no dedicated route.
  - Indexing (`2026-11-16`): `17` Indexed, `6` Not indexed (`2` healthy apex redirects + `4` `Crawled - currently not indexed`: favicon query URL and all three biorhythm guides `ce-este-bioritmul`, `zile-critice-in-bioritm`, `energia-zilei-cum-sa-o-folosesti`, unrecrawled since `2026-07-06`). Root cause: `app/page.tsx` rendered `guides.slice(0, 3)` (only numerology guides) and biorhythm pages lacked server-rendered links outside `<Suspense>`.
  - AdSense (`pub-8681888147711861`): Gmail revealed the site waited unreviewed since `2026-06-12` due to missing payments info (`2026-11-08` 30-day deactivation notice). Owner completed Payments on `2026-11-19`; deactivation banner cleared, status `Getting ready`, `Auto ads` `Off`, manual ad units unlocked (`0` created).
  - Infrastructure & legal: Cloudflare manages DNS-only (`strict` SSL, `0` Workers/Pages); Vercel Hobby serves production (`fra1`), which prohibits commercial ads/checkouts under ToS. Owner has no PFA/SRL (`persoană fizică`), and `My Billing Account` (`01637F-04BA52-076921`) holds `$370.00` untouched GCP credits (`$300` Free Credit expiring `2027-01-08` + `$70` monthly Google Developer Program grants).
- Decision:
  - Keep `spirithub.ro` Romanian utility focus and preserve proven metadata/H1s on `/`, `/bioritm`, and `/numerologie/compatibilitate`.
  - Keep `Auto ads` OFF in AdSense; plan 2 manual Responsive Display units (`result-inline` and `content-footer`) activated ONLY after Google approval AND Sprint 2 migration off Vercel Hobby to Cloud Run (`europe-west1`) + Cloudflare CDN.
  - Defer direct recurring digital-report sales until traffic supports a PFA/SRL; prioritize traffic growth, AdSense (`Individual`), and 2Performant (`Persoană Fizică`) Romanian affiliate placements.
  - Ship `/bioritm/compatibilitate`, expose all 6 guides on `/`, add server-rendered guide links across biorhythm routes, deepen the unindexed biorhythm guides, fix sitemap `lastModified` honesty, and clean broken grammar/medical claims/AI filler across all interpretation datasets and UI copy.
- Change made:
  - Added deterministic domain module `lib/biorhythm-compatibility.ts` and static route `/bioritm/compatibilitate` (`app/bioritm/compatibilitate/page.tsx` + `client.tsx`) plus `.compat-progress` CSS in `app/globals.css`.
  - Updated `app/page.tsx` (`guides` instead of `guides.slice(0, 3)`), `app/bioritm/page.tsx`, `app/bioritm/critice/page.tsx`, `app/bioritm/energia-zilei/page.tsx`, `app/numerologie/compatibilitate/page.tsx`, `data/guides.ts`, and `app/sitemap.ts`.
  - Cleaned Romanian prose, fixed `life-path.json` `"Cifra Destinului"` subtitle mismatch, removed the `"statistic mai mare"` medical claim in `biorhythm.json`, and stripped `✨`/`🌌` slop across 5 JSON files and 11 TSX files, backed by 3 new test suites (`tests/biorhythm-compatibility.test.ts`, `tests/biorhythm-guides-indexing.test.ts`, `tests/content-quality.test.ts`).
- Expected result: Capture the `281`-impression biorhythm compatibility cluster, get all 3 biorhythm guides indexed on next Google crawl, and improve AdSense review trust/quality.
- Review date: 2026-12-03 (after Cloud Run migration and Search Console re-indexing).
- Outcome: Verified locally (`bun test`, `bun run typecheck`, `bun run lint`, `bun run build`) and pushed to `main` on 2026-11-19.

## 2026-11-19 - Deploy SpiritHub backend to Google Cloud Run (europe-west1)

- Evidence:
  - Creating `spirithub-ro` hit the 9-project quota limit (`0` projects in `DELETE_REQUESTED`), and deleted projects still count toward quota for 30 days.
  - Cloud Billing Credits audit (`01637F-04BA52-076921`) confirmed `$370.00 USD` (`100%` remaining across `$300.00` GCP Free Credit expiring `2027-01-08` and `7 × $10.00` monthly Google Developer Program AI Pro credits expiring `2027-01-27` to `2027-10-27`); no unclaimed November credit is present yet on `developers.google.com/program/my-benefits` (next expected ~`2026-11-27`).
- Decision:
  - Repurpose unused project `gen-lang-client-0488321484` as `SpiritHub` so Cloud Run launches immediately with `$0` out-of-pocket cost, clean up the 7 unused old projects (keeping `perceptive-plexus-w6m9v` untouched), and verify `.run.app` thoroughly before modifying production Cloudflare DNS.
- Change made:
  - Renamed `gen-lang-client-0488321484` to `SpiritHub`, linked `01637F-04BA52-076921`, enabled Cloud Run / Cloud Build / Artifact Registry / Billing Budgets APIs, and created `$5` monthly gross-spend budget alert `0b3b87d6-f564-44c6-a090-e87c466ed992`.
  - Deleted 7 old projects (`gen-lang-client-0260820914`, `newsletter-476708`, `vorbe-vechi`, `multiversxpert`, `ai-chronicle`, `gen-lang-client-0213823510`, `acm-romania`).
  - Added `.gcloudignore`, deployed `spirithub-web` (`revision spirithub-web-00001-ng9`) in `europe-west1` (`cpu=1`, `memory=512Mi`, `min=0`, `max=2`), and enabled live Artifact Registry cleanup (`keepCount=2`, `olderThan=1d`, dry-run disabled).
- Expected result: Run SpiritHub on commercial-friendly serverless infrastructure inside Cloud Run Always Free + GCP/Developer Program credits, ready for AdSense activation after domain mapping.
- Review date: 2026-11-26 (after custom domain mapping + Cloudflare cutover and Search Console recrawl).
- Outcome: Live service verified HTTP `200` on `https://spirithub-web-ag2sqjyu4q-ew.a.run.app` across `/`, `/bioritm/compatibilitate`, `/ads.txt`, `/api/health`, and `/api/og/calea-vietii/3` (`177207` PNG bytes) with Vercel analytics disabled.
- Cutover COMPLETE (`2026-11-19`): Created `$0` Cloud Run Domain Mappings for `www.spirithub.ro` and `spirithub.ro`, updated Cloudflare DNS (`CNAME ghs.googlehosted.com` + 4 `A` + 4 `AAAA`, rollback values `216.198.79.1` and `07cdae1f44a2a3e7.vercel-dns-017.com` documented, TXT records untouched), created edge `301` redirect ruleset `f2946c6556c8477abe9f67cdde4d7fac`, verified managed TLS certs across all Google edge POPs, enabled `proxied: true` (`ttl: 1`) under `strict` SSL, and passed all 7 live production checks (`https://www.spirithub.ro/` `200` with `server: cloudflare`, no `x-vercel-id`, no `_vercel/insights`, `/bioritm/compatibilitate` `200`, `/ads.txt` `200`, `/api/health` `200`, `/api/og/calea-vietii/3` `200` `image/png` `177830` bytes, and apex `301` redirects preserving path + query string).
