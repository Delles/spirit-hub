import {
  PHYSICAL_CYCLE_DAYS,
  EMOTIONAL_CYCLE_DAYS,
  INTELLECTUAL_CYCLE_DAYS,
  biorhythmConfig,
} from "@/config/biorhythm";
import type { CycleName } from "@/lib/biorhythm";
import { CalendarDateError, parseCalendarDate } from "@/lib/bucharest-calendar";
import { ValidationError, validateDate } from "@/lib/utils";

export type CompatibilityBandKey = "high" | "balanced" | "complementary";

export interface CycleCompatibilityItem {
  cycle: CycleName;
  label: string;
  cycleDays: number;
  color: string;
  score: number;
  summary: string;
}

export interface BiorhythmCompatibilityReport {
  daysApart: number;
  overallScore: number;
  band: CompatibilityBandKey;
  title: string;
  summary: string;
  guidance: string[];
  cycles: CycleCompatibilityItem[];
}

interface BandDefinition {
  title: string;
  summary: string;
  guidance: string[];
}

const MS_PER_DAY = 86_400_000;

const BAND_DEFINITIONS: Record<CompatibilityBandKey, BandDefinition> = {
  high: {
    title: "Sincronizare ridicată",
    summary:
      "Cele trei cicluri se află într-o aliniere simbolică apropiată. Aveți șanse mai mari să simțiți un ritm asemănător în energie, dispoziție și felul în care abordați planurile comune. Această comparație matematică are rol simbolic de reflecție, nu valoare științifică sau predictivă.",
    guidance: [
      "Folosiți perioadele de vârf comun pentru activități care cer coordonare și decizii luate împreună.",
      "Când apare oboseala, este posibil să o resimțiți în același timp, așa că planificați pauze comune.",
      "Priviți scorul ca pe un reper orientativ; comunicarea și contextul real rămân decisive.",
    ],
  },
  balanced: {
    title: "Ritm echilibrat",
    summary:
      "Ciclurile alternează între momente de apropiere și faze în care vă completați diferit. Puteți avea domenii în care reacționați la unison și zone unde unul aduce calm când celălalt este mai solicitat. Interpretarea are caracter simbolic, nu științific.",
    guidance: [
      "Observați care dintre cele trei cicluri are scorul cel mai ridicat și folosiți acel punct comun ca sprijin.",
      "În zonele cu scor moderat, clarificați așteptările înainte de discuții sau sarcini solicitante.",
      "Diferențele de ritm pot fi utile atunci când împărțiți responsabilitățile zilnice.",
    ],
  },
  complementary: {
    title: "Ritmuri complementare",
    summary:
      "Diferența de fază dintre cicluri creează o dinamică complementară, în care unul poate fi într-o etapă activă când celălalt are nevoie de refacere. Un scor mic nu indică incompatibilitate, ci ritmuri diferite. Rezultatul este pur simbolic și nu are valoare științifică.",
    guidance: [
      "Respectați nevoia diferită de ritm, mai ales în zilele în care unul caută acțiune și celălalt liniște.",
      "Sprijiniți-vă reciproc: cine are mai multă energie într-un ciclu poate prelua inițiativa în acea zi.",
      "Transformați contrastul în conversație calmă despre program, odihnă și priorități.",
    ],
  },
};

const CYCLE_SUMMARIES: Record<CycleName, Record<CompatibilityBandKey, string>> = {
  physical: {
    high: "Ritm apropiat de vitalitate, efort și rezistență fizică în activitățile zilnice.",
    balanced: "Alternanță echilibrată între perioadele de efort comun și nevoia de refacere.",
    complementary:
      "Ritmuri diferite de energie fizică; unul poate fi mai activ când celălalt se reface.",
  },
  emotional: {
    high: "Dispoziția și sensibilitatea tind să urce și să coboare în perioade similare.",
    balanced: "Rezonanță moderată; vă puteți susține ușor când comunicați deschis starea de moment.",
    complementary:
      "Faze emoționale decalate, utile pentru a aduce echilibru în momentele mai intense.",
  },
  intellectual: {
    high: "Cicluri mentale apropiate, favorabile pentru planificare și discuții structurate.",
    balanced: "Moduri parțial sincronizate de concentrare și analiză pe parcursul săptămânii.",
    complementary:
      "Perspective și ritmuri mentale diferite, care pot aduce idei complementare în decizii.",
  },
};

const CYCLE_DEFINITIONS: ReadonlyArray<{ cycle: CycleName; days: number }> = [
  { cycle: "physical", days: PHYSICAL_CYCLE_DAYS },
  { cycle: "emotional", days: EMOTIONAL_CYCLE_DAYS },
  { cycle: "intellectual", days: INTELLECTUAL_CYCLE_DAYS },
];

function getBandForScore(score: number): CompatibilityBandKey {
  if (score >= 70) return "high";
  if (score >= 40) return "balanced";
  return "complementary";
}

function getUtcMidnightMs(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function computeCycleScore(daysApart: number, cycleDays: number): number {
  return Math.round(Math.abs(Math.cos((Math.PI * daysApart) / cycleDays)) * 100);
}

export function createBiorhythmCompatibilityReport(
  birthDate1: Date,
  birthDate2: Date
): BiorhythmCompatibilityReport {
  validateDate(birthDate1, "birthDate1");
  validateDate(birthDate2, "birthDate2");

  const utc1 = getUtcMidnightMs(birthDate1);
  const utc2 = getUtcMidnightMs(birthDate2);
  const daysApart = Math.round(Math.abs(utc1 - utc2) / MS_PER_DAY);

  const cycles: CycleCompatibilityItem[] = CYCLE_DEFINITIONS.map(({ cycle, days }) => {
    const score = computeCycleScore(daysApart, days);
    const cycleBand = getBandForScore(score);
    const config = biorhythmConfig.cycles[cycle];

    return {
      cycle,
      label: config.name,
      cycleDays: days,
      color: config.color,
      score,
      summary: CYCLE_SUMMARIES[cycle][cycleBand],
    };
  });

  const overallScore = Math.round(
    cycles.reduce((total, item) => total + item.score, 0) / cycles.length
  );
  const band = getBandForScore(overallScore);
  const bandCopy = BAND_DEFINITIONS[band];

  return {
    daysApart,
    overallScore,
    band,
    title: bandCopy.title,
    summary: bandCopy.summary,
    guidance: bandCopy.guidance,
    cycles,
  };
}

export function getBiorhythmCompatibilityResult(
  date1: string,
  date2: string
): BiorhythmCompatibilityReport | null {
  if (!date1 || !date2) {
    return null;
  }

  try {
    const parsed1 = parseCalendarDate(date1);
    const parsed2 = parseCalendarDate(date2);
    return createBiorhythmCompatibilityReport(parsed1, parsed2);
  } catch (error) {
    if (error instanceof CalendarDateError || error instanceof ValidationError) {
      return null;
    }
    throw error;
  }
}
