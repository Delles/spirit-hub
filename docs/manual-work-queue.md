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

- Status: needed
- Owner: user
- What Codex needs:
  - Is `spirithub.ro` approved in Google AdSense?
  - Publisher/client ID, formatted like `ca-pub-xxxxxxxxxxxxxxxx`
  - Slot ID for result-page inline ad
  - Slot ID for content-footer ad

### Configure Vercel environment variables

- Status: blocked until AdSense values exist
- Owner: user or Codex if Vercel access is available
- Variables:
  - `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT`
  - `NEXT_PUBLIC_ADSENSE_SLOT_RESULT_INLINE`
  - `NEXT_PUBLIC_ADSENSE_SLOT_CONTENT_FOOTER`
- Success signal: production HTML includes AdSense script and result pages reserve ad slots without
  layout shift.

### GDPR consent decision

- Status: needed before personalized ads
- Owner: user with Codex guidance
- Recommendation: start with non-personalized ads if possible, then add a consent management
  platform only when revenue justifies the complexity.

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

### Vercel Plugin

- Status: needed
- Owner: user
- Action: in Codex App plugin marketplace, add the Vercel plugin shown in the screenshot.
- Why it matters: Codex needs direct visibility into deployments, build failures, and possibly
  environment variables.
- Success signal: a future session can discover Vercel tools through `tool_search` and inspect
  SpiritHub deployments without asking the user to open Vercel manually.

### Vercel Deploy Skill

- Status: optional but useful
- Owner: user
- Action: add the "Vercel Deploy" skill if it is separate from the plugin.
- Why it matters: it gives deployment-specific instructions and workflows inside Codex sessions.

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
