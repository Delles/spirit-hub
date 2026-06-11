# SpiritHub Management Meeting

Use this agenda for the weekly Codex App automation and for manual owner sessions.

## Inputs

Check these first:

- `docs/operator-manual.md`
- `docs/owner-charter.md`
- `docs/owner-dev-workflow.md`
- `docs/business-roadmap.md`
- `docs/manual-work-queue.md`
- `docs/dev-brief.md`
- new files in `docs/inbox/`
- latest Search Console review in `docs/search-console-review-*.md`
- Vercel deployment or runtime status when tools allow it
- production URLs when a health check is needed

## Agenda

1. Check whether the user's manual tasks were completed.
2. Check whether the last dev task was completed.
3. Review new analytics, Search Console exports, screenshots, or account evidence.
4. Identify the current biggest blocker to traffic or revenue.
5. Decide one user task.
6. Decide one dev task.
7. Update the relevant docs before ending the session.

## Required Output

Every management meeting should produce:

- CEO brief: what changed, what matters, and the current risk.
- User task: exactly one external/manual task for the user when needed.
- Dev task: one concrete task for Codex CLI, written into `docs/dev-brief.md`.
- Evidence needed next: screenshots, CSVs, credentials, URLs, or confirmations.

## Rules

- Do not create multiple competing dev tasks.
- Do not ask the user for vague status. Ask for a specific screenshot, export, setting, or
  confirmation.
- If no analytics are available, improve the highest-priority existing page or unblock Search
  Console.
- If production is broken, production health beats growth work.
- If the work is docs-only, say that no build is required.
