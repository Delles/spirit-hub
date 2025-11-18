# Implementation Plan - Dream Interpretation Module

## Overview

This implementation plan breaks down the Dream Interpretation Module into discrete, manageable coding tasks. Each task builds incrementally on previous work, with all tasks focused on writing, modifying, or testing code. The plan follows implementation-first development, with optional testing tasks marked with \*.

## Task List

- [x] 1. Create dream symbols dataset and seeding infrastructure
  - Create JSON file with 100+ Romanian dream symbols across 7 categories
  - Each symbol must include: name, category, shortMeaning, fullInterpretation
  - Ensure proper Romanian diacritics (ă, â, î, ș, ț) in all text
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 1.1 Create dream symbols JSON dataset
  - Create `data/dream-symbols.json` with minimum 100 symbols
  - Distribute across categories: animale (20), natură (20), obiecte (15), emoții (15), persoane (10), acțiuni (10), locuri (10)
  - Write authentic Romanian interpretations based on traditional folklore
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [x] 1.2 Implement Convex seedDreamSymbols mutation
  - Create `convex/dreams.ts` file
  - Implement mutation accepting array of symbol objects
  - Generate slugs using `generateSlug()` from lib/dreams.ts
  - Extract keywords from name and interpretation text
  - Add timestamp and validate required fields
  - Check for existing slugs to prevent duplicates (idempotency)
  - _Requirements: 6.4, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 1.3 Test seeding process
  - Run seedDreamSymbols mutation from Convex dashboard
  - Verify all 100+ symbols inserted correctly
  - Check slug generation and keyword extraction
  - Validate Romanian diacritics preserved
  - _Requirements: 1.1, 9.7_

- [x] 2. Implement Convex backend queries
  - Create all query functions in `convex/dreams.ts`
  - Use Convex search indexes for performance
  - Map Convex documents to DreamSymbol interface
  - Handle null cases gracefully
  - _Requirements: 6.1, 6.2, 6.3, 6.6, 6.7_

- [x] 2.1 Implement searchDreamSymbols query
  - Accept query string, optional category filter, and limit parameter
  - Use Convex search index on `name` field
  - Return empty array for queries < 2 characters
  - Filter by category if provided
  - Limit results (default 20, max 50)
  - Map to DreamSymbol interface with proper field mapping
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 6.1, 6.5, 6.6_

- [x] 2.2 Implement getDreamSymbol query
  - Accept slug parameter
  - Query using `by_slug` index for performance
  - Return null if symbol not found
  - Map Convex document to DreamSymbol interface
  - _Requirements: 3.1, 6.2, 6.6, 6.7_

- [x] 2.3 Implement getDailyDream query
  - Accept ISO date string parameter (YYYY-MM-DD)
  - Hash date string to generate deterministic number
  - Get total count of dream symbols
  - Calculate index using modulo: hash(date) % totalCount
  - Fetch symbol at calculated index
  - Return mapped DreamSymbol
  - _Requirements: 5.1, 5.2, 5.3, 6.3, 6.6_

- [x] 2.4 Write unit tests for Convex queries
  - Test searchDreamSymbols with various queries
  - Test getDreamSymbol with valid and invalid slugs
  - Test getDailyDream determinism (same date = same symbol)
  - Mock Convex context for isolated testing
  - _Requirements: 2.3, 6.7, 8.6_

- [x] 3. Create dream search input component
  - Build reusable search input with debouncing
  - Implement loading states and validation
  - Ensure accessibility and mobile-friendliness
  - _Requirements: 2.1, 2.7, 2.8, 7.1, 7.2, 7.10, 8.1, 8.2, 10.1_

- [x] 3.1 Implement DreamSearchInput component
  - Create `components/vise/dream-search-input.tsx` as client component
  - Use `use-debounced-value` hook with 300ms delay
  - Add search icon and Romanian placeholder text
  - Implement controlled input with local state
  - Show loading spinner during search
  - Add clear button when query has content
  - Validate minimum 2 characters before triggering search
  - Display validation message in Romanian
  - Ensure touch-friendly (44x44px minimum targets)
  - Add proper ARIA labels for accessibility
  - _Requirements: 2.1, 2.7, 2.8, 7.1, 7.2, 7.10, 8.1, 8.2, 10.1_

- [x] 4. Create dream result list component
  - Build grid layout for search results
  - Display category badges and descriptions
  - Implement loading and empty states
  - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7, 7.3, 7.4, 7.10, 10.2_

- [x] 4.1 Implement DreamResultList component
  - Create `components/vise/dream-result-list.tsx`
  - Use shadcn/ui Card component for result items
  - Implement grid layout (1 column mobile, 2 columns tablet+)
  - Add category Badge with color coding (7 categories)
  - Display symbol name, category, and short description
  - Truncate descriptions to 2 lines with ellipsis
  - Add hover/focus states for accessibility
  - Implement click handler for symbol selection
  - Support keyboard navigation (Enter/Space)
  - Show loading skeleton states
  - Display empty state with Romanian fallback message
  - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7, 7.3, 7.4, 7.10, 10.2_

- [x] 5. Create dream detail card component
  - Build full interpretation display
  - Extend shared result-card component
  - Add share functionality
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 7.5, 7.8, 7.9, 7.10_

- [x] 5.1 Implement DreamDetailCard component
  - Create `components/vise/dream-detail-card.tsx`
  - Extend `components/shared/result-card.tsx`
  - Display symbol name as title
  - Show category badge with appropriate color
  - Render full interpretation with prose styling
  - Integrate share-button component
  - Format share URL: `/vise/${symbol.slug}`
  - Use Romanian share title: "Interpretare vis: {symbol.name}"
  - Add optional close/back button
  - Ensure mobile-responsive layout
  - Add proper ARIA labels
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 7.5, 7.8, 7.9, 7.10_

- [x] 6. Create multi-symbol combo form component
  - Build symbol selector with validation
  - Implement 2-3 symbol limit
  - Add combine functionality
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 7.6, 7.7, 7.10, 10.5_

- [x] 6.1 Implement DreamComboForm component
  - Create `components/vise/dream-combo-form.tsx` as client component
  - Use Combobox pattern (shadcn/ui) for symbol selection
  - Implement local state for selected symbols array
  - Display selected symbols with remove buttons
  - Show visual counter (e.g., "2/3 simboluri selectate")
  - Disable combine button when < 2 symbols selected
  - Show validation message when > 3 symbols selected
  - Implement clear all button
  - Call onCombine callback with selected symbols
  - Add proper ARIA labels and error messages in Romanian
  - Ensure keyboard navigation works
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 7.6, 7.7, 7.10, 10.5_

- [x] 7. Implement main dream search page
  - Update existing vise page with working search
  - Integrate search input and result list
  - Add links to other dream features
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 8.1, 8.2, 8.3, 8.4, 8.5, 10.1, 10.2, 10.3, 10.4_

- [x] 7.1 Create client component for search page
  - Create `app/vise/client.tsx` as client component
  - Import and use DreamSearchInput component
  - Import and use DreamResultList component
  - Implement search handler calling searchDreamSymbols query
  - Manage loading state during search
  - Handle search errors with Romanian error messages
  - Implement symbol selection to show detail view
  - Use DreamDetailCard for inline detail display
  - Add links to multi-symbol interpreter and daily dream pages
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 8.1, 8.2, 8.4, 10.1, 10.2, 10.3, 10.4_

- [x] 7.2 Update server component for search page
  - Update `app/vise/page.tsx` to import client component
  - Keep as server component for metadata
  - Update metadata with accurate description
  - Remove placeholder content and disabled search input
  - Render client component for interactivity
  - _Requirements: 8.3_

- [x] 8. Implement multi-symbol interpreter page
  - Create new page for combining dream symbols
  - Integrate combo form component
  - Display combined interpretation
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 8.3, 8.4, 8.5, 10.5_

- [x] 8.1 Create client component for multi-symbol page
  - Create `app/vise/interpretare/client.tsx` as client component
  - Import and use DreamComboForm component
  - Fetch available symbols using searchDreamSymbols query
  - Implement combine handler using `combineInterpretations()` from lib/dreams.ts
  - Display combined interpretation in result card
  - Add share functionality for combined result
  - Handle validation errors with Romanian messages
  - Show loading states during symbol fetching
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 8.4, 10.5_

- [x] 8.2 Create server component for multi-symbol page
  - Create `app/vise/interpretare/page.tsx` as server component
  - Set metadata: title "Interpretare Vis Complex", description
  - Add header with back button
  - Render client component
  - Add educational content about multi-symbol interpretation
  - _Requirements: 8.3_

- [x] 9. Implement daily dream page
  - Create page showing deterministic daily symbol
  - Format date in Romanian
  - Display full interpretation
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 8.3, 8.4, 8.5_

- [x] 9.1 Create client component for daily dream page
  - Create `app/vise/visul-zilei/client.tsx` as client component
  - Get current date in ISO format (YYYY-MM-DD)
  - Call getDailyDream query with current date
  - Use `formatRomanianDate()` from lib/utils.ts for date display
  - Display symbol using DreamDetailCard component
  - Add link back to main search page
  - Handle loading state while fetching
  - Handle error if daily dream fails to load
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 8.4_

- [x] 9.2 Create server component for daily dream page
  - Create `app/vise/visul-zilei/page.tsx` as server component
  - Set metadata: title "Visul Zilei", description
  - Add header with Moon icon and back button
  - Render client component
  - Add educational content about daily dream feature
  - _Requirements: 8.3_

- [x] 10. Update navigation and links
  - Add dream module links to main navigation
  - Update homepage to include dream features
  - Ensure all internal links work correctly
  - _Requirements: 5.7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10_

- [x] 10.1 Update main navigation header
  - Update `components/layout/header.tsx`
  - Ensure "Vise" link in navigation is active
  - Verify mobile menu includes dream link
  - Test active route highlighting for /vise routes
  - _Requirements: 7.8_

- [x] 10.2 Update homepage with dream features
  - Update `app/page.tsx`
  - Add dream interpretation card to tool selector
  - Include brief description and icon
  - Link to `/vise` main search page
  - Ensure consistent styling with other tool cards
  - _Requirements: 7.8_

- [x] 11. Integration testing and quality assurance
  - Test complete user flows end-to-end
  - Verify performance targets met
  - Ensure accessibility compliance
  - _Requirements: All requirements_

- [x] 11.1 Test search flow
  - User types "șarpe" in search input
  - Verify 300ms debounce works correctly
  - Confirm query executes and results display
  - Test clicking result shows detail view
  - Verify Romanian diacritics display correctly
  - Test empty search results show fallback message
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [x] 11.2 Test multi-symbol flow
  - Search and select first symbol
  - Search and select second symbol
  - Verify combine button enables
  - Click combine and verify interpretation displays
  - Test share functionality works
  - Verify validation prevents < 2 or > 3 symbols
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 11.3 Test daily dream flow
  - Navigate to daily dream page
  - Verify deterministic symbol loads
  - Confirm Romanian date formatting
  - Test that same symbol shows for all users on same day
  - Verify share functionality
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 11.4 Performance testing
  - Measure search response time (target <300ms)
  - Measure page load time (target <2s on 3G)
  - Verify no console errors in production
  - Check bundle size (<50KB for dream module)
  - Test on mobile devices (iOS and Android)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 11.5 Accessibility testing
  - Test keyboard navigation (Tab, Enter, Escape)
  - Verify screen reader announces results correctly
  - Check ARIA labels on all interactive elements
  - Ensure focus indicators are visible (3px ring)
  - Test with NVDA/JAWS screen readers
  - Verify touch targets ≥44x44px on mobile
  - _Requirements: 7.9, 7.10_

- [x] 11.6 Cross-browser testing
  - Test on Chrome, Firefox, Safari, Edge
  - Verify dark theme looks correct on all browsers
  - Test Web Share API with fallback
  - Check Romanian diacritics render correctly
  - Verify responsive design on various screen sizes
  - _Requirements: All UI requirements_

- [x] 12. Final cleanup and documentation
  - Remove any debug code or console.logs
  - Verify all TypeScript types are correct
  - Ensure code follows project conventions
  - Update Implementation-Plan.md with completion status
  - _Requirements: All requirements_

- [x] 12.1 Code cleanup
  - Remove all console.log statements
  - Remove unused imports and variables
  - Verify all files use @/ path aliases
  - Ensure kebab-case naming for all files
  - Check TypeScript strict mode compliance
  - Run production build and fix any errors
  - _Requirements: 8.4, 8.5_

- [x] 12.2 Update documentation
  - Mark Phase 2.3 as complete in Implementation-Plan.md
  - Update progress percentage
  - Document any deviations from original plan
  - Add notes about dataset size and categories
  - List any known issues or future improvements
  - _Requirements: All requirements_
