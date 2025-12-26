# SpiritHub MVP Feature Swap

## Overview
Replace Dream Symbols with Oracle feature + enhance Energia Zilei with Moon Phase.

---

## Phase 1: Remove Dream Symbols
- [x] Delete dream-related data files
- [x] Remove dream components
- [x] Remove dream routes/pages
- [x] Clean up dream utilities
- [x] Update homepage grid layout

## Phase 2: Create Oracle Feature ("Mesajul Universului")
- [x] Create `oracle.json` (20 messages created, scalable to 100)
- [x] Create `lib/oracle.ts` with selection logic
- [x] Build `OracleWidget` component for homepage
- [x] Create `/mesaj-zilnic` full page
- [x] Add Oracle to `DailyContentProvider`
- [x] Integrate widget into homepage grid

## Phase 2b: Oracle UI Polish
- [x] Update `OracleWidget` styling (glassmorphism/blur)
- [x] Create `OracleCard` component (Stream of Cards layout)
- [x] Refactor `/mesaj-zilnic` page to use `OracleCard`

## Phase 3: Enhance Energia Zilei with Moon Phase
- [ ] Create `moon-guide.json` with 8 phase interpretations
- [ ] Create `lib/moon-guide.ts` with phase calculation
- [ ] Update `EnergiaZileiData` interface
- [ ] Update Energia Zilei page to show moon integration
- [ ] Update moon phase header to be tappable

## Phase 4: Verification & Polish
- [x] Fix static generation issue for `/mesaj-zilnic`
- [x] Run build verification
- [x] Test Oracle daily rotation (via build verification of dynamic route)
- [ ] Test Moon Phase calculation
- [ ] Verify homepage layout
- [ ] Browser testing
- [ ] Create walkthrough documentation
