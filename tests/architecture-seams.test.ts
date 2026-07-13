import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { createOGImageResponse } from "@/components/og/og-image-frame";
import {
  createBiorhythmReport,
  createCriticalDaysReport,
} from "@/lib/biorhythm-report";
import {
  formatRomanianCalendarDate,
  formatRomanianPickerDate,
  getBucharestCalendarDate,
  parseCalendarDate,
} from "@/lib/bucharest-calendar";
import { getDailyContentForDate } from "@/lib/daily-content";
import {
  getCompatibilityResult,
  getDestinyResult,
  getLifePathResult,
} from "@/lib/numerology-results";
import { getOGFormatContext, getOGFrameConfig } from "@/lib/og-composition";
import { OG_CACHE } from "@/lib/og-helpers";

describe("biorhythm report seam", () => {
  test("returns one complete report for the current day and forecast", () => {
    const report = createBiorhythmReport({
      birthDate: new Date(1990, 0, 1),
      targetDate: new Date(1990, 0, 2),
      forecastDays: 3,
      chartDaysBefore: 1,
      chartDaysAfter: 1,
    });

    expect(report.current.physical).toBeCloseTo(0.2698, 3);
    expect(report.current.emotional).toBeCloseTo(0.2225, 3);
    expect(report.weekOutlook).toHaveLength(3);
    expect(report.chartSeries).toHaveLength(3);
    expect(report.chartSeries[1].physical).toBeCloseTo(report.current.physical, 10);
  });

  test("returns critical days in the same domain shape as the main report", () => {
    const report = createCriticalDaysReport({
      birthDate: new Date(1990, 0, 1),
      startDate: new Date(1990, 0, 1),
      days: 30,
    });

    expect(report.days.length).toBeGreaterThan(0);
    expect(report.days[0].cycles.length).toBeGreaterThan(0);
  });
});

describe("Bucharest calendar seam", () => {
  test("keeps a date-only value stable across timezone boundaries", () => {
    expect(getBucharestCalendarDate(new Date("2026-07-13T21:30:00.000Z"))).toBe("2026-07-14");
    expect(parseCalendarDate("2026-07-14")).toEqual(new Date(2026, 6, 14));
  });

  test("formats Romanian calendar dates in one place", () => {
    expect(formatRomanianCalendarDate("2026-07-13")).toBe("13 iulie 2026");
    expect(formatRomanianPickerDate(new Date(2026, 0, 1))).toBe("01 ianuarie 2026");
  });
});

describe("daily content seam", () => {
  test("composes all daily content from an explicit calendar date", () => {
    const content = getDailyContentForDate("2026-07-13");

    expect(content.date).toBe("2026-07-13");
    expect(content.dailyNumber.number).toBe(3);
    expect(content.energiaZilei).toBeDefined();
    expect(content.moonGuide).toBeDefined();
    expect(content.dailyOracle).toBeDefined();
  });
});

describe("numerology result seam", () => {
  test("returns a Life Path result with its interpretation", () => {
    const result = getLifePathResult("1985-11-14");

    expect(result?.number).toBe(3);
    expect(result?.interpretation?.hero.title).toBeTruthy();
  });

  test("returns a Destiny result with its interpretation", () => {
    const result = getDestinyResult("Ion Popescu");

    expect(result?.number).toBe(7);
    expect(result?.interpretation?.hero.title).toBeTruthy();
  });

  test("composes compatibility from both people in one result", () => {
    const result = getCompatibilityResult({
      person1: { name: "Ion Popescu", birthDate: "1985-11-14" },
      person2: { name: "Ana Ionescu", birthDate: "1990-01-01" },
    });

    expect(result?.person1.lifePath).toBe(3);
    expect(result?.person2.lifePath).toBe(3);
    expect(result?.scores.average).toBeGreaterThanOrEqual(0);
    expect(result?.interpretation?.hero.title).toBeTruthy();
  });
});

describe("OG composition seam", () => {
  test("normalizes an image format once for every OG route", () => {
    const context = getOGFormatContext(new Request("https://example.test/api/og?format=story"));

    expect(context.format).toBe("story");
    expect(context.width).toBe(1080);
    expect(context.height).toBe(1920);
    expect(context.isVertical).toBe(true);
  });

  test("falls back safely for unknown image formats", () => {
    const context = getOGFormatContext(new Request("https://example.test/api/og?format=toString"));

    expect(context.format).toBe("og");
    expect(context.width).toBe(1200);
    expect(context.height).toBe(630);
  });

  test("keeps frame dimensions, spacing, and cache policy behind one seam", () => {
    const frame = getOGFrameConfig({
      contentType: "mesaj-zilnic",
      format: "story",
      cacheControl: OG_CACHE.DAILY,
      gap: "24px",
    });

    expect(frame.width).toBe(1080);
    expect(frame.height).toBe(1920);
    expect(frame.isVertical).toBe(true);
    expect(frame.gap).toBe("24px");
    expect(frame.cacheControl).toBe(OG_CACHE.DAILY);
  });

  test("wraps adapter content in an ImageResponse with shared cache headers", () => {
    const response = createOGImageResponse({
      contentType: "mesaj-zilnic",
      format: "og",
      cacheControl: OG_CACHE.STATIC,
      children: createElement("span", null, "Test content"),
    });

    expect(response.headers.get("Cache-Control")).toBe(OG_CACHE.STATIC);
  });
});
