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
