/**
 * Moon Phase Calculator
 *
 * Deterministic calculation of the current lunar phase based on a known
 * new-moon reference date. Returns one of 8 standard phases with Romanian
 * labels and matching emoji.
 */

// Average length of a synodic month (new moon to new moon) in days
const SYNODIC_MONTH = 29.53058867;

// Known new-moon reference: 6 January 2000 at 18:14 UTC
// (widely used astronomical reference point)
const KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

/**
 * Moon phase keys (English identifiers for internal use)
 */
export type MoonPhaseKey =
  | "new"
  | "waxing_crescent"
  | "first_quarter"
  | "waxing_gibbous"
  | "full"
  | "waning_gibbous"
  | "last_quarter"
  | "waning_crescent";

/**
 * Moon phase data returned by the calculator
 */
export interface MoonPhaseData {
  /** Internal phase key */
  phaseKey: MoonPhaseKey;
  /** Romanian label for UI display */
  labelRo: string;
  /** Emoji representing the phase */
  emoji: string;
  /** Moon age in days (0 = new moon, ~14.76 = full moon) */
  ageDays: number;
}

/**
 * Phase definitions: boundaries (as fraction of cycle 0-1), labels, emoji
 * Each phase spans ~1/8 of the cycle (~3.69 days)
 */
const PHASES: Array<{
  maxFraction: number;
  key: MoonPhaseKey;
  labelRo: string;
  emoji: string;
}> = [
  {
    maxFraction: 0.0625,
    key: "new",
    labelRo: "Lună nouă – un nou început",
    emoji: "🌑",
  },
  {
    maxFraction: 0.1875,
    key: "waxing_crescent",
    labelRo: "Semilună în creștere – intenții și primii pași",
    emoji: "🌒",
  },
  {
    maxFraction: 0.3125,
    key: "first_quarter",
    labelRo: "Primul pătrar – acțiune și hotărâre",
    emoji: "🌓",
  },
  {
    maxFraction: 0.4375,
    key: "waxing_gibbous",
    labelRo: "Lună aproape plină – ajustări și progres",
    emoji: "🌔",
  },
  {
    maxFraction: 0.5625,
    key: "full",
    labelRo: "Lună plină – claritate și intensitate",
    emoji: "🌕",
  },
  {
    maxFraction: 0.6875,
    key: "waning_gibbous",
    labelRo: "Lună în descreștere – lecții și recunoștință",
    emoji: "🌖",
  },
  {
    maxFraction: 0.8125,
    key: "last_quarter",
    labelRo: "Ultimul pătrar – curățare și clarificare",
    emoji: "🌗",
  },
  {
    maxFraction: 0.9375,
    key: "waning_crescent",
    labelRo: "Semilună în descreștere – odihnă și vindecare",
    emoji: "🌘",
  },
  {
    maxFraction: 1.0,
    key: "new",
    labelRo: "Lună nouă – un nou început",
    emoji: "🌑",
  },
];

/**
 * Calculate the moon phase for a given date.
 *
 * @param date - The date to calculate the phase for (defaults to now)
 * @returns MoonPhaseData with phase key, Romanian label, emoji, and age in days
 */
export function getMoonPhase(date: Date = new Date()): MoonPhaseData {
  const nowMs = date.getTime();

  // Days since the known new moon reference
  const daysSinceReference = (nowMs - KNOWN_NEW_MOON_MS) / (1000 * 60 * 60 * 24);

  // Current position in the lunar cycle (0 to SYNODIC_MONTH)
  const ageDays = ((daysSinceReference % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;

  // Fraction of the cycle (0 to 1)
  const fraction = ageDays / SYNODIC_MONTH;

  // Find matching phase
  for (const phase of PHASES) {
    if (fraction <= phase.maxFraction) {
      return {
        phaseKey: phase.key,
        labelRo: phase.labelRo,
        emoji: phase.emoji,
        ageDays: Math.round(ageDays * 100) / 100, // round to 2 decimals
      };
    }
  }

  // Fallback (should never reach here)
  return {
    phaseKey: "new",
    labelRo: "Lună nouă – timp de noi începuturi",
    emoji: "🌑",
    ageDays: 0,
  };
}

