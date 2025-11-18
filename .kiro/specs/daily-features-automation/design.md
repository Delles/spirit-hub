# Design Document - Daily Features & Automation

## Overview

This design implements automated daily content selection and a homepage widget that displays three daily features: daily number (Numărul Zilei), daily dream (Visul Zilei), and biorhythm hint. The system leverages existing Convex infrastructure and deterministic algorithms to provide consistent daily content to all users with 99% autonomy.

## Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Convex Cron Jobs                        │
│  ┌──────────────────────┐  ┌──────────────────────────────┐│
│  │ Hourly (0 * * * *)   │  │ Daily (0 0 * * *)            ││
│  │ ensureDailyDream()   │  │ ensureDailyNumber()          ││
│  └──────────┬───────────┘  └──────────┬───────────────────┘│
└─────────────┼──────────────────────────┼──────────────────┘
              │                          │
              ▼                          ▼
    ┌─────────────────────────────────────────────┐
    │         dailyPicks Table (Convex)           │
    │  ┌───────────────────────────────────────┐  │
    │  │ date | type         | contentId       │  │
    │  │ 2025 | daily-dream  | sarpe           │  │
    │  │ 2025 | daily-number | 7               │  │
    │  └───────────────────────────────────────┘  │
    └─────────────────┬───────────────────────────┘
                      │
                      ▼
    ┌─────────────────────────────────────────────┐
    │         Homepage Daily Widget               │
    │  ┌─────────────────────────────────────┐    │
    │  │  Daily Number  │  Daily Dream  │ Bio│    │
    │  │  [7] Căutător  │  [Șarpe]      │ Hint│   │
    │  └─────────────────────────────────────┘    │
    └─────────────────────────────────────────────┘
```

### Component Architecture

```
app/page.tsx (Homepage)
    │
    └─── DailyWidget (new component)
         ├─── DailyNumberCard
         │    └─── Convex: getDailyNumber()
         ├─── DailyDreamCard
         │    └─── Convex: getDailyDream()
         └─── BiorhythmHintCard
              └─── Client-side: getBiorhythmHint()
```

## Components and Interfaces

### 1. Daily Widget Component

**Location:** `components/layout/daily-widget.tsx`

**Purpose:** Container component that displays all three daily features in a responsive grid layout.

**Props:**
```typescript
interface DailyWidgetProps {
  className?: string;
}
```

**Layout:**
- Desktop: 3-column grid (equal width)
- Tablet: 3-column grid (slightly compressed)
- Mobile: Single column stack

**Styling:**
- Follows design.json specifications
- Semi-transparent card background with backdrop blur
- Purple/blue gradient accents
- Responsive padding and gaps

### 2. Daily Number Card

**Location:** `components/layout/daily-widget.tsx` (internal component)

**Purpose:** Displays the daily numerology number with title and short description.

**Data Source:** Convex query `getDailyNumber(date: string)`

**Features:**
- Large animated number display (similar to result-card.tsx)
- Master Number badge (11, 22, 33) with special styling
- Title and short description from interpretation
- Click-through link to `/numerologie/numar-zilnic`
- Loading and error states

**Master Number Detection:**
```typescript
const isMasterNumber = (num: number): boolean => {
  return num === 11 || num === 22 || num === 33;
};
```

### 3. Daily Dream Card

**Location:** `components/layout/daily-widget.tsx` (internal component)

**Purpose:** Displays the daily dream symbol with name and short meaning.

**Data Source:** Convex query `getDailyDream(date: string)`

**Features:**
- Dream symbol name with category badge
- Short meaning (1-2 sentences)
- Click-through link to `/vise/visul-zilei`
- Loading and error states

### 4. Biorhythm Hint Card

**Location:** `components/layout/daily-widget.tsx` (internal component)

**Purpose:** Displays a generic biorhythm hint based on day of the week.

**Data Source:** Client-side function (no database query needed)

**Features:**
- Day-of-week based hint rotation
- Brief suggestion (2-3 sentences)
- Click-through link to `/bioritm`
- No loading state (instant)

**Hint Rotation Logic:**
```typescript
const biorhythmHints: Record<number, { title: string; hint: string }> = {
  0: { // Sunday
    title: "Zi de Odihnă",
    hint: "Duminica este perfectă pentru regenerare. Acordă-ți timp pentru relaxare și reflecție."
  },
  1: { // Monday
    title: "Energie Fizică",
    hint: "Începutul săptămânii aduce energie fizică crescută. Profită de acest moment pentru activități intense."
  },
  // ... etc for all 7 days
};
```

## Data Models

### Daily Picks Table (Existing)

Already defined in `convex/schema.ts`:

```typescript
dailyPicks: defineTable({
  date: v.string(), // ISO date string (YYYY-MM-DD)
  type: v.string(), // "daily-number" | "daily-dream"
  contentId: v.string(), // Reference to interpretation or dream symbol
  createdAt: v.number(), // Timestamp
}).index("by_date_and_type", ["date", "type"])
```

**Usage:**
- `type: "daily-number"` → `contentId` stores the number as string (e.g., "7", "11", "22")
- `type: "daily-dream"` → `contentId` stores the dream symbol slug (e.g., "sarpe")

### Interpretations Table (Existing)

Already defined in `convex/schema.ts`:

```typescript
interpretations: defineTable({
  type: v.string(), // "daily" for daily numbers
  number: v.number(), // 1-9, 11, 22, 33
  title: v.string(),
  description: v.string(),
  fullText: v.string(),
  createdAt: v.number(),
}).index("by_type_and_number", ["type", "number"])
```

**Note:** Daily number interpretations already exist (seeded via `seedInterpretations` mutation).

## Convex Functions

### 1. Daily Number Persistence (New)

**File:** `convex/numerology.ts`

**Function:** `ensureDailyNumber` (internal mutation)

**Purpose:** Ensures daily number is persisted in dailyPicks table for the target date.

**Implementation:**
```typescript
export const ensureDailyNumber = internalMutation({
  args: {
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Resolve target ISO date in RO timezone
    const targetDate = args.date ?? isoDateInBucharest(new Date());

    // If already persisted, nothing to do
    const existing = await ctx.db
      .query("dailyPicks")
      .withIndex("by_date_and_type", (q) => 
        q.eq("date", targetDate).eq("type", "daily-number")
      )
      .first();
    
    if (existing) {
      return { date: targetDate, persisted: false, number: existing.contentId };
    }

    // Calculate daily number deterministically
    const date = new Date(targetDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Use reduceToSingleDigit from lib/numerology.ts
    // This preserves Master Numbers (11, 22, 33)
    const sum = day + month + year;
    const dailyNumber = reduceToSingleDigit(sum);

    // Persist the daily pick
    await ctx.db.insert("dailyPicks", {
      date: targetDate,
      type: "daily-number",
      contentId: String(dailyNumber),
      createdAt: Date.now(),
    });

    return { date: targetDate, persisted: true, number: String(dailyNumber) };
  },
});
```

**Helper Function:**
```typescript
function isoDateInBucharest(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  
  return `${year}-${month}-${day}`;
}
```

### 2. Update getDailyNumber Query (Modified)

**File:** `convex/numerology.ts`

**Modification:** Check dailyPicks table first before calculating.

**Updated Implementation:**
```typescript
export const getDailyNumber = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    // First, check persisted daily picks
    const existingPick = await ctx.db
      .query("dailyPicks")
      .withIndex("by_date_and_type", (q) => 
        q.eq("date", args.date).eq("type", "daily-number")
      )
      .first();

    let dailyNumber: number;

    if (existingPick) {
      // Use persisted number
      dailyNumber = parseInt(existingPick.contentId, 10);
    } else {
      // Calculate on-demand (fallback)
      const date = new Date(args.date);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const sum = day + month + year;
      dailyNumber = reduceToSingleDigit(sum);
    }

    // Fetch interpretation
    const interpretation = await ctx.db
      .query("interpretations")
      .withIndex("by_type_and_number", (q) => 
        q.eq("type", "daily").eq("number", dailyNumber)
      )
      .first();

    if (!interpretation) {
      throw new Error(`Nu s-a găsit interpretarea zilnică pentru numărul ${dailyNumber}`);
    }

    return {
      ...interpretation,
      date: args.date,
    };
  },
});
```

### 3. Cron Job Configuration (Modified)

**File:** `convex/crons.ts`

**Add:** Daily cron job for daily number persistence.

**Updated Implementation:**
```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run hourly at minute 0 (existing)
crons.cron(
  "ensure-daily-dream-persisted",
  "0 * * * *",
  internal.dreams.ensureDailyDream,
  {}
);

// Run daily at 00:00 UTC (new)
crons.cron(
  "ensure-daily-number-persisted",
  "0 0 * * *",
  internal.numerology.ensureDailyNumber,
  {}
);

export default crons;
```

**Rationale:**
- Hourly job for dreams covers DST changes and ensures persistence near midnight RO time
- Daily job at 00:00 UTC for numbers is sufficient (runs at 02:00/03:00 RO time depending on DST)
- Both jobs are idempotent - safe to run multiple times

## Client-Side Logic

### Biorhythm Hint Generation

**Location:** `lib/biorhythm.ts` (new function)

**Function:** `getBiorhythmHintForDay(date: Date)`

**Purpose:** Returns a generic biorhythm hint based on day of the week.

**Implementation:**
```typescript
export interface BiorhythmHint {
  title: string;
  hint: string;
  dayOfWeek: string;
}

export function getBiorhythmHintForDay(date: Date): BiorhythmHint {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  const hints: Record<number, { title: string; hint: string }> = {
    0: {
      title: "Zi de Odihnă",
      hint: "Duminica este perfectă pentru regenerare. Acordă-ți timp pentru relaxare și reflecție interioară."
    },
    1: {
      title: "Energie Fizică",
      hint: "Începutul săptămânii aduce energie fizică crescută. Profită de acest moment pentru activități intense."
    },
    2: {
      title: "Claritate Mentală",
      hint: "Marți este ideal pentru gândire analitică și rezolvare de probleme. Concentrează-te pe sarcini complexe."
    },
    3: {
      title: "Echilibru Emoțional",
      hint: "Mijlocul săptămânii favorizează conexiunile emoționale. Dedică timp relațiilor importante."
    },
    4: {
      title: "Creativitate",
      hint: "Joi stimulează creativitatea și expresia personală. Explorează idei noi și proiecte artistice."
    },
    5: {
      title: "Socializare",
      hint: "Vineri este perfect pentru interacțiuni sociale și activități de grup. Conectează-te cu prietenii."
    },
    6: {
      title: "Reflecție",
      hint: "Sâmbăta încurajează introspecția și planificarea. Evaluează-ți progresul și stabilește obiective."
    },
  };

  const dayNames = [
    "Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"
  ];

  return {
    ...hints[dayOfWeek],
    dayOfWeek: dayNames[dayOfWeek],
  };
}
```

## Error Handling

### Widget-Level Error Handling

Each card in the widget handles errors independently:

```typescript
// Daily Number Card
try {
  const dailyNumber = useQuery(api.numerology.getDailyNumber, { 
    date: todayISO 
  });
  
  if (dailyNumber === undefined) {
    return <LoadingSpinner />;
  }
  
  // Render card
} catch (error) {
  return (
    <ErrorCard 
      title="Numărul Zilei" 
      message="Momentan nu putem afișa numărul zilei. Te rugăm să revii mai târziu."
      linkTo="/numerologie/numar-zilnic"
    />
  );
}
```

**Fallback Strategy:**
- If one card fails, others continue to display
- Error messages are user-friendly in Romanian
- Links to full pages remain functional
- Errors are logged to console for monitoring

### Cron Job Error Handling

Cron jobs are designed to be fault-tolerant:

1. **Idempotency:** Safe to run multiple times
2. **Graceful Degradation:** If persistence fails, queries fall back to on-demand calculation
3. **Logging:** Errors are logged but don't crash the system
4. **Retry:** Hourly/daily execution provides automatic retry

## Performance Optimization

### Caching Strategy

1. **Database-Level Caching:**
   - Daily picks are persisted in `dailyPicks` table
   - Queries check cache first before calculating
   - Cache invalidates automatically at date change

2. **Component-Level Caching:**
   - Convex queries are automatically cached by React Query
   - Stale-while-revalidate pattern ensures fast loads

3. **Static Generation:**
   - Homepage can be statically generated with ISR
   - Revalidate every hour to pick up new daily content

### Load Time Targets

- **Widget Initial Load:** < 500ms
- **Individual Card Load:** < 200ms
- **Error State Display:** Instant

### Optimization Techniques

1. **Parallel Queries:** All three cards query simultaneously
2. **Minimal Data Transfer:** Only fetch necessary fields
3. **Lazy Loading:** Widget loads after hero content
4. **Skeleton States:** Show loading skeletons for better UX

## Testing Strategy

### Unit Tests

1. **Biorhythm Hint Function:**
   - Test all 7 days of week
   - Verify Romanian text correctness
   - Check return type structure

2. **Daily Number Calculation:**
   - Test Master Number preservation (11, 22, 33)
   - Test regular number reduction (1-9)
   - Test edge cases (leap years, etc.)

### Integration Tests

1. **Cron Jobs:**
   - Verify daily number persistence
   - Verify dream persistence
   - Test idempotency

2. **Widget Component:**
   - Test loading states
   - Test error states
   - Test successful data display
   - Test responsive layout

### Manual Testing

1. **Visual Regression:**
   - Test on mobile, tablet, desktop
   - Verify dark theme styling
   - Check Master Number badges

2. **User Flow:**
   - Click through to full pages
   - Verify links work correctly
   - Test error recovery

## Deployment Checklist

### Pre-Deployment

- [ ] Run `seedInterpretations` mutation (if not already done)
- [ ] Run `seedDreamSymbols` mutation (if not already done)
- [ ] Verify cron jobs are configured in Convex dashboard
- [ ] Test widget on staging environment

### Post-Deployment

- [ ] Monitor cron job execution logs
- [ ] Verify daily picks are being persisted
- [ ] Check widget load times in production
- [ ] Monitor error rates

### Rollback Plan

If issues occur:
1. Widget can be hidden via feature flag
2. Cron jobs can be disabled in Convex dashboard
3. Queries fall back to on-demand calculation
4. No data loss - dailyPicks table remains intact

## Future Enhancements

### Phase 3.2 Considerations

1. **OG Images:** Generate dynamic OG images for daily content
2. **Share Functionality:** Add share buttons to widget cards
3. **Personalization:** Consider user-specific biorhythm hints (requires birth date)
4. **Analytics:** Track widget engagement and click-through rates

### Potential Improvements

1. **Animation:** Add subtle animations to number/dream changes
2. **Notifications:** Optional daily notifications for returning users
3. **History:** Show previous daily picks in a calendar view
4. **Favorites:** Allow users to save favorite daily picks

## Technical Debt

### Known Limitations

1. **Timezone Handling:** Currently uses Europe/Bucharest hardcoded
   - Future: Make timezone configurable per user

2. **Master Number Interpretations:** Need to verify all Master Number interpretations are seeded
   - Action: Add validation in seedInterpretations mutation

3. **Biorhythm Hints:** Currently generic day-of-week hints
   - Future: Consider more sophisticated hint generation

### Maintenance Notes

1. **Cron Job Monitoring:** Set up alerts for failed cron executions
2. **Content Updates:** Daily interpretations may need periodic review/updates
3. **Performance Monitoring:** Track widget load times and optimize if needed

## References

- Requirements: `.kiro/specs/daily-features-automation/requirements.md`
- Design System: `docs/design.json`
- Existing Cron Jobs: `convex/crons.ts`
- Numerology Logic: `lib/numerology.ts`
- Dream Logic: `convex/dreams.ts`
