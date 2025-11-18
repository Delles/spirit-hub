# Design Document - Dream Interpretation Module

## Overview

The Dream Interpretation Module is the most complex feature of SpiritHub.ro, providing a searchable Romanian dream dictionary with multi-symbol interpretation capabilities and daily featured content. The module leverages Convex's search functionality, React's state management, and the existing design system to deliver a fast, intuitive user experience.

### Key Design Goals

1. **Fast Search Performance**: Sub-300ms search results using Convex search indexes and debounced input
2. **Scalable Data Model**: Support for 100+ symbols at launch, expandable to 500+ without performance degradation
3. **Intuitive Multi-Symbol Flow**: Clear UI for selecting and combining 2-3 dream symbols
4. **Consistent UX**: Reuse existing components (result-card, share-button) and design patterns
5. **99% Autonomy**: Deterministic daily dream selection requiring no manual intervention

## Architecture

### High-Level Component Structure

```
app/vise/
├── page.tsx (Server Component - Search Interface)
├── client.tsx (Client Component - Interactive Search)
├── interpretare/
│   ├── page.tsx (Server Component - Multi-Symbol)
│   └── client.tsx (Client Component - Symbol Selection)
└── visul-zilei/
    ├── page.tsx (Server Component - Daily Dream)
    └── client.tsx (Client Component - Display)

components/vise/
├── dream-search-input.tsx (Debounced search bar)
├── dream-result-list.tsx (Search results display)
├── dream-detail-card.tsx (Full interpretation view)
└── dream-combo-form.tsx (Multi-symbol selector)

convex/
├── dreams.ts (Queries and mutations)
└── schema.ts (dreamSymbols table - already defined)

lib/
└── dreams.ts (Pure functions - already implemented)
```

### Data Flow

1. **Search Flow**: User types → Debounce (300ms) → Convex search query → Results display
2. **Detail Flow**: User clicks symbol → Fetch by slug → Display full interpretation
3. **Multi-Symbol Flow**: User selects symbols → Combine interpretations → Display result
4. **Daily Dream Flow**: Page loads → Calculate date → Fetch deterministic symbol → Display

## Components and Interfaces

### 1. Dream Search Input Component

**File**: `components/vise/dream-search-input.tsx`

**Purpose**: Debounced search input with loading states and accessibility

**Props Interface**:

```typescript
interface DreamSearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}
```

**Key Features**:

- Uses `use-debounced-value` hook (300ms delay)
- Search icon with proper ARIA labels
- Loading spinner during search
- Minimum 2 characters validation
- Romanian placeholder text
- Touch-friendly (44x44px minimum)

**Implementation Notes**:

- Client component ("use client")
- Controlled input with local state
- Debounced value triggers parent onSearch callback
- Clear button when query has content

### 2. Dream Result List Component

**File**: `components/vise/dream-result-list.tsx`

**Purpose**: Display search results with category badges and short descriptions

**Props Interface**:

```typescript
interface DreamResultListProps {
  symbols: DreamSymbol[];
  onSelectSymbol: (symbol: DreamSymbol) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}
```

**Key Features**:

- Grid layout (1 column mobile, 2 columns tablet+)
- Category badge with color coding
- Short description preview (2 lines max, ellipsis)
- Hover/focus states for accessibility
- Loading skeleton states
- Empty state with Romanian message

**Implementation Notes**:

- Uses shadcn/ui Card component
- Badge component for categories
- Click handler for symbol selection
- Keyboard navigation support (Enter/Space)

### 3. Dream Detail Card Component

**File**: `components/vise/dream-detail-card.tsx`

**Purpose**: Display full dream symbol interpretation with sharing

**Props Interface**:

```typescript
interface DreamDetailCardProps {
  symbol: DreamSymbol;
  onClose?: () => void;
  showBackButton?: boolean;
}
```

**Key Features**:

- Extends shared result-card component
- Symbol name as title
- Category badge
- Full interpretation with prose styling
- Share button integration
- Optional close/back button
- Related symbols section (future enhancement)

**Implementation Notes**:

- Reuses `components/shared/result-card.tsx`
- Share URL format: `/vise/${symbol.slug}`
- Romanian share title: "Interpretare vis: {symbol.name}"

### 4. Dream Combo Form Component

**File**: `components/vise/dream-combo-form.tsx`

**Purpose**: Multi-symbol selector with combination functionality

**Props Interface**:

```typescript
interface DreamComboFormProps {
  availableSymbols: DreamSymbol[];
  onCombine: (symbols: DreamSymbol[]) => void;
  maxSymbols?: number; // Default: 3
}
```

**Key Features**:

- Search/autocomplete for symbol selection
- Selected symbols display with remove buttons
- Visual counter (e.g., "2/3 simboluri selectate")
- Combine button (disabled if < 2 symbols)
- Validation messages in Romanian
- Clear all button

**Implementation Notes**:

- Uses Combobox pattern (shadcn/ui)
- Local state for selected symbols
- Validation before calling onCombine
- Accessible labels and error messages

## Data Models

### DreamSymbol Interface

Already defined in `lib/dreams.ts`:

```typescript
interface DreamSymbol {
  id: string;
  name: string;
  slug: string;
  category: string;
  interpretation: string;
  shortDescription?: string;
}
```

### Convex Schema

Already defined in `convex/schema.ts`:

```typescript
dreamSymbols: defineTable({
  name: v.string(),
  slug: v.string(),
  category: v.string(),
  shortMeaning: v.string(),
  fullInterpretation: v.string(),
  keywords: v.array(v.string()),
  createdAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_category", ["category"])
  .searchIndex("search_symbols", {
    searchField: "name",
    filterFields: ["category"],
  });
```

### Mapping Strategy

Convex schema → DreamSymbol interface:

- `name` → `name`
- `slug` → `slug`
- `category` → `category`
- `shortMeaning` → `shortDescription`
- `fullInterpretation` → `interpretation`
- `_id` → `id`

## Convex Backend Design

### File: `convex/dreams.ts`

#### Query: searchDreamSymbols

**Purpose**: Search dream symbols by name with optional category filter

**Signature**:

```typescript
export const searchDreamSymbols = query({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

**Logic**:

1. If query is empty, return all symbols (up to limit)
2. Use Convex search index on `name` field
3. Filter by category if provided
4. Limit results (default: 20, max: 50)
5. Map Convex documents to DreamSymbol interface
6. Return sorted by relevance

**Performance**: <100ms using search index

#### Query: getDreamSymbol

**Purpose**: Fetch single dream symbol by slug

**Signature**:

```typescript
export const getDreamSymbol = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

**Logic**:

1. Query by slug using `by_slug` index
2. Return null if not found
3. Map to DreamSymbol interface

**Performance**: <50ms using index

#### Query: getDailyDream

**Purpose**: Get deterministic daily dream symbol

**Signature**:

```typescript
export const getDailyDream = query({
  args: { date: v.string() }, // ISO date: "2025-11-17"
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

**Logic**:

1. Hash the date string to get a deterministic number
2. Get total count of dream symbols
3. Use modulo to select index: `hash(date) % totalCount`
4. Fetch symbol at that index
5. Return mapped DreamSymbol

**Determinism**: Same date always returns same symbol for all users

#### Mutation: seedDreamSymbols

**Purpose**: Bulk import dream symbols from JSON data

**Signature**:

```typescript
export const seedDreamSymbols = mutation({
  args: {
    symbols: v.array(
      v.object({
        name: v.string(),
        category: v.string(),
        shortMeaning: v.string(),
        fullInterpretation: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

**Logic**:

1. Validate each symbol has required fields
2. Generate slug using `generateSlug()` from lib/dreams.ts
3. Extract keywords from name and interpretation
4. Check for existing slug to prevent duplicates
5. Insert new symbols with timestamp
6. Return count of inserted symbols

**Idempotency**: Skip symbols with existing slugs

## Page Designs

### 1. Main Search Page (`app/vise/page.tsx` + `client.tsx`)

**Layout**:

```
┌─────────────────────────────────────┐
│ Header: "Interpretare Vise"        │
│ [Back Button]                       │
├─────────────────────────────────────┤
│                                     │
│  [Moon Icon]                        │
│  Dicționar de Interpretare Vise     │
│  Peste 100 de simboluri explicate   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🔍 Caută simboluri...         │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌─────────────┐ ┌─────────────┐  │
│  │ Șarpe       │ │ Apă         │  │
│  │ [Animale]   │ │ [Natură]    │  │
│  │ Transformare│ │ Emoții...   │  │
│  └─────────────┘ └─────────────┘  │
│                                     │
│  [Link: Interpretare Vis Complex]  │
│  [Link: Visul Zilei]               │
│                                     │
└─────────────────────────────────────┘
```

**Features**:

- Server component for metadata
- Client component for search interactivity
- DreamSearchInput with debouncing
- DreamResultList showing results
- Click symbol → expand inline or navigate to detail
- Links to multi-symbol and daily dream pages

### 2. Multi-Symbol Interpreter (`app/vise/interpretare/page.tsx` + `client.tsx`)

**Layout**:

```
┌─────────────────────────────────────┐
│ Header: "Interpretare Vis Complex" │
│ [Back Button]                       │
├─────────────────────────────────────┤
│                                     │
│  Selectează 2-3 simboluri din vis   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Caută și selectează simboluri │ │
│  └───────────────────────────────┘ │
│                                     │
│  Simboluri selectate (2/3):         │
│  ┌─────────────┐ ┌─────────────┐  │
│  │ Șarpe [X]   │ │ Apă [X]     │  │
│  └─────────────┘ └─────────────┘  │
│                                     │
│  [Combină Interpretările]           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Interpretare Combinată:     │   │
│  │ Visul tău combină șarpele   │   │
│  │ și apa...                   │   │
│  │ [Share Button]              │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Features**:

- DreamComboForm for symbol selection
- Validation (2-3 symbols required)
- Combined interpretation display
- Uses `combineInterpretations()` from lib/dreams.ts
- Share combined result

### 3. Daily Dream Page (`app/vise/visul-zilei/page.tsx` + `client.tsx`)

**Layout**:

```
┌─────────────────────────────────────┐
│ Header: "Visul Zilei"              │
│ [Back Button]                       │
├─────────────────────────────────────┤
│                                     │
│  [Moon Icon]                        │
│  Visul Zilei                        │
│  17 noiembrie 2025                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Șarpe                       │   │
│  │ [Animale Badge]             │   │
│  │                             │   │
│  │ Șarpele în vis simbolizează │   │
│  │ transformare și reînnoire...│   │
│  │                             │   │
│  │ [Share Button]              │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Link: Caută alte simboluri]      │
│                                     │
└─────────────────────────────────────┘
```

**Features**:

- Fetches daily dream using getDailyDream query
- Romanian date formatting
- DreamDetailCard for display
- Link back to main search

## Error Handling

### Search Errors

**Scenario**: Convex query fails or times out

**Handling**:

1. Catch error in client component
2. Display Romanian error message: "Nu am putut căuta simboluri. Te rugăm să încerci din nou."
3. Provide retry button
4. Log error to console for debugging

### Symbol Not Found

**Scenario**: User navigates to invalid slug

**Handling**:

1. getDreamSymbol returns null
2. Display 404-style message: "Simbolul nu a fost găsit"
3. Provide link back to search page
4. Suggest similar symbols (future enhancement)

### Empty Search Results

**Scenario**: No symbols match query

**Handling**:

1. Display fallback message from config/dreams.ts
2. Suggest checking spelling
3. Show popular symbols as alternatives
4. Keep search input visible for retry

### Multi-Symbol Validation

**Scenario**: User tries to combine < 2 or > 3 symbols

**Handling**:

1. Disable combine button when invalid
2. Display validation message:
   - < 2: "Selectează cel puțin 2 simboluri"
   - > 3: "Poți selecta maximum 3 simboluri"
3. Visual feedback (red border, warning icon)

## Testing Strategy

### Unit Tests

**lib/dreams.ts** (already tested):

- ✅ generateSlug() with Romanian diacritics
- ✅ searchSymbols() with fuzzy matching
- ✅ combineInterpretations() with 2-3 symbols

**New Tests Needed**:

- Convex queries (mock Convex context)
- Component rendering (React Testing Library)
- Search debouncing behavior
- Multi-symbol validation logic

### Integration Tests

**Search Flow**:

1. User types "șarpe"
2. Debounce waits 300ms
3. Query executes
4. Results display
5. User clicks result
6. Detail view shows

**Multi-Symbol Flow**:

1. User searches and selects "șarpe"
2. User searches and selects "apă"
3. Combine button enables
4. User clicks combine
5. Combined interpretation displays
6. Share button works

**Daily Dream Flow**:

1. Page loads with today's date
2. Query fetches deterministic symbol
3. Symbol displays correctly
4. Same symbol for all users on same day

### Manual Testing Checklist

- [ ] Search works on mobile (touch, keyboard)
- [ ] Debouncing prevents excessive queries
- [ ] Romanian diacritics display correctly
- [ ] Category badges have correct colors
- [ ] Share functionality works (Web Share API + fallback)
- [ ] Loading states prevent layout shift
- [ ] Error messages are clear and helpful
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces results
- [ ] Dark theme looks polished

## Performance Optimization

### Search Performance

**Target**: <300ms from keystroke to results display

**Optimizations**:

1. Convex search index on `name` field
2. 300ms debounce to reduce query frequency
3. Limit results to 20 (configurable)
4. Client-side caching of recent searches (future)

### Page Load Performance

**Target**: <2s initial load on 3G

**Optimizations**:

1. Server components for static content
2. Client components only where needed
3. Code splitting by route
4. Lazy load DreamDetailCard
5. Optimize images (if any)

### Bundle Size

**Target**: <50KB for dream module

**Optimizations**:

1. Reuse existing components (result-card, share-button)
2. Tree-shake unused utilities
3. Dynamic imports for heavy components
4. Minimize dependencies

## Accessibility

### ARIA Labels

- Search input: `aria-label="Caută simboluri onirice"`
- Search button: `aria-label="Caută"`
- Result items: `aria-label="Simbol: {name}, Categorie: {category}"`
- Close buttons: `aria-label="Închide"`
- Share buttons: `aria-label="Distribuie interpretarea"`

### Keyboard Navigation

- Tab: Navigate between interactive elements
- Enter/Space: Activate buttons and select symbols
- Escape: Close modals/detail views
- Arrow keys: Navigate result list (future enhancement)

### Screen Reader Support

- Announce search results count: "Am găsit 5 simboluri"
- Announce loading state: "Se caută..."
- Announce errors: "Eroare: {message}"
- Semantic HTML (headings, lists, buttons)

### Focus Management

- Focus search input on page load
- Focus first result after search
- Focus close button when detail opens
- Visible focus indicators (3px ring)

## Design System Integration

### Colors

From `docs/design.json`:

**Category Badge Colors**:

- Animale: `text-red-400` / `bg-red-400/10`
- Natură: `text-green-400` / `bg-green-400/10`
- Obiecte: `text-blue-400` / `bg-blue-400/10`
- Emoții: `text-purple-400` / `bg-purple-400/10`
- Persoane: `text-yellow-400` / `bg-yellow-400/10`
- Acțiuni: `text-orange-400` / `bg-orange-400/10`
- Locuri: `text-cyan-400` / `bg-cyan-400/10`

**Interactive States**:

- Hover: `hover:bg-accent`
- Focus: `focus-visible:ring-2 focus-visible:ring-primary/50`
- Active: `active:scale-[0.98]`

### Typography

- Page title: `text-3xl font-bold`
- Section heading: `text-2xl font-semibold`
- Symbol name: `text-xl font-semibold`
- Body text: `text-base text-muted-foreground`
- Category badge: `text-xs font-medium`

### Spacing

- Page padding: `px-4 py-12`
- Card padding: `p-6`
- Gap between elements: `gap-4` (16px)
- Section margin: `mb-8` (32px)

### Components

- Cards: `rounded-lg border bg-card shadow-sm`
- Buttons: shadcn/ui Button component
- Inputs: shadcn/ui Input component
- Badges: shadcn/ui Badge component

## Future Enhancements

### Phase 1 (Post-MVP)

- Individual symbol pages (`/vise/[slug]`)
- Related symbols suggestions
- Symbol favorites (localStorage)
- Recent searches history

### Phase 2 (Advanced)

- Advanced search filters (by category, keywords)
- Symbol comparison view
- User-submitted interpretations (moderated)
- Dream journal feature

### Phase 3 (Premium)

- AI-powered dream analysis
- Personalized interpretations
- Dream pattern tracking
- Export dream journal as PDF

## Migration Notes

### Existing Code to Preserve

- `lib/dreams.ts` - All functions working correctly
- `config/dreams.ts` - Configuration complete
- `convex/schema.ts` - dreamSymbols table defined
- `hooks/use-debounced-value.ts` - Ready to use

### Existing Code to Update

- `app/vise/page.tsx` - Replace placeholder with working search
- Remove disabled attribute from search input
- Add client component for interactivity

### New Code to Create

- `convex/dreams.ts` - All queries and mutations
- `components/vise/*` - All 4 components
- `app/vise/interpretare/*` - Multi-symbol pages
- `app/vise/visul-zilei/*` - Daily dream pages
- Dream symbols dataset (JSON or seed script)

## Data Seeding Strategy

### Initial Dataset

**Minimum Viable Product**: 100 symbols

**Category Distribution**:

- Animale: 20 symbols (șarpe, pisică, câine, pasăre, etc.)
- Natură: 20 symbols (apă, foc, pădure, munte, etc.)
- Obiecte: 15 symbols (casă, mașină, cheie, etc.)
- Emoții: 15 symbols (frică, bucurie, tristețe, etc.)
- Persoane: 10 symbols (mamă, tată, străin, etc.)
- Acțiuni: 10 symbols (zbor, cădere, fugă, etc.)
- Locuri: 10 symbols (școală, biserică, piață, etc.)

### Data Format

JSON structure for seeding:

```json
{
  "symbols": [
    {
      "name": "Șarpe",
      "category": "animale",
      "shortMeaning": "Transformare și reînnoire spirituală",
      "fullInterpretation": "Șarpele în vis simbolizează transformare profundă și reînnoire spirituală. Poate indica schimbări majore în viața ta sau nevoia de a lăsa în urmă vechile obiceiuri. În tradiția românească, șarpele este adesea asociat cu înțelepciune și vindecare, dar și cu pericole ascunse. Acordă atenție contextului visului pentru a înțelege mesajul complet."
    }
  ]
}
```

### Seeding Process

1. Create `data/dream-symbols.json` with 100+ symbols
2. Run `seedDreamSymbols` mutation from Convex dashboard
3. Verify symbols in database
4. Test search functionality
5. Expand dataset incrementally to 500+ symbols

## Success Metrics

### Technical Metrics

- Search response time: <300ms (p95)
- Page load time: <2s (p95)
- Zero TypeScript errors
- Zero console errors in production
- Lighthouse score >90

### Functional Metrics

- 100+ symbols available at launch
- Search returns relevant results
- Multi-symbol combination works correctly
- Daily dream changes each day
- Share functionality works on all platforms

### UX Metrics

- Mobile-responsive on all screen sizes
- Touch targets ≥44x44px
- Keyboard navigation works
- Screen reader compatible
- Romanian text displays correctly with diacritics
