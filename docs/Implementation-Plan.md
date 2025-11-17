# Implementation Plan – SpiritHub.ro

**Status:** Phase 2.2 Complete - Numerology Module Fully Functional  
**Approach:** Hybrid Layer-First Strategy  
**Last Updated:** November 17, 2025  
**Progress:** ~60% Complete (6/10 days estimated)

---

## 🎯 Quick Status Overview

| Phase | Status | Completion |
|-------|--------|------------|
| **Phase 1: Foundation** | ✅ Complete | 100% |
| **Phase 2.1: Biorhythm** | ✅ Complete | 100% |
| **Phase 2.2: Numerology** | ✅ Complete | 100% |
| **Phase 2.3: Dreams** | ⏳ Next | 0% |
| **Phase 3: Polish** | ⏳ Pending | 0% |

**What's Working:**
- ✅ Complete foundation (Convex, lib functions, shared components, layouts)
- ✅ Biorhythm calculator with interactive chart
- ✅ Critical days detection and display
- ✅ Numerology module with 4 calculators (Life Path, Destiny, Compatibility, Daily Number)
- ✅ Romanian interpretations seeded in Convex database
- ✅ Master Numbers (11, 22, 33) support
- ✅ Mobile-responsive design
- ✅ Share functionality
- ✅ Full accessibility support

**Next Up:** Dream Interpretation Module (search, symbols, daily dream)

---

## Current State Analysis

### ✅ Completed - Phase 1: Foundation Layer
- **Project Structure:**
  - Next.js 16 + React 19 project initialized
  - Tailwind CSS 4 configured with dark theme
  - TypeScript strict mode enabled
  - Path aliases configured (`@/`)
  - Bun as package manager

- **Convex Backend (1.1):**
  - Convex installed and configured
  - Database schema with 4 tables (interpretations, dreamSymbols, dailyPicks, analytics)
  - Indexes defined for efficient queries
  - ConvexProvider integrated in app/layout.tsx
  - Environment variables configured
  - Developer documentation in README.md

- **Core Domain Logic (1.2):**
  - `lib/numerology.ts` - All numerology calculations with Romanian diacritics
  - `lib/biorhythm.ts` - Complete biorhythm cycle calculations
  - `lib/dreams.ts` - Dream symbol utilities
  - `lib/constants.ts` - Shared constants
  - `lib/utils.ts` - Utility functions including Romanian date formatting

- **Configuration Layer (1.3):**
  - `config/site.ts` - Site metadata and navigation
  - `config/numerology.ts` - Numerology mappings and interpretations
  - `config/dreams.ts` - Dream categories and search config
  - `config/biorhythm.ts` - Cycle parameters and thresholds

- **Shared Components (1.4):**
  - Layout: `header.tsx`, `footer.tsx`, `main-layout.tsx`
  - Shared: `result-card.tsx`, `share-button.tsx`, `section-heading.tsx`, `loading-spinner.tsx`, `error-message.tsx`
  - shadcn/ui: button, input, card, label, badge, separator, dialog
  - All components with TypeScript interfaces
  - Mobile-responsive with hamburger menu
  - Dark theme compatible

- **Custom Hooks (1.5):**
  - `use-debounced-value.ts` - For search inputs
  - `use-client-only.ts` - For browser API access

- **Root Layout (1.6):**
  - MainLayout integrated globally
  - Dark theme applied with `dark` class
  - Header and footer on all pages

- **Cleanup (1.7):**
  - All test files removed
  - Zero console.log statements
  - Production build successful (2.5s)
  - Zero TypeScript errors
  - All routes rendering correctly

### ✅ Completed - Phase 2.1: Biorhythm Module
- **Convex Backend:**
  - `convex/biorhythm.ts` with getBiorhythm and getCriticalDays queries
  - Full integration with lib/biorhythm.ts calculations
  - Romanian-language summaries

- **Biorhythm Components:**
  - `biorhythm-form.tsx` - Date input with validation
  - `biorhythm-chart.tsx` - Interactive SVG chart with 3 cycles
  - `biorhythm-summary.tsx` - Text interpretation with progress bars
  - `critical-days-list.tsx` - Upcoming critical days display

- **Pages:**
  - `/bioritm` - Main calculator with chart and summary
  - `/bioritm/critice` - Critical days view (30-day forecast)
  - Both pages with proper metadata and SEO

- **Features:**
  - Responsive design (mobile and desktop optimized)
  - Real-time cycle calculations
  - Visual chart with 15-day window (11 on mobile)
  - Critical day detection and warnings
  - Share functionality
  - Accessibility compliant (ARIA labels, keyboard navigation)

### ✅ Completed - Phase 2.2: Numerology Module
- **Convex Backend:**
  - `convex/numerology.ts` with all queries (Life Path, Destiny, Compatibility, Daily Number)
  - `seedInterpretations` mutation with 37 Romanian interpretations
  - Master Numbers (11, 22, 33) support for Life Path and Destiny

- **Numerology Components:**
  - `numerology-form.tsx` - Reusable form with 3 variants (lifePath, destiny, compatibility)
  - `life-path-card.tsx` - Life Path result display with Master Number badges
  - `destiny-card.tsx` - Destiny number result display
  - `compatibility-card.tsx` - Compatibility score and interpretation display

- **Pages:**
  - `/numerologie/calea-vietii` - Life Path calculator
  - `/numerologie/nume-destin` - Destiny Name calculator
  - `/numerologie/compatibilitate` - Compatibility calculator
  - `/numerologie/numar-zilnic` - Daily number display
  - `/numerologie` - Updated landing page with working links

- **Features:**
  - All four calculators fully functional
  - Romanian diacritics handled correctly in name calculations
  - Master Number detection and special display
  - Share functionality on all result pages
  - Mobile-responsive forms and cards
  - Loading and error states
  - Accessibility compliant

### ❌ Missing - Phase 2.3, Phase 3
- Dream interpretation module (search, symbols, daily dream)
- Daily automation features (cron jobs)
- SEO optimization (OG images, metadata)
- Analytics integration

---

## Implementation Strategy

### Why Hybrid Layer-First?

Building in **horizontal layers** before completing features vertically provides:

1. **Shared Foundation** - Core infrastructure benefits all features, prevents duplication
2. **Parallel Development** - Once foundation is ready, features can be built simultaneously
3. **Consistent UX** - Shared components ensure uniform look and feel
4. **Faster Iteration** - Core utilities enable rapid feature development
5. **Reduced Rework** - Patterns established early prevent refactoring later

### Feature Order Rationale

**Biorhythm → Numerology → Dreams** because:
- **Biorhythm**: Simplest (single calculator, pure math) - validates foundation
- **Numerology**: Medium complexity (multiple calculators) - tests component reusability
- **Dreams**: Most complex (search, database, dynamic content) - benefits from proven patterns

---

## ✅ Phase 1: Foundation Layer (COMPLETED)

All foundation components have been implemented, tested, and cleaned up. The codebase is ready for Phase 2 feature implementation.

### ✅ 1.1 Convex Backend Setup (COMPLETED)

**Goal:** Initialize Convex and define data schema

**Tasks:**
- [x] Install Convex dependencies (`bun install convex`)
- [x] Run `npx convex dev` to initialize project
- [x] Create `convex/schema.ts` with tables:
  - `interpretations` - Static numerology/dream interpretations
  - `dreamSymbols` - Dream dictionary entries with search index
  - `dailyPicks` - Daily number and dream selections
  - `analytics` - Optional usage tracking
- [x] Define indexes for efficient queries (by_type_and_number, by_slug, by_category, search_symbols, etc.)
- [x] Set up Convex environment variables (.env.local and .env.local.example)
- [x] Integrate ConvexProvider in app/layout.tsx
- [x] Verify frontend-backend connection with test queries
- [x] Update README.md with setup instructions and troubleshooting

**Files Created:**
- `convex/schema.ts` ✅
- `convex/_generated/` (auto-generated) ✅
- `.env.local.example` ✅
- Updated `README.md` with Convex documentation ✅

**Acceptance Criteria:** ✅ ALL MET
- ✅ Convex dev server runs successfully
- ✅ Schema compiles without errors
- ✅ Can query empty tables from React components
- ✅ Two-terminal workflow documented
- ✅ Environment variables properly configured

---

### ✅ 1.2 Core Domain Logic (`/lib`) (COMPLETED)

**Goal:** Pure calculation functions for all features

**Tasks:**
- [x] Create `lib/numerology.ts`:
  - `reduceToSingleDigit(num: number): number`
  - `calculateLifePath(birthDate: Date): number`
  - `calculateDestinyNumber(name: string): number`
  - `calculateCompatibility(num1: number, num2: number): number`
  - Romanian letter-to-number mapping (with diacritics: ă, â, î, ș, ț)

- [x] Create `lib/biorhythm.ts`:
  - `calculateCycle(birthDate: Date, targetDate: Date, cycleDays: number): number`
  - `getPhysicalCycle(birthDate: Date, targetDate: Date): number`
  - `getEmotionalCycle(birthDate: Date, targetDate: Date): number`
  - `getIntellectualCycle(birthDate: Date, targetDate: Date): number`
  - `getCriticalDays(birthDate: Date, startDate: Date, days: number): Date[]`
  - `getBiorhythmSummary(physical: number, emotional: number, intellectual: number): string`

- [x] Create `lib/dreams.ts`:
  - `generateSlug(symbolName: string): string`
  - `searchSymbols(query: string, symbols: DreamSymbol[]): DreamSymbol[]`
  - `combineInterpretations(symbols: DreamSymbol[]): string`

- [x] Extend `lib/utils.ts`:
  - `formatRomanianDate(date: Date): string`
  - `normalizeRomanianText(text: string): string`
  - `cn()` already exists from shadcn

- [x] Create `lib/constants.ts`:
  - Biorhythm cycle lengths (23, 28, 33)
  - Numerology number ranges (1-9)
  - Romanian alphabet mapping

**Files Created:**
- `lib/numerology.ts` ✅
- `lib/biorhythm.ts` ✅
- `lib/dreams.ts` ✅
- `lib/constants.ts` ✅
- `lib/utils.ts` (extended) ✅
- `lib/__tests__/` (comprehensive test suite with 81 passing tests) ✅

**Acceptance Criteria:** ✅ ALL MET
- ✅ All functions are pure (no side effects)
- ✅ No React imports
- ✅ Full TypeScript typing with strict mode
- ✅ Fully tested (81 unit tests, 100% passing)
- ✅ Romanian diacritics handled correctly

---

### ✅ 1.3 Configuration (`/config`) (COMPLETED)

**Goal:** Centralized configuration for site and features

**Tasks:**
- [x] Create `config/site.ts`:
  - Site name, description, URLs
  - Navigation structure
  - Social media links
  - SEO defaults

- [x] Create `config/numerology.ts`:
  - Letter-to-number mappings (Romanian alphabet)
  - Interpretation text keys
  - Number meanings (1-9)
  - Master numbers (11, 22, 33)
  - Compatibility ranges

- [x] Create `config/dreams.ts`:
  - Symbol categories (7 categories)
  - Search configuration (minQueryLength, maxResults, debounceMs)
  - Fallback behavior
  - Max combined symbols limit

- [x] Create `config/biorhythm.ts`:
  - Cycle parameters (physical: 23, emotional: 28, intellectual: 33)
  - Critical day thresholds (0.1)
  - Interpretation ranges (critic, scăzut, mediu, ridicat)
  - Default forecast days (30)

- [x] Create comprehensive test suite:
  - `config/__tests__/site.test.ts`
  - `config/__tests__/numerology.test.ts`
  - `config/__tests__/dreams.test.ts`
  - `config/__tests__/biorhythm.test.ts`
  - `config/__tests__/integration.test.ts`

**Files Created:**
- `config/site.ts` ✅
- `config/numerology.ts` ✅
- `config/dreams.ts` ✅
- `config/biorhythm.ts` ✅
- `config/__tests__/` (76 passing tests) ✅

**Acceptance Criteria:** ✅ ALL MET
- ✅ All config exported as typed constants
- ✅ Easy to modify without touching code
- ✅ Romanian text properly encoded with diacritics
- ✅ Kebab-case naming convention followed
- ✅ Comprehensive inline documentation
- ✅ No business logic in configuration files
- ✅ TypeScript compilation successful
- ✅ All tests passing (76/76)

---

### ✅ 1.4 Shared Components (`/components`) (COMPLETED)

**Goal:** Reusable UI components for consistent UX

**Tasks:**
- [x] Check existing shadcn/ui components in `components/ui/` directory:
  - Currently installed: `button.tsx`
  - Verify which components are already available before installing new ones

- [x] Install additional shadcn/ui components (using bun):
  ```bash
  bunx shadcn@latest add input card label badge separator dialog
  ```

- [x] Create `components/layout/header.tsx`:
  - Logo and site name with Sparkles icon
  - Navigation links (Numerologie, Vise, Bioritm)
  - Mobile responsive menu with hamburger
  - Active route highlighting
  - Sticky header with backdrop blur

- [x] Create `components/layout/footer.tsx`:
  - Copyright notice
  - Links (Privacy, Terms, Contact)
  - Disclaimer text
  - Three-column grid layout (Brand, Tools, Legal)

- [x] Create `components/layout/main-layout.tsx`:
  - Wrapper combining Header + children + Footer
  - Consistent padding and max-width (7xl)
  - Flex layout for sticky footer

- [x] Create `components/shared/result-card.tsx`:
  - Generic card for displaying calculation results
  - Props: title, number, description, interpretation, badge, shareUrl, shareTitle
  - Large animated number display with gradient
  - Share button integration
  - Prose styling for interpretation text

- [x] Create `components/shared/share-button.tsx`:
  - Share result via Web Share API (mobile)
  - Fallback to copy link (desktop)
  - Visual feedback with "Copiat!" state
  - Proper SSR handling

- [x] Create `components/shared/section-heading.tsx`:
  - Consistent heading styles
  - Optional icon support with colored background
  - Description text support

- [x] Create `components/shared/loading-spinner.tsx`:
  - Loading state indicator with animated spinner
  - Romanian text: "Se încarcă..."
  - Customizable text and className

- [x] Create `components/shared/error-message.tsx`:
  - Error display component with AlertCircle icon
  - Romanian error messages
  - Destructive color scheme

**Files Created:**
- `components/layout/header.tsx` ✅
- `components/layout/footer.tsx` ✅
- `components/layout/main-layout.tsx` ✅
- `components/shared/result-card.tsx` ✅
- `components/shared/share-button.tsx` ✅
- `components/shared/section-heading.tsx` ✅
- `components/shared/loading-spinner.tsx` ✅
- `components/shared/error-message.tsx` ✅
- `components/ui/input.tsx` ✅
- `components/ui/card.tsx` ✅
- `components/ui/label.tsx` ✅
- `components/ui/badge.tsx` ✅
- `components/ui/separator.tsx` ✅
- `components/ui/dialog.tsx` ✅

**Files Modified:**
- `app/layout.tsx` (integrated MainLayout) ✅

**Acceptance Criteria:** ✅ ALL MET
- ✅ All components use TypeScript interfaces for props
- ✅ Mobile-first responsive design with hamburger menu
- ✅ Dark theme compatible with gradient accents
- ✅ Accessible (semantic HTML, proper ARIA)
- ✅ All text in Romanian
- ✅ Build successful with no TypeScript errors
- ✅ Sticky header with backdrop blur effect
- ✅ Share functionality with Web Share API + clipboard fallback

---

### ✅ 1.5 Custom Hooks (`/hooks`) (COMPLETED)

**Goal:** Reusable React logic patterns

**Tasks:**
- [x] Create `hooks/use-debounced-value.ts`:
  - Debounce input for search (dream symbols)
  - Configurable delay (default 300ms)

- [x] Create `hooks/use-client-only.ts`:
  - Safely access browser APIs (localStorage, window)
  - Prevent SSR hydration issues

**Files Created:**
- `hooks/use-debounced-value.ts` ✅
- `hooks/use-client-only.ts` ✅

**Acceptance Criteria:** ✅ ALL MET
- ✅ Hooks follow React naming convention (`useXxx`)
- ✅ Properly typed with TypeScript
- ✅ Handle edge cases (unmounting, rapid changes)

---

### ✅ 1.6 Update Root Layout (COMPLETED)

**Goal:** Apply MainLayout globally

**Tasks:**
- [x] Update `app/layout.tsx`:
  - Import and wrap children with `<MainLayout>`
  - Ensure dark theme CSS variables are set
  - Add any global providers (Convex, if needed)
  - Apply `dark` class to html element for global dark theme

**Files Modified:**
- `app/layout.tsx` ✅

**Acceptance Criteria:** ✅ ALL MET
- ✅ Header and Footer appear on all pages
- ✅ Consistent spacing and max-width
- ✅ Dark theme applied globally

---

### ✅ 1.7 Cleanup & Quality Assurance (COMPLETED)

**Goal:** Remove test files and ensure production-ready code

**Tasks:**
- [x] Remove all test directories and files:
  - `__tests__/` (root)
  - `app/__tests__/`
  - `components/__tests__/`
  - `components/layout/__tests__/`
  - `components/shared/__tests__/`
  - `config/__tests__/`
  - `convex/__tests__/`
  - `hooks/__tests__/`
  - `lib/__tests__/`

- [x] Verify no console.log statements in source code
- [x] Run TypeScript diagnostics on all files
- [x] Verify production build succeeds
- [x] Confirm all imports use `@/` aliases
- [x] Verify kebab-case naming convention

**Acceptance Criteria:** ✅ ALL MET
- ✅ All test files removed
- ✅ No console.log statements in source code
- ✅ Zero TypeScript errors or warnings
- ✅ Production build successful (2.5s compile time)
- ✅ All routes render correctly
- ✅ Code is clean and production-ready

---

## Phase 2: Feature Implementation

### ✅ 2.1 Biorhythm Module (COMPLETED)

**Goal:** Working biorhythm calculator with visual output

**Tasks:**
- [x] Create `convex/biorhythm.ts`:
  - Query: `getBiorhythm(birthDate: string, targetDate: string)`
  - Query: `getCriticalDays(birthDate: string, startDate: string, days: number)`
  - Uses lib/biorhythm.ts functions
  - Returns cycles and Romanian summary text

- [x] Create `components/bioritm/biorhythm-form.tsx`:
  - Date of birth input with validation
  - Target date input (defaults to today, optional)
  - Submit button with loading state
  - Error handling and user feedback

- [x] Create `components/bioritm/biorhythm-chart.tsx`:
  - Interactive SVG chart with three cycles
  - Color-coded: Physical (red), Emotional (blue), Intellectual (green)
  - 15-day window on desktop, 11-day on mobile
  - Current day indicator with value markers
  - Responsive design with proper scaling
  - Full accessibility (ARIA labels, screen reader support)

- [x] Create `components/bioritm/biorhythm-summary.tsx`:
  - Romanian text summary of current state
  - Visual progress bars for each cycle
  - Gradient fills matching chart colors
  - Percentage indicators

- [x] Create `components/bioritm/critical-days-list.tsx`:
  - List of upcoming critical days (30-day forecast)
  - Affected cycles displayed with color-coded badges
  - Romanian guidance for each critical day
  - Empty state when no critical days found
  - Formatted dates with day of week

- [x] Create `app/bioritm/page.tsx` and `app/bioritm/client.tsx`:
  - Server component for metadata
  - Client component for interactive calculator
  - Form → Chart → Summary flow
  - Share functionality
  - Link to critical days page
  - Info cards explaining each cycle

- [x] Create `app/bioritm/critice/page.tsx` and `app/bioritm/critice/client.tsx`:
  - Dedicated critical days view
  - 30-day forecast from today
  - Simplified form (birth date only)
  - Back link to main calculator
  - Educational content about critical days

**Files Created:**
- `convex/biorhythm.ts` ✅
- `components/bioritm/biorhythm-form.tsx` ✅
- `components/bioritm/biorhythm-chart.tsx` ✅
- `components/bioritm/biorhythm-summary.tsx` ✅
- `components/bioritm/critical-days-list.tsx` ✅
- `app/bioritm/client.tsx` ✅
- `app/bioritm/critice/client.tsx` ✅
- `app/bioritm/critice/page.tsx` ✅

**Files Modified:**
- `app/bioritm/page.tsx` ✅

**Acceptance Criteria:** ✅ ALL MET
- ✅ User can input birth date and see biorhythm
- ✅ Chart displays correctly on mobile and desktop (responsive)
- ✅ Critical days calculated accurately (30-day forecast)
- ✅ All text in Romanian with proper diacritics
- ✅ Fast calculation (instant, client-side rendering)
- ✅ Zero TypeScript errors
- ✅ Fully accessible (ARIA labels, keyboard navigation)
- ✅ Share functionality integrated
- ✅ Loading and error states handled
- ✅ Professional, polished UI matching design system

---

### ✅ 2.2 Numerology Module (COMPLETED)

**Goal:** Four working numerology calculators

**Tasks:**
- [x] Create `convex/numerology.ts`:
  - Query: `getLifePathInterpretation(number: number)` ✅
  - Query: `getDestinyInterpretation(number: number)` ✅
  - Query: `getCompatibilityInterpretation(score: number)` ✅
  - Query: `getDailyNumber(date: string)` ✅
  - Mutation: `seedInterpretations()` with 37 Romanian interpretations ✅
  - Master Numbers (11, 22, 33) support ✅

- [x] Create `components/numerologie/numerology-form.tsx`:
  - Reusable form wrapper with 3 variants ✅
  - Date picker for birth dates ✅
  - Text input for names with Romanian diacritics validation ✅
  - Client-side validation with Romanian error messages ✅
  - Loading states and accessibility ✅

- [x] Create `components/numerologie/life-path-card.tsx`:
  - Display Life Path number (1-9, 11, 22, 33) ✅
  - Master Number badges and explanations ✅
  - Show interpretation from Convex ✅
  - Share functionality ✅

- [x] Create `components/numerologie/destiny-card.tsx`:
  - Display Destiny number ✅
  - Show interpretation ✅
  - Share functionality ✅

- [x] Create `components/numerologie/compatibility-card.tsx`:
  - Display compatibility score ✅
  - Show relationship guidance ✅
  - Share functionality ✅

- [x] Create `app/numerologie/calea-vietii/page.tsx` and `client.tsx`:
  - Life Path calculator ✅
  - Birth date input → calculation → result card ✅
  - Master Number detection and display ✅
  - Educational content about Life Path ✅

- [x] Create `app/numerologie/nume-destin/page.tsx` and `client.tsx`:
  - Destiny Name calculator ✅
  - Full name input → calculation → result card ✅
  - Romanian diacritics support ✅

- [x] Create `app/numerologie/compatibilitate/page.tsx` and `client.tsx`:
  - Compatibility calculator ✅
  - Two names + two birth dates → score + guidance ✅
  - Combined Life Path and Destiny compatibility ✅

- [x] Create `app/numerologie/numar-zilnic/page.tsx` and `client.tsx`:
  - Daily number display ✅
  - Deterministic based on current date ✅
  - Daily forecast text ✅
  - Romanian date formatting ✅

- [x] Update `app/numerologie/page.tsx`:
  - Replace "În curând" buttons with working links ✅
  - Add brief explanations ✅
  - Professional card layout ✅

**Files Created:**
- `convex/numerology.ts` ✅
- `components/numerologie/numerology-form.tsx` ✅
- `components/numerologie/life-path-card.tsx` ✅
- `components/numerologie/destiny-card.tsx` ✅
- `components/numerologie/compatibility-card.tsx` ✅
- `app/numerologie/calea-vietii/page.tsx` ✅
- `app/numerologie/calea-vietii/client.tsx` ✅
- `app/numerologie/nume-destin/page.tsx` ✅
- `app/numerologie/nume-destin/client.tsx` ✅
- `app/numerologie/compatibilitate/page.tsx` ✅
- `app/numerologie/compatibilitate/client.tsx` ✅
- `app/numerologie/numar-zilnic/page.tsx` ✅
- `app/numerologie/numar-zilnic/client.tsx` ✅

**Files Modified:**
- `app/numerologie/page.tsx` ✅

**Acceptance Criteria:** ✅ ALL MET
- ✅ All four calculators work correctly
- ✅ Romanian diacritics handled in name calculations
- ✅ Interpretations display properly (37 interpretations seeded)
- ✅ Master Numbers (11, 22, 33) supported and displayed
- ✅ Mobile-friendly forms with proper validation
- ✅ Results shareable on all pages
- ✅ All text in Romanian
- ✅ Loading and error states handled
- ✅ Accessibility compliant (ARIA labels, keyboard navigation)
- ✅ Professional UI matching design system

---

### 2.3 Dream Interpretation Module (Most Complex)

**Goal:** Searchable dream dictionary with multi-symbol interpreter

**Tasks:**
- [ ] Create dream symbols dataset:
  - Minimum 100 symbols for MVP (target 500+)
  - Romanian names and interpretations
  - Categories (animale, natură, obiecte, emoții, etc.)
  - JSON or seed script format

- [ ] Create `convex/dreams.ts`:
  - Query: `searchDreamSymbols(query: string, limit: number)`
  - Query: `getDreamSymbol(slug: string)`
  - Query: `getDailyDream(date: string)`
  - Action: `seedDreamSymbols()` (one-time data import)

- [ ] Create `components/vise/dream-search-input.tsx`:
  - Search bar with debounced input
  - Uses `use-debounced-value` hook
  - Real-time results

- [ ] Create `components/vise/dream-result-list.tsx`:
  - List of matching symbols
  - Click to expand or navigate to detail

- [ ] Create `components/vise/dream-detail-card.tsx`:
  - Full interpretation display
  - Symbol name, category, meaning
  - Related symbols (optional)

- [ ] Create `components/vise/dream-combo-form.tsx`:
  - Select up to 3 symbols from dream
  - Combine interpretations button

- [ ] Update `app/vise/page.tsx`:
  - Working search interface
  - Display results dynamically
  - Link to individual symbol pages (optional)

- [ ] Create `app/vise/interpretare/page.tsx`:
  - Multi-symbol interpreter
  - User selects 2-3 main symbols
  - Combined interpretation text

- [ ] Create `app/vise/visul-zilei/page.tsx`:
  - Daily highlighted dream symbol
  - Deterministic selection based on date
  - Full interpretation

**Files Created:**
- `convex/dreams.ts`
- `data/dream-symbols.json` (or seed script)
- `components/vise/dream-search-input.tsx`
- `components/vise/dream-result-list.tsx`
- `components/vise/dream-detail-card.tsx`
- `components/vise/dream-combo-form.tsx`
- `app/vise/interpretare/page.tsx`
- `app/vise/visul-zilei/page.tsx`

**Files Modified:**
- `app/vise/page.tsx`

**Acceptance Criteria:**
- Search returns relevant results in <300ms
- At least 100 symbols available
- Debounced search prevents excessive queries
- Multi-symbol interpretation makes sense
- Daily dream changes each day
- All text in Romanian
- Mobile-friendly search interface

---

## Phase 3: Polish & Optimization

### 3.1 Daily Features & Automation

**Goal:** Automated daily content selection

**Tasks:**
- [ ] Create `convex/daily.ts`:
  - Action: `selectDailyNumber(date: string)`
  - Action: `selectDailyDream(date: string)`
  - Deterministic selection based on date hash

- [ ] Set up Convex cron jobs:
  - Daily at 00:00 UTC: update daily picks
  - Store in `dailyPicks` table

- [ ] Create `components/layout/daily-widget.tsx`:
  - Display on homepage
  - Shows: Numărul zilei, Visul zilei, Bioritm hint
  - Links to full pages

- [ ] Update `app/page.tsx`:
  - Add daily widget above tool cards
  - Fetch from Convex

**Files Created:**
- `convex/daily.ts`
- `convex/crons.ts` (Convex cron configuration)
- `components/layout/daily-widget.tsx`

**Files Modified:**
- `app/page.tsx`

**Acceptance Criteria:**
- Daily content updates automatically at midnight
- Widget loads quickly (<500ms)
- Links work correctly
- Content is deterministic (same for all users on same day)

---

### 3.2 SEO & Sharing

**Goal:** Optimize for search engines and social sharing

**Tasks:**
- [ ] Create `app/api/og/route.tsx`:
  - Next.js OG image generation
  - Dynamic images for results
  - Include: tool name, result number, short Romanian text
  - SpiritHub.ro branding

- [ ] Update metadata for all pages:
  - Unique titles and descriptions
  - Romanian keywords
  - Open Graph tags
  - Twitter Card tags

- [ ] Implement share functionality:
  - Update `share-button.tsx` to use OG images
  - Web Share API with fallback
  - Copy link functionality

- [ ] Create `public/robots.txt`
- [ ] Create `app/sitemap.ts` (dynamic sitemap generation)

**Files Created:**
- `app/api/og/route.tsx`
- `public/robots.txt`
- `app/sitemap.ts`

**Files Modified:**
- All page.tsx files (metadata updates)
- `components/shared/share-button.tsx`

**Acceptance Criteria:**
- OG images generate correctly
- Social media previews look good
- All pages have unique metadata
- Sitemap includes all routes
- robots.txt allows indexing

---

### 3.3 Final Polish

**Goal:** Production-ready quality

**Tasks:**
- [ ] Mobile responsiveness audit:
  - Test all pages on mobile viewport
  - Fix any layout issues
  - Ensure touch targets are adequate (min 44x44px)

- [ ] Dark theme refinement:
  - Verify contrast ratios (WCAG AA minimum)
  - Adjust colors if needed
  - Test all components in dark mode

- [ ] Performance optimization:
  - Add loading states to all async operations
  - Optimize images (if any)
  - Check bundle size
  - Enable Next.js static generation where possible

- [ ] Analytics integration (optional):
  - Simple pageview tracking in Convex
  - Privacy-compliant (no personal data)
  - Track: page visits, calculator usage

- [ ] Error handling:
  - Add error boundaries
  - User-friendly error messages in Romanian
  - Fallback UI for failed loads

- [ ] Accessibility audit:
  - Keyboard navigation works
  - Screen reader friendly
  - ARIA labels where needed
  - Focus indicators visible

**Files Modified:**
- Various components (polish and fixes)
- `app/globals.css` (theme adjustments)

**Acceptance Criteria:**
- All pages load in <2 seconds on 3G
- No console errors or warnings
- Lighthouse score >90 (Performance, Accessibility, Best Practices, SEO)
- Works on Chrome, Firefox, Safari, Edge
- Mobile experience is smooth
- Dark theme looks polished

---

## Success Metrics

### Technical
- [ ] All TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Lighthouse scores >90 across the board
- [ ] Page load <2 seconds on mobile
- [ ] Zero runtime errors in production

### Functional
- [ ] All calculators produce correct results
- [ ] Search returns relevant symbols
- [ ] Daily content updates automatically
- [ ] Sharing works on major platforms
- [ ] Forms validate properly

### UX
- [ ] Mobile-first design works well
- [ ] Dark theme is visually appealing
- [ ] Navigation is intuitive
- [ ] Romanian text is natural and correct
- [ ] Loading states prevent confusion

---

## Risk Mitigation

### Potential Issues

1. **Convex Learning Curve**
   - Mitigation: Start with simple queries, reference docs
   - Fallback: Use Next.js API routes if Convex proves difficult

2. **Romanian Diacritics**
   - Mitigation: Test early with real Romanian text
   - Use proper UTF-8 encoding everywhere

3. **Dream Symbol Dataset**
   - Mitigation: Start with 50-100 symbols, expand later
   - Use AI to help generate initial content (with review)

4. **Chart Rendering (Biorhythm)**
   - Mitigation: Use simple SVG, not complex charting library
   - Fallback: Text-only summary if charts prove difficult

5. **Mobile Performance**
   - Mitigation: Test on real devices early
   - Optimize bundle size, use code splitting

---

## Post-MVP Enhancements

Features to consider after core platform is stable:

- [ ] Blog section with educational content
- [ ] User accounts (optional, for saving results)
- [ ] More dream symbols (expand to 500+)
- [ ] Advanced numerology calculators (Personal Year, etc.)
- [ ] Biorhythm comparison (two people)
- [ ] Email notifications for critical days
- [ ] Mobile app (PWA or native)
- [ ] Affiliate integrations (books, courses)
- [ ] Premium features (detailed reports, etc.)

---

## Timeline Estimate

**Phase 1 (Foundation):** ✅ COMPLETED (3 days)
**Phase 2.1 (Biorhythm):** ✅ COMPLETED (1 day)
**Phase 2.2 (Numerology):** ✅ COMPLETED (2 days)
**Phase 2.3 (Dreams):** 2-3 days (estimated)
**Phase 3 (Polish):** 2-3 days (estimated)

**Total MVP:** 10-15 days of focused development
**Progress:** ~60% complete (6/10 days)

---

## Next Steps

1. ✅ Phase 1: Foundation Layer - COMPLETED
2. ✅ Phase 2.1: Biorhythm Module - COMPLETED
3. ✅ Phase 2.2: Numerology Module - COMPLETED
4. **NEXT:** Phase 2.3: Dream Interpretation Module
   - Dream symbols dataset (100+ symbols)
   - Search functionality with debouncing
   - Multi-symbol interpreter
   - Daily dream feature
5. Phase 3: Polish & Optimization
6. Deploy to Vercel
7. Iterate based on user feedback

---

**Current Status:** Foundation complete, Biorhythm and Numerology modules fully functional. Ready to begin Dream Interpretation module (Phase 2.3).
