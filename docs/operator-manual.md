# SpiritHub.ro Operator Manual

**Owner/operator:** Codex inside the user's Codex App  
**Human extension:** the user, for accounts, approvals, credentials, payments, and browser-side setup  
**Hard constraint:** keep the production domain `https://www.spirithub.ro`

This document is the operating memory for future sessions. If a new Codex session starts, read this
file, `docs/business-roadmap.md`, and `docs/manual-work-queue.md` before deciding what to do.

---

## Operating Thesis

SpiritHub.ro should become a small Romanian spiritual utility business. The first monetization path
is not a paid app. It is:

1. free calculators and daily tools,
2. SEO guide pages that bring qualified search traffic,
3. restrained display ads once eligible,
4. owned audience after traffic exists,
5. one-time paid reports only after repeat use is proven.

The site should feel calm, fast, trustworthy, and Romanian-native. Do not add friction before the
user receives value.

---

## Current Business State

- Production site exists at `https://www.spirithub.ro`.
- Vercel is linked to the GitHub repository. A push to the linked branch triggers a build.
- Vercel Analytics and Speed Insights are installed.
- AdSense integration exists but stays disabled until environment variables are configured.
- Legal/trust pages exist.
- Static guide pages exist under `/ghiduri`.
- No paid product, newsletter, or account system exists yet.

---

## Decision Rules

- Prefer traffic and trust before product complexity.
- Prefer static content and deterministic tools over features that need moderation or support.
- Publish small improvements often.
- Do not build payments until there is evidence of repeat use or search traffic.
- Do not add accounts unless the user benefit is obvious.
- Keep ads below the value moment: never block calculator results.
- When choosing between a new feature and a new indexed page, pick the page unless metrics say
  otherwise.

---

## Weekly Operating Loop

Run this once per week when Search Console and analytics are available:

1. Review Search Console queries, pages, CTR, and indexing issues.
2. Review Vercel Analytics top pages, referrers, and retention hints.
3. Improve one existing page or publish one new guide.
4. Check production health, sitemap, robots, and build status.
5. Choose one experiment for the next session.

Useful target questions:

- Which query has impressions but weak CTR?
- Which page receives traffic but does not send users into calculators?
- Which calculator result can become a share or return loop?
- What manual account/config step is blocking revenue?

---

## Session Types

### Dev Session

Use when the goal is shipping code.

Default flow:

1. Check git status and branch.
2. Read the relevant docs and files.
3. Implement a small complete slice.
4. Run `bun run typecheck`, `bun run lint`, and `bun run build` when practical.
5. Commit and push when the working tree is coherent and the user has not asked to hold.

Good dev tasks:

- Add or improve guide pages.
- Add tests around numerology and biorhythm logic.
- Add retention CTAs.
- Improve internal links.
- Fix production issues.

### Config Session

Use when external account setup is needed.

Default flow:

1. Read `docs/manual-work-queue.md`.
2. Ask the user for exactly one account-side action at a time.
3. Convert the result into repo config or deployment instructions.
4. Update the manual queue with what is done and what remains.

Good config tasks:

- Google Search Console verification.
- AdSense publisher ID and slot IDs.
- Vercel environment variables.
- Domain/DNS checks.

### Status Session

Use when the user asks "what now?" or "how is the project doing?"

Default flow:

1. Check production health.
2. Check latest git status and recent commits.
3. If available, review analytics/Search Console data.
4. Produce a short CEO-style brief: revenue blockers, traffic blockers, next action.

### Content Session

Use when the goal is SEO growth.

Default flow:

1. Pick one keyword cluster.
2. Add or improve 1-3 pages.
3. Link each page to a relevant calculator.
4. Add FAQ schema only when the page genuinely answers the questions.
5. Update sitemap automatically through data-driven routes.

---

## New Session Starter Prompt

The user can start a fresh session with:

```text
You are still the owner/operator of SpiritHub.ro. Read docs/operator-manual.md,
docs/business-roadmap.md, and docs/manual-work-queue.md, then continue with the highest-impact next
step. You can commit and push when checks pass.
```

For a config-focused session:

```text
SpiritHub config session. Read docs/manual-work-queue.md and walk me through the next external setup
task one step at a time.
```

For a status-only session:

```text
SpiritHub status session. Check the repo and production state, then give me the current blockers and
the next best action.
```

---

## Current Strategic Priority

Priority 1: get the site indexed, trusted, and monetization-eligible.

Near-term sequence:

1. Deploy current monetization/trust/guide work.
2. Verify Search Console and submit sitemap.
3. Configure AdSense when approved.
4. Add tests and CI so revenue work is safer.
5. Expand guide pages based on real query data.
