/**
 * Biorhythm calculation functions for SpiritHub.ro
 * Pure functions for calculating physical, emotional, and intellectual cycles
 * All functions are deterministic and framework-agnostic
 */

import {
  PHYSICAL_CYCLE_DAYS,
  EMOTIONAL_CYCLE_DAYS,
  INTELLECTUAL_CYCLE_DAYS,
  CRITICAL_THRESHOLD,
} from "@/config/biorhythm";
import { ValidationError, validateDate } from "@/lib/utils";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Represents the three biorhythm cycle values for a given date
 */
export interface BiorhythmCycles {
  physical: number;
  emotional: number;
  intellectual: number;
}

/**
 * Represents a critical day when one or more cycles cross zero
 */
export interface CriticalDay {
  date: Date;
  cycles: ("physical" | "emotional" | "intellectual")[];
}

// ============================================================================
// Core Calculation Functions
// ============================================================================

/**
 * Calculates a biorhythm cycle value for a given date
 * Uses sine wave formula: sin(2π × daysLived / cycleDays)
 *
 * @param birthDate - The person's birth date
 * @param targetDate - The date to calculate the cycle for
 * @param cycleDays - The length of the cycle in days (23, 28, or 33)
 * @returns A value between -1 (low) and 1 (high) representing the cycle state
 * @throws ValidationError if dates are invalid or targetDate is before birthDate
 */
export function calculateCycle(birthDate: Date, targetDate: Date, cycleDays: number): number {
  // Validate inputs
  validateDate(birthDate, "birthDate");
  validateDate(targetDate, "targetDate");

  if (targetDate < birthDate) {
    throw new ValidationError("targetDate cannot be before birthDate");
  }

  // Calculate days lived since birth
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysLived = Math.floor((targetDate.getTime() - birthDate.getTime()) / millisecondsPerDay);

  // Apply sine wave formula: sin(2π × daysLived / cycleDays)
  const cycleValue = Math.sin((2 * Math.PI * daysLived) / cycleDays);

  return cycleValue;
}

// ============================================================================
// Cycle-Specific Functions
// ============================================================================

/**
 * Calculates the physical biorhythm cycle (23-day period)
 * Represents physical energy, strength, and stamina
 *
 * @param birthDate - The person's birth date
 * @param targetDate - The date to calculate the cycle for
 * @returns A value between -1 (low physical energy) and 1 (high physical energy)
 */
export function getPhysicalCycle(birthDate: Date, targetDate: Date): number {
  return calculateCycle(birthDate, targetDate, PHYSICAL_CYCLE_DAYS);
}

/**
 * Calculates the emotional biorhythm cycle (28-day period)
 * Represents mood, emotional stability, and sensitivity
 *
 * @param birthDate - The person's birth date
 * @param targetDate - The date to calculate the cycle for
 * @returns A value between -1 (low emotional state) and 1 (high emotional state)
 */
export function getEmotionalCycle(birthDate: Date, targetDate: Date): number {
  return calculateCycle(birthDate, targetDate, EMOTIONAL_CYCLE_DAYS);
}

/**
 * Calculates the intellectual biorhythm cycle (33-day period)
 * Represents mental clarity, analytical ability, and memory
 *
 * @param birthDate - The person's birth date
 * @param targetDate - The date to calculate the cycle for
 * @returns A value between -1 (low mental clarity) and 1 (high mental clarity)
 */
export function getIntellectualCycle(birthDate: Date, targetDate: Date): number {
  return calculateCycle(birthDate, targetDate, INTELLECTUAL_CYCLE_DAYS);
}

// ============================================================================
// Critical Days Detection
// ============================================================================

/**
 * Identifies critical days when biorhythm cycles cross zero
 * A critical day occurs when a cycle value is between -CRITICAL_THRESHOLD and +CRITICAL_THRESHOLD
 *
 * @param birthDate - The person's birth date
 * @param startDate - The start date of the range to check
 * @param days - Number of days to check ahead from startDate
 * @returns Array of CriticalDay objects with dates and affected cycles
 */
export function getCriticalDays(birthDate: Date, startDate: Date, days: number): CriticalDay[] {
  // Validate inputs
  validateDate(birthDate, "birthDate");
  validateDate(startDate, "startDate");

  if (days < 0) {
    throw new ValidationError("days must be a positive number");
  }

  const criticalDays: CriticalDay[] = [];
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  // Iterate through each day in the range
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate.getTime() + i * millisecondsPerDay);
    const affectedCycles: ("physical" | "emotional" | "intellectual")[] = [];

    // Check each cycle for zero-crossing
    const physical = getPhysicalCycle(birthDate, currentDate);
    const emotional = getEmotionalCycle(birthDate, currentDate);
    const intellectual = getIntellectualCycle(birthDate, currentDate);

    if (Math.abs(physical) <= CRITICAL_THRESHOLD) {
      affectedCycles.push("physical");
    }
    if (Math.abs(emotional) <= CRITICAL_THRESHOLD) {
      affectedCycles.push("emotional");
    }
    if (Math.abs(intellectual) <= CRITICAL_THRESHOLD) {
      affectedCycles.push("intellectual");
    }

    // If any cycles are critical, add this day to the results
    if (affectedCycles.length > 0) {
      criticalDays.push({
        date: currentDate,
        cycles: affectedCycles,
      });
    }
  }

  return criticalDays;
}

// ============================================================================
// Romanian Biorhythm Summary
// ============================================================================

/**
 * Generates a Romanian-language summary of biorhythm cycles
 * Analyzes cycle values and provides guidance based on their states
 *
 * @param physical - Physical cycle value (-1 to 1)
 * @param emotional - Emotional cycle value (-1 to 1)
 * @param intellectual - Intellectual cycle value (-1 to 1)
 * @returns Romanian-language guidance text
 */
export function getBiorhythmSummary(
  physical: number,
  emotional: number,
  intellectual: number,
): string {
  // Categorize each cycle as high (>0.3), low (<-0.3), or neutral
  const isPhysicalHigh = physical > 0.3;
  const isPhysicalLow = physical < -0.3;
  const isEmotionalHigh = emotional > 0.3;
  const isEmotionalLow = emotional < -0.3;
  const isIntellectualHigh = intellectual > 0.3;
  const isIntellectualLow = intellectual < -0.3;

  // Check for critical states (near zero)
  const isPhysicalCritical = Math.abs(physical) <= CRITICAL_THRESHOLD;
  const isEmotionalCritical = Math.abs(emotional) <= CRITICAL_THRESHOLD;
  const isIntellectualCritical = Math.abs(intellectual) <= CRITICAL_THRESHOLD;

  // Build summary based on cycle combinations
  const summaryParts: string[] = [];

  // All cycles high - excellent day
  if (isPhysicalHigh && isEmotionalHigh && isIntellectualHigh) {
    return "Zi excelentă pentru activități complexe! Toate ciclurile tale sunt în fază pozitivă. Este momentul ideal pentru proiecte importante, decizii majore și activități care necesită energie fizică, claritate mentală și stabilitate emotională.";
  }

  // All cycles low - rest day
  if (isPhysicalLow && isEmotionalLow && isIntellectualLow) {
    return "Zi de odihnă și recuperare. Toate ciclurile tale sunt în fază negativă. Evită deciziile importante, efortul fizic intens și sarcinile mentale complexe. Concentrează-te pe relaxare, meditație și activități simple.";
  }

  // Physical cycle guidance
  if (isPhysicalHigh) {
    summaryParts.push(
      "Energia fizică este ridicată - zi bună pentru sport, exerciții și activități fizice",
    );
  } else if (isPhysicalLow) {
    summaryParts.push(
      "Energia fizică este scăzută - evită efortul fizic intens și odihnește-te mai mult",
    );
  } else if (isPhysicalCritical) {
    summaryParts.push(
      "Ciclul fizic este în fază critică - fii atent la sănătatea ta și evită riscurile fizice",
    );
  }

  // Emotional cycle guidance
  if (isEmotionalHigh) {
    summaryParts.push("starea emoțională este pozitivă - moment bun pentru relații și comunicare");
  } else if (isEmotionalLow) {
    summaryParts.push(
      "starea emoțională este fragilă - evită conflictele și deciziile emoționale importante",
    );
  } else if (isEmotionalCritical) {
    summaryParts.push(
      "ciclul emoțional este în fază critică - fii prudent în relațiile interpersonale",
    );
  }

  // Intellectual cycle guidance
  if (isIntellectualHigh) {
    summaryParts.push(
      "claritatea mentală este excelentă - zi ideală pentru studiu, analiză și rezolvarea problemelor",
    );
  } else if (isIntellectualLow) {
    summaryParts.push(
      "claritatea mentală este redusă - amână deciziile complexe și sarcinile analitice",
    );
  } else if (isIntellectualCritical) {
    summaryParts.push(
      "ciclul intelectual este în fază critică - verifică de două ori informațiile importante",
    );
  }

  // If no specific guidance was added, provide neutral summary
  if (summaryParts.length === 0) {
    return "Zi echilibrată cu cicluri în fază neutră. Poți desfășura activități normale, dar fără a forța limitele. Ascultă-ți corpul și emoțiile.";
  }

  // Combine parts with proper capitalization
  const summary = summaryParts.join(", ");
  return summary.charAt(0).toUpperCase() + summary.slice(1) + ".";
}
