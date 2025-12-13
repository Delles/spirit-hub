/**
 * Server-side Moon Phase Utility
 *
 * Provides a cached moon phase for Europe/Bucharest timezone.
 * Uses Next.js unstable_cache with a 6-hour TTL.
 */

import { unstable_cache } from "next/cache";
import { getMoonPhase, type MoonPhaseData } from "@/lib/moon-phase";

/**
 * Get the current date in Europe/Bucharest timezone as a Date object
 * representing midnight of that day (for consistent cache keys).
 */
function getBucharestDate(): Date {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(now);

  const year = parseInt(parts.find((p) => p.type === "year")?.value ?? "0", 10);
  const month = parseInt(parts.find((p) => p.type === "month")?.value ?? "0", 10) - 1;
  const day = parseInt(parts.find((p) => p.type === "day")?.value ?? "0", 10);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);

  return new Date(year, month, day, hour, minute);
}

/**
 * Generate a cache key segment based on the current 6-hour window.
 * This ensures the cache naturally invalidates every 6 hours.
 */
function getCacheKeySegment(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
  }).formatToParts(now);

  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);

  // Round hour down to nearest 6-hour window (0, 6, 12, 18)
  const windowHour = Math.floor(hour / 6) * 6;

  return `${year}-${month}-${day}-${windowHour}`;
}

/**
 * Fetch moon phase for Bucharest timezone (internal, not cached)
 */
async function fetchMoonPhaseForBucharest(): Promise<MoonPhaseData> {
  const bucharestDate = getBucharestDate();
  return getMoonPhase(bucharestDate);
}

/**
 * Get cached moon phase for Europe/Bucharest timezone.
 * Cache revalidates every 6 hours (21600 seconds).
 *
 * @returns MoonPhaseData with phase key, Romanian label, emoji, and age in days
 */
export async function getCachedMoonPhaseForBucharest(): Promise<MoonPhaseData> {
  const cacheKeySegment = getCacheKeySegment();

  const cached = unstable_cache(
    async () => fetchMoonPhaseForBucharest(),
    ["moon-phase", cacheKeySegment],
    {
      revalidate: 21600, // 6 hours in seconds
    }
  );

  return cached();
}

