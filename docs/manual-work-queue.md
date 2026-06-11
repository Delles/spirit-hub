# SpiritHub.ro Manual Work Queue

This is the list of things Codex cannot fully do alone from inside the app. The user is the external
operator for accounts, credentials, approvals, and browser-only admin screens.

Update this file whenever a task is completed or a new blocker appears.

---

## Priority 0: Deployment

### Push current repo changes

- Status: in progress
- Owner: Codex
- Why it matters: Vercel is linked to GitHub, so the push should trigger production deployment.
- Success signal: Vercel build succeeds and `https://www.spirithub.ro/ghiduri` returns `200`.

---

## Priority 1: Google Search Console

### Verify `spirithub.ro`

- Status: needed
- Owner: user with Codex guidance
- Why it matters: Search Console is required to see queries, indexing issues, and growth direction.
- Best verification method: DNS TXT record if the domain registrar is accessible.
- Success signal: Search Console property for `https://www.spirithub.ro` or domain property is verified.

### Submit sitemap

- Status: needed after verification
- Owner: user or Codex if connector/browser access is available
- URL: `https://www.spirithub.ro/sitemap.xml`
- Success signal: Search Console accepts the sitemap and discovers the guide URLs.

### Request indexing for core pages

- Status: optional after sitemap submission
- Owner: user with Codex guidance
- URLs:
  - `https://www.spirithub.ro/`
  - `https://www.spirithub.ro/numerologie/calea-vietii`
  - `https://www.spirithub.ro/numerologie/nume-destin`
  - `https://www.spirithub.ro/numerologie/compatibilitate`
  - `https://www.spirithub.ro/bioritm`
  - `https://www.spirithub.ro/ghiduri`

---

## Priority 2: AdSense

### Confirm account status

- Status: waiting on Google review
- Owner: Codex owner, with user account-screen confirmation when needed
- What Codex needs:
  - AdSense review result for `spirithub.ro`.
  - Slot ID for result-page inline ad
  - Slot ID for content-footer ad

Known publisher/client ID:

- `ca-pub-8681888147711861`

### Verify AdSense site ownership

- Status: complete
- Owner: Codex owner, with user account-screen confirmation when needed
- Method: AdSense code snippet.
- Implementation: the app now ships the AdSense script with `ca-pub-8681888147711861` inside the root layout `<head>`.
- Success signal: AdSense verification succeeded and site review was requested.
- Evidence received: screenshot showing `Verify site ownership` complete and `Review requested` at 11 Jun 2026 15:57.

### Wait for AdSense site review result

- Status: waiting
- Owner: Google review, monitored by Codex owner through user account-screen confirmation.
- Expected timing: usually a few days, sometimes 2-4 weeks.
- Success signal: AdSense approves `spirithub.ro`.
- Evidence needed: screenshot of the approval, rejection, or policy issue message.

### Configure Vercel environment variables

- Status: partially unblocked
- Owner: user or Codex if Vercel access is available
- Variables:
- `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` is optional now because the production publisher id is in code.
- `NEXT_PUBLIC_ADSENSE_SLOT_RESULT_INLINE` is still needed after approval.
- `NEXT_PUBLIC_ADSENSE_SLOT_CONTENT_FOOTER` is still needed after approval.
- Success signal: production HTML includes AdSense script and result pages reserve ad slots without
  layout shift.

### GDPR consent decision

- Status: complete in AdSense setup
- Owner: user with Codex guidance
- Decision: use Google's certified CMP with 3 choices: consent, do not consent, and manage options.
- Scope: `spirithub.ro` and future sites.

---

## Priority 3: Analytics Inputs

### Share Vercel Analytics snapshot

- Status: needed after deployment has had time to collect traffic
- Owner: user
- What Codex needs:
  - top pages,
  - referrers,
  - country/device split,
  - traffic over the last 7 and 30 days.

### Share Search Console query snapshot

- Status: needed 7-14 days after sitemap submission
- Owner: user
- What Codex needs:
  - top queries by impressions,
  - pages with impressions but low CTR,
  - indexing errors.

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

- Status: manual export or screenshot still needed
- Owner: user
- Reason: the Vercel plugin can inspect deployments/runtime logs, but it did not expose Web Analytics
  data directly in the 2026-06-11 session.
- Analytics URL: `https://vercel.com/claudiu-marinescus-projects/spirit-hub/analytics`
- What Codex needs when available:
  - top pages,
  - referrers,
  - countries,
  - devices,
  - time range,
  - pageviews/visitors trend.

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

Open these production URLs:

- `https://www.spirithub.ro/`
- `https://www.spirithub.ro/ghiduri`
- `https://www.spirithub.ro/ghiduri/ce-este-calea-vietii-in-numerologie`
- `https://www.spirithub.ro/sitemap.xml`

Check:

- Pages load on mobile.
- Footer has "Ghiduri".
- Homepage has "Ghiduri populare".
- Guide article CTA opens the matching calculator.
- No obvious layout overlap.
