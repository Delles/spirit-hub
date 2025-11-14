/**
 * Biorhythm Configuration
 * 
 * Defines cycle parameters, thresholds, and interpretation ranges for biorhythm calculations.
 * Biorhythms track three cycles (physical, emotional, intellectual) that begin at birth.
 */

export interface CycleConfig {
  name: string;
  days: number;
  color: string;
  description: string;
}

export interface InterpretationRange {
  min: number;
  max: number;
  level: 'critic' | 'scăzut' | 'mediu' | 'ridicat';
  key: string;
}

export interface BiorhythmConfig {
  cycles: {
    physical: CycleConfig;
    emotional: CycleConfig;
    intellectual: CycleConfig;
  };
  criticalThreshold: number;
  interpretationRanges: InterpretationRange[];
  defaultForecastDays: number;
}

export const biorhythmConfig: BiorhythmConfig = {
  cycles: {
    // Physical cycle: 23-day cycle affecting strength, coordination, and physical well-being
    physical: {
      name: 'Fizic',
      days: 23,
      color: '#ef4444', // red
      description: 'Ciclul fizic influențează energia, rezistența și coordonarea fizică',
    },
    
    // Emotional cycle: 28-day cycle affecting mood, creativity, and sensitivity
    emotional: {
      name: 'Emoțional',
      days: 28,
      color: '#3b82f6', // blue
      description: 'Ciclul emoțional influențează starea de spirit, creativitatea și sensibilitatea',
    },
    
    // Intellectual cycle: 33-day cycle affecting mental clarity, memory, and analytical thinking
    intellectual: {
      name: 'Intelectual',
      days: 33,
      color: '#10b981', // green
      description: 'Ciclul intelectual influențează claritatea mentală, memoria și gândirea analitică',
    },
  },

  /**
   * Critical Threshold
   * 
   * When a cycle value is within ±0.1 of zero, it's considered a "critical day".
   * Critical days occur when a cycle crosses from positive to negative (or vice versa),
   * representing a transition period where the body/mind is adjusting.
   * These days may bring instability or unpredictability in the affected area.
   */
  criticalThreshold: 0.1,

  /**
   * Interpretation Ranges
   * 
   * Maps cycle values (-1.0 to 1.0) to interpretation levels:
   * - critic: Near zero crossing (±0.1) - transition/unstable period
   * - scăzut: Low phase (0.1 to 0.4 or -1.0 to -0.1) - recovery/recharge period
   * - mediu: Medium phase (0.4 to 0.7) - moderate activity period
   * - ridicat: High phase (0.7 to 1.0) - peak performance period
   * 
   * Note: Negative values are treated as low phase (recovery), not as separate interpretations.
   */
  interpretationRanges: [
    {
      min: -0.1,
      max: 0.1,
      level: 'critic',
      key: 'critical',
    },
    {
      min: 0.1,
      max: 0.4,
      level: 'scăzut',
      key: 'low',
    },
    {
      min: 0.4,
      max: 0.7,
      level: 'mediu',
      key: 'medium',
    },
    {
      min: 0.7,
      max: 1.0,
      level: 'ridicat',
      key: 'high',
    },
  ],

  /**
   * Default Forecast Days
   * 
   * Number of days to display when showing upcoming critical days or biorhythm forecast.
   * 30 days provides a good balance between useful planning horizon and UI complexity.
   */
  defaultForecastDays: 30,
} as const;

// Export individual constants for convenience
export const PHYSICAL_CYCLE_DAYS = biorhythmConfig.cycles.physical.days;
export const EMOTIONAL_CYCLE_DAYS = biorhythmConfig.cycles.emotional.days;
export const INTELLECTUAL_CYCLE_DAYS = biorhythmConfig.cycles.intellectual.days;
export const CRITICAL_THRESHOLD = biorhythmConfig.criticalThreshold;
export const DEFAULT_FORECAST_DAYS = biorhythmConfig.defaultForecastDays;
