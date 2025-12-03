/**
 * Server-side utility for fetching daily widget data
 * 
 * Caching strategy (works with ISR on the page level):
 * 1. Page uses ISR with revalidate=3600 (1 hour) - serves cached HTML from edge
 * 2. When ISR revalidates, this function is called
 * 3. unstable_cache with date-based key ensures Convex is only queried once per day
 * 4. Result: ~24 ISR revalidations/day, but only ~1 Convex query/day
 * 
 * Same data for all users, so we can cache aggressively.
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getBiorhythmHintForDay } from "@/lib/biorhythm";
import { unstable_cache } from "next/cache";

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
  biorhythmHint: {
    title: string;
    hint: string;
    dayOfWeek: string;
  };
}

/**
 * Fetch daily widget data from Convex
 * This function is called server-side and uses ConvexHttpClient
 */
async function fetchDailyWidgetData(): Promise<DailyWidgetData> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  }

  const client = new ConvexHttpClient(convexUrl);
  const todayISO = getTodayISO();

  // Fetch daily number and dream in parallel
  const [dailyNumber, dailyDream] = await Promise.all([
    client.query(api.numerology.getDailyNumber, { date: todayISO }).catch(() => null),
    client.query(api.dreams.getDailyDream, { date: todayISO }).catch(() => null),
  ]);

  // Calculate biorhythm hint (client-side calculation, no Convex query needed)
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parseInt(parts.find((p) => p.type === "year")?.value ?? "0", 10);
  const month = parseInt(parts.find((p) => p.type === "month")?.value ?? "0", 10) - 1;
  const day = parseInt(parts.find((p) => p.type === "day")?.value ?? "0", 10);

  const bucharestDate = new Date(year, month, day);
  const biorhythmHint = getBiorhythmHintForDay(bucharestDate);

  return {
    dailyNumber: dailyNumber
      ? {
          number: dailyNumber.number,
          title: dailyNumber.title,
          description: dailyNumber.description,
          date: dailyNumber.date,
        }
      : null,
    dailyDream: dailyDream
      ? {
          name: dailyDream.name,
          category: dailyDream.category,
          shortDescription: dailyDream.shortDescription,
        }
      : null,
    biorhythmHint,
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
      tags: ["daily-widget"],
    }
  );

  return cached();
}

