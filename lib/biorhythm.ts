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
import biorhythmData from "@/data/interpretations/biorhythm.json";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Represents the structured interpretation data from JSON
 */
export interface BiorhythmInterpretationData {
  theme: {
    primary: string;
    accent: string;
    bg_soft: string;
    hex: string;
  };
  hero: {
    icon: string;
    title: string;
    subtitle: string;
    headline: string;
  };
  tags: string[];
  content: {
    main_text: string;
    dos: string[];
    donts: string[];
  };
  mantra: string;
  trajectory_hints?: {
    ascending: string;
    descending: string;
    stable?: string;
  };
}

/**
 * Represents the direction of change for a biorhythm cycle
 */
export type Trajectory = 'ascending' | 'descending' | 'stable';

/**
 * Represents the three biorhythm cycle values for a given date
 */
export interface BiorhythmCycles {
  physical: number;
  emotional: number;
  intellectual: number;
}

/**
 * Represents the complete biorhythm state for a date
 */
export interface BiorhythmResult extends BiorhythmCycles {
  trajectories: {
    physical: Trajectory;
    emotional: Trajectory;
    intellectual: Trajectory;
  };
}

/**
 * Represents a critical day when one or more cycles cross zero
 */
export interface CriticalDay {
  date: Date;
  cycles: ("physical" | "emotional" | "intellectual")[];
}

/**
 * Represents a daily biorhythm hint based on day of the week
 */
export interface BiorhythmHint {
  title: string;
  hint: string;
  dayOfWeek: string;
}

/**
 * Represents the intensity level of a biorhythm cycle
 * Used for determining which interpretation to display
 */
export type IntensityLevel = 'peak' | 'high' | 'rising' | 'critical' | 'falling' | 'low' | 'valley';

// Type the imported JSON
const typedBiorhythmData = biorhythmData as Record<string, BiorhythmInterpretationData>;

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

/**
 * Determines the trajectory (direction of change) of a biorhythm cycle
 * Compares current value with yesterday's value
 * 
 * @param birthDate - The person's birth date
 * @param targetDate - The date to calculate for
 * @param cycleDays - The length of the cycle
 * @returns 'ascending' | 'descending' | 'stable'
 */
export function getCycleTrajectory(
  birthDate: Date,
  targetDate: Date,
  cycleDays: number
): Trajectory {
  const todayValue = calculateCycle(birthDate, targetDate, cycleDays);

  // Get yesterday's date
  const yesterday = new Date(targetDate);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayValue = calculateCycle(birthDate, yesterday, cycleDays);

  const diff = todayValue - yesterdayValue;

  if (Math.abs(diff) < 0.001) return 'stable';
  return diff > 0 ? 'ascending' : 'descending';
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

/**
 * Gets trajectory for the physical cycle
 */
export function getPhysicalTrajectory(birthDate: Date, targetDate: Date): Trajectory {
  return getCycleTrajectory(birthDate, targetDate, PHYSICAL_CYCLE_DAYS);
}

/**
 * Gets trajectory for the emotional cycle
 */
export function getEmotionalTrajectory(birthDate: Date, targetDate: Date): Trajectory {
  return getCycleTrajectory(birthDate, targetDate, EMOTIONAL_CYCLE_DAYS);
}

/**
 * Gets trajectory for the intellectual cycle
 */
export function getIntellectualTrajectory(birthDate: Date, targetDate: Date): Trajectory {
  return getCycleTrajectory(birthDate, targetDate, INTELLECTUAL_CYCLE_DAYS);
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
// Daily Biorhythm Hints
// ============================================================================

/**
 * Returns a generic biorhythm hint based on the day of the week
 * Provides daily guidance without requiring user birth date
 *
 * @param date - The date to get the hint for (defaults to current date)
 * @returns BiorhythmHint object with title, hint text, and day name in Romanian
 */
export function getBiorhythmHintForDay(date: Date = new Date()): BiorhythmHint {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

  const hints: Record<number, { title: string; hint: string }> = {
    0: {
      title: "Zi de Odihnă",
      hint: "Duminica este perfectă pentru regenerare. Acordă-ți timp pentru relaxare și reflecție interioară.",
    },
    1: {
      title: "Energie Fizică",
      hint: "Începutul săptămânii aduce energie fizică crescută. Profită de acest moment pentru activități intense.",
    },
    2: {
      title: "Claritate Mentală",
      hint: "Marți este ideal pentru gândire analitică și rezolvare de probleme. Concentrează-te pe sarcini complexe.",
    },
    3: {
      title: "Echilibru Emoțional",
      hint: "Mijlocul săptămânii favorizează conexiunile emoționale. Dedică timp relațiilor importante.",
    },
    4: {
      title: "Creativitate",
      hint: "Joi stimulează creativitatea și expresia personală. Explorează idei noi și proiecte artistice.",
    },
    5: {
      title: "Socializare",
      hint: "Vineri este perfect pentru interacțiuni sociale și activități de grup. Conectează-te cu prietenii.",
    },
    6: {
      title: "Reflecție",
      hint: "Sâmbăta încurajează introspecția și planificarea. Evaluează-ți progresul și stabilește obiective.",
    },
  };

  const dayNames = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];

  return {
    ...hints[dayOfWeek],
    dayOfWeek: dayNames[dayOfWeek],
  };
}

// ============================================================================
// Romanian Biorhythm Interpretation (Rich Data)
// ============================================================================

/**
 * Determines the intensity level of a biorhythm cycle value
 * 
 * Thresholds:
 * - Peak: > 0.75 (exceptional maximum)
 * - High: 0.35 to 0.75 (active positive)
 * - Rising: 0.15 to 0.35 (building momentum)
 * - Critical: -0.15 to 0.15 (zero-crossing)
 * - Falling: -0.35 to -0.15 (declining)
 * - Low: -0.75 to -0.35 (passive regeneration)
 * - Valley: < -0.75 (deep rest minimum)
 * 
 * @param value - Cycle value from -1 to 1
 * @returns IntensityLevel string
 */
export function getCycleIntensityLevel(value: number): IntensityLevel {
  if (value > 0.75) return 'peak';
  if (value > 0.35) return 'high';
  if (value > 0.15) return 'rising';
  if (value >= -0.15) return 'critical';
  if (value >= -0.35) return 'falling';
  if (value >= -0.75) return 'low';
  return 'valley';
}

/**
 * Returns the most relevant biorhythm interpretation card based on cycle values
 *
 * Priority:
 * 1. Critical Days (most impacts safety/stability)
 * 2. All High (Super Day - all cycles > 0.35)
 * 3. All Low (Recharge Day - all cycles < -0.35)
 * 4. Dominant Cycle with Intensity Level
 *
 * @param physical - Physical cycle value (-1 to 1)
 * @param emotional - Emotional cycle value (-1 to 1)
 * @param intellectual - Intellectual cycle value (-1 to 1)
 * @returns BiorhythmInterpretationData with theme, hero, tags, content, etc.
 */
export function getBiorhythmInterpretation(
  physical: number,
  emotional: number,
  intellectual: number
): BiorhythmInterpretationData {
  // Thresholds for composite states
  const ALL_HIGH_THRESHOLD = 0.35;
  const ALL_LOW_THRESHOLD = -0.35;

  // Helper to safely get interpretation with fallback
  const getInterpretation = (key: string): BiorhythmInterpretationData => {
    const data = typedBiorhythmData[key];
    if (!data) {
      // Fallback to a safe default if key is missing (defensive programming)
      console.error(`[Biorhythm] Missing interpretation key: ${key}`);
      return typedBiorhythmData["physical_high"]; // Safe fallback
    }
    return data;
  };

  // Get intensity levels for each cycle
  const physicalLevel = getCycleIntensityLevel(physical);
  const emotionalLevel = getCycleIntensityLevel(emotional);
  const intellectualLevel = getCycleIntensityLevel(intellectual);

  // 1. Critical Priority - check for zero-crossing states
  if (physicalLevel === 'critical') return getInterpretation("physical_critical");
  if (emotionalLevel === 'critical') return getInterpretation("emotional_critical");
  if (intellectualLevel === 'critical') return getInterpretation("intellectual_critical");

  // 2. All High (Super Day)
  if (physical > ALL_HIGH_THRESHOLD && emotional > ALL_HIGH_THRESHOLD && intellectual > ALL_HIGH_THRESHOLD) {
    return getInterpretation("all_high");
  }

  // 3. All Low (Recharge Day)
  if (physical < ALL_LOW_THRESHOLD && emotional < ALL_LOW_THRESHOLD && intellectual < ALL_LOW_THRESHOLD) {
    return getInterpretation("all_low");
  }

  // 4. Dominant Cycle with Intensity Level
  const pAbs = Math.abs(physical);
  const eAbs = Math.abs(emotional);
  const iAbs = Math.abs(intellectual);

  const maxAbs = Math.max(pAbs, eAbs, iAbs);

  if (maxAbs === pAbs) {
    return getInterpretation(`physical_${physicalLevel}`);
  }
  if (maxAbs === eAbs) {
    return getInterpretation(`emotional_${emotionalLevel}`);
  }
  // Default to intellectual
  return getInterpretation(`intellectual_${intellectualLevel}`);
}

