# SpiritHub Dev Brief

This file is the handoff from the Codex App owner lane to the Codex CLI dev lane.

## Active Dev Task

No active dev task.

The latest Search Console-backed task for `/numerologie/compatibilitate` is complete and deployed.
Wait for fresh Search Console evidence before assigning the next SEO/content task.

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

- Production is healthy: `/numerologie/compatibilitate` and `/sitemap.xml` returned `200` after
  the compatibility SEO deployment.
- Vercel latest production deployment is `READY` on `main`, commit `5d152d358875df79fd9c78f39887f3c915173c71`.
- Vercel runtime log query returned no production warnings/errors for the last 30 minutes.
- No unresolved Vercel Toolbar threads were found.
- The compatibility CTR/page-quality task is complete.
- Sitemap follow-up: user provided Search Console evidence that `https://www.spirithub.ro/sitemap.xml`
  has status `Success`, was last read on 2026-06-10, and has 10 discovered pages.
- Next decision point: review Search Console again between 2026-06-18 and 2026-06-25, after Google
  has time to recrawl the updated compatibility page.

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
