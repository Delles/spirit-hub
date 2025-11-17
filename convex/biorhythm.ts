/**
 * Convex Backend Functions - Biorhythm Module
 * 
 * Provides server-side queries for biorhythm calculations.
 * All calculations are deterministic and use pure functions from @/lib/biorhythm.
 */

import { query } from './_generated/server';
import { v } from 'convex/values';
import {
  getPhysicalCycle,
  getEmotionalCycle,
  getIntellectualCycle,
  getBiorhythmSummary,
  getCriticalDays as getCriticalDaysUtil,
} from '@/lib/biorhythm';

/**
 * Query: getBiorhythm
 * 
 * Calculates biorhythm cycles for a given birth date and target date.
 * Returns cycle values (-1 to 1) and Romanian-language summary.
 * 
 * @param birthDate - ISO 8601 date string (YYYY-MM-DD)
 * @param targetDate - ISO 8601 date string (YYYY-MM-DD)
 * @returns Object with physical, emotional, intellectual values and summary text
 * 
 * Requirements: 1.2, 1.4, 7.1, 7.2, 7.3, 7.4, 7.5
 */
export const getBiorhythm = query({
  args: {
    birthDate: v.string(),
    targetDate: v.string(),
  },
  handler: (ctx, args) => {
    // Parse ISO date strings to Date objects
    const birth = new Date(args.birthDate);
    const target = new Date(args.targetDate);

    // Calculate each cycle using lib functions
    const physical = getPhysicalCycle(birth, target);
    const emotional = getEmotionalCycle(birth, target);
    const intellectual = getIntellectualCycle(birth, target);

    // Generate Romanian-language summary
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
 * Identifies upcoming critical days when biorhythm cycles cross zero.
 * A critical day occurs when any cycle value is within ±0.1 of zero.
 * 
 * @param birthDate - ISO 8601 date string (YYYY-MM-DD)
 * @param startDate - ISO 8601 date string (YYYY-MM-DD) - start of range
 * @param days - Number of days to check ahead from startDate
 * @returns Array of critical days with dates and affected cycles
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
export const getCriticalDays = query({
  args: {
    birthDate: v.string(),
    startDate: v.string(),
    days: v.number(),
  },
  handler: (ctx, args) => {
    // Parse ISO date strings to Date objects
    const birth = new Date(args.birthDate);
    const start = new Date(args.startDate);

    // Get critical days using lib function
    const criticalDays = getCriticalDaysUtil(birth, start, args.days);

    // Convert Date objects to ISO strings for JSON serialization
    return criticalDays.map((day: { date: Date; cycles: ('physical' | 'emotional' | 'intellectual')[] }) => ({
      date: day.date.toISOString().split('T')[0],
      cycles: day.cycles,
    }));
  },
});
