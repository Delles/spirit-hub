/**
 * Moon Guide - SpiritHub.ro
 *
 * Combines moon phase calculation with spiritual interpretations.
 * Returns complete guidance data for the current lunar phase.
 */

import { getMoonPhase, type MoonPhaseKey, type MoonPhaseData } from "./moon-phase";
import moonGuideData from "@/data/interpretations/moon-guide.json";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Theme configuration for a moon phase
 */
interface MoonGuideTheme {
    primary: string; // Tailwind gradient classes
    accent: string;  // Tailwind text color class
}

/**
 * Raw interpretation data from JSON
 */
interface MoonGuideInterpretation {
    theme: MoonGuideTheme;
    title: string;
    subtitle: string;
    insight: string;
    guidance: string[];
    avoid: string[];
    mantra: string;
}

/**
 * Complete moon guide data combining phase calculation with interpretation
 */
export interface MoonGuideData extends MoonPhaseData {
    theme: MoonGuideTheme;
    title: string;
    subtitle: string;
    insight: string;
    guidance: string[];
    avoid: string[];
    mantra: string;
}

// Type the imported JSON
const typedMoonGuideData = moonGuideData as Record<MoonPhaseKey, MoonGuideInterpretation>;

// ============================================================================
// Main Function
// ============================================================================

/**
 * Get complete moon guidance for a given date.
 *
 * Combines the calculated moon phase with its spiritual interpretation.
 *
 * @param date - The date to get guidance for (defaults to current date)
 * @returns MoonGuideData with phase info and interpretation
 */
export function getMoonGuide(date: Date = new Date()): MoonGuideData {
    const phase = getMoonPhase(date);
    const interpretation = typedMoonGuideData[phase.phaseKey];

    if (!interpretation) {
        // Fallback to "new" if somehow missing (should never happen)
        const fallback = typedMoonGuideData["new"];
        return {
            ...phase,
            ...fallback,
        };
    }

    return {
        ...phase,
        ...interpretation,
    };
}
