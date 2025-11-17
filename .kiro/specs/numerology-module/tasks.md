# Implementation Plan - Numerology Module

## Overview

This implementation plan breaks down the Numerology Module into discrete, actionable coding tasks. Each task builds incrementally on previous work and references specific requirements from the requirements document.

---

## Task List

- [x] 1. Create Romanian interpretation data and seed database








  - Create comprehensive Romanian interpretation texts for all numerology numbers (1-9, 11, 22, 33)
  - Include Life Path interpretations with personality traits and life purpose guidance
  - Include Master Number interpretations (11, 22, 33) with heightened spiritual significance
  - Include Destiny interpretations focused on life mission and potential
  - Include compatibility interpretations for all score ranges (low, medium, good, excellent)
  - Include daily interpretations with actionable guidance for each number
  - Mark Master Number interpretations with `isMasterNumber: true` and include `reducedNumber` field
  - Implement `seedInterpretations` mutation in `convex/numerology.ts`
  - Run seeding process from Convex dashboard to populate database
  - Verify all interpretations are stored correctly with proper indexes
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 2. Implement Convex backend queries for numerology




  - [x] 2.1 Create `convex/numerology.ts` with query functions


    - Implement `getLifePathInterpretation(number)` query using `by_type_and_number` index (supports 1-9, 11, 22, 33)
    - Implement `getDestinyInterpretation(number)` query using `by_type_and_number` index (supports 1-9, 11, 22, 33)
    - Implement `getCompatibilityInterpretation(score)` query with score range logic
    - Implement `getDailyNumber(date)` query with deterministic date calculation
    - Add error handling for missing interpretations
    - Add TypeScript types for all query responses including Master Number fields
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 2.2 Test Convex queries from dashboard



    - Test each query with valid inputs
    - Verify query response times are under 200ms
    - Test error handling with invalid inputs
    - Verify Romanian text displays correctly
    - _Requirements: 6.2, 9.2_

- [x] 3. Create reusable NumerologyForm component





  - [x] 3.1 Build form component with variant support


    - Create `components/numerologie/numerology-form.tsx` with TypeScript interfaces
    - Implement three form variants: 'lifePath', 'destiny', 'compatibility'
    - Add dynamic field rendering based on `type` prop
    - Style with Tailwind CSS following design system (check `docs/design.json`)
    - Use shadcn/ui Input and Label components
    - Add primary gradient button for submission
    - _Requirements: 1.1, 2.1, 3.1, 8.3_

  - [x] 3.2 Implement client-side validation

    - Add birth date validation (required, must be in past, valid format)
    - Add name validation (required, minimum 2 characters, Romanian letters only)
    - Display field-specific error messages in Romanian below inputs
    - Use AlertCircle icon from lucide-react for error indicators
    - Prevent form submission when validation fails
    - _Requirements: 1.5, 2.5, 3.5, 5.2_

  - [x] 3.3 Add loading state and accessibility

    - Disable form inputs during submission
    - Show loading spinner on submit button
    - Ensure all inputs have proper labels and ARIA attributes
    - Make touch targets at least 44x44px for mobile
    - Test keyboard navigation (tab order, enter to submit)
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 9.3_

- [x] 4. Create result card components for displaying numerology results





  - [x] 4.1 Build LifePathCard component


    - Create `components/numerologie/life-path-card.tsx` with TypeScript interface
    - Use shared ResultCard component as base wrapper
    - Display large animated number (1-9, 11, 22, 33) with gradient effect
    - Add special golden gradient and sparkle icon for Master Numbers (11, 22, 33)
    - Show "Număr Maestru" badge for Master Numbers
    - Display both Master Number meaning and reduced number meaning when applicable
    - Show interpretation title, description, and full text
    - Add share button at bottom using shared ShareButton component
    - Style with design system colors and typography
    - _Requirements: 1.3, 8.1, 8.2, 10.1, 10.2, 10.3_



  - [x] 4.2 Build DestinyCard component

    - Create `components/numerologie/destiny-card.tsx` with TypeScript interface
    - Similar structure to LifePathCard but with destiny-specific content
    - Display calculated name above number
    - Support Master Numbers (11, 22, 33) with special styling
    - Add "Număr Maestru" badge for Master Numbers
    - Show both Master Number meaning and reduced number meaning when applicable
    - Show destiny interpretation with proper Romanian text
    - Add share functionality with Master Number designation in share text


    - _Requirements: 2.3, 2.4, 8.1, 8.2, 10.1, 10.2, 10.3, 11.5_

  - [x] 4.3 Build CompatibilityCard component

    - Create `components/numerologie/compatibility-card.tsx` with TypeScript interface
    - Display large compatibility score (0-100) with percentage
    - Add color-coded badge based on score range (green/blue/yellow/red)
    - Show two-column layout with both people's Life Path and Destiny numbers


    - Display compatibility level and relationship guidance
    - Add share button with compatibility result
    - _Requirements: 3.3, 3.4, 8.1, 8.2, 10.1_

  - [x] 4.4 Ensure mobile responsiveness for all cards

    - Test all cards on mobile viewport (375px width)
    - Ensure text is readable without horizontal scrolling
    - Verify number animations work smoothly on mobile
    - Check touch target sizes for share buttons
    - _Requirements: 5.3, 5.4, 5.5_

- [x] 5. Implement Life Path calculator page




  - [x] 5.1 Create Life Path page with form and results


    - Create `app/numerologie/calea-vietii/page.tsx` as client component
    - Add page heading with Calculator icon from lucide-react
    - Integrate NumerologyForm component with 'lifePath' variant
    - Implement form submission handler that calculates Life Path number with Master Number detection
    - Ensure calculation preserves Master Numbers (11, 22, 33) without reduction
    - Use `useQuery` to fetch interpretation from Convex (supports Master Numbers)
    - Display LifePathCard when data is available (with Master Number styling if applicable)
    - Add LoadingSpinner during query execution
    - Add ErrorMessage component for query failures
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 9.1, 9.2, 9.3, 9.4, 10.1, 10.2_



  - [ ] 5.2 Add metadata and SEO optimization
    - Define page metadata with Romanian title and description
    - Add Open Graph tags for social sharing
    - Ensure proper heading hierarchy (h1, h2, h3)


    - _Requirements: 8.5_

  - [ ] 5.3 Test Life Path calculator end-to-end
    - Test with various birth dates (past, future, invalid)
    - Test with birth dates that produce Master Numbers (11, 22, 33)


    - Verify Master Numbers are preserved and not reduced
    - Verify calculation matches `lib/numerology.ts` results


    - Test error handling and loading states
    - Verify share button functionality includes Master Number designation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 9.1, 9.2, 10.1, 10.2, 10.3_

- [ ] 6. Implement Destiny Name calculator page

  - [ ] 6.1 Create Destiny Name page with form and results
    - Create `app/numerologie/nume-destin/page.tsx` as client component
    - Add page heading with Sparkles icon from lucide-react
    - Integrate NumerologyForm component with 'destiny' variant


    - Implement form submission handler that calculates Destiny number with Master Number detection
    - Ensure Romanian diacritics (ă, â, î, ș, ț) are handled correctly
    - Ensure calculation preserves Master Numbers (11, 22, 33) without reduction
    - Use `useQuery` to fetch interpretation from Convex (supports Master Numbers)
    - Display DestinyCard when data is available (with Master Number styling if applicable)

    - Add loading and error states
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 9.1, 9.2, 9.3, 9.4, 10.1, 10.2_



  - [ ] 6.2 Add metadata and test Romanian character handling
    - Define page metadata with Romanian title and description
    - Test with names containing all Romanian diacritics
    - Test with names that produce Master Numbers (11, 22, 33)
    - Verify Master Numbers are preserved and not reduced
    - Verify calculation accuracy with various Romanian names
    - Test error handling for empty or invalid names
    - _Requirements: 2.2, 2.4, 2.5, 8.5, 10.1, 10.2_

- [x] 7. Implement Compatibility calculator page



  - [ ] 7.1 Create Compatibility page with two-person form
    - Create `app/numerologie/compatibilitate/page.tsx` as client component
    - Add page heading with Heart icon from lucide-react
    - Integrate NumerologyForm component with 'compatibility' variant
    - Implement form submission handler that calculates both Life Path and Destiny numbers for two people with Master Number detection
    - Ensure Master Numbers (11, 22, 33) are preserved in calculations


    - Calculate compatibility score using Master Numbers at full value (not reduced)


    - Use `useQuery` to fetch compatibility interpretation based on score
    - Display CompatibilityCard with both people's data (including Master Numbers if applicable)
    - Show Master Number badges for any Master Numbers in the results
    - Add loading and error states
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 9.1, 9.2, 9.3, 9.4, 10.1, 10.2_

  - [ ] 7.2 Add metadata and test compatibility calculations
    - Define page metadata with Romanian title and description
    - Test with various name and date combinations
    - Test with combinations that include Master Numbers (11, 22, 33)


    - Verify compatibility scores correctly use Master Numbers at full value
    - Verify compatibility scores match expected ranges
    - Test all four compatibility levels (low, medium, good, excellent)
    - Verify both people's numbers are displayed correctly with Master Number indicators



    - _Requirements: 3.3, 3.4, 3.5, 8.5, 10.1, 10.2_



- [ ] 8. Implement Daily Number page

  - [ ] 8.1 Create Daily Number page with automatic display
    - Create `app/numerologie/numar-zilnic/page.tsx` as client component
    - Add page heading with Calendar icon from lucide-react
    - Get current date and format in Romanian (e.g., "17 noiembrie 2025")
    - Use `useQuery` to fetch daily number and interpretation from Convex


    - Display large daily number with gradient animation
    - Show daily forecast text in Romanian
    - Add "Revino mâine pentru un nou număr!" message


    - Add share button for daily number
    - No form required (uses current date automatically)


    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 9.1, 9.2_

  - [ ] 8.2 Add metadata and test date changes
    - Define page metadata with Romanian title and description
    - Verify daily number is deterministic (same for all users on same date)
    - Test that number changes when date changes


    - Verify Romanian date formatting is correct
    - _Requirements: 4.4, 4.5, 8.5_

- [ ] 9. Update numerology landing page with working links

  - [ ] 9.1 Update `/numerologie/page.tsx` with active navigation
    - Replace "În curând" placeholder buttons with working links


    - Link to `/numerologie/calea-vietii` for Life Path calculator
    - Link to `/numerologie/nume-destin` for Destiny calculator
    - Link to `/numerologie/compatibilitate` for Compatibility calculator
    - Link to `/numerologie/numar-zilnic` for Daily Number
    - Add brief Romanian descriptions for each calculator
    - Ensure all links are keyboard accessible


    - _Requirements: 8.3, 8.4, 8.5_

  - [ ] 9.2 Add info cards explaining each calculator
    - Create card for each calculator with icon, title, and description
    - Use consistent styling with design system
    - Add hover effects for better interactivity
    - Ensure mobile-responsive grid layout
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 10. Final polish and quality assurance

  - [ ] 10.1 Mobile responsiveness audit
    - Test all four calculator pages on mobile (375px, 414px, 768px)
    - Verify forms are easy to use on touch devices
    - Check that result cards display correctly on small screens


    - Ensure all text is readable without zooming
    - Verify touch targets are at least 44x44px
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 10.2 Accessibility compliance check
    - Run keyboard navigation test on all pages
    - Verify focus indicators are visible (3px purple ring)
    - Check color contrast ratios meet WCAG AA (4.5:1)
    - Test with screen reader (NVDA or VoiceOver)
    - Ensure all forms have proper labels and ARIA attributes
    - Verify semantic HTML structure (h1, h2, form, label, button)
    - _Requirements: 5.5, 8.5_

  - [ ] 10.3 Performance optimization
    - Run Lighthouse audit on all pages (target >90 for all categories)
    - Verify page load times are under 2 seconds on 3G
    - Check that calculations are instant (<100ms)
    - Verify Convex queries complete in under 500ms
    - Optimize any large interpretation texts if needed
    - _Requirements: 9.1, 9.2, 9.4, 9.5_

  - [ ] 10.4 Cross-browser testing
    - Test on Chrome (latest version)
    - Test on Firefox (latest version)
    - Test on Safari (latest version)
    - Test on Edge (latest version)
    - Verify Romanian diacritics display correctly in all browsers
    - Check that all animations work smoothly
    - _Requirements: 8.5, 9.1_

  - [ ] 10.5 Final code cleanup
    - Remove any console.log statements
    - Remove unused imports and variables
    - Verify all files use `@/` path aliases
    - Ensure kebab-case naming convention for all files
    - Run TypeScript diagnostics to ensure zero errors
    - Verify production build succeeds
    - _Requirements: All_

