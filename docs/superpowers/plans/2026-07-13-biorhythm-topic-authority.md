# Biorhythm Topic Authority Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the biorhythm cluster's ranking support with accurate methodology content and
reciprocal internal links while preserving the calculator snippet experiment.

**Architecture:** Extend the existing typed guide data in `data/guides.ts`; the current dynamic guide
route renders the added sections and links without new components or client behavior.

**Tech Stack:** Next.js App Router, TypeScript, Bun.

## Global Constraints

- Keep Romanian copy natural, specific, and non-deterministic.
- Do not change `/bioritm` metadata, H1, primary copy, or calculator behavior.
- Add no dependencies, accounts, payments, newsletters, or ad complexity.

---

### Task 1: Strengthen the Biorhythm Guide Cluster

**Files:**

- Modify: `data/guides.ts`
- Modify: `docs/growth-log.md`

**Interfaces:**

- Consumes: the existing `Guide.sections` and optional `Guide.relatedLinks` data structures.
- Produces: rendered methodology copy and reciprocal guide/calculator links through
  `app/ghiduri/[slug]/page.tsx`.

- [x] **Step 1: Update the methodology guide**

Add a section that explains the 23-, 28-, and 33-day sine cycles and how the calculator turns a
birth date and target date into the three daily values. Set `updatedAt` to `2026-07-13` and adjust
the reading time to reflect the added content.

- [x] **Step 2: Add reciprocal contextual links**

Use the existing `relatedLinks` shape to connect the main biorhythm guide, critical-days guide,
daily-energy guide, and `/bioritm` calculator with natural Romanian descriptions.

- [x] **Step 3: Record the growth experiment**

Add the decision metrics, selected action, non-overlap rule, and 14-day review date to
`docs/growth-log.md`.

- [x] **Step 4: Verify**

Run `bun run typecheck`, `bun run lint`, and `bun run build`. Confirm generated output contains the
new formula explanation and links to `/bioritm`, `/ghiduri/ce-este-bioritmul`, and
`/ghiduri/zile-critice-in-bioritm`.

- [x] **Step 5: Commit**

Stage only the guide data, growth log, current evidence files, and this run's design/plan documents.
Commit with `Strengthen biorhythm topic authority` and push `main` after checks pass.
