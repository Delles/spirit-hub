# Harness Recommendation - 2026-06-11

This note records the operating decision for SpiritHub.ro after checking the current Codex manual,
the installed plugins, the Windows setup, and the project needs.

---

## Recommendation

Use a **hybrid operating model**:

1. **Codex App on Windows remains the owner console**
   - best for connected plugins,
   - Vercel/GitHub/Gmail/Calendar access,
   - automations,
   - artifacts and docs,
   - project-state conversations,
   - quick commits and deployments.

2. **Add a dedicated Codex CLI lane for heavy engineering**
   - best for subagents,
   - non-interactive `codex exec`,
   - scripted audits,
   - repeatable repo checks,
   - cleaner long-running terminal workflows.

3. **Prefer WSL2 or a remote/devbox environment for that CLI lane**
   - the current Windows native sandbox works for many repo tasks,
   - but it has repeatedly blocked browser and Temp-directory workflows with
     `CreateProcessAsUserW failed: 5`,
   - WSL2 gives a Linux-native sandbox and generally smoother Node/browser/test automation.

Do not abandon the Codex App. It is the best surface for the "business owner" layer. The missing
piece is a stronger engineering lane for larger autonomous work.

---

## Why This Is Better Than App Only

The App is strong at:

- project automations,
- plugins and connected apps,
- Git/Vercel visibility,
- documents and operating memory,
- local/worktree threads,
- human-in-the-loop decisions.

The App is weaker in this setup for:

- authenticated analytics UI access,
- browser automation, due to current sandbox failure,
- large parallel read-heavy research with subagents,
- scripted recurring analyses outside the app automation model.

The CLI is strong at:

- explicit subagent workflows,
- `codex exec` for scripted reports,
- JSON output for machine-readable summaries,
- terminal-first workflows,
- CI-like local checks,
- remote or WSL operation.

---

## What To Set Up Next

### Required

Install WSL2 with Ubuntu and clone the repo under the Linux home directory, not under `/mnt/c`.

Target path:

```text
~/code/spirit-hub
```

Install Codex in WSL:

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

Then log in and verify:

```bash
codex --version
codex mcp --help
```

### Nice To Have

Configure the same useful MCP/connectors where possible:

- GitHub
- Vercel
- browser/Playwright or Chrome DevTools MCP
- OpenAI Docs MCP

The exact WSL plugin parity may differ from the App, so keep the App as the connected-account
console until the CLI lane proves it has equivalent access.

---

## Operating Split

Use **Codex App** for:

- weekly owner review automation,
- Vercel deployment checks,
- runtime log checks,
- Search Console export analysis,
- content roadmap decisions,
- docs, business plan, and task queue updates,
- small fixes and commits.

Use **Codex CLI / WSL** for:

- subagent research,
- codebase-wide reviews,
- SEO/content audits across many files,
- test-suite expansion,
- Playwright/browser QA,
- scripted `codex exec` reports,
- experimental redesign branches.

Use **manual user help** for:

- Vercel Analytics screenshots/export while dashboard data is not exposed through tools,
- Google Search Console exports,
- AdSense account approval and slot IDs,
- any account-side billing, DNS, or consent configuration.

---

## Website Direction

Do not redesign the whole site yet.

Current data says the business wedge is biorhythm search traffic. The site should evolve toward:

- clearer biorhythm-first landing paths,
- more trust and less mystical ambiguity,
- faster mobile scanning,
- stronger internal links from homepage and guides to calculators,
- restrained monetization only after the result moment.

Near-term design/content work should focus on:

1. `/bioritm` conversion and CTR.
2. `/numerologie/compatibilitate` CTR and page clarity.
3. Homepage routing to the winning biorhythm and calculator flows.
4. A calmer, more utility-like look if analytics shows users bounce before using tools.

A full visual redesign is not justified until we have Vercel Analytics and Search Console follow-up
data after the latest SEO changes.

---

## Decision

Stay in the Codex App for owner operations, but set up WSL2 + Codex CLI as the serious engineering
execution lane. This gives the project both continuity and power.
