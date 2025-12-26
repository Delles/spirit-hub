# SpiritHub MVP Feature Implementation Plan

> **Goal:** Replace Dream Symbols with Oracle feature + integrate Moon Phase into Energia Zilei

---

## User Review Required

> [!IMPORTANT]
> This plan removes all dream-related functionality. The `/vise` routes and dream search will be deleted.

> [!NOTE]
> Oracle messages need to be written (100 total). AI assistance recommended for initial draft.

---

## Phase 1: Remove Dream Symbols

### [DELETE] Dream Data Files
- `data/dream-symbols.json` (57KB, ~80 symbols)
- `data/dreams-search-index.json` (search index)

### [DELETE] Dream Components
- `components/vise/` (entire directory)
- `components/landing/widgets/dream-widget.tsx`

### [DELETE] Dream Routes
- `app/vise/` (entire directory including `[slug]`, `visul-zilei`)

### [DELETE] Dream Utilities
- `lib/dream-data.ts`
- `scripts/generate-dream-index.ts`

### [MODIFY] [daily-content-provider.tsx](file:///d:/Projects/spirit-hub/components/providers/daily-content-provider.tsx)
- Remove `dailyDream` from context
- Remove dream selection logic

### [MODIFY] [daily-widgets-client.tsx](file:///d:/Projects/spirit-hub/components/landing/daily-widgets-client.tsx)
- Remove `DreamWidget` import and usage
- Prepare slot for `OracleWidget`

---

## Phase 2: Create Oracle Feature

### [NEW] Data Schema: `data/interpretations/oracle.json`
- Create flexible schema for daily messages (Hero, Insight, Action, Mantra).
- Populate with 20 initial messages.

### [NEW] [oracle.ts](file:///d:/Projects/spirit-hub/lib/oracle.ts)
- Implement `getDailyOracle` with deterministic daily rotation.

### [NEW] [oracle-widget.tsx](file:///d:/Projects/spirit-hub/components/landing/widgets/oracle-widget.tsx)
- Glass card design.
- Deep link to `/mesaj-zilnic`.

### [NEW] [mesaj-zilnic/page.tsx](file:///d:/Projects/spirit-hub/app/mesaj-zilnic/page.tsx)
- Full page display of the oracle message.
- Shareable Mantra card.

### [MODIFY] [daily-content-provider.tsx](file:///d:/Projects/spirit-hub/components/providers/daily-content-provider.tsx)
- Add `dailyOracle` to context.

---

## Phase 2b: Oracle UI Polish (New)

> **Goal:** Align Oracle feature UI with "Energia Zilei" design system (Glassmorphism, Stream of Cards).

### [MODIFY] [oracle-widget.tsx](file:///d:/Projects/spirit-hub/components/landing/widgets/oracle-widget.tsx)
- Update container styles to match `BiorhythmWidget`:
    - `bg-black/5 backdrop-blur-sm`
    - `border border-white/10`
    - `hover:shadow-[0_0_50px_rgba(...,0.2)]`
    - Subtle linear gradient overlay.

### [NEW] [oracle-card.tsx](file:///d:/Projects/spirit-hub/components/oracle/oracle-card.tsx)
- **Structure:**
    - Container: `bg-black/40 backdrop-blur-xl ring-1 ring-white/5`.
    - **Hero:** Icon in gradient box, "MESAJUL UNIVERSULUI" subtitle, Title, Markdown Insight.
    - **Action Card:** Styled as the "Tactical Grid" (or similar prominent action box).
    - **Mantra:** Styled exactly like the `EnergiaZileiCard` mantra section.
    - **Share Button:** Integrated into the Mantra section.

### [MODIFY] [mesaj-zilnic/page.tsx](file:///d:/Projects/spirit-hub/app/mesaj-zilnic/page.tsx)
- Refactor to use `OracleCard`.
- Update page header and back button to match `EnergiaZileiClient` layout (Ghost button, Title + Description text).

---

## Phase 3: Enhance Energia Zilei with Moon Phase

### [NEW] Data Schema: `data/interpretations/moon-guide.json`
- 8 phases total (0-7).
- Interpretations for each phase.

### [NEW] [moon-guide.ts](file:///d:/Projects/spirit-hub/lib/moon-guide.ts)
- Calculate moon phase based on date.

### [MODIFY] [energia-zilei.ts](file:///d:/Projects/spirit-hub/lib/energia-zilei.ts)
- Import `getMoonPhase`.

### [MODIFY] [energia-zilei-card.tsx](file:///d:/Projects/spirit-hub/components/bioritm/energia-zilei-card.tsx)
- Add moon phase section below main content.

### [MODIFY] [moon-phase-header.tsx](file:///d:/Projects/spirit-hub/components/landing/moon-phase-header.tsx)
- Make tappable (link to `/bioritm/energia-zilei`).

---

## Phase 4: Verification

### Build Check
```bash
bun run build
bun run typecheck
bun run lint
```

### Functional Tests
- [ ] Homepage loads with Oracle widget
- [ ] Oracle shows same message all day
- [ ] Oracle message changes next day (test with date override)
- [ ] `/mesaj-zilnic` page renders correctly
- [ ] Energia Zilei shows moon phase
- [ ] Moon phase header is tappable
- [ ] No 404s for removed dream routes
- [ ] Mobile responsive check
