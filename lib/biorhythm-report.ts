import {
  CRITICAL_THRESHOLD,
  biorhythmConfig,
  type CycleConfig,
} from "@/config/biorhythm";
import {
  getBiorhythmInterpretation,
  getCriticalDays,
  getCycleIntensityLevel,
  getEmotionalCycle,
  getEmotionalTrajectory,
  getIntellectualCycle,
  getIntellectualTrajectory,
  getPhysicalCycle,
  getPhysicalTrajectory,
  getWeekOutlook,
  type BiorhythmCycles,
  type BiorhythmInterpretationData,
  type CycleName,
  type DayOutlook,
  type CriticalDay,
  type IntensityLevel,
  type Trajectory,
} from "@/lib/biorhythm";

export interface BiorhythmCurrentResult extends BiorhythmCycles {
  trajectories: Record<CycleName, Trajectory>;
  intensity: Record<CycleName, IntensityLevel>;
  interpretation: BiorhythmInterpretationData;
  trajectory: Trajectory;
}

export interface BiorhythmChartPoint extends BiorhythmCycles {
  date: Date;
}

export interface BiorhythmReport {
  current: BiorhythmCurrentResult;
  cycles: Record<CycleName, CycleConfig>;
  weekOutlook: DayOutlook[];
  criticalDays: CriticalDay[];
  chartSeries: BiorhythmChartPoint[];
  chartTargetIndex: number;
}

export interface BiorhythmReportInput {
  birthDate: Date;
  targetDate: Date;
  forecastDays?: number;
  chartDaysBefore?: number;
  chartDaysAfter?: number;
}

export interface CriticalDaysReportInput {
  birthDate: Date;
  startDate: Date;
  days?: number;
}

const CYCLE_NAMES: CycleName[] = ["physical", "emotional", "intellectual"];

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function calculateCurrentCycles(birthDate: Date, targetDate: Date): BiorhythmCycles {
  return {
    physical: getPhysicalCycle(birthDate, targetDate),
    emotional: getEmotionalCycle(birthDate, targetDate),
    intellectual: getIntellectualCycle(birthDate, targetDate),
  };
}

function calculateTrajectories(birthDate: Date, targetDate: Date): Record<CycleName, Trajectory> {
  return {
    physical: getPhysicalTrajectory(birthDate, targetDate),
    emotional: getEmotionalTrajectory(birthDate, targetDate),
    intellectual: getIntellectualTrajectory(birthDate, targetDate),
  };
}

function calculateIntensity(cycles: BiorhythmCycles): Record<CycleName, IntensityLevel> {
  return {
    physical: getCycleIntensityLevel(cycles.physical),
    emotional: getCycleIntensityLevel(cycles.emotional),
    intellectual: getCycleIntensityLevel(cycles.intellectual),
  };
}

function selectRepresentativeTrajectory(
  cycles: BiorhythmCycles,
  intensity: Record<CycleName, IntensityLevel>,
  trajectories: Record<CycleName, Trajectory>,
): Trajectory {
  for (const cycle of CYCLE_NAMES) {
    if (intensity[cycle] === "critical") return trajectories[cycle];
  }

  if (
    cycles.physical > 0.35 &&
    cycles.emotional > 0.35 &&
    cycles.intellectual > 0.35
  ) {
    return trajectories.physical;
  }

  if (
    cycles.physical < -0.35 &&
    cycles.emotional < -0.35 &&
    cycles.intellectual < -0.35
  ) {
    return trajectories.physical;
  }

  const dominantCycle = CYCLE_NAMES.reduce((best, cycle) =>
    Math.abs(cycles[cycle]) > Math.abs(cycles[best]) ? cycle : best,
  );

  return trajectories[dominantCycle];
}

function createChartSeries(
  birthDate: Date,
  targetDate: Date,
  daysBefore: number,
  daysAfter: number,
): BiorhythmChartPoint[] {
  const series: BiorhythmChartPoint[] = [];

  for (let offset = -daysBefore; offset <= daysAfter; offset += 1) {
    const date = addDays(targetDate, offset);
    series.push({ date, ...calculateCurrentCycles(birthDate, date) });
  }

  return series;
}

export function createBiorhythmReport({
  birthDate,
  targetDate,
  forecastDays = 7,
  chartDaysBefore = 7,
  chartDaysAfter = 7,
}: BiorhythmReportInput): BiorhythmReport {
  const cycles = calculateCurrentCycles(birthDate, targetDate);
  const trajectories = calculateTrajectories(birthDate, targetDate);
  const intensity = calculateIntensity(cycles);

  return {
    current: {
      ...cycles,
      trajectories,
      intensity,
      interpretation: getBiorhythmInterpretation(
        cycles.physical,
        cycles.emotional,
        cycles.intellectual,
      ),
      trajectory: selectRepresentativeTrajectory(cycles, intensity, trajectories),
    },
    cycles: biorhythmConfig.cycles,
    weekOutlook: getWeekOutlook(birthDate, targetDate, forecastDays),
    criticalDays: getCriticalDays(birthDate, targetDate, forecastDays),
    chartSeries: createChartSeries(birthDate, targetDate, chartDaysBefore, chartDaysAfter),
    chartTargetIndex: chartDaysBefore,
  };
}

export function createCriticalDaysReport({
  birthDate,
  startDate,
  days = biorhythmConfig.defaultForecastDays,
}: CriticalDaysReportInput): { days: CriticalDay[]; criticalThreshold: number } {
  return {
    days: getCriticalDays(birthDate, startDate, days),
    criticalThreshold: CRITICAL_THRESHOLD,
  };
}
