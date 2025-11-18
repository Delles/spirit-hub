# Implementation Plan - Daily Features & Automation

## Overview

This implementation plan breaks down the Daily Features & Automation feature into discrete, manageable coding tasks. Each task builds incrementally on previous steps and references specific requirements from the requirements document.

---

## Task List

- [x] 1. Extend Convex numerology functions for daily number persistence





  - Add `ensureDailyNumber` internal mutation to persist daily numbers in dailyPicks table
  - Implement `isoDateInBucharest` helper function for timezone handling
  - Modify `getDailyNumber` query to check dailyPicks table first before calculating
  - Import `reduceToSingleDigit` from lib/numerology.ts to preserve Master Numbers
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.2, 5.3, 6.1, 6.2_

- [x] 2. Update Convex cron jobs configuration





  - Add daily cron job at 00:00 UTC to call `ensureDailyNumber`
  - Verify existing hourly cron job for `ensureDailyDream` is working
  - Test cron job execution in Convex dashboard
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 3. Create biorhythm hint utility function





  - Add `getBiorhythmHintForDay` function to lib/biorhythm.ts
  - Implement day-of-week based hint rotation (7 hints in Romanian)
  - Define BiorhythmHint interface with title, hint, and dayOfWeek fields
  - Return appropriate hint based on date.getDay()
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 4. Create daily widget component structure





  - Create `components/layout/daily-widget.tsx` file
  - Implement DailyWidget container component with responsive grid layout
  - Set up 3-column grid for desktop, single column for mobile
  - Apply design.json styling (semi-transparent background, backdrop blur, border radius)
  - Add proper TypeScript interfaces for all props
  - _Requirements: 3.1, 3.8_

- [x] 5. Implement Daily Number Card





  - Create DailyNumberCard internal component in daily-widget.tsx
  - Use Convex useQuery hook to fetch getDailyNumber with today's date
  - Display large animated number with gradient styling
  - Detect Master Numbers (11, 22, 33) and show special badge
  - Show title and short description from interpretation
  - Add click-through link to /numerologie/numar-zilnic
  - Implement loading skeleton state
  - Implement error fallback with Romanian message
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 3.2, 3.5, 3.7, 7.1_

- [x] 6. Implement Daily Dream Card





  - Create DailyDreamCard internal component in daily-widget.tsx
  - Use Convex useQuery hook to fetch getDailyDream with today's date
  - Display dream symbol name with category badge
  - Show short meaning (1-2 sentences)
  - Add click-through link to /vise/visul-zilei
  - Implement loading skeleton state
  - Implement error fallback with Romanian message
  - _Requirements: 2.1, 2.2, 2.3, 3.3, 3.5, 3.7, 7.2_

- [x] 7. Implement Biorhythm Hint Card





  - Create BiorhythmHintCard internal component in daily-widget.tsx
  - Call getBiorhythmHintForDay with current date (client-side, no query)
  - Display hint title and text in Romanian
  - Add click-through link to /bioritm with call-to-action text
  - Implement error fallback (though unlikely since it's client-side)
  - _Requirements: 4.1, 4.2, 4.4, 4.5, 3.4, 3.5, 3.7, 7.3_

- [x] 8. Integrate daily widget into homepage





  - Update app/page.tsx to import and render DailyWidget component
  - Position widget above the existing tool cards slider
  - Add proper spacing and layout integration
  - Ensure widget doesn't interfere with existing homepage functionality
  - Test responsive behavior on mobile, tablet, and desktop
  - _Requirements: 3.1, 3.8_

- [x] 9. Add error handling and fallbacks





  - Implement independent error handling for each card
  - Create ErrorCard component for consistent error display
  - Ensure widget continues to display other cards if one fails
  - Add console logging for errors (for monitoring)
  - Test error scenarios (network failure, missing data, etc.)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 10. Performance optimization and testing
  - Verify widget loads in < 500ms on typical connections
  - Test parallel query execution for all three cards
  - Verify caching behavior (dailyPicks table usage)
  - Test Master Number badge display for numbers 11, 22, 33
  - Test responsive layout on multiple screen sizes
  - Verify all Romanian text displays correctly with diacritics
  - Test click-through links to full pages
  - Run TypeScript type checking
  - Run production build and verify no errors
  - _Requirements: 3.6, 6.1, 6.2, 6.3, 6.4, 6.5_

---

## Implementation Notes

### Master Number Handling

When implementing the Daily Number Card, ensure Master Numbers are preserved:

```typescript
// In ensureDailyNumber mutation
import { reduceToSingleDigit } from "@/lib/numerology";

const sum = day + month + year;
const dailyNumber = reduceToSingleDigit(sum); // Preserves 11, 22, 33
```

### Timezone Considerations

All date calculations should use Europe/Bucharest timezone:

```typescript
function isoDateInBucharest(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  // ... format as YYYY-MM-DD
}
```

### Error Handling Pattern

Each card should handle errors independently:

```typescript
try {
  const data = useQuery(api.module.query, { args });
  if (data === undefined) return <LoadingSkeleton />;
  return <CardContent data={data} />;
} catch (error) {
  return <ErrorCard message="Romanian error message" />;
}
```

### Responsive Grid Layout

Widget should adapt to screen size:

```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <DailyNumberCard />
  <DailyDreamCard />
  <BiorhythmHintCard />
</div>
```

### Testing Checklist

Before marking tasks complete:

- [ ] TypeScript compiles without errors
- [ ] All Romanian text displays correctly
- [ ] Master Number badges appear for 11, 22, 33
- [ ] Links navigate to correct pages
- [ ] Loading states display properly
- [ ] Error states display properly
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Widget loads in < 500ms
- [ ] Cron jobs execute successfully in Convex dashboard

---

## Dependencies

### External Dependencies

- Convex React hooks (`useQuery`)
- Next.js Link component
- Existing lib functions (`reduceToSingleDigit`, date formatting)
- Existing Convex queries (`getDailyNumber`, `getDailyDream`)

### Internal Dependencies

- Task 1 must complete before Task 2 (cron job needs mutation)
- Task 3 must complete before Task 7 (hint function needed)
- Tasks 4-7 must complete before Task 8 (widget needs all cards)
- Task 8 must complete before Task 10 (testing needs integrated widget)

---

## Success Criteria

The implementation is complete when:

1. ✅ Daily number is persisted automatically via cron job
2. ✅ Daily dream is persisted automatically via existing cron job
3. ✅ Homepage displays daily widget with all three cards
4. ✅ Master Numbers (11, 22, 33) display with special badges
5. ✅ All text is in Romanian with proper diacritics
6. ✅ Widget loads in < 500ms
7. ✅ Links navigate to correct full pages
8. ✅ Error handling works gracefully
9. ✅ Responsive layout works on all screen sizes
10. ✅ Zero TypeScript errors
11. ✅ Production build succeeds

---

## Post-Implementation

After completing all tasks:

1. Deploy to Convex production environment
2. Verify cron jobs are running in production
3. Monitor widget load times
4. Check error logs for any issues
5. Gather user feedback on daily content

---

## Future Enhancements (Post-MVP)

These are not part of the current implementation but may be considered later:

- Add animations to number/dream changes at midnight
- Generate OG images for daily content sharing
- Add share buttons to individual widget cards
- Track widget engagement analytics
- Implement user-specific biorhythm hints (requires birth date)
- Add daily content history/calendar view
