import { describe, expect, test } from "bun:test";
import {
  createBiorhythmCompatibilityReport,
  getBiorhythmCompatibilityResult,
} from "@/lib/biorhythm-compatibility";
import { parseCalendarDate } from "@/lib/bucharest-calendar";
import { ValidationError } from "@/lib/utils";

describe("biorhythm compatibility calculation", () => {
  test("returns 100% alignment for the same birth date", () => {
    const report = createBiorhythmCompatibilityReport(
      new Date(1992, 4, 15),
      new Date(1992, 4, 15)
    );

    expect(report.daysApart).toBe(0);
    expect(report.overallScore).toBe(100);
    expect(report.band).toBe("high");
    expect(report.cycles.every((item) => item.score === 100)).toBe(true);
  });

  test("is symmetric regardless of date order", () => {
    const first = createBiorhythmCompatibilityReport(
      new Date(1988, 2, 10),
      new Date(1991, 7, 24)
    );
    const second = createBiorhythmCompatibilityReport(
      new Date(1991, 7, 24),
      new Date(1988, 2, 10)
    );

    expect(first).toEqual(second);
    expect(getBiorhythmCompatibilityResult("1988-03-10", "1991-08-24")).toEqual(
      getBiorhythmCompatibilityResult("1991-08-24", "1988-03-10")
    );
  });

  test("produces 0% emotional alignment and complementary band for a 14-day shift", () => {
    const report = getBiorhythmCompatibilityResult("1990-05-01", "1990-05-15");

    expect(report).not.toBeNull();
    expect(report!.daysApart).toBe(14);
    const emotional = report!.cycles.find((item) => item.cycle === "emotional");
    expect(emotional?.score).toBe(0);
    expect(report!.band).toBe("complementary");
  });

  test("produces 100% emotional alignment and high band for a 28-day shift", () => {
    const report = getBiorhythmCompatibilityResult("1990-05-01", "1990-05-29");

    expect(report).not.toBeNull();
    expect(report!.daysApart).toBe(28);
    const emotional = report!.cycles.find((item) => item.cycle === "emotional");
    expect(emotional?.score).toBe(100);
    expect(report!.band).toBe("high");
  });

  test("computes exact calendar days across DST boundaries", () => {
    const march1 = parseCalendarDate("1990-03-01");
    const april1 = parseCalendarDate("1990-04-01");
    const report = createBiorhythmCompatibilityReport(march1, april1);

    expect(report.daysApart).toBe(31);
    expect(getBiorhythmCompatibilityResult("1990-03-01", "1990-04-01")?.daysApart).toBe(31);
  });

  test("throws ValidationError when either Date object is invalid", () => {
    expect(() =>
      createBiorhythmCompatibilityReport(new Date("invalid"), new Date(1990, 0, 1))
    ).toThrow(ValidationError);

    expect(() =>
      createBiorhythmCompatibilityReport(new Date(1990, 0, 1), new Date("invalid"))
    ).toThrow(ValidationError);
  });

  test("returns null from string helper on invalid date inputs", () => {
    expect(getBiorhythmCompatibilityResult("not-a-date", "1990-01-01")).toBeNull();
    expect(getBiorhythmCompatibilityResult("1990-02-30", "1990-01-01")).toBeNull();
    expect(getBiorhythmCompatibilityResult("", "1990-01-01")).toBeNull();
  });
});
