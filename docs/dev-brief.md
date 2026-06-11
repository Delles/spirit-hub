# SpiritHub Dev Brief

This file is the handoff from the Codex App owner lane to the Codex CLI dev lane.

## Active Dev Task

Improve `/numerologie/compatibilitate` for the next Search Console-backed SEO opportunity.

Scope:

- Target the intent `compatibilitate numerologica calculator` and close variants in the page title,
  meta description, H1/intro copy, and useful visible content.
- Keep the page Romanian-native, calm, mobile-first, and tool-focused.
- Make sure the page quickly routes visitors into the compatibility calculator/result flow.
- Add or adjust FAQ schema only if the visible page copy genuinely answers the questions.
- Do not add a paid product, account flow, newsletter, or broad redesign.

Evidence:

- `docs/search-console-review-2026-06-11.md` shows `/numerologie/compatibilitate` has 40
  impressions, average position 8.12, and 0 clicks.
- The same review recommends improving this page's title/meta after the biorhythm work.

Checks:

- Run `bun run typecheck`, `bun run lint`, and `bun run build` when practical.
- If checks pass and the change is coherent, commit and push to `main`.

## Current Context

- The site is live at `https://www.spirithub.ro`.
- GitHub `main` is the source of truth.
- Vercel builds on push.
- Current business priority: indexing, SEO trust, and traffic growth before paid features.
- Current external blocker: follow-up Search Console export after Google has time to recrawl, plus
  the AdSense review result.
- AdSense owner-call status on 2026-06-11: site ownership is verified and the site review has been requested.
- Publisher/client id: `ca-pub-8681888147711861`.
- Code changed so the root layout AdSense script can render in production without requiring `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT`.

## Latest Owner Decision - 2026-06-11

- Production is healthy: `/`, `/ghiduri`, `/ghiduri/ce-este-calea-vietii-in-numerologie`, and
  `/sitemap.xml` returned `200`.
- Vercel latest production deployment is `READY` on `main`, commit `55369c8499ad68d24551af374f7684890e66260a`.
- Vercel runtime log query returned no production warnings/errors for the last 24 hours.
- No unresolved Vercel Toolbar threads were found.
- The next dev task is CTR/page-quality work on `/numerologie/compatibilitate`.
- Sitemap follow-up: user provided Search Console evidence that `https://www.spirithub.ro/sitemap.xml`
  has status `Success`, was last read on 2026-06-10, and has 10 discovered pages.

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
- Commit hash: pending push.
- Follow-up: monitor Search Console after Google recrawls `/numerologie/compatibilitate`.

## Previous Handoff - 2026-06-11

- Changed `config/monetization.ts` to default to `ca-pub-8681888147711861`.
- Changed `components/monetization/adsense-script.tsx` and `app/layout.tsx` so the AdSense snippet is emitted inside the root layout `<head>`, matching Google's ownership verification instruction.
- Ad slot ids remain disabled until Google approves the site and slot ids are available.
- Checks passed: `bun run typecheck`, `bun run lint`, `bun run build`.
- Build output confirmed the AdSense script appears in generated `<head>` HTML with `ca-pub-8681888147711861`.
- Owner next step: wait for Google AdSense review result; user should provide a screenshot if AdSense approves or reports an issue.
