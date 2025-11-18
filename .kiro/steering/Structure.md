# Project Structure – SpiritHub.ro

This document describes the high-level architecture and folder structure for the SpiritHub.ro codebase.

---

## Top-Level Overview

The app uses Next.js 16 App Router, React 19, Convex for backend/data, Tailwind CSS 4 for styling, and shadcn/ui for UI primitives. The platform is divided into three main feature domains (Numerology, Dreams, Biorhythm) plus shared marketing and blog content.

### Core Directories

- `app/` - Next.js App Router pages & layouts
- `components/` - React components (feature + UI)
- `convex/` - Convex backend (schema, queries, actions)
- `lib/` - Domain logic, utilities, static data
- `config/` - Configuration (site, SEO, feature config)
- `public/` - Static assets
- `hooks/` - Custom React hooks

---

## app/ Directory

Entry point for routes using the App Router.

### Example Structure

```
app/
+-- layout.tsx              # Root layout (theme, fonts, base UI)
+-- page.tsx                # Home page (tool selector + widgets)
+-- globals.css             # Global styles (Tailwind + theme vars)

+-- numerologie/
¦   +-- page.tsx            # Numerology landing/overview
¦   +-- calea-vietii/
¦   ¦   +-- page.tsx        # Life Path calculator
¦   +-- nume-destin/
¦   ¦   +-- page.tsx        # Destiny Name calculator
¦   +-- compatibilitate/
¦   ¦   +-- page.tsx        # Love compatibility calculator
¦   +-- numar-zilnic/
¦       +-- page.tsx        # Daily numerology number

+-- vise/
¦   +-- page.tsx            # Dream dictionary search
¦   +-- visul-zilei/
¦   ¦   +-- page.tsx        # Dream of the day
¦   +-- interpretare/
¦       +-- page.tsx        # Dream combination interpreter

+-- bioritm/
¦   +-- page.tsx            # Biorhythm calculator
¦   +-- critice/
¦       +-- page.tsx        # Critical days view

+-- blog/
¦   +-- page.tsx            # Blog index
¦   +-- [slug]/
¦       +-- page.tsx        # Blog article detail

+-- api/
¦   +-- og/
¦   ¦   +-- route.tsx       # OG image generation for sharing
¦   +-- health/
¦       +-- route.ts        # Simple health check endpoint (optional)
```

**Note:** Additional route groups (e.g., `(marketing)`, `(tools)`) can be introduced if needed for layout separation, but keep structure simple and readable.

---

## components/ Directory

All reusable React components, organized by role.

### Layout & Global Components

```
components/
+-- layout/
¦   +-- main-layout.tsx        # Main page shell (header, footer, content)
¦   +-- header.tsx             # Top navigation with tool links
¦   +-- footer.tsx             # Footer with links, disclaimers
¦   +-- daily-widget.tsx       # Home widget (daily number, dream, biorhythm)

+-- numerologie/
¦   +-- numerology-form.tsx    # Shared form layout for numerology inputs
¦   +-- life-path-card.tsx     # Result card for Life Path
¦   +-- destiny-card.tsx       # Result card for Name Destiny
¦   +-- compatibility-card.tsx # Result card for compatibility
¦   +-- numerology-steps.tsx   # Step-by-step flow wrapper

+-- vise/
¦   +-- dream-search-input.tsx # Search bar with debounced input
¦   +-- dream-result-list.tsx  # List of dream symbols
¦   +-- dream-detail-card.tsx  # Single dream interpretation view
¦   +-- dream-combo-form.tsx   # Form to select multiple symbols

+-- bioritm/
¦   +-- biorhythm-chart.tsx    # Visual graph of cycles
¦   +-- biorhythm-summary.tsx  # Text summary for a given day
¦   +-- critical-days-list.tsx # Upcoming "critical days"

+-- shared/
¦   +-- result-card.tsx        # Generic result card layout
¦   +-- share-button.tsx       # Share result (using OG image)
¦   +-- section-heading.tsx    # Consistent section headings
¦   +-- loading-spinner.tsx    # Loading states
¦   +-- error-message.tsx      # Standardized error display
¦   +-- ad-slot.tsx            # Wrapper for ad placements

+-- ui/
¦   +-- ...                    # shadcn/ui primitives (buttons, inputs, modals, etc.)

+-- kokonutui/
¦   +-- ...                    # Third-party UI components (if used)
```

### Rules:

- Component filenames use kebab-case: `life-path-card.tsx`, not `LifePathCard.tsx`.
- Each component exports a named React component.
- Props must be typed with TypeScript interfaces.

---

## convex/ Directory

Convex backend functionality: schema, queries, and actions.

### Example Structure

```
convex/
+-- schema.ts                # Convex schema (tables: users, interpretations, logs)
+-- numerology.ts            # Convex functions for numerology (queries/actions)
+-- dreams.ts                 # Convex functions for dream symbols/search
+-- biorhythm.ts              # Convex functions for biorhythms
+-- daily.ts                  # Daily rotation, "of the day" content helpers
+-- analytics.ts              # Simple analytics logging (pageviews, usage)
```

### Responsibilities:

- `schema.ts`: tables for static interpretations, daily picks, and optional users/analytics.
- `numerology.ts`: deterministic calculation utilities + queries for interpretations.
- `dreams.ts`: search functions, symbol lookup.
- `biorhythm.ts`: calculation utilities, today's summary & critical days.
- `daily.ts`: utilities used by cron-like processes to select "Numarul zilei" and "Visul zilei".

---

## lib/ Directory

Domain logic and utilities, separate from React.

```
lib/
+-- numerology.ts           # Pure functions for numerology math
+-- biorhythm.ts            # Pure functions for cycles and dates
+-- dreams.ts                # Helpers for symbol slug generation, matching
+-- og.ts                    # Helpers for OG image text/content generation
+-- utils.ts                 # Generic helpers (cn(), formatting)
+-- constants.ts            # Shared constants (e.g., cycle lengths, mappings)
```

### Rules:

- No React imports here; keep functions pure.
- Numerology math and biorhythm formulas live here, then are consumed by Convex and components.

---

## config/ Directory

Configuration for site and features.

```
config/
+-- site.ts                 # Site-level config (name, URLs, nav items)
+-- numerology.ts           # Mappings for letter→number, interpretation keys
+-- dreams.ts                # Symbol config, categories, fallback behavior
+-- biorhythm.ts             # Cycle lengths, thresholds for "critical" days
```

---

## hooks/ Directory

Custom React hooks.

```
hooks/
+-- use-debounced-value.ts       # For search inputs (dream symbols)
+-- use-client-only.ts            # Client-side only logic (e.g., localStorage)
+-- use-media-query.ts            # Responsive behavior hooks
+-- use-ads-ready.ts              # Handle when ads can be safely rendered
```

### Rules:

- Hooks must be named `useXxx`.
- Keep them small and focused.

---

## public/ Directory

Static assets consumed by the app.

```
public/
+-- images/
¦   +-- logo-light.svg
¦   +-- logo-dark.svg
¦   +-- numerology-bg.jpg
¦   +-- dreams-bg.jpg
¦   +-- biorhythm-bg.jpg
+-- favicon.ico
```

---

## Page Composition Patterns

### 1. Root Layout (`app/layout.tsx`)

- Provides theme, fonts (e.g., Geist), base styles.
- Wraps everything in MainLayout with header/footer.
- Sets base metadata for SpiritHub.ro.

### 2. Feature Pages

- Compose high-level flows:
  - Inputs (forms) → Results (cards) → Optional CTA/share.
- Use shared components (`result-card`, `share-button`, `ad-slot`).

### 3. Data Flow

- For simple deterministic calculations: call pure functions from `@/lib`.
- For data backed by Convex (symbol DB, static interpretations): call Convex queries using their React bindings.

---

## Routing Conventions

- Use semantic and Romanian route names:
  - `/numerologie/calea-vietii` (not `/numerology/life-path`).
- Dynamic routes: `[slug]` or `[id]` where necessary (e.g., blog posts, dream symbols).
- Avoid overly deep nesting; keep routes understandable.

---

## Styling Approach

- Tailwind CSS v4 utilities in `globals.css` and in components.
- Use `cn()` from `@/lib/utils` for conditional classes.
- Dark mode default with a "mystical" aesthetic:
  - Deep purples/blues, gold highlights.
- Use shadcn/ui components as base building blocks, styled via Tailwind.
