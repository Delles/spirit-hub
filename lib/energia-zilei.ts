/**
 * Energia Zilei (Energy of the Day) - SpiritHub.ro
 *
 * Universal daily energy guidance based on planetary day tradition.
 * Data is now sourced from data/interpretations/energy.json.
 */

import energyData from "@/data/interpretations/energy.json";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Complete energy data for a single day (New Schema)
 */
export interface EnergiaZileiData {
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
  energyLevel: number;
  tags: string[];
  content: {
    main_text: string;
    dos: string[];
    donts: string[];
  };
  mantra: string;
}

// Type the imported JSON correctly
const typedEnergyData = energyData as Record<string, EnergiaZileiData>;

// ============================================================================
// Main Function
// ============================================================================

/**
 * Returns the energy data for a given date
 *
 * @param date - The date to get energy for (defaults to current date)
 * @returns EnergiaZileiData with complete daily energy information
 */
export function getEnergiaZilei(date: Date = new Date()): EnergiaZileiData {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const data = typedEnergyData[dayOfWeek.toString()];

  if (!data) {
    // Fallback if data is missing (should not happen)
    return typedEnergyData["0"];
  }

  return data;
}
