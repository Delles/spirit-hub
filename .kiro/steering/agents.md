# Agent Behavior Guidelines – SpiritHub.ro

These guidelines define how AI agents should behave when working on the SpiritHub.ro codebase.

SpiritHub.ro is a Romanian spiritual platform (numerology, dream interpretation, biorhythm). The UX is in Romanian, but development and these docs are in English.

---

## Core Principles

### 1. Understand Before Acting

Always gather sufficient context before making any change.

- Read relevant files (pages, components, Convex functions, lib utilities).
- Understand the feature from a user's perspective (numerology/dream/biorhythm flows).
- Respect the spiritual, non-sensational tone of the product.

### 2. Plan Before Implementing

Never jump directly into coding.

- Create a clear, written plan before implementation.
- Keep the scope tightly aligned with the user's request.
- Identify dependencies (Convex schema, shared components, routing).

### 3. Clean and Document

Code should be self-explanatory and easy to maintain.

- Prefer meaningful names over excessive comments.
- Add comments only where logic is non-obvious (e.g., numerology math, biorhythm formulas).
- Ensure no debug or leftover code remains.

### 4. Respect Project Structure and Conventions

- Follow the established folder structure (see structure.md).
- Use kebab-case for component filenames.
- Always use `@/` path aliases for imports.
- Keep UI text in Romanian; internal code and docs in English.

### 5. No Unnecessary Markdown Files

- Do not create new markdown documentation files unless explicitly requested.
- The main documentation lives in: agents.md, product.md, structure.md, tech.md.
- Use code comments, TypeScript types, and clear naming as primary documentation.

### 6. Optimize for 99% Autonomy

- Favor deterministic logic and static content where possible.
- Avoid adding features that require ongoing manual moderation or data entry.
- Design flows so the platform runs mostly unattended.

---

## Workflow: Before Implementing

When given a task, agents MUST follow this workflow.

### Step 1: Context Gathering

1. Identify which part of the platform the task affects:
   - Numerology (`/numerologie`)
   - Dream Interpretation (`/vise`)
   - Biorhythm (`/bioritm`)
   - Shared components (`/components`)
   - Data/logic (`/lib`, `/convex`)

2. Read through relevant files:
   - Pages in `app/` related to the feature.
   - Components in `@/components` used by those pages.
   - Convex functions & schema in `convex/`.
   - Utilities in `@/lib` (e.g., numerology math, biorhythm calculations).

3. Check configuration:
   - `@/config/site.ts` (site-level config, SEO, navigation).
   - Any feature-specific config (e.g., numerology mappings, dream symbol config).
   - `docs/design.json` (design system - colors, typography, spacing, components) - **ALWAYS check this when building or modifying UI**.

4. Continue context gathering until you can explain:
   - How the feature works today.
   - What needs to change.
   - How it fits into the broader UX.

### Step 2: Planning Phase

**Do not start implementing yet.**

1. Write a clear, concise plan:
   - What will be added/changed.
   - Which files will be touched or created.
   - Any Convex schema updates, and how data flows through the system.

2. Break the work into steps:
   - UI changes (components/pages).
   - Backend changes (Convex queries/actions, cron jobs).
   - Data/model changes (types, interfaces, static content).

3. Validate scope:
   - Ensure plan aligns exactly with the user's request.
   - Do not introduce extra features, routes, or refactors unless requested.

4. Present the plan clearly to the user before proceeding.

**Example (for a new numerology feature):**

> I'll help you add a "Personal Year Number" calculator under `/numerologie`.
>
> **Plan:**
>
> 1. Add Convex utility for personal year calculation.
> 2. Create `app/numerologie/personal-year/page.tsx` with the calculator UI.
> 3. Add result card using existing result-card component.
> 4. Wire up the calculation on form submit; ensure all UI is in Romanian.
> 5. Add navigation link in the numerology landing page.
> 6. Test the flow on mobile and desktop.
>
> Wait for the user to respond with "Implement" (or similar explicit approval) before writing code.

---

## Workflow: Implementation

Once the plan is approved:

### 1. Follow the Plan

- Implement changes step by step.
- If you must deviate, explain why and adjust the plan.

### 2. Respect Conventions

- Use TypeScript with strict types.
- Use `cn()` from `@/lib/utils` for conditional classes.
- Use shadcn/ui and Tailwind v4 for styling.
- **Before building any UI component, check `docs/design.json`** for colors, typography, spacing, component styles, and design principles to ensure consistency.

### 3. UI in Romanian Only

- All visible user-facing text (labels, headings, errors) must be in Romanian.
- Internal code (variables, functions, comments) should be in English.

### 4. Backend Using Convex

- Use Convex queries/actions for data needs and logic that should run server-side.
- Keep numerology & biorhythm calculations deterministic and transparent.
- For static content (interpretations), use Convex tables or static JSON in `@/lib`.

### 5. Testing

- Manually test the flow in the browser when possible.
- At minimum: happy path, invalid input, mobile layout.

---

## Workflow: After Implementation

After finishing implementation, agents MUST perform cleanup and lightweight documentation.

### Cleanup Phase

#### 1. Remove Bloat

- Remove all console logs and temporary debugging code.
- Remove unused imports, variables, and components.
- Remove scratch helpers created only for development.

#### 2. Self-Documenting Code

- Ensure function and component names clearly express intent.
- Add inline comments only for:
  - Non-obvious algorithms (e.g., numerology reduction logic).
  - Mathematical formulas (biorhythm cycles).
- Use TypeScript interfaces and types to describe data structures.

#### 3. No Extra Markdown

- Do not create additional markdown files like `implementation-notes.md`, `design.md`, etc., unless the user explicitly asks for them.

#### 4. Code Quality Check

- Verify imports use `@/` aliases (except within same folder).
- Confirm file naming: kebab-case for components, proper folders.
- Ensure Tailwind classes are consistent and minimal.
- Confirm dark mode looks good (SpiritHub is dark/"mystical" by default).

---

## System Prompts for Agents

### Planning Prompt (Before Implementing)

When a task is assigned, use this mindset:

> My goal is to complete the task described by the user.
>
> I will first read through the relevant files in the SpiritHub.ro codebase until I have enough context to write a good plan.
>
> Then I will present a clear, focused plan that stays within scope.
>
> I will not implement code until the user explicitly tells me to "Implement".

### Cleanup and Documentation Prompt (After Implementing)

After implementation, apply this mindset:

> I will clean up the code I worked on, remove any debug or temporary bloat, and ensure the logic is self-explanatory.
>
> I will rely on clear naming and TypeScript types for documentation, with comments only where truly necessary.
>
> I will not create extra markdown files; the code itself should be sufficient documentation.

---

## Important Reminders

- **Always plan first** – No coding without a plan.
- **Code is documentation** – Make it readable and obvious.
- **Respect UX & Tone** – Spiritual, respectful, non-sensational.
- **Romanian UI only** – All user-facing text must be Romanian.
- **Check design.json** – Always reference `docs/design.json` when building or modifying UI components.
- **No surprise scope** – Don't add features not requested.
- **Favor autonomy** – Prefer static/deterministic flows over manual maintenance.

