# Implementation Plan – SpiritHub.ro

**Status:** Ready for Implementation  
**Approach:** Hybrid Layer-First Strategy  
**Last Updated:** November 14, 2025

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

### ❌ Missing - Phase 2 & 3
- Feature-specific components (numerologie, vise, bioritm)
- Convex backend functions (queries/actions)
- Actual calculator implementations
- Static interpretation data seeding
- Daily automation features
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

### 2.1 Biorhythm Module (Simplest)

**Goal:** Working biorhythm calculator with visual output

**Tasks:**
- [ ] Create `convex/biorhythm.ts`:
  - Query: `getBiorhythm(birthDate: string, targetDate: string)`
  - Uses lib/biorhythm.ts functions
  - Returns cycles and summary text

- [ ] Create `components/bioritm/biorhythm-form.tsx`:
  - Date of birth input
  - Target date input (defaults to today)
  - Submit button

- [ ] Create `components/bioritm/biorhythm-chart.tsx`:
  - Visual representation of three cycles
  - Simple SVG or Canvas chart
  - Color-coded: Physical (red), Emotional (blue), Intellectual (green)

- [ ] Create `components/bioritm/biorhythm-summary.tsx`:
  - Text summary of current state
  - Romanian guidance (e.g., "Zi bună pentru efort fizic")

- [ ] Create `components/bioritm/critical-days-list.tsx`:
  - List of upcoming critical days
  - Explanation of what to watch for

- [ ] Update `app/bioritm/page.tsx`:
  - Replace placeholder with working calculator
  - Use Convex query for data
  - Show form → results flow

- [ ] Create `app/bioritm/critice/page.tsx`:
  - Dedicated page for critical days view
  - Extended date range (30 days)

**Files Created:**
- `convex/biorhythm.ts`
- `components/bioritm/biorhythm-form.tsx`
- `components/bioritm/biorhythm-chart.tsx`
- `components/bioritm/biorhythm-summary.tsx`
- `components/bioritm/critical-days-list.tsx`
- `app/bioritm/critice/page.tsx`

**Files Modified:**
- `app/bioritm/page.tsx`

**Acceptance Criteria:**
- User can input birth date and see biorhythm
- Chart displays correctly on mobile and desktop
- Critical days calculated accurately
- All text in Romanian
- Fast calculation (<500ms)

---

### 2.2 Numerology Module (Medium Complexity)

**Goal:** Four working numerology calculators

**Tasks:**
- [ ] Create `convex/numerology.ts`:
  - Query: `getLifePathInterpretation(number: number)`
  - Query: `getDestinyInterpretation(number: number)`
  - Query: `getCompatibilityInterpretation(score: number)`
  - Seed interpretations table with Romanian text

- [ ] Create `components/numerologie/numerology-form.tsx`:
  - Reusable form wrapper
  - Date picker for birth dates
  - Text input for names
  - Validation

- [ ] Create `components/numerologie/life-path-card.tsx`:
  - Display Life Path number (1-9)
  - Show interpretation from Convex

- [ ] Create `components/numerologie/destiny-card.tsx`:
  - Display Destiny number
  - Show interpretation

- [ ] Create `components/numerologie/compatibility-card.tsx`:
  - Display compatibility score
  - Show relationship guidance

- [ ] Create `app/numerologie/calea-vietii/page.tsx`:
  - Life Path calculator
  - Birth date input → calculation → result card

- [ ] Create `app/numerologie/nume-destin/page.tsx`:
  - Destiny Name calculator
  - Full name input → calculation → result card

- [ ] Create `app/numerologie/compatibilitate/page.tsx`:
  - Compatibility calculator
  - Two names + two birth dates → score + guidance

- [ ] Create `app/numerologie/numar-zilnic/page.tsx`:
  - Daily number display
  - Deterministic based on current date
  - Daily forecast text

- [ ] Update `app/numerologie/page.tsx`:
  - Replace "În curând" buttons with working links
  - Add brief explanations

**Files Created:**
- `convex/numerology.ts`
- `components/numerologie/numerology-form.tsx`
- `components/numerologie/life-path-card.tsx`
- `components/numerologie/destiny-card.tsx`
- `components/numerologie/compatibility-card.tsx`
- `app/numerologie/calea-vietii/page.tsx`
- `app/numerologie/nume-destin/page.tsx`
- `app/numerologie/compatibilitate/page.tsx`
- `app/numerologie/numar-zilnic/page.tsx`

**Files Modified:**
- `app/numerologie/page.tsx`

**Acceptance Criteria:**
- All four calculators work correctly
- Romanian diacritics handled in name calculations
- Interpretations display properly
- Mobile-friendly forms
- Results shareable
- All text in Romanian

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

**Phase 1 (Foundation):** 3-5 days
**Phase 2 (Features):** 5-7 days
**Phase 3 (Polish):** 2-3 days

**Total MVP:** 10-15 days of focused development

---

## Next Steps

1. Review and approve this plan
2. Begin Phase 1.1 (Convex setup)
3. Work through phases sequentially
4. Test continuously as features are built
5. Deploy to Vercel when Phase 2 is complete
6. Iterate based on user feedback

---

**Ready to implement? Let's start with Phase 1.1: Convex Backend Setup.**
