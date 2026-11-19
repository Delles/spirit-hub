import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import sitemap from "@/app/sitemap";
import { parseCalendarDate } from "@/lib/bucharest-calendar";
import {
  calculatePersonalYear,
  getPersonalYearReport,
  getQuickTargetYears,
  getRecommendedTargetYear,
  MAX_PERSONAL_YEAR,
  MIN_PERSONAL_YEAR,
  reduceToCycleDigit,
} from "@/lib/personal-year";
import { ValidationError } from "@/lib/utils";

const ROOT = resolve(import.meta.dir, "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(resolve(ROOT, relativePath), "utf8");
}

describe("personal year calculation", () => {
  test("computes exact personalYear, universalYear, and transparent steps", () => {
    const calc1 = calculatePersonalYear(parseCalendarDate("1990-07-14"), 2027);
    expect(calc1.personalYear).toBe(5);
    expect(calc1.universalYear).toBe(2);
    expect(calc1.daySum).toBe(5);
    expect(calc1.monthSum).toBe(7);
    expect(calc1.yearSum).toBe(11);
    expect(calc1.rawTotal).toBe(23);
    expect(calc1.steps).toEqual({
      dayExpression: "1 + 4 = 5",
      monthExpression: "7",
      yearExpression: "2 + 0 + 2 + 7 = 11",
      totalExpression: "5 + 7 + 11 = 23 → 2 + 3 = 5",
    });

    const calc2 = calculatePersonalYear(parseCalendarDate("1995-01-01"), 2027);
    expect(calc2.personalYear).toBe(4);
    expect(calc2.universalYear).toBe(2);
    expect(calc2.steps.totalExpression).toBe("1 + 1 + 11 = 13 → 1 + 3 = 4");

    const calc3 = calculatePersonalYear(parseCalendarDate("1988-12-29"), 2027);
    expect(calc3.personalYear).toBe(7);
    expect(calc3.universalYear).toBe(2);
    expect(calc3.steps.dayExpression).toBe("2 + 9 = 11");
    expect(calc3.steps.monthExpression).toBe("1 + 2 = 3");
    expect(calc3.steps.totalExpression).toBe("11 + 3 + 11 = 25 → 2 + 5 = 7");

    const calcSingle = calculatePersonalYear(parseCalendarDate("2000-01-01"), 2000);
    expect(calcSingle.rawTotal).toBe(4);
    expect(calcSingle.personalYear).toBe(4);
    expect(calcSingle.steps.totalExpression).toBe("1 + 1 + 2 = 4");
  });

  test("reduces 11, 22, and 33 strictly to 2, 4, and 6 without preserving master numbers", () => {
    expect(reduceToCycleDigit(11)).toBe(2);
    expect(reduceToCycleDigit(22)).toBe(4);
    expect(reduceToCycleDigit(33)).toBe(6);

    const sum11 = calculatePersonalYear(parseCalendarDate("1990-01-01"), 2025);
    expect(sum11.rawTotal).toBe(11);
    expect(sum11.personalYear).toBe(2);

    const sum22 = calculatePersonalYear(parseCalendarDate("1990-09-02"), 2027);
    expect(sum22.rawTotal).toBe(22);
    expect(sum22.personalYear).toBe(4);

    const sum33 = calculatePersonalYear(parseCalendarDate("1990-09-29"), 2029);
    expect(sum33.rawTotal).toBe(33);
    expect(sum33.personalYear).toBe(6);
  });

  test("throws ValidationError on invalid Date or invalid/out-of-range targetYear", () => {
    expect(() => calculatePersonalYear(new Date("invalid"), 2027)).toThrow(ValidationError);
    expect(() =>
      calculatePersonalYear(parseCalendarDate("1990-07-14"), MIN_PERSONAL_YEAR - 1)
    ).toThrow(ValidationError);
    expect(() =>
      calculatePersonalYear(parseCalendarDate("1990-07-14"), MAX_PERSONAL_YEAR + 1)
    ).toThrow(ValidationError);
    expect(() => calculatePersonalYear(parseCalendarDate("1990-07-14"), 2027.5)).toThrow(
      ValidationError
    );
    expect(() => calculatePersonalYear(parseCalendarDate("1990-07-14"), Number.NaN)).toThrow(
      ValidationError
    );
  });

  test("recommends next year from November onward and builds 3 quick years", () => {
    expect(getRecommendedTargetYear("2026-10-31")).toBe(2026);
    expect(getRecommendedTargetYear("2026-11-01")).toBe(2027);
    expect(getRecommendedTargetYear("2027-01-15")).toBe(2027);
    expect(getRecommendedTargetYear("2027-11-19")).toBe(2028);
    expect(getQuickTargetYears("2026-11-19")).toEqual([2026, 2027, 2028]);
  });

  test("getPersonalYearReport handles invalid inputs and builds 9-year timeline across 1..9 outcomes", () => {
    expect(getPersonalYearReport("", 2027)).toBeNull();
    expect(getPersonalYearReport("not-a-date", 2027)).toBeNull();
    expect(getPersonalYearReport("1990-02-30", 2027)).toBeNull();
    expect(getPersonalYearReport("1990-07-14", 1899)).toBeNull();
    expect(getPersonalYearReport("1990-07-14", 2151)).toBeNull();
    expect(getPersonalYearReport("1990-07-14", 2027.5)).toBeNull();

    const report = getPersonalYearReport("1990-07-14", 2027);
    expect(report).not.toBeNull();
    expect(report!.cycleTimeline).toHaveLength(9);
    expect(report!.cycleTimeline.map((item) => item.year)).toEqual([
      2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
    ]);
    expect(report!.cycleTimeline.filter((item) => item.isSelected)).toHaveLength(1);
    expect(report!.cycleTimeline[1]).toMatchObject({
      year: 2027,
      personalYear: 5,
      isSelected: true,
    });

    const seenNumbers = new Set<number>();
    for (let year = 2020; year <= 2028; year++) {
      const itemReport = getPersonalYearReport("1990-07-14", year);
      expect(itemReport).not.toBeNull();
      seenNumbers.add(itemReport!.calculation.personalYear);
      expect(itemReport!.interpretation.hero.subtitle).toContain("Anul Personal");
      expect(itemReport!.interpretation.content.dos).toHaveLength(3);
      expect(itemReport!.interpretation.content.donts).toHaveLength(3);
      expect(itemReport!.interpretation.content.reflection_questions).toHaveLength(2);
      expect(itemReport!.interpretation.mantra.length).toBeGreaterThan(0);
    }

    expect(seenNumbers.size).toBe(9);
  });
});

describe("sprint 3 sitemap, privacy, and ad slot integration", () => {
  test("sitemap includes /numerologie/an-personal and its companion guide", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://www.spirithub.ro/numerologie/an-personal");
    expect(urls).toContain("https://www.spirithub.ro/ghiduri/ce-este-anul-personal-in-numerologie");
  });

  test("privacy policy documents Cloudflare Web Analytics and Google Cloud Run without Vercel Analytics", () => {
    const privacySource = readRepoFile("app/confidentialitate/page.tsx");

    expect(privacySource).toContain("Cloudflare Web Analytics");
    expect(privacySource).toContain("Google Cloud Run");
    expect(privacySource).not.toContain("Vercel Analytics");
    expect(privacySource).not.toContain("Speed Insights");
  });

  test("guide page renders AdSlot with adSlots.contentFooter", () => {
    const guidePageSource = readRepoFile("app/ghiduri/[slug]/page.tsx");

    expect(guidePageSource).toContain("AdSlot");
    expect(guidePageSource).toContain("adSlots.contentFooter");
  });
});
