"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DailyWidgetData } from "@/lib/daily-widget-server";

interface DailyWidgetDateCheckerProps {
  widgetData: DailyWidgetData;
}

/**
 * Client-side component that checks if the daily widget data matches today's date.
 * Only checks once on mount to avoid unnecessary refreshes.
 * 
 * The Next.js cache key includes the date, so it auto-invalidates at midnight.
 * This checker is a safety net for edge cases (e.g., browser cache, stale HTML).
 * 
 * Since data only changes once per 24 hours, we only check once per page load.
 */
export function DailyWidgetDateChecker({ widgetData }: DailyWidgetDateCheckerProps) {
  const router = useRouter();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Only check once per component mount to avoid unnecessary refreshes
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    // Get today's date in ISO format (YYYY-MM-DD) in Europe/Bucharest timezone
    const getTodayISO = (): string => {
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
    };

    const todayISO = getTodayISO();

    // Helper for safe refreshing with loop protection
    const triggerSafeRefresh = () => {
      try {
        const lastRefresh = sessionStorage.getItem("convex-refresh-lock");
        const now = Date.now();
        const lastRefreshTime = lastRefresh ? parseInt(lastRefresh, 10) : NaN;

        if (Number.isFinite(lastRefreshTime) && (now - lastRefreshTime < 5000)) {
          console.error("Convex auto-refresh loop detected. Aborting.");
          return;
        }

        sessionStorage.setItem("convex-refresh-lock", now.toString());
        router.refresh();
      } catch (e) {
        // Fallback if sessionStorage fails (e.g. private mode)
        router.refresh();
      }
    };

    // Check if the daily number date matches today
    // If dailyNumber exists and has a date, compare it
    if (widgetData.dailyNumber?.date) {
      const dataDate = widgetData.dailyNumber.date;

      // If the date doesn't match today, refresh the page to get fresh data
      // This handles edge cases where HTML was cached before the cache key changed
      if (dataDate !== todayISO) {
        // Use router.refresh() to re-fetch server components without losing client state
        // This will hit the Next.js cache (with date-based key), not Convex directly
        triggerSafeRefresh();
        return;
      }
    }

    // Check for partial failure: Daily Number exists but Dream is missing
    if (widgetData.dailyNumber && !widgetData.dailyDream) {
      triggerSafeRefresh();
      return;
    }

    // Check for partial failure: Daily Dream exists but Number is missing (Symmetric check)
    if (widgetData.dailyDream && !widgetData.dailyNumber) {
      triggerSafeRefresh();
      return;
    }

    // Check for total failure: Both are missing
    if (!widgetData.dailyNumber && !widgetData.dailyDream) {
      triggerSafeRefresh();
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  // This component doesn't render anything
  return null;
}
