# SpiritHub.ro Manual Work Queue

This is the list of things Codex cannot fully do alone from inside the app. The user is the external
operator for accounts, credentials, approvals, and browser-only admin screens.

Update this file whenever a task is completed or a new blocker appears.

---

## Priority 0: Deployment

### Push current repo changes

- Status: complete
- Owner: Codex
- Why it matters: Vercel is linked to GitHub, so the push should trigger production deployment.
- Success signal: Vercel build succeeds and `https://www.spirithub.ro/ghiduri` returns `200`.
- Evidence: on 2026-06-11, local `main` was clean and up to date with `origin/main`; latest Vercel
  production deployment was `READY`; production checks for `/`, `/ghiduri`, the life-path guide,
  and `/sitemap.xml` returned `200`.
- Evidence update: later on 2026-06-11, the latest Vercel production deployment was still `READY` on
  `main` at commit `7f7a11fb4a241d8ed00c42d40385df04052f869a`; production runtime logs had no
  warnings/errors for the last hour and there were no unresolved Vercel Toolbar threads.

---

## Priority 1: Google Search Console

### Verify `spirithub.ro`

- Status: complete (`sc-domain:spirithub.ro` domain property verified)
- Owner: autonomous / verified 2026-11-19

### Submit sitemap

- Status: complete
- URL: `https://www.spirithub.ro/sitemap.xml`
- Evidence update (`2026-11-19`): Sitemap status `Success`, last read `2026-11-16`, `20` discovered pages (will update to `21` after `/bioritm/compatibilitate` recrawl).

### Request indexing for core and unindexed pages

- Status: initial 4 biorhythm URLs requested manually on `2026-11-19`; around `2026-11-26`, recheck those 4 plus the 2 new Sprint 3 Personal Year URLs (and request indexing for the 2 new URLs if not yet picked up via `sitemap.xml`).
- Evidence (`2026-11-19`): Automated URL Inspection confirmed `https://www.spirithub.ro/bioritm/compatibilitate` was `URL is not on Google` (`N/A` last crawl) before hitting a Google human-verification gate. Owner then manually requested indexing for all 4 URLs in Search Console:
  - `https://www.spirithub.ro/bioritm/compatibilitate` (new route targeting 281+ impressions)
  - `https://www.spirithub.ro/ghiduri/ce-este-bioritmul`
  - `https://www.spirithub.ro/ghiduri/zile-critice-in-bioritm`
  - `https://www.spirithub.ro/ghiduri/energia-zilei-cum-sa-o-folosesti`
- Added in Sprint 3 (`2026-11-19`, included in `sitemap.xml` and internal links):
  - `https://www.spirithub.ro/numerologie/an-personal`
  - `https://www.spirithub.ro/ghiduri/ce-este-anul-personal-in-numerologie`

---

## Priority 2: AdSense

### Confirm payments profile and prevent deactivation

- Status: complete (`2026-11-19`)
- Background: Gmail showed `2026-06-12` notice (`Set up your AdSense payments profile`) that paused site review, followed by a `2026-11-08` 30-day deactivation warning (`2026-12-08`).
- Evidence (`2026-11-19`): Owner completed Payments profile (`Individual`); Home checklist now shows `"We've got your info"`, `"Nice work, you've completed all the steps"`, and the deactivation warning is gone.

### Site approval and ads.txt recognition

- Status: `Getting ready` (site ownership verified, `Ads.txt: Authorized`, Review requested since `Jun 22, 2026 11:58 EEST`; confirmed via AdSense detail screenshot on `2026-11-19` after completing Individual payments profile; owner confirmed Google Pay / Google Wallet status is clear; live `https://www.spirithub.ro/ads.txt` returns `200` and `Mediapartners-Google` receives `200 OK`).
- Publisher ID: `ca-pub-8681888147711861`.
- Code readiness (`2026-11-19`): `/confidentialitate` updated for Google Cloud Run + Cloudflare Web Analytics + AdSense GDPR consent, `<AdSlot slotId={adSlots.contentFooter} />` wired on `/ghiduri/[slug]`, and `Dockerfile` updated to accept `NEXT_PUBLIC_ADSENSE_SLOT_*` build args.
- Optional setup while waiting: publish Google's built-in `European regulations` GDPR consent message in AdSense `Privacy & messaging` pointing to `https://www.spirithub.ro/confidentialitate`.
- Note (`2026-11-19`): 2Performant affiliate integration is postponed per owner preference; focus monetization on AdSense manual slots once `spirithub.ro` flips to `Ready`.

### Ad unit policy & hosting migration dependency

- Policy defined (`2026-11-19`):
  - Keep **Auto ads: Off** (prevents interstitials/vignettes/layout shifts over calculators).
  - Create **2 manual Responsive Display ad units** once `spirithub.ro` flips to `Ready`:
    1. `spirithub-result-inline` -> `NEXT_PUBLIC_ADSENSE_SLOT_RESULT_INLINE` (below calculator results)
    2. `spirithub-content-footer` -> `NEXT_PUBLIC_ADSENSE_SLOT_CONTENT_FOOTER` (bottom of `/ghiduri/[slug]`)
- **Critical constraint:** Do NOT set live slot IDs while hosted on **Vercel Hobby** (Vercel ToS prohibits commercial/ad monetization on Hobby).
- **Cloud Run backend live (`2026-11-19`):**
  - GCP project `gen-lang-client-0488321484` renamed to `SpiritHub` and linked to `My Billing Account` (`01637F-04BA52-076921`).
  - Credits verified untouched (`$370.00 USD`: `$300.00` Free Credit expiring `2027-01-08` + `7 × $10.00` Google Developer Program monthly grants auto-bound; no unclaimed November credit yet on `2026-11-19`, next expected ~`2026-11-27`).
  - Monthly `$5` gross-spend budget alert created (`0b3b87d6-f564-44c6-a090-e87c466ed992`).
  - Service `spirithub-web` (`europe-west1`, `cpu=1`, `memory=512Mi`, `min=0`, `max=2`) running revision `spirithub-web-00002-p5p` (`100%` traffic, `https://spirithub-web-965560703047.europe-west1.run.app`), with Artifact Registry cleanup (`keepCount=2`, `olderThan=1d`, dry-run disabled).
  - Cloudflare Web Analytics (`site_tag: e6bf2f31ee304ca794bb38487b86b46d`, `token: 7ee095a5f5fa4ea3b476d68fbecc7529`, `auto_install: true`) verified active at `$0` on live HTML responses.
  - **Cloudflare + Cloud Run cutover COMPLETE (`2026-11-19`):**
    - Cloud Run Domain Mappings created (`$0`) for `www.spirithub.ro` and `spirithub.ro` on `spirithub-web` (`europe-west1`).
    - Cloudflare DNS switched from Vercel (`216.198.79.1` / `07cdae1f44a2a3e7.vercel-dns-017.com`) to Cloud Run (`CNAME ghs.googlehosted.com` + 4 `A` + 4 `AAAA`, TXT records preserved), waited for Google Trust Services managed TLS certs across POPs, then enabled Cloudflare proxy (`proxied: true`, `ttl: 1`) under `Full (strict)` SSL.
    - Cloudflare `http_request_dynamic_redirect` ruleset `f2946c6556c8477abe9f67cdde4d7fac` (rule `3d599cc05966454c8a36c9b7d0beb814`) live (`301` `spirithub.ro` -> `https://www.spirithub.ro`, preserving path & query string).
    - Verified live through Cloudflare (`server: cloudflare`, no `x-vercel-id`, no `_vercel/insights`): `https://www.spirithub.ro/` (`200`, `34296` bytes), `/bioritm/compatibilitate` (`200`), `/ads.txt` (`200`), `/api/health` (`200`), `/api/og/calea-vietii/3` (`200`, `image/png`, `177830` bytes), `https://spirithub.ro/` (`301`), and `https://spirithub.ro/bioritm?test=1` (`301`).
    - **Remaining Vercel cleanup:** Custom domains `spirithub.ro` and `www.spirithub.ro` are already detached (`2026-11-19`). Once Cloud Run has run cleanly for a full sprint, disable automatic Vercel Git builds on `prj_uU5Tf74okiaOW8UYIpwDsfKvr5Wn`.

---

## Priority 3: Analytics Inputs

### Share Vercel Analytics snapshot

- Status: current through the export received on 2026-07-20
- Owner: user
- Latest inbox update: a Vercel Analytics top-pages CSV was added on 2026-07-20.
- Latest baseline: `docs/vercel-analytics-review-2026-06-11.md`, based primarily on 30-day Vercel
  CSV exports for 2026-05-12 17:00 to 2026-06-11 17:59.
- What Codex needs:
  - top pages,
  - referrers,
  - country/device split,
  - traffic over the last 7 and 30 days.
- Latest evidence: `docs/inbox/2026-07-20-vercel-analytics-top-pages.csv` covers 2026-07-13 through
  2026-07-20 and is summarized in `docs/growth-log.md`.

### Share Search Console query snapshot

- Status: current through the analyzed export received on 2026-07-20
- Owner: user
- What Codex needs:
  - top queries by impressions,
  - pages with impressions but low CTR,
  - indexing errors.
- Latest evidence: `docs/inbox/2026-07-20-search-console-performance.xlsx`, read through local Excel
  in a follow-up audit and summarized in `docs/growth-log.md`. Fresh owner SERP screenshots for the
  two active biorhythm queries are also stored in `docs/inbox/`.
- Next requested window: after 2026-07-27, export Last 7 days with Queries and Pages. Also filter
  `calcul bioritm` and `bioritm calcul` separately and export each query's Pages tab so we can verify
  that `/bioritm` receives the majority of impressions instead of the homepage.

---

## Priority 4: Optional Access Improvements

These are now important. They would make Codex more autonomous and reduce repeated manual
round-trips.

### WSL2 + Codex CLI Engineering Lane

- Status: configured
- Owner: user
- Reason: the Codex App should remain the owner console, but a WSL2 CLI lane would be better for
  subagents, browser QA, scripted audits, and long-running engineering work.
- Current machine state: Ubuntu WSL is installed, the repo exists under `~/code/spirit-hub`, Codex CLI
  is installed, Node/npm/npx are installed, Bun is installed, and Next telemetry is disabled.
- MCP status: `chrome-devtools` and `openaiDeveloperDocs` are enabled in `codex mcp list`.
- Success signal: a future session can run Codex CLI from the WSL clone and use it as the dev lane.

Recommended CLI startup:

```bash
cd ~/code/spirit-hub
git pull --ff-only
git status --short
codex
```

Use prompt:

```text
You are the SpiritHub dev team. Read docs/dev-brief.md and complete the active task. Use the existing
project conventions. Run typecheck, lint, and build when practical. Commit and push if checks pass
and the brief says shipping is allowed.
```

### Vercel Plugin

- Status: installed
- Owner: user and Codex
- Action: complete.
- Why it matters: Codex needs direct visibility into deployments, build failures, and possibly
  environment variables.
- Success signal: Codex can inspect SpiritHub deployments and production runtime logs through Vercel
  tools.

Known Vercel IDs:

- team id: `team_N8z7T0gEvxQT4wpkn8BHvxJa`
- project id: `prj_uU5Tf74okiaOW8UYIpwDsfKvr5Wn`

### Vercel Deploy Skill

- Status: optional but useful
- Owner: user
- Action: add the "Vercel Deploy" skill if it is separate from the plugin.
- Why it matters: it gives deployment-specific instructions and workflows inside Codex sessions.

### Vercel Analytics

- Status: try plugin permission refresh first; manual CSV export remains the fallback
- Owner: user for Vercel authorization/export, Codex for analysis
- Reason: the Vercel plugin can inspect deployments/runtime logs, and Vercel docs now mark Web
  Analytics as a plugin permission, but the currently exposed Codex App Vercel tools still do not
  include a first-class Web Analytics query/export tool.
- Analytics URL: `https://vercel.com/claudiu-marinescus-projects/spirit-hub/analytics`
- Automation attempt:
  - install or refresh the Vercel plugin with `npx plugins add vercel/vercel-plugin`,
  - approve the Vercel `Web Analytics` permission if prompted,
  - restart or refresh the Codex session and search available Vercel tools for analytics access.
- Fallback input:
  - export CSVs from Vercel Analytics panels where available instead of screenshots,
  - save them in `docs/inbox/` using dated filenames.
- What Codex needs when available:
  - top pages,
  - referrers,
  - countries,
  - devices,
  - time range,
  - pageviews/visitors trend.
- Longer-term option: Vercel Drains can forward Web Analytics events as JSON/NDJSON to an HTTP
  destination for future reporting, but this needs a receiving endpoint/storage setup and does not
  replace historical dashboard exports.

### GitHub

- Status: available enough for local git push if credentials work
- Useful future access: GitHub connector for PR/issues/checks, if a session needs it.

### Vercel

- Status: linked to repository, direct Codex access unknown
- Useful future access:
  - build logs,
  - deployment status,
  - environment variable management.

### Browser Plugin

- Status: browser connection failed once with a Windows sandbox permission error
- Workaround: use local HTTP checks and ask the user for visual QA when needed.
- Future fix: user may need to approve or restart the Codex App/browser integration if visual testing
  is required.

### Codex App Automations

- Status: created
- Owner: Codex
- Recommended cadence: weekly, after enough Search Console data can change meaningfully.
- Purpose: remind the project to review Search Console exports, production health, and next SEO task.
- Current automation id: `spirithub-weekly-owner-review`

---

## Manual QA Checklist After Deployment

Status: useful now because browser-based visual QA is blocked in the Windows Codex App.

Open these production URLs:

- `https://www.spirithub.ro/`
- `https://www.spirithub.ro/ghiduri`
- `https://www.spirithub.ro/ghiduri/ce-este-calea-vietii-in-numerologie`
- `https://www.spirithub.ro/bioritm`
- `https://www.spirithub.ro/numerologie/compatibilitate`
- `https://www.spirithub.ro/sitemap.xml`

Check:

- Pages load on mobile.
- Footer has "Ghiduri".
- Homepage has "Ghiduri populare".
- Guide article CTA opens the matching calculator.
- `/bioritm` presents the calculator before long explanatory content.
- `/numerologie/compatibilitate` clearly asks for two names and birth dates and explains the result as symbolic, not deterministic.
- No obvious layout overlap.
