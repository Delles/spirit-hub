# Technology Stack – SpiritHub.ro

SpiritHub.ro uses a modern, performant, and mostly serverless stack focused on speed, maintainability, and low operational overhead.

---

## Core Technologies

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19.x
- **Language**: TypeScript 5 (strict mode)
- **Backend / Data**: Convex
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui ("new-york" variant), Radix UI primitives
- **Animations**: Framer Motion
- **Package Manager**: Bun
- **Deployment**: Vercel (primary), Cloudflare (DNS/CDN)
- **Theme**: Dark mode by default (mystical aesthetic)

---

## Backend: Convex

Convex is the primary backend for:

- **Data storage:**
  - Static interpretations (numerology, dream symbols, biorhythm texts).
  - Optional user-related info (anonymous IDs, saved dates).
  - Simple analytics (pageviews, feature usage).

- **Server-side logic:**
  - Queries for dream search.
  - Actions for daily selection (Numarul zilei, Visul zilei).
  - Any future features requiring transactional operations.

### Guidelines:

- Define all tables and indexes in `convex/schema.ts`.
- Keep calculation logic in `@/lib` and call it from Convex functions.
- Use Convex React bindings for data fetching in components.
- Prefer queries for read-only operations, actions for writes or side effects.

---

## Frontend: Next.js + React

### Next.js 16 App Router:

- Used for file-based routing (`app/` directory).
- Server components where appropriate, client components for interactive flows.
- API routes under `app/api/` for OG images and health checks if needed.

### React 19:

- Functional components only.
- Hooks for state and effects.
- Minimal client-side global state; prefer props and hooks.

---

## Styling & UI

### Tailwind CSS v4

- Primary styling mechanism.
- Mobile-first, utility-based.
- Dark theme by default:
  - Colors defined in `app/globals.css` as CSS variables.
  - Tailwind config references these variables where needed.

### shadcn/ui

- Use shadcn/ui components as baseline:
  - Buttons, inputs, dialogs, accordions, etc.
- Style with Tailwind classes according to SpiritHub design.
- Imported under `@/components/ui`.

### Radix UI & Motion

- **Radix UI:**
  - Accessible, unstyled primitives for complex components (dialogs, popovers).

- **Framer Motion:**
  - Subtle animations:
    - Result number "count up".
    - Section fade-ins, modest transitions.
  - Keep animations light to avoid performance issues.

---

## Code Style & Conventions

### Imports & Aliases

- Always use `@/` path aliases for internal modules:
  - `@/components/...`
  - `@/lib/...`
  - `@/config/...`
  - `@/hooks/...`

- Import order:
  1. External packages (React, Next, Convex, shadcn).
  2. Internal components.
  3. Internal utilities and types.

### File Naming

- **Components**: kebab-case `.tsx`
  - `life-path-card.tsx`, `dream-search-input.tsx`

- **Hooks/Utils**: kebab-case `.ts`
  - `use-debounced-value.ts`, `numerology.ts`

- **Pages**: `page.tsx` within Next.js app directory.
- **Folders**: kebab-case.

### TypeScript

- Use TypeScript strictly:
  - No `any` unless absolutely unavoidable (and commented).

- All components must define prop interfaces:

```typescript
export interface LifePathCardProps {
  lifePathNumber: number;
  title: string;
  description: string;
}
```

- Use specific types for domain logic:
  - `type LifePathNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;`
  - Clear types for dream symbol IDs, biorhythm values, etc.

---

## State Management

- Prefer local component state via React hooks.
- Use custom hooks for reusable state patterns (e.g., debounced input).
- No heavy global state library (Redux, Zustand, etc.) unless absolutely required.
- For cross-component data:
  - Use props drilling where manageable.
  - Use context only for truly global concerns (theme, user identity if added later).

---

## Theming & Dark Mode

- Dark mode is default and primary.
- Use `next-themes` if user toggle is added later; otherwise static dark theme.
- Define palette and typography in CSS variables in `globals.css`.
- Ensure sufficient contrast and accessibility for text and UI.

---

## Development & Tooling

### Commands (Bun)

```bash
bun dev           # Start Next.js dev server (localhost:3000, uses package.json "dev" script)

bun run lint      # ESLint (uses "lint" script: bun eslint .)
bun run typecheck # TypeScript type checking (uses "typecheck" script: bun tsc --noEmit)

bun run build     # Production build (uses "build" script: bun next build)
bun start         # Run production server (uses "start" script: bun next start)
```

### shadcn/ui

- Use the shadcn CLI to add new components:

```bash
npx shadcn@latest add <component-name>
```

- Keep customizations minimal and consistent with the "new-york" theme.

---

## Images & OG

- Use `next/image` for remote images when beneficial (avatars, backgrounds).
- Configure `next.config.js` for remote patterns (CDNs, external sources).
- For shareable result images:
  - Use Next.js OG image generation (`app/api/og/route.tsx`).
  - Include key info (tool, result number, short Romanian text).

---

## AI / LLM Usage (Optional)

- The core platform is deterministic (no LLM required).
- If cheap LLMs are used:
  - Use them only for optional, "extra insight" features (not core results).
  - Keep costs low and bounded.
  - Ensure generated text is post-processed for Romanian quality and correctness.
  - Avoid hallucinated factual claims; keep it in the realm of "guidance".
