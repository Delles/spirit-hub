# SpiritHub Dev Brief

This file is the handoff from the Codex App owner lane to the Codex CLI dev lane.

## Active Dev Task

No active dev task yet.

## Current Context

- The site is live at `https://www.spirithub.ro`.
- GitHub `main` is the source of truth.
- Vercel builds on push.
- Current business priority: indexing, SEO trust, and traffic growth before paid features.
- Current external blocker: Google Search Console verification and sitemap submission.
- AdSense owner-call status on 2026-06-11: Google asked to verify `spirithub.ro`; the chosen method is the AdSense code snippet.
- Publisher/client id: `ca-pub-8681888147711861`.
- Code changed so the root layout AdSense script can render in production without requiring `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT`.

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

- Changed `config/monetization.ts` to default to `ca-pub-8681888147711861`.
- Changed `components/monetization/adsense-script.tsx` and `app/layout.tsx` so the AdSense snippet is emitted inside the root layout `<head>`, matching Google's ownership verification instruction.
- Ad slot ids remain disabled until Google approves the site and slot ids are available.
- Checks passed: `bun run typecheck`, `bun run lint`, `bun run build`.
- Build output confirmed the AdSense script appears in generated `<head>` HTML with `ca-pub-8681888147711861`.
- Owner next step after deployment: in AdSense, tick `I've placed the code`, click `Verify`, then request review.
