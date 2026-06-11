# SpiritHub Dev Checklist

Use this checklist for Codex CLI dev sessions in WSL.

## Before Coding

Run:

```bash
cd ~/code/spirit-hub
git pull --ff-only
git status --short
```

Then read:

- `AGENTS.md`
- `docs/dev-brief.md`
- any files referenced by the active task

If `docs/dev-brief.md` has no active task, stop and ask the Owner team for one.

## During Coding

- Keep the change scoped to the active task.
- Follow existing Next.js and data/config patterns.
- Prefer simple static content and deterministic calculations.
- Keep Romanian copy clear and useful.
- Add internal links from guides to the matching calculators when relevant.
- Avoid new dependencies unless the task clearly requires one.

## Before Push

Run when practical:

```bash
bun run typecheck
bun run lint
bun run build
```

For UI changes, inspect the affected page locally or ask the Owner team for visual QA if browser
automation is unavailable.

## Commit And Push

Commit only coherent work.

Use concise commit messages, for example:

```text
Improve biorhythm guide internal links
Add Search Console driven guide page
Fix mobile layout on calculator results
```

Push after checks pass unless the owner brief says to hold.

## After Push

Update `docs/dev-brief.md` with:

- what changed,
- checks run,
- commit hash if known,
- production or deployment follow-up,
- blockers or recommendations.
