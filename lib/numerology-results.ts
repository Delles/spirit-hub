import { isValid, parseISO } from "date-fns";
import {
  calculateCompatibility,
  calculateDestinyNumber,
  calculateLifePath,
} from "@/lib/numerology";
import {
  getInterpretation,
  type CompatibilityInterpretation,
  type LifePathInterpretation,
} from "@/lib/interpretations";

export interface LifePathResult {
  birthDate: string;
  number: number;
  interpretation: LifePathInterpretation | null;
}

export interface DestinyResult {
  name: string;
  number: number;
  interpretation: LifePathInterpretation | null;
}

export interface NumerologyPersonInput {
  name: string;
  birthDate: string;
}

export interface CompatibilityPersonResult {
  name: string;
  lifePath: number;
  destiny: number;
}

export interface CompatibilityScores {
  average: number;
  lifePath: number;
  destiny: number;
}

export interface CompatibilityResult {
  person1: CompatibilityPersonResult;
  person2: CompatibilityPersonResult;
  scores: CompatibilityScores;
  interpretation: CompatibilityInterpretation | null;
}

function parseBirthDate(value: string): Date | null {
  const date = parseISO(value);
  return isValid(date) ? date : null;
}

function getCompatibilityInterpretation(score: number): CompatibilityInterpretation | null {
  const level = score >= 76 ? "100" : score >= 51 ? "75" : score >= 26 ? "50" : "25";
  return getInterpretation<CompatibilityInterpretation>("compatibility", level);
}

export function getLifePathResult(birthDate: string): LifePathResult | null {
  const parsedBirthDate = parseBirthDate(birthDate);
  if (!parsedBirthDate) return null;

  try {
    const number = calculateLifePath(parsedBirthDate);
    return {
      birthDate,
      number,
      interpretation: getInterpretation<LifePathInterpretation>("life-path", number),
    };
  } catch {
    return null;
  }
}

export function getDestinyResult(name: string): DestinyResult | null {
  if (!name.trim()) return null;

  try {
    const number = calculateDestinyNumber(name);
    return {
      name,
      number,
      interpretation: getInterpretation<LifePathInterpretation>("destiny", number),
    };
  } catch {
    return null;
  }
}

export function getCompatibilityResult({
  person1,
  person2,
}: {
  person1: NumerologyPersonInput;
  person2: NumerologyPersonInput;
}): CompatibilityResult | null {
  const birthDate1 = parseBirthDate(person1.birthDate);
  const birthDate2 = parseBirthDate(person2.birthDate);

  if (!birthDate1 || !birthDate2 || !person1.name.trim() || !person2.name.trim()) {
    return null;
  }

  try {
    const lifePath1 = calculateLifePath(birthDate1);
    const lifePath2 = calculateLifePath(birthDate2);
    const destiny1 = calculateDestinyNumber(person1.name);
    const destiny2 = calculateDestinyNumber(person2.name);
    const lifePathScore = calculateCompatibility(lifePath1, lifePath2);
    const destinyScore = calculateCompatibility(destiny1, destiny2);
    const average = Math.round((lifePathScore + destinyScore) / 2);

    return {
      person1: { name: person1.name, lifePath: lifePath1, destiny: destiny1 },
      person2: { name: person2.name, lifePath: lifePath2, destiny: destiny2 },
      scores: { average, lifePath: lifePathScore, destiny: destinyScore },
      interpretation: getCompatibilityInterpretation(average),
    };
  } catch {
    return null;
  }
}
