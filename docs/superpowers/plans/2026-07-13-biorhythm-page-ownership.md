# Biorhythm Calculator Page Ownership Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/bioritm` the single search-intent owner for biorhythm calculator queries.

**Architecture:** Separate search intent at the metadata and visible-copy layers. Root/homepage
signals retain brand and numerology intent; the calculator page alone owns exact biorhythm
calculator phrasing and its product differentiators.

**Tech Stack:** Next.js App Router metadata, React 19, TypeScript, Bun.

## Global Constraints

- Keep SpiritHub.ro as the umbrella brand.
- Keep the homepage independently indexable for brand, numerology, and daily-guidance intent.
- Do not change calculator behavior, canonicals, payments, accounts, ads, or other verticals.
- Use natural Romanian copy and only benefits already present in the product.

---

### Task 1: Separate Homepage and Calculator Intent

**Files:**

- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/bioritm/page.tsx`
- Modify: `app/bioritm/client.tsx`
- Modify: `docs/growth-log.md`
- Modify: `docs/manual-work-queue.md`

**Interfaces:**

- Consumes: Next.js `Metadata` objects and the existing `BioritmClient` introduction.
- Produces: distinct generated metadata and visible headings for `/` and `/bioritm`.

- [x] **Step 1: Remove global and homepage competition**

Change root fallback metadata to numerology and daily-guidance positioning. Remove the homepage's
dedicated exact-match biorhythm SEO paragraph while preserving its existing calculator navigation.

- [x] **Step 2: Differentiate `/bioritm`**

Set the title to `Calcul Bioritm Personal – Grafic 7 Zile | SpiritHub.ro`. Align description,
Open Graph, Twitter, H1, and introduction around the physical, emotional and intellectual graph,
seven-day outlook, free use, and no-account flow.

- [x] **Step 3: Record the controlled experiment**

Update the growth log with the owner override, evidence, exact changed surfaces, expected result,
and a 2026-07-27 review date. Update the manual queue with the two post-deploy indexing URLs and the
query-filtered Pages export required for measurement.

- [x] **Step 4: Verify**

Run `bun run typecheck`, `bun run lint`, and `bun run build`. Inspect generated HTML to confirm the
homepage contains no exact biorhythm calculator metadata, `/bioritm` contains the new proposition,
both canonicals are correct, and each page has exactly one H1.

- [ ] **Step 5: Commit and deploy**

Stage only the scoped source and operating documents, commit with
`Make biorhythm page own calculator intent`, push `main`, verify the production deployment and both
changed URLs, then record the deployment in a docs-only commit.
