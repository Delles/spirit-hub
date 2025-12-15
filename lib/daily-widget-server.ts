/**
 * Server-side utility for fetching daily widget data
 * 
 * Caching strategy (works with ISR on the page level):
 * 1. Page uses ISR with revalidate=3600 (1 hour) - serves cached HTML from edge
 * 2. When ISR revalidates, this function is called
 * 3. unstable_cache with date-based key ensures data is only recalculated once per day
 * 4. Result: ~24 ISR revalidations/day, but only ~1 data calculation/day
 * 
 * Same data for all users, so we can cache aggressively.
 */

import { getEnergiaZileiWidget, type DominantEnergy } from "@/lib/energia-zilei";
import { unstable_cache } from "next/cache";
import { calculateDailyNumber, getDailyDream } from "@/lib/daily-content";
import { getInterpretation } from "@/lib/interpretations";

/**
 * Get today's date in ISO format (YYYY-MM-DD) in Europe/Bucharest timezone
 */
function getTodayISO(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";

  return `${year}-${month}-${day}`;
}

/**
 * Daily widget data structure
 */
export interface DailyWidgetData {
  dailyNumber: {
    number: number;
    title: string;
    description: string;
    date: string;
  } | null;
  dailyDream: {
    name: string;
    category: string;
    shortDescription: string;
  } | null;
  energiaZilei: {
    dayName: string;
    theme: string;
    shortHint: string;
    energyLevel: number;
    dominantEnergy: DominantEnergy;
    color: string;
    planetSymbol: string;
  };
  /** Unix timestamp (ms) when data was rendered server-side. Used to detect stale bfcache pages. */
  serverRenderTimestamp: number;
}

/**
 * Fetch daily widget data locally (deterministic)
 */
async function fetchDailyWidgetData(): Promise<DailyWidgetData> {
  const todayISO = getTodayISO();

  // 1. Calculate Daily Number
  const dailyNumVal = calculateDailyNumber(todayISO);
  const dailyNumInterp = getInterpretation("daily", dailyNumVal);

  const dailyNumberData = dailyNumInterp ? {
    number: dailyNumVal,
    title: dailyNumInterp.title,
    description: dailyNumInterp.description,
    date: todayISO,
  } : null;

  // 2. Get Daily Dream
  let dailyDreamData = null;
  try {
    const dreamSymbol = getDailyDream(todayISO);
    if (dreamSymbol) {
      dailyDreamData = {
        name: dreamSymbol.name,
        category: dreamSymbol.category,
        shortDescription: dreamSymbol.shortMeaning, // Map shortMeaning to shortDescription
      };
    }
  } catch (e) {
    console.error("Failed to fetch daily dream:", e);
  }

  // 3. Calculate Energia Zilei using Bucharest date for consistency
  // Parse todayISO to create a Date object representing the Bucharest date
  const [yearStr, monthStr, dayStr] = todayISO.split("-");
  const bucharestDate = new Date(
    parseInt(yearStr, 10),
    parseInt(monthStr, 10) - 1,
    parseInt(dayStr, 10)
  );
  const energiaZilei = getEnergiaZileiWidget(bucharestDate);

  return {
    dailyNumber: dailyNumberData,
    dailyDream: dailyDreamData,
    energiaZilei,
    // Note: serverRenderTimestamp is added in getCachedDailyWidgetData() AFTER cache read
    // to reflect actual page render time, not cache population time
    serverRenderTimestamp: 0, // placeholder, will be overwritten
  };
}

/**
 * Get daily widget data with Next.js caching
 * Cache key includes today's date, so it automatically invalidates at midnight
 * Revalidates every 12 hours as a safety net (cache key handles date-based invalidation)
 */
export async function getCachedDailyWidgetData(): Promise<DailyWidgetData> {
  const todayISO = getTodayISO();

  // Cache key includes the date, so cache automatically invalidates when date changes
  // This means the cache will naturally refresh at midnight Bucharest time
  const cached = unstable_cache(
    async () => {
      return fetchDailyWidgetData();
    },
    ["daily-widget-data", todayISO],
    {
      revalidate: 43200, // 12 hours in seconds - safety net (cache key handles date invalidation)
      tags: ["daily-content", `daily-${todayISO}`],
    }
  );

  const data = await cached();

  // IMPORTANT: Set serverRenderTimestamp AFTER cache read, not inside cached function!
  // This ensures the timestamp reflects when the PAGE was rendered (for bfcache detection),
  // not when the unstable_cache was populated.
  return {
    ...data,
    serverRenderTimestamp: Date.now(),
  };
}

