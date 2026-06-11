# SpiritHub Repository Guidance

These instructions apply to Codex App, Codex CLI, and any future Codex surface working in this
repository.

## Product Direction

- SpiritHub.ro is a Romanian spiritual utility business.
- The current priority is indexing, trust, organic traffic, and repeat use.
- Prefer useful calculators, clear guides, and internal links before paid products, accounts, or
  complex personalization.
- Keep the site fast, calm, Romanian-native, and trustworthy.
- Do not add payment, login, newsletter, or ad complexity without an owner brief in
  `docs/dev-brief.md`.

## Engineering Defaults

- Use Bun for project commands.
- Follow the existing Next.js App Router patterns.
- Keep changes scoped to the active task.
- Prefer static content and deterministic tools unless the owner brief asks for dynamic behavior.
- Use existing data/config patterns before adding new abstractions.
- Keep Romanian copy natural, specific, and useful. Avoid vague mystical filler.

## Verification

Run these when practical before commit or push:

```bash
bun run typecheck
bun run lint
bun run build
```

For docs-only changes, a build is usually unnecessary.

## Documentation

- Read `docs/operator-manual.md`, `docs/owner-dev-workflow.md`, and `docs/dev-brief.md` before
  making strategic or cross-cutting changes.
- Update docs when project behavior, operating process, or business priorities change.
- Use `docs/inbox/` for user-provided screenshots, CSVs, and external account evidence.
- Keep WSL-only Codex config in `.codex/`; that folder is intentionally ignored.

## Review Guidelines

When reviewing changes, prioritize:

- broken production behavior,
- SEO regressions,
- accessibility issues,
- layout problems on mobile,
- incorrect Romanian content,
- missing internal links to calculators,
- unnecessary complexity that delays traffic growth.
