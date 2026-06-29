# SpiritHub.ro Owner / Dev Workflow

This project has two operating lanes.

## 1. Codex App: Owner Console

Use the Codex App for management, strategy, recurring reviews, account-side coordination, and
deciding what should be built next.

Default responsibilities:

- Review business roadmap and manual blockers.
- Review Search Console exports, Vercel Analytics screenshots, production status, and user-provided
  evidence.
- Decide the highest-impact next action.
- Write a clear dev brief for the Codex CLI lane.
- Update project memory in `docs/`.
- Ask the user for external account actions when needed.

Default starting prompt:

```text
SpiritHub owner session. Read docs/operator-manual.md, docs/business-roadmap.md,
docs/manual-work-queue.md, docs/owner-dev-workflow.md, and docs/dev-brief.md. Check what manual
inputs are available in docs/inbox, then decide the next owner action.
```

## 2. Codex CLI in WSL: Dev Team

Use Codex CLI in WSL for focused engineering work.

Default responsibilities:

- Pull latest `main` from GitHub.
- Read `docs/dev-brief.md` and the files it references.
- Implement the requested slice.
- Run checks.
- Commit and push when the change is coherent and the brief allows it.
- Update `docs/dev-brief.md` with outcome, blockers, and follow-up notes.

WSL-only Codex config can live in the WSL clone under `.codex/`. The repository ignores this folder
so local agent profiles, project config, logs, and experiments do not pollute GitHub or the Codex App
workspace. Durable instructions that should travel with the repository should use `AGENTS.md`
instead.

Default starting prompt:

```text
You are the SpiritHub dev team. Read docs/dev-brief.md and complete the active task. Use the existing
project conventions. Run typecheck, lint, and build when practical. Commit and push if checks pass
and the brief says shipping is allowed.
```

Recommended WSL commands before starting:

```bash
cd ~/code/spirit-hub
git pull --ff-only
git status --short
codex
```

## 3. Shared Inbox

The user should place manual inputs in `docs/inbox/`.

Good inputs:

- Search Console CSV exports.
- Vercel Analytics screenshots or exports.
- AdSense approval screenshots and IDs.
- Notes from Google/Vercel/admin screens Codex cannot access directly.
- Product ideas, Romanian copy, screenshots, and competitor examples.

Naming convention:

```text
YYYY-MM-DD-source-topic.ext
```

Examples:

```text
2026-06-11-search-console-queries.csv
2026-06-11-vercel-analytics-top-pages.png
2026-06-11-adsense-status.png
```

## 4. Weekly Management Meeting

The Codex App automation should behave like a token-efficient owner/operator session. Its primary
goal is sustainable traffic and revenue growth, with the user acting as the human extension for
account screens, approvals, credentials, payments, and other real-world actions.

Agenda:

1. Read the operator manual, roadmap, manual queue, workflow, dev brief, and new inbox files.
2. Check whether the user's manual tasks were completed.
3. Review only new Search Console, analytics, AdSense, and SERP evidence that can change a decision.
4. Identify the single largest current traffic or revenue bottleneck.
5. Execute one scoped, high-value action when safe; otherwise write the exact dev brief needed to execute it.
6. Ask the user for at most one external action that Codex cannot perform.
7. Update durable project memory and the relevant work queue or dev brief.

Do not perform routine Vercel dashboard, toolbar-thread, or multi-day log reviews. Use Vercel only
when the run deploys a change, a deployment is reported failed, or production behavior indicates an
incident. After a deployment, use the minimum checks needed to confirm the changed path is healthy.

If a page is inside an SEO measurement window, avoid overlapping edits to that page but continue
work on another query, guide, internal-link cluster, retention loop, or monetization blocker. Waiting
is not the default owner action.

Output format:

- Business result: what was shipped or decided and why it should improve traffic or revenue.
- Scoreboard: only the few metrics that changed the decision.
- User task: zero or one exact external action.
- Next bet: the next non-overlapping action if the current change needs time to measure.

## 5. Repository Location Policy

The Windows Codex App workspace and the WSL Codex CLI clone can both exist.

Source of truth:

- GitHub `main` is the source of truth.
- The Windows workspace is the owner console workspace.
- The WSL clone is the dev workspace.

Rules:

- Before a CLI dev session, run `git pull --ff-only` in WSL.
- After a CLI dev session, commit and push from WSL.
- Before an App owner session that edits docs or code, pull latest changes in the Windows workspace.
- Avoid editing the same files in both workspaces during the same task.
- Keep WSL-only Codex configuration under `.codex/` in the WSL clone or under `~/.codex/`.

Do not move the Codex App workspace into WSL unless the App itself can open WSL paths cleanly. The
two-clone model is safer as long as both lanes sync through GitHub.

## 6. Vercel Build Skip Policy

The repo uses `vercel.json` with `ignoreCommand` so documentation-only commits do not spend a
production build. The command runs `node scripts/vercel-ignore-build.mjs`.

Rules:

- Changes under `docs/`, any `README.md`, or root `AGENTS.md` skip the Vercel build.
- Changes to app code, data, config, package files, scripts, public assets, or Vercel config still
  build.
- The script compares against `VERCEL_GIT_PREVIOUS_SHA` when Vercel provides it, then falls back to
  `HEAD^`.
- Vercel expects exit code `0` to ignore the build and exit code `1` to continue the build.
