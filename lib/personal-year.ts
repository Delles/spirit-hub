import {
  type CalendarDate,
  CalendarDateError,
  getBucharestCalendarDate,
  parseCalendarDate,
} from "@/lib/bucharest-calendar";
import { getInterpretation, type PersonalYearInterpretation } from "@/lib/interpretations";
import { ValidationError, validateDate } from "@/lib/utils";

export type PersonalYearNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const MIN_PERSONAL_YEAR = 1900;
export const MAX_PERSONAL_YEAR = 2150;

export interface PersonalYearCalculationSteps {
  dayExpression: string;
  monthExpression: string;
  yearExpression: string;
  totalExpression: string;
}

export interface PersonalYearCalculation {
  birthDay: number;
  birthMonth: number;
  targetYear: number;
  universalYear: PersonalYearNumber;
  daySum: number;
  monthSum: number;
  yearSum: number;
  rawTotal: number;
  personalYear: PersonalYearNumber;
  steps: PersonalYearCalculationSteps;
}

export interface PersonalYearTimelineItem {
  year: number;
  personalYear: PersonalYearNumber;
  title: string;
  isSelected: boolean;
}

export interface PersonalYearReport {
  birthDate: string;
  targetYear: number;
  calculation: PersonalYearCalculation;
  interpretation: PersonalYearInterpretation;
  cycleTimeline: PersonalYearTimelineItem[];
}

function getDigits(value: number): number[] {
  return String(value).split("").map(Number);
}

function sumDigits(value: number): number {
  return getDigits(value).reduce((total, digit) => total + digit, 0);
}

function formatComponentExpression(value: number, sum: number): string {
  const digits = getDigits(value);
  return digits.length === 1 ? String(sum) : `${digits.join(" + ")} = ${sum}`;
}

function formatTotalExpression(
  daySum: number,
  monthSum: number,
  yearSum: number,
  rawTotal: number
): string {
  const base = `${daySum} + ${monthSum} + ${yearSum} = ${rawTotal}`;
  if (rawTotal <= 9) {
    return base;
  }

  const reductions: string[] = [];
  let current = rawTotal;
  while (current > 9) {
    const digits = getDigits(current);
    const next = digits.reduce((total, digit) => total + digit, 0);
    reductions.push(`${digits.join(" + ")} = ${next}`);
    current = next;
  }

  return `${base} → ${reductions.join(" → ")}`;
}

function validateTargetYear(targetYear: number): void {
  if (
    !Number.isInteger(targetYear) ||
    targetYear < MIN_PERSONAL_YEAR ||
    targetYear > MAX_PERSONAL_YEAR
  ) {
    throw new ValidationError(
      `targetYear must be an integer between ${MIN_PERSONAL_YEAR} and ${MAX_PERSONAL_YEAR}`
    );
  }
}

export function reduceToCycleDigit(num: number): PersonalYearNumber {
  if (!Number.isInteger(num) || num <= 0) {
    throw new ValidationError("Input must be a positive integer");
  }

  if (num >= 1 && num <= 9) {
    return num as PersonalYearNumber;
  }

  return reduceToCycleDigit(sumDigits(num));
}

export function getRecommendedTargetYear(referenceDate?: CalendarDate): number {
  const parsed = parseCalendarDate(referenceDate ?? getBucharestCalendarDate());
  const year = parsed.getFullYear();
  const month = parsed.getMonth() + 1;
  return month >= 11 ? year + 1 : year;
}

export function getQuickTargetYears(referenceDate?: CalendarDate): [number, number, number] {
  const recommended = getRecommendedTargetYear(referenceDate);
  return [recommended - 1, recommended, recommended + 1];
}

export function calculatePersonalYear(
  birthDate: Date,
  targetYear: number
): PersonalYearCalculation {
  validateDate(birthDate, "birthDate");
  validateTargetYear(targetYear);

  const birthDay = birthDate.getDate();
  const birthMonth = birthDate.getMonth() + 1;
  const daySum = sumDigits(birthDay);
  const monthSum = sumDigits(birthMonth);
  const yearSum = sumDigits(targetYear);
  const rawTotal = daySum + monthSum + yearSum;

  const universalYear = reduceToCycleDigit(targetYear);
  const personalYear = reduceToCycleDigit(rawTotal);

  return {
    birthDay,
    birthMonth,
    targetYear,
    universalYear,
    daySum,
    monthSum,
    yearSum,
    rawTotal,
    personalYear,
    steps: {
      dayExpression: formatComponentExpression(birthDay, daySum),
      monthExpression: formatComponentExpression(birthMonth, monthSum),
      yearExpression: formatComponentExpression(targetYear, yearSum),
      totalExpression: formatTotalExpression(daySum, monthSum, yearSum, rawTotal),
    },
  };
}

export function getPersonalYearReport(
  birthDate: string,
  targetYear: number
): PersonalYearReport | null {
  if (!birthDate) {
    return null;
  }

  try {
    const parsedBirthDate = parseCalendarDate(birthDate);
    const calculation = calculatePersonalYear(parsedBirthDate, targetYear);
    const interpretation = getInterpretation<PersonalYearInterpretation>(
      "personal-year",
      calculation.personalYear
    );

    if (!interpretation) {
      return null;
    }

    const timelineStart = Math.max(
      MIN_PERSONAL_YEAR,
      Math.min(MAX_PERSONAL_YEAR - 8, targetYear - 1)
    );
    const cycleTimeline: PersonalYearTimelineItem[] = [];

    for (let offset = 0; offset < 9; offset++) {
      const year = timelineStart + offset;
      const itemCalc =
        year === targetYear ? calculation : calculatePersonalYear(parsedBirthDate, year);
      const itemInterpretation = getInterpretation<PersonalYearInterpretation>(
        "personal-year",
        itemCalc.personalYear
      );

      cycleTimeline.push({
        year,
        personalYear: itemCalc.personalYear,
        title: itemInterpretation?.hero.title ?? "",
        isSelected: year === targetYear,
      });
    }

    return {
      birthDate,
      targetYear,
      calculation,
      interpretation,
      cycleTimeline,
    };
  } catch (error) {
    if (error instanceof CalendarDateError || error instanceof ValidationError) {
      return null;
    }
    throw error;
  }
}
