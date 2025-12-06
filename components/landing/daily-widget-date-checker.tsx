"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DailyWidgetData } from "@/lib/daily-widget-server";

// Module-level timestamps to track retries in memory (persist across soft refreshes)
// These act as backups when sessionStorage is blocked (Private Mode)
// using timestamps allows the flag to "expire" so users can retry on later visits
// while still preventing tight infinite refresh loops
let lastInMemoryMissingRetry = 0;
let lastInMemoryStalenessRetry = 0;

const RETRY_COOLDOWN_MS = 15000; // 15 seconds

interface DailyWidgetDateCheckerProps {
  widgetData: DailyWidgetData;
}

/**
 * Client-side component that checks if the daily widget data matches today's date.
 * Only checks once on mount to avoid unnecessary refreshes.
 * 
 * Strategy:
 * 1. Date Mismatch: Persistent throttled retry (every 5s) until fixed.
 *    - Private Mode Fallback: One retry every 15s.
 * 2. Missing Data: One-shot retry (try once, then give up).
 *    - Private Mode Fallback: One retry every 15s.
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

    // Helper for safe refreshing with loop protection (for persistent retries)
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
        // Fallback if sessionStorage fails (e.g. Private Mode)
        // Guard against infinite loops by throttling retries
        const now = Date.now();
        if (now - lastInMemoryStalenessRetry > RETRY_COOLDOWN_MS) {
          lastInMemoryStalenessRetry = now;
          router.refresh();
        }
      }
    };

    // ========================================================================
    // Check 1: Success / Cleanup
    // If we have full data, clear the missing-retry flags
    // ========================================================================
    if (widgetData.dailyNumber && widgetData.dailyDream) {
      // Clear storage flag
      try {
        sessionStorage.removeItem("convex-missing-retry");
      } catch (e) { /* ignore */ }

      // Reset memory timestamp (allow immediate retry on next failure)
      lastInMemoryMissingRetry = 0;
    }

    // ========================================================================
    // Check 2: Date Mismatch (Staleness)
    // ========================================================================
    if (widgetData.dailyNumber?.date) {
      if (widgetData.dailyNumber.date !== todayISO) {
        triggerSafeRefresh();
        return;
      } else {
        // Date matches! Reset staleness retry timestamp
        lastInMemoryStalenessRetry = 0;
      }
    }

    // ========================================================================
    // Check 3: Missing Data (Outage)
    // One-shot retry strategy
    // ========================================================================
    const isMissingData = !widgetData.dailyNumber || !widgetData.dailyDream;

    if (isMissingData) {
      try {
        const hasRetried = sessionStorage.getItem("convex-missing-retry");
        if (!hasRetried) {
          sessionStorage.setItem("convex-missing-retry", "true");
          router.refresh();
        } else {
          console.warn("Daily widget data missing, retry limit reached (storage).");
        }
      } catch (e) {
        // Fallback for private mode: use in-memory timestamp throttle
        const now = Date.now();
        if (now - lastInMemoryMissingRetry > RETRY_COOLDOWN_MS) {
          lastInMemoryMissingRetry = now;
          router.refresh();
        }
      }
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  // This component doesn't render anything
  return null;
}
