# Design Document - Biorhythm Module

## Overview

The Biorhythm Module is the first feature implementation in Phase 2 of SpiritHub.ro, chosen for its simplicity and ability to validate the platform's foundation layer. It provides users with visual and textual representations of their physical, emotional, and intellectual cycles based on their birth date.

The module consists of two main pages:

1. **Daily Biorhythm Calculator** (`/bioritm`) - Main calculator with form, chart, and summary
2. **Critical Days Viewer** (`/bioritm/critice`) - Extended view of upcoming critical days

All calculations leverage the existing `lib/biorhythm.ts` utilities and are exposed through Convex queries for consistent server-side execution.

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface Layer                    │
├─────────────────────────────────────────────────────────────┤
│  /bioritm/page.tsx          │  /bioritm/critice/page.tsx   │
│  - BiorhythmForm            │  - BiorhythmForm             │
│  - BiorhythmChart           │  - CriticalDaysList          │
│  - BiorhythmSummary         │  - Extended date range       │
│  - ShareButton              │                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Convex Backend Layer                      │
├─────────────────────────────────────────────────────────────┤
│  convex/biorhythm.ts                                        │
│  - getBiorhythm(birthDate, targetDate)                      │
│  - getCriticalDays(birthDate, startDate, days)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Domain Logic Layer                        │
├─────────────────────────────────────────────────────────────┤
│  lib/biorhythm.ts                                           │
│  - calculateCycle()                                          │
│  - getPhysicalCycle()                                        │
│  - getEmotionalCycle()                                       │
│  - getIntellectualCycle()                                    │
│  - getCriticalDays()                                         │
│  - getBiorhythmSummary()                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Configuration Layer                       │
├─────────────────────────────────────────────────────────────┤
│  config/biorhythm.ts                                        │
│  - Cycle parameters (23, 28, 33 days)                       │
│  - Critical threshold (0.1)                                  │
│  - Interpretation ranges                                     │
│  - Default forecast days (30)                                │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input** → User enters birth date (and optionally target date) in BiorhythmForm
2. **Client Validation** → Form validates dates before submission
3. **Convex Query** → React component calls `useQuery(api.biorhythm.getBiorhythm, { birthDate, targetDate })`
4. **Server Calculation** → Convex function invokes `lib/biorhythm.ts` utilities
5. **Response** → Convex returns `{ physical, emotional, intellectual, summary }`
6. **Rendering** → Components display chart, summary, and share button

---

## Components and Interfaces

### 1. Convex Backend Functions

**File:** `convex/biorhythm.ts`

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";
import {
  getPhysicalCycle,
  getEmotionalCycle,
  getIntellectualCycle,
  getBiorhythmSummary,
  getCriticalDays as getCriticalDaysUtil,
} from "@/lib/biorhythm";

/**
 * Query: getBiorhythm
 *
 * Calculates biorhythm cycles for a given birth date and target date.
 * Returns cycle values and Romanian-language summary.
 */
export const getBiorhythm = query({
  args: {
    birthDate: v.string(), // ISO 8601 format: "YYYY-MM-DD"
    targetDate: v.string(), // ISO 8601 format: "YYYY-MM-DD"
  },
  handler: async (ctx, args) => {
    const birth = new Date(args.birthDate);
    const target = new Date(args.targetDate);

    const physical = getPhysicalCycle(birth, target);
    const emotional = getEmotionalCycle(birth, target);
    const intellectual = getIntellectualCycle(birth, target);
    const summary = getBiorhythmSummary(physical, emotional, intellectual);

    return {
      physical,
      emotional,
      intellectual,
      summary,
      birthDate: args.birthDate,
      targetDate: args.targetDate,
    };
  },
});

/**
 * Query: getCriticalDays
 *
 * Identifies upcoming critical days when cycles cross zero.
 * Returns array of dates with affected cycles.
 */
export const getCriticalDays = query({
  args: {
    birthDate: v.string(),
    startDate: v.string(),
    days: v.number(),
  },
  handler: async (ctx, args) => {
    const birth = new Date(args.birthDate);
    const start = new Date(args.startDate);

    const criticalDays = getCriticalDaysUtil(birth, start, args.days);

    return criticalDays.map((day) => ({
      date: day.date.toISOString().split("T")[0],
      cycles: day.cycles,
    }));
  },
});
```

---

### 2. BiorhythmForm Component

**File:** `components/bioritm/biorhythm-form.tsx`

**Purpose:** Collects user input for birth date and optional target date.

**Props Interface:**

```typescript
export interface BiorhythmFormProps {
  onSubmit: (birthDate: string, targetDate: string) => void;
  isLoading?: boolean;
}
```

**Features:**

- Birth date input (required) with native date picker
- Target date input (optional, defaults to today)
- Client-side validation:
  - Birth date must be in the past
  - Target date must be after birth date
  - Dates must be valid
- Romanian labels and error messages
- Submit button with loading state
- Touch-friendly inputs (44x44px minimum)

**Visual Design:**

- Card container with semi-transparent background
- Vertical form layout with 24px gap
- Labels: 14px medium weight white text
- Inputs: 16px text with subtle background (`oklch(1 0 0 / 0.12)`)
- Primary gradient button at bottom
- Error messages in destructive red color

---

### 3. BiorhythmChart Component

**File:** `components/bioritm/biorhythm-chart.tsx`

**Purpose:** Visual representation of three biorhythm cycles.

**Props Interface:**

```typescript
export interface BiorhythmChartProps {
  physical: number;
  emotional: number;
  intellectual: number;
  birthDate: string;
  targetDate: string;
}
```

**Chart Specifications:**

**Type:** SVG-based sine wave visualization

**Dimensions:**

- Desktop: 800px width × 400px height
- Mobile: 100% width (responsive) × 300px height
- Maintains aspect ratio

**Visual Elements:**

1. **Background Grid:**
   - Horizontal lines at -100%, -50%, 0%, +50%, +100%
   - Subtle white lines at 8% opacity
   - Zero line emphasized with 15% opacity

2. **Cycle Curves:**
   - Physical: Red (`#ef4444`) - 3px stroke width
   - Emotional: Blue (`#3b82f6`) - 3px stroke width
   - Intellectual: Green (`#10b981`) - 3px stroke width
   - Smooth sine wave paths
   - Display 7 days before and 7 days after target date (15 days total)

3. **Current Day Indicator:**
   - Vertical line at target date
   - White color at 30% opacity
   - 2px stroke width
   - Extends full height

4. **Value Markers:**
   - Circles at current day intersection for each cycle
   - 8px radius
   - Filled with cycle color
   - White border (2px)

5. **Legend:**
   - Positioned at top-right
   - Shows cycle names with color indicators
   - Romanian labels: "Fizic", "Emoțional", "Intelectual"

**Responsive Behavior:**

- On mobile (<768px): Reduce to 5 days before/after (11 days total)
- Scale font sizes proportionally
- Maintain readability of all text elements

**Accessibility:**

- ARIA label describing chart content
- Screen reader text for cycle values
- Keyboard focusable with tab navigation

---

### 4. BiorhythmSummary Component

**File:** `components/bioritm/biorhythm-summary.tsx`

**Purpose:** Text-based interpretation of biorhythm state.

**Props Interface:**

```typescript
export interface BiorhythmSummaryProps {
  summary: string;
  physical: number;
  emotional: number;
  intellectual: number;
}
```

**Layout:**

- Card container with 32px padding
- Heading: "Interpretare" (24px semi-bold white)
- Summary text: 16px regular light gray, 1.5 line height
- Cycle indicators below summary:
  - Three horizontal bars showing cycle levels
  - Color-coded (red, blue, green)
  - Percentage labels
  - Visual fill based on value (-100% to +100%)

**Cycle Indicator Design:**

```
Fizic        [████████████░░░░░░░░] 65%
Emoțional    [░░░░░░░░░░██████████] -45%
Intelectual  [████████████████████] 89%
```

- Bar width: 100%
- Bar height: 24px
- Border radius: 12px (full pill shape)
- Background: `oklch(1 0 0 / 0.12)`
- Fill: Gradient from cycle color to lighter shade
- Negative values fill from right to left

---

### 5. CriticalDaysList Component

**File:** `components/bioritm/critical-days-list.tsx`

**Purpose:** Display upcoming critical days with affected cycles.

**Props Interface:**

```typescript
export interface CriticalDaysListProps {
  criticalDays: Array<{
    date: string;
    cycles: ("physical" | "emotional" | "intellectual")[];
  }>;
}
```

**Layout:**

- Vertical list with 16px gap between items
- Each item is a card with:
  - Date in Romanian format (e.g., "17 noiembrie 2025")
  - Day of week (e.g., "Luni")
  - Affected cycle badges (colored pills)
  - Warning icon (AlertCircle from lucide-react)

**Critical Day Card Design:**

```
┌─────────────────────────────────────────┐
│ ⚠️  17 noiembrie 2025 (Luni)            │
│                                          │
│ Cicluri critice:                         │
│ [Fizic] [Emoțional]                     │
│                                          │
│ Fii atent la efortul fizic și           │
│ gestionarea emoțiilor.                   │
└─────────────────────────────────────────┘
```

**Badge Colors:**

- Physical: Red background with white text
- Emotional: Blue background with white text
- Intellectual: Green background with white text

**Empty State:**

- When no critical days in range:
  - Display: "Nu există zile critice în următoarele 30 de zile."
  - Icon: CheckCircle (green)
  - Centered text

---

### 6. Page Implementations

#### Main Biorhythm Page

**File:** `app/bioritm/page.tsx`

**Structure:**

```typescript
export default function BioritmPage() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const biorhythm = useQuery(
    api.biorhythm.getBiorhythm,
    hasSubmitted ? { birthDate, targetDate } : "skip",
  );

  // Render form, then results when available
}
```

**Layout Flow:**

1. Page heading with icon (Activity from lucide-react)
2. Description paragraph
3. BiorhythmForm
4. Loading spinner (when query is pending)
5. Results section (when data available):
   - BiorhythmChart
   - BiorhythmSummary
   - ShareButton
6. Link to Critical Days page

**Metadata:**

```typescript
export const metadata: Metadata = {
  title: "Calculator Bioritm | SpiritHub.ro",
  description:
    "Calculează-ți bioritmul zilnic și descoperă ciclurile tale fizice, emoționale și intelectuale.",
};
```

#### Critical Days Page

**File:** `app/bioritm/critice/page.tsx`

**Structure:**

```typescript
export default function CriticeDaysPage() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const criticalDays = useQuery(
    api.biorhythm.getCriticalDays,
    hasSubmitted
      ? {
          birthDate,
          startDate: new Date().toISOString().split("T")[0],
          days: 30,
        }
      : "skip",
  );

  // Render form, then critical days list
}
```

**Layout Flow:**

1. Page heading: "Zile Critice"
2. Explanation paragraph about critical days
3. BiorhythmForm (birth date only, no target date)
4. Loading spinner
5. CriticalDaysList
6. Back link to main calculator

**Metadata:**

```typescript
export const metadata: Metadata = {
  title: "Zile Critice Bioritm | SpiritHub.ro",
  description: "Descoperă zilele critice din bioritmul tău când ciclurile trec prin zero.",
};
```

---

## Data Models

### Biorhythm Query Response

```typescript
interface BiorhythmResponse {
  physical: number; // -1.0 to 1.0
  emotional: number; // -1.0 to 1.0
  intellectual: number; // -1.0 to 1.0
  summary: string; // Romanian-language guidance
  birthDate: string; // ISO 8601 format
  targetDate: string; // ISO 8601 format
}
```

### Critical Days Query Response

```typescript
interface CriticalDaysResponse {
  date: string; // ISO 8601 format
  cycles: ("physical" | "emotional" | "intellectual")[];
}
[];
```

### Form State

```typescript
interface BiorhythmFormState {
  birthDate: string; // ISO 8601 format
  targetDate: string; // ISO 8601 format
  errors: {
    birthDate?: string;
    targetDate?: string;
  };
}
```

---

## Error Handling

### Client-Side Validation Errors

**Birth Date Errors:**

- Empty: "Data nașterii este obligatorie"
- Future date: "Data nașterii trebuie să fie în trecut"
- Invalid format: "Data nașterii este invalidă"

**Target Date Errors:**

- Before birth date: "Data țintă trebuie să fie după data nașterii"
- Invalid format: "Data țintă este invalidă"

**Display:**

- Show below respective input field
- Red text color (`hsl(var(--destructive))`)
- Small font size (14px)
- Icon: AlertCircle

### Server-Side Errors

**Convex Query Failures:**

- Network error: "Eroare de conexiune. Verifică conexiunea la internet."
- Calculation error: "Eroare la calcularea bioritmului. Încearcă din nou."
- Invalid input: "Date invalide. Verifică informațiile introduse."

**Display:**

- ErrorMessage component (shared)
- Positioned above results area
- Retry button included
- Error logged to console for debugging

### Loading States

**During Query Execution:**

- LoadingSpinner component
- Romanian text: "Se calculează bioritmul..."
- Centered in results area
- Prevents multiple submissions

---

## Testing Strategy

### Unit Tests (Optional)

**Component Tests:**

- BiorhythmForm validation logic
- BiorhythmChart SVG generation
- BiorhythmSummary text formatting
- CriticalDaysList rendering with various inputs

**Integration Tests:**

- Form submission → Convex query → Results display
- Error handling flows
- Loading state transitions

### Manual Testing Checklist

**Functional Testing:**

- [ ] Birth date input accepts valid dates
- [ ] Target date defaults to today
- [ ] Form validates dates correctly
- [ ] Convex query executes within 500ms
- [ ] Chart displays three cycles correctly
- [ ] Summary text is in Romanian and accurate
- [ ] Critical days list shows correct dates
- [ ] Share button copies URL to clipboard
- [ ] Share button uses Web Share API on mobile

**Visual Testing:**

- [ ] Chart renders correctly on desktop (1920×1080)
- [ ] Chart renders correctly on tablet (768×1024)
- [ ] Chart renders correctly on mobile (375×667)
- [ ] All text is readable with sufficient contrast
- [ ] Colors match design system (red, blue, green)
- [ ] Dark theme looks polished
- [ ] Loading spinner is centered and visible
- [ ] Error messages are clearly visible

**Accessibility Testing:**

- [ ] Form inputs are keyboard navigable
- [ ] Focus indicators are visible
- [ ] Chart has ARIA labels
- [ ] Screen reader announces cycle values
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Touch targets are at least 44×44px

**Performance Testing:**

- [ ] Page loads in <2 seconds on 3G
- [ ] Chart renders without lag
- [ ] No console errors or warnings
- [ ] Convex query completes in <500ms

**Cross-Browser Testing:**

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Design Decisions and Rationales

### 1. SVG Chart vs. Canvas vs. Library

**Decision:** Use SVG for biorhythm chart

**Rationale:**

- SVG is resolution-independent (scales perfectly on all devices)
- Easier to style with CSS and integrate with design system
- Better accessibility (can add ARIA labels and semantic structure)
- Simpler implementation than Canvas
- No external charting library needed (reduces bundle size)
- Sufficient for simple sine wave visualization

**Trade-offs:**

- Canvas would be faster for complex animations (not needed here)
- Charting libraries (Chart.js, Recharts) would provide more features but add ~50KB to bundle

### 2. Server-Side Calculation via Convex

**Decision:** Perform all biorhythm calculations in Convex queries

**Rationale:**

- Consistent with platform architecture (all features use Convex)
- Calculations are deterministic and fast (<10ms)
- Enables future features (caching, analytics, user accounts)
- Keeps client bundle smaller
- Easier to test and debug server-side

**Trade-offs:**

- Requires network round-trip (~100-200ms)
- Could be done client-side for instant results
- Acceptable because 500ms total time is still fast

### 3. 15-Day Chart Window (Desktop)

**Decision:** Display 7 days before and 7 days after target date

**Rationale:**

- Provides context for trend visualization
- Shows where cycles are heading
- Not too cluttered on desktop screens
- Balances detail with readability

**Trade-offs:**

- Could show more days (30+) but chart becomes harder to read
- Could show fewer days (3-5) but loses trend context
- Mobile reduces to 11 days (5 before/after) for readability

### 4. Romanian-Only UI

**Decision:** All user-facing text in Romanian, no i18n

**Rationale:**

- Target audience is exclusively Romanian speakers
- Simplifies implementation (no translation layer)
- Ensures natural, culturally appropriate language
- Reduces bundle size (no i18n library)

**Trade-offs:**

- Cannot easily expand to other languages later
- Acceptable because product is specifically for Romanian market

### 5. No User Accounts Required

**Decision:** Calculator works without registration or login

**Rationale:**

- Reduces friction for first-time users
- Aligns with "accessible spiritual tools" product goal
- Faster time-to-value (instant results)
- Simpler implementation (no auth flow)

**Trade-offs:**

- Cannot save user's birth date for future visits
- Could add optional accounts later for power users
- Acceptable for MVP and casual users

---

## Performance Considerations

### Bundle Size Optimization

**Strategies:**

- Use native date inputs (no date picker library)
- SVG chart (no charting library)
- Shared components from foundation layer
- Tree-shaking for unused Convex functions

**Target:** <50KB additional JavaScript for biorhythm module

### Rendering Performance

**Strategies:**

- Memoize chart SVG generation with `useMemo`
- Debounce form inputs if needed
- Lazy load chart component if above fold
- Use CSS transforms for animations (GPU-accelerated)

**Target:** 60fps chart rendering, <100ms interaction response

### Network Performance

**Strategies:**

- Convex queries are automatically cached
- Static page generation where possible
- Prefetch critical days query on main page hover
- Compress SVG paths

**Target:** <500ms total query time, <2s page load on 3G

---

## Accessibility Compliance

### WCAG 2.1 Level AA Requirements

**Perceivable:**

- ✅ Text contrast ratio ≥4.5:1 (white on dark background)
- ✅ Chart colors distinguishable (red, blue, green)
- ✅ Alternative text for all visual elements
- ✅ Responsive text sizing (16px minimum)

**Operable:**

- ✅ Keyboard navigation for all interactive elements
- ✅ Visible focus indicators (3px purple ring)
- ✅ Touch targets ≥44×44px
- ✅ No time limits on interactions

**Understandable:**

- ✅ Clear Romanian labels and instructions
- ✅ Consistent navigation and layout
- ✅ Error messages are specific and helpful
- ✅ Predictable behavior (no surprises)

**Robust:**

- ✅ Semantic HTML (form, button, label, etc.)
- ✅ ARIA labels where needed
- ✅ Works with screen readers (NVDA, JAWS, VoiceOver)
- ✅ Valid HTML5 markup

---

## Future Enhancements (Post-MVP)

**Potential Features:**

1. **Biorhythm Comparison:** Compare two people's cycles for compatibility
2. **Extended Forecast:** Show 90-day or 1-year chart
3. **Cycle History:** View past biorhythm states
4. **Email Alerts:** Notify users of upcoming critical days
5. **PDF Export:** Download biorhythm report
6. **Personalized Insights:** AI-generated guidance based on cycles
7. **Integration with Calendar:** Add critical days to Google Calendar
8. **Biorhythm Widgets:** Embeddable chart for other websites

**Not Planned:**

- User accounts (unless needed for other features)
- Social features (comments, sharing results publicly)
- Paid premium features (platform is free with ads)

---

## Dependencies

### External Libraries

**Required:**

- `convex` - Backend queries
- `lucide-react` - Icons (Activity, AlertCircle, CheckCircle, Share2)
- `date-fns` - Date formatting (already in project)

**Not Required:**

- No charting library (using SVG)
- No date picker library (using native inputs)
- No form library (simple controlled inputs)

### Internal Dependencies

**Foundation Layer:**

- `lib/biorhythm.ts` - Calculation functions
- `config/biorhythm.ts` - Configuration
- `components/shared/result-card.tsx` - Card wrapper
- `components/shared/share-button.tsx` - Sharing functionality
- `components/shared/loading-spinner.tsx` - Loading state
- `components/shared/error-message.tsx` - Error display
- `components/layout/main-layout.tsx` - Page layout

---

## Implementation Notes

### Development Order

1. **Convex Functions** (`convex/biorhythm.ts`)
   - Implement `getBiorhythm` query
   - Implement `getCriticalDays` query
   - Test with Convex dashboard

2. **BiorhythmForm** (`components/bioritm/biorhythm-form.tsx`)
   - Build form UI
   - Add validation logic
   - Test with various inputs

3. **BiorhythmChart** (`components/bioritm/biorhythm-chart.tsx`)
   - Generate SVG sine waves
   - Add responsive behavior
   - Test on multiple screen sizes

4. **BiorhythmSummary** (`components/bioritm/biorhythm-summary.tsx`)
   - Display summary text
   - Add cycle indicators
   - Style with design system

5. **CriticalDaysList** (`components/bioritm/critical-days-list.tsx`)
   - Render list of critical days
   - Add badges and icons
   - Handle empty state

6. **Main Page** (`app/bioritm/page.tsx`)
   - Wire up form and results
   - Add loading and error states
   - Test full flow

7. **Critical Days Page** (`app/bioritm/critice/page.tsx`)
   - Implement extended view
   - Add navigation links
   - Test full flow

8. **Polish & Testing**
   - Mobile responsiveness
   - Accessibility audit
   - Performance optimization
   - Cross-browser testing

### Code Style Guidelines

- Use TypeScript strict mode
- Follow kebab-case for file names
- Use `@/` path aliases for imports
- All UI text in Romanian
- Add JSDoc comments for complex functions
- Use Tailwind CSS for styling (no custom CSS)
- Prefer functional components with hooks
- Keep components small and focused (<200 lines)

---

## Success Criteria

**Functional:**

- ✅ User can calculate biorhythm with birth date
- ✅ Chart displays three cycles correctly
- ✅ Summary provides Romanian guidance
- ✅ Critical days are identified accurately
- ✅ Share button works on mobile and desktop

**Performance:**

- ✅ Page loads in <2 seconds on 3G
- ✅ Convex query completes in <500ms
- ✅ Chart renders at 60fps
- ✅ No console errors or warnings

**Quality:**

- ✅ Zero TypeScript errors
- ✅ Lighthouse score >90 (all categories)
- ✅ WCAG AA accessibility compliance
- ✅ Works on Chrome, Firefox, Safari, Edge
- ✅ Mobile-responsive (320px to 1920px)

**User Experience:**

- ✅ Form is intuitive and easy to use
- ✅ Results are visually appealing
- ✅ Romanian text is natural and accurate
- ✅ Error messages are helpful
- ✅ Loading states prevent confusion
