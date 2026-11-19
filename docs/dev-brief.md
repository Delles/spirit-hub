# SpiritHub Dev Brief

This file is the handoff from the Codex App owner lane to the Codex CLI dev lane.

## Active Dev Task

Sprint 2 Part 3 (Domain Mapping & Cutover) is partially complete (`2026-11-19` — DNS & redirect rule switched, awaiting Google Cloud Run managed TLS certificate issuance before turning on Cloudflare proxy):

1. Re-verify direct HTTPS (`HTTP 200` without `-k`) on `www.spirithub.ro` (`ghs.googlehosted.com`) and `spirithub.ro` (`216.239.32.21`) once Google finishes provisioning the managed TLS certs (`~15–25 min` window).
2. Flip `proxied: true` (`ttl: 1`) on `CNAME www.spirithub.ro` (`a6daf07ce70665d8b121128a1551cd02`) and all 8 `spirithub.ro` `A`/`AAAA` records under Cloudflare `strict` SSL, then verify all 7 production routes through Cloudflare (`server: cloudflare`, `301` apex redirect, no `x-vercel-id`).
3. Detach `spirithub.ro` and `www.spirithub.ro` from Vercel (`prj_uU5Tf74okiaOW8UYIpwDsfKvr5Wn`).
4. Around `2026-11-26`, re-check Search Console indexing for `/bioritm/compatibilitate` and the 3 biorhythm guides (`ce-este-bioritmul`, `zile-critice-in-bioritm`, `energia-zilei-cum-sa-o-folosesti`) submitted manually on `2026-11-19`.
5. Once AdSense flips to `Ready` on Cloud Run, create the 2 Responsive Display units (`spirithub-result-inline`, `spirithub-content-footer`), pass `NEXT_PUBLIC_ADSENSE_SLOT_*` build args in Cloud Run builds, and integrate 2Performant (`Persoană Fizică`) Romanian affiliate placements on relevant guides/results.

## Latest Handoff - 2026-11-19 (Sprint 2 Part 3 In Progress: DNS Switched, Waiting on Cloud Run TLS)

- Created `$0` Cloud Run custom domain mappings for `www.spirithub.ro` and `spirithub.ro` -> `spirithub-web` (`europe-west1`) via Google Cloud Console.
- Updated Cloudflare DNS (`zone b13d899fa0d5a42855fcdfee97998d6c`, `proxied: false`, `ttl: 300`, rollback values `A 216.198.79.1` and `CNAME 07cdae1f44a2a3e7.vercel-dns-017.com`): `www.spirithub.ro -> ghs.googlehosted.com`, `spirithub.ro -> 216.239.{32,34,36,38}.21` (`A`) and `2001:4860:4802:{32,34,36,38}::15` (`AAAA`), keeping Google verification TXT and `_vercel` TXTs intact. Confirmed visibility on `1.1.1.1` and `8.8.8.8`.
- Created Cloudflare `http_request_dynamic_redirect` ruleset `f2946c6556c8477abe9f67cdde4d7fac` (rule `3d599cc05966454c8a36c9b7d0beb814`) to `301` redirect `spirithub.ro` -> `https://www.spirithub.ro` preserving path and query string once proxy is enabled.
- Verified Cloud Run Domain Mappings UI shows both domains in `Certificate provisioning` (`11 minutes ago`, zero DNS mismatch errors); kept `proxied: false` intentionally to avoid Cloudflare `526` under `strict` SSL until certs validate.

## Latest Handoff - 2026-11-19 (Sprint 2 Part 2: Cloud Run Live on `.run.app`)

- Repurposed existing project `gen-lang-client-0488321484` as `SpiritHub` (fresh project creation hit the 9-project account quota, and GCP retains deleted projects against quota for 30 days) and deleted 7 unused old projects (`gen-lang-client-0260820914`, `newsletter-476708`, `vorbe-vechi`, `multiversxpert`, `ai-chronicle`, `gen-lang-client-0213823510`, `acm-romania`) while leaving `perceptive-plexus-w6m9v` untouched.
- Linked `My Billing Account` (`01637F-04BA52-076921`), enabled `run`, `cloudbuild`, `artifactregistry`, and `billingbudgets` APIs, and created `$5` monthly gross-spend budget alert `0b3b87d6-f564-44c6-a090-e87c466ed992` (`50%` / `100%`, `exclude-all-credits`).
- Checked `developers.google.com/program/my-benefits` and Cloud Billing Credits on `2026-11-19`: `$370.00 USD` (`100%` available across `$300.00` GCP Free Credit + `7 × $10.00` Google Developer Program monthly grants); no unclaimed November credit is present yet (next `$10` expected around `2026-11-27`).
- Added `.gcloudignore` and deployed `spirithub-web` (`revision spirithub-web-00001-ng9`) to Cloud Run `europe-west1` (`port 8080`, `cpu=1`, `memory=512Mi`, `min=0`, `max=2`, `--allow-unauthenticated`).
- Activated Artifact Registry cleanup policy on `cloud-run-source-deploy` (`keepCount=2`, delete `olderThan=1d`, `--no-dry-run`).
- Verified live HTTP `200` on `https://spirithub-web-ag2sqjyu4q-ew.a.run.app` across `/` (`34424` bytes, `hasVercel=False`), `/bioritm/compatibilitate` (`59281` bytes), `/ads.txt` (`pub-8681888147711861`), `/api/health`, and `/api/og/calea-vietii/3` (`image/png`, `177207` bytes). Production DNS still points to Vercel until Domain Mapping + Cloudflare cutover.

## Latest Handoff - 2026-11-19 (Sprint 2 Part 1: Cloud Run Readiness)

- Prepared Cloud Run standalone deployment without changing Vercel's default build path:
  - `next.config.ts`: gated `output: "standalone"` behind `CLOUD_RUN_BUILD === "true"` and prioritized `K_REVISION` for `NEXT_PUBLIC_ASSET_VERSION`.
  - `app/layout.tsx`: gated Vercel `<Analytics />` and `<SpeedInsights />` behind `Boolean(process.env.VERCEL)` so Cloud Run skips `/_vercel/*` requests.
  - Removed `export const runtime = "edge";` from all 6 OG image routes under `app/api/og/*` so they run natively on Node.js.
  - Added multi-stage `Dockerfile` (`oven/bun:1-slim` builder + `node:22-slim` non-root runner on port `8080`), `.dockerignore`, and `tests/cloud-run-readiness.test.ts`.
- Verified `bun test` (`34 pass, 0 fail`), `bun run typecheck`, `bun run lint`, both standalone (`CLOUD_RUN_BUILD=true`) and default `bun run build`, and local HTTP `200` responses from `.next/standalone/server.js` across `/`, `/bioritm/compatibilitate`, `/ads.txt`, `/api/health`, and `/api/og/calea-vietii/3`.
- Search Console live check: `/bioritm/compatibilitate` is not yet indexed (`URL is not on Google`, `N/A`); clicking Request Indexing triggered a Google bot-verification challenge so automated submission stopped cleanly for human completion.

## Latest Handoff - 2026-11-19

- Completed full owner audit across Gmail, Cloudflare (`spirithub.ro` DNS-only on Free plan), ROTLD (`2028-01-07` 2-year registration), Google Cloud Billing (`$370.00` credits on `01637F-04BA52-076921`, `$300` expiring `2027-01-08`), Search Console (`242` clicks / `6,575` impressions in 3 months), and AdSense (`Individual` Payments setup completed, deactivation warning cleared, `Auto ads` `Off`).
- Built `/bioritm/compatibilitate` (`lib/biorhythm-compatibility.ts`, `app/bioritm/compatibilitate/page.tsx` + `client.tsx`, `.compat-progress` CSS in `app/globals.css`) targeting the `281`-impression biorhythm compatibility query cluster.
- Fixed internal linking root cause on `app/page.tsx` (`guides` instead of `guides.slice(0, 3)`) and added server-rendered links outside `<Suspense>` on `/bioritm`, `/bioritm/critice`, `/bioritm/energia-zilei`, and `/numerologie/compatibilitate`; deepened `zile-critice-in-bioritm` and `energia-zilei-cum-sa-o-folosesti` in `data/guides.ts` and updated `app/sitemap.ts`.
- Executed strict Romanian `/unslop` pass across `biorhythm.json`, `life-path.json` (fixed `"Cifra Destinului"` subtitle bug), `compatibility.json`, `energy.json`, `destiny.json`, `app/despre/page.tsx`, and 10 calculator/card UI files; removed the `"statistic mai mare"` medical claim in `biorhythm.json`.
- Added `tests/biorhythm-compatibility.test.ts`, `tests/biorhythm-guides-indexing.test.ts`, and `tests/content-quality.test.ts`.
- Verified with `bun test`, `bun run typecheck`, `bun run lint`, and `bun run build`, committed on `main`, and pushed to `origin/main`.

## Latest Handoff - 2026-07-20

- Strengthened the existing `Cum se calculează numărul destinului?` guide without changing the
  calculator's metadata, inputs, URL behavior, or result logic.
- Documented the exact letter mapping implemented in `config/numerology.ts`, Romanian diacritics, a
  complete `Ion Popescu` example, master-number reduction, and the symbolic/non-scientific boundary.
- Added a contextual calculator-to-guide card and reciprocal internal linking to the life-path and
  compatibility explanations.
- Added `tests/destiny-guide.test.ts` to protect the methodology and internal-link contract.
- Verification passed: `bun test` (13 tests), `bun run typecheck`, `bun run lint`, and
  `bun run build`. Generated HTML contains the guide methodology and calculator-to-guide link while
  preserving the calculator title, description, canonical, and result behavior.
- Product/evidence commit `68e8c5b5f05fbdddecb4120695d4f56f7e9e2117` was pushed to `main`.
  Vercel deployment `dpl_7UoBEYmYjrJ8ppXgHUtNvYxQBsin` reached `READY`; both changed production
  paths returned `200` with the expected link, example, and interpretation boundary.

## Latest Handoff - 2026-07-13

- Implemented the approved architecture deepening review across biorhythm, daily content/date
  handling, numerology results, and OG image generation.
- Added deep domain seams in `lib/biorhythm-report.ts`, `lib/bucharest-calendar.ts`,
  `lib/daily-content.ts`, `lib/numerology-results.ts`, and `lib/og-composition.ts` plus the
  `components/og` frame and content adapters.
- Migrated biorhythm routes and presentation modules, daily pages/providers, numerology calculator
  clients, and all six OG routes to those seams without changing SEO copy or route ownership.
- Added public-interface tests in `tests/architecture-seams.test.ts`.
- Verification passed: `bun test`, `bun run typecheck`, `bun run lint`, and `bun run build`.

The owner explicitly overrode the prior `/bioritm` no-edit window after supplying fresh manual SERP
screenshots. The biorhythm page-ownership experiment is complete in the owner lane: the
homepage no longer targets biorhythm calculator intent, while `/bioritm` owns the exact search phrase
and the seven-day graph benefit. Do not make another overlapping homepage or `/bioritm` SEO-copy edit
before 2026-07-27 unless a production defect appears. The next non-overlapping candidate remains
`/numerologie/nume-destin` or a local-only repeat-use improvement.

## Current Context

- The site is live at `https://www.spirithub.ro`.
- GitHub `main` is the source of truth.
- Vercel builds on app-affecting pushes; documentation-only commits are skipped by the repo-level
  Vercel `ignoreCommand`.
- Current business priority: indexing, SEO trust, and traffic growth before paid features.
- Current external blocker: follow-up Search Console export after Google has time to recrawl, plus
  the AdSense review result.
- AdSense owner-call status on 2026-06-11: site ownership is verified and the site review has been requested.
- Publisher/client id: `ca-pub-8681888147711861`.
- Code changed so the root layout AdSense script can render in production without requiring `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT`.

## Latest Owner Decision - 2026-06-11

- `docs/inbox` contains the Vercel Analytics CSV exports already summarized in
  `docs/vercel-analytics-review-2026-06-11.md`; no newer unreviewed manual input was found.
- Production remains healthy: direct production HTML checks confirmed the public
  `/numerologie/compatibilitate` page has the updated calculator-focused copy, FAQ schema, metadata,
  and AdSense ownership script.
- Latest Vercel production deployment is `READY` on `main`, commit
  `7f7a11fb4a241d8ed00c42d40385df04052f869a` (`Skip Vercel builds for docs-only changes`).
- Vercel runtime log query returned no production warnings/errors/fatal logs for the last hour.
- No unresolved Vercel Toolbar threads were found.
- Browser-based visual QA is still blocked in the Windows Codex App by the known
  `CreateProcessAsUserW failed: 5` issue, so the user's manual content/UI audit remains useful.
- The compatibility CTR/page-quality task is complete.
- Sitemap follow-up: user provided Search Console evidence that `https://www.spirithub.ro/sitemap.xml`
  has status `Success`, was last read on 2026-06-10, and has 10 discovered pages.
- Vercel Analytics baseline was added in `docs/vercel-analytics-review-2026-06-11.md`: the stronger
  30-day export shows 85 visitors, 345 total page views/events, homepage and `/bioritm` leading,
  daily/numerology tools active, Romania dominant, and Google already meaningful as a referrer.
- Next owner action: wait for the Google AdSense review result and capture a screenshot of approval,
  rejection, or policy issues in `docs/inbox` as a dated `adsense-status` file.
- Manual QA action: user should double check the live UI/content on the homepage, `/bioritm`,
  `/numerologie/compatibilitate`, `/ghiduri`, and one guide page, especially on mobile.
- Next SEO decision point: review Search Console again between 2026-06-18 and 2026-06-25, after
  Google has time to recrawl the updated compatibility page.

## Default Dev Checks

Run when practical before commit/push:

```bash
bun run typecheck
bun run lint
bun run build
```

## Handoff Notes

When a dev task is completed, update this section with:

- what changed,
- checks run,
- commit hash if pushed,
- blockers or follow-up recommendations.

## Latest Handoff - 2026-06-11

- Updated `/numerologie/compatibilitate` metadata to target `compatibilitate numerologica calculator`
  with a calculator-focused title, meta description, OpenGraph metadata, Twitter metadata, and
  canonical URL.
- Updated visible Romanian copy so the H1, intro, and supporting section clearly describe the
  compatibility calculator, required inputs, score, and interpretation.
- Adjusted the compatibility FAQ and FAQ schema to match visible answers about how the calculator
  works, why names and birth dates are needed, and how to read the result.
- Kept the calculator flow prominent; no paid products, accounts, newsletter, or broad redesign
  were added.
- Checks passed: `bun run typecheck`, `bun run lint`, `bun run build`.
- Note: the first sandboxed `bun run build` failed because `next/font` could not fetch Google Fonts;
  rerunning the same build with network access passed.
- Implementation commit: `d2df048c8d2e3ded9560e4e9205bc327bd3c9234`.
- Follow-up: monitor Search Console after Google recrawls `/numerologie/compatibilitate`.

## Previous Handoff - 2026-06-11

- Changed `config/monetization.ts` to default to `ca-pub-8681888147711861`.
- Changed `components/monetization/adsense-script.tsx` and `app/layout.tsx` so the AdSense snippet is emitted inside the root layout `<head>`, matching Google's ownership verification instruction.
- Ad slot ids remain disabled until Google approves the site and slot ids are available.
- Checks passed: `bun run typecheck`, `bun run lint`, `bun run build`.
- Build output confirmed the AdSense script appears in generated `<head>` HTML with `ca-pub-8681888147711861`.
- Owner next step: wait for Google AdSense review result; user should provide a screenshot if AdSense approves or reports an issue.
