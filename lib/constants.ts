/**
 * Core constants for SpiritHub.ro domain logic
 * 
 * NOTE: Most configuration has been moved to dedicated config modules:
 * - Numerology config: @/config/numerology
 * - Biorhythm config: @/config/biorhythm
 * - Dreams config: @/config/dreams
 * - Site config: @/config/site
 * 
 * This file is kept for backward compatibility and legacy constants.
 */

// ============================================================================
// Numerology Constants (Legacy - prefer @/config/numerology)
// ============================================================================

/**
 * Minimum valid numerology number
 */
export const NUMEROLOGY_MIN = 1;

/**
 * Maximum valid numerology number (excluding Master Numbers)
 */
export const NUMEROLOGY_MAX = 9;

/**
 * Type representing valid numerology numbers (1-9 or Master Numbers)
 */
export type NumerologyNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33;
