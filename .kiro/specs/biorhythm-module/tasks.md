# Implementation Plan - Biorhythm Module

## Task List

- [x] 1. Implement Convex backend functions
  - Create `convex/biorhythm.ts` with query functions for biorhythm calculations
  - Implement `getBiorhythm` query accepting birthDate and targetDate parameters
  - Implement `getCriticalDays` query accepting birthDate, startDate, and days parameters
  - Import and use calculation functions from `lib/biorhythm.ts`
  - Return properly typed responses with cycle values and Romanian summaries
  - _Requirements: 1.2, 1.4, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 2. Create BiorhythmForm component
  - Create `components/bioritm/biorhythm-form.tsx` with TypeScript interface
  - Implement birth date input field with native date picker
  - Implement optional target date input field (defaults to today)
  - Add client-side validation for date inputs
  - Display Romanian error messages for invalid inputs
  - Implement submit handler with loading state
  - Style with Tailwind CSS following design system (card, inputs, button)
  - Ensure touch-friendly inputs with 44x44px minimum tap targets
  - _Requirements: 1.1, 5.1, 5.2, 5.4, 5.5, 8.1, 8.4, 9.1, 9.2_

- [x] 3. Create BiorhythmChart component
  - Create `components/bioritm/biorhythm-chart.tsx` with TypeScript interface
  - Generate SVG chart with 800x400px dimensions (desktop)
  - Implement responsive sizing for mobile (100% width, 300px height)
  - Draw background grid with horizontal lines at -100%, -50%, 0%, +50%, +100%
  - Calculate and render sine wave paths for physical (red), emotional (blue), and intellectual (green) cycles
  - Display 15-day window (7 days before/after target date) on desktop
  - Display 11-day window (5 days before/after target date) on mobile
  - Add current day indicator (vertical line)
  - Add value markers (circles) at current day intersection
  - Implement legend with cycle names and colors in Romanian
  - Add ARIA labels for accessibility
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 8.2, 9.3_

- [x] 4. Create BiorhythmSummary component
  - Create `components/bioritm/biorhythm-summary.tsx` with TypeScript interface
  - Display Romanian-language summary text from Convex query
  - Create cycle indicator bars showing percentage values
  - Implement horizontal bars with color-coded fills (red, blue, green)
  - Display cycle names in Romanian: "Fizic", "Emoțional", "Intelectual"
  - Show percentage labels for each cycle
  - Handle negative values (fill from right to left)
  - Style with card container and proper spacing
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Create CriticalDaysList component
  - Create `components/bioritm/critical-days-list.tsx` with TypeScript interface
  - Render list of critical days with dates in Romanian format (DD.MM.YYYY)
  - Display day of week for each critical day
  - Show affected cycle badges (colored pills) for each day
  - Add warning icon (AlertCircle) to each critical day card
  - Implement empty state with "Nu există zile critice" message
  - Style cards with proper spacing and colors
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6. Implement main biorhythm calculator page
  - Update `app/bioritm/page.tsx` with working calculator
  - Add page metadata (title, description) in Romanian
  - Implement state management for birth date and target date
  - Integrate BiorhythmForm component with submit handler
  - Call Convex `getBiorhythm` query with useQuery hook
  - Display LoadingSpinner while query is pending
  - Render BiorhythmChart with query results
  - Render BiorhythmSummary with query results
  - Add ShareButton for sharing results
  - Implement error handling with ErrorMessage component
  - Add link to Critical Days page
  - Style with MainLayout and proper spacing
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.2, 6.3, 6.4, 6.5, 8.3, 10.1, 10.2, 10.3, 10.4_

- [x] 7. Implement critical days viewer page
  - Create `app/bioritm/critice/page.tsx` with critical days viewer
  - Add page metadata (title, description) in Romanian
  - Implement state management for birth date
  - Integrate BiorhythmForm component (birth date only, no target date)
  - Call Convex `getCriticalDays` query with 30-day range
  - Display LoadingSpinner while query is pending
  - Render CriticalDaysList with query results
  - Implement error handling with ErrorMessage component
  - Add back link to main calculator page
  - Style with MainLayout and proper spacing
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 10.1, 10.2, 10.3_

- [x] 8. Add navigation links and polish
  - Update header navigation to include Bioritm link (if not already present)
  - Verify ShareButton integration works on mobile (Web Share API) and desktop (clipboard)
  - Test all Romanian text for accuracy and naturalness
  - Verify dark theme styling across all components
  - Ensure consistent spacing and alignment with design system
  - Add page transitions or animations if desired (optional)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 8.5_

- [x] 9. Responsive design and mobile optimization
  - Test all components on mobile viewport (375px width minimum)
  - Verify chart renders correctly without horizontal scrolling
  - Ensure form inputs are touch-friendly (44x44px minimum)
  - Test on tablet viewport (768px width)
  - Test on desktop viewport (1920px width)
  - Verify text remains readable at all sizes
  - Ensure loading states are visible on all devices
  - _Requirements: 2.4, 2.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 10. Accessibility compliance verification
  - Verify keyboard navigation works for all interactive elements
  - Test focus indicators are visible (3px purple ring)
  - Add ARIA labels to chart and complex UI elements
  - Test with screen reader (NVDA, JAWS, or VoiceOver)
  - Verify color contrast ratios meet WCAG AA (4.5:1 minimum)
  - Ensure semantic HTML is used throughout
  - Test touch target sizes (44x44px minimum)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 11. Performance optimization and testing
  - Verify Convex queries complete within 500ms
  - Test page load time on 3G connection (<2 seconds target)
  - Optimize chart rendering with useMemo if needed
  - Verify no console errors or warnings in browser
  - Run TypeScript diagnostics to ensure zero errors
  - Test production build succeeds
  - Verify bundle size is reasonable (<50KB additional)
  - _Requirements: 1.2, 7.5, 8.3, 10.5_

- [x] 12. Cross-browser testing and final validation
  - Test on Chrome (latest version)
  - Test on Firefox (latest version)
  - Test on Safari (latest version)
  - Test on Edge (latest version)
  - Verify all features work consistently across browsers
  - Test error scenarios (invalid dates, network failures)
  - Verify loading states display correctly
  - Test share functionality on multiple devices
  - _Requirements: All requirements validated across browsers_
