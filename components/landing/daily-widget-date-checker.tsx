"use client";

import { useEffect, useCallback, useRef } from "react";
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
 * Client-side component that checks if the daily widget data matches today's date.
 * Checks on mount, bfcache restore (pageshow), and tab visibility change.
 * 
 * Strategy:
 * 1. Date Mismatch: Persistent throttled retry (every 5s) until fixed.
 *    - Private Mode Fallback: One retry every 15s.
 * 2. Missing Data: One-shot retry (try once, then give up).
 *    - Private Mode Fallback: One retry every 15s.
 * 3. Mobile Restore: Re-checks when page is restored from bfcache or tab becomes visible.
 */
export function DailyWidgetDateChecker({ widgetData }: DailyWidgetDateCheckerProps) {
  const router = useRouter();
  // Keep a ref to widgetData so event handlers always see current value
  const widgetDataRef = useRef(widgetData);
  widgetDataRef.current = widgetData;

  // Helper for safe refreshing with loop protection (for persistent retries)
  const triggerSafeRefresh = useCallback(() => {
    try {
      const lastRefresh = sessionStorage.getItem("convex-refresh-lock");
      const now = Date.now();
      const lastRefreshTime = lastRefresh ? parseInt(lastRefresh, 10) : NaN;

      if (Number.isFinite(lastRefreshTime) && (now - lastRefreshTime < 5000)) {
        return;
      }

      sessionStorage.setItem("convex-refresh-lock", now.toString());
      router.refresh();
    } catch {
      // Fallback if sessionStorage fails (e.g. Private Mode)
      // Guard against infinite loops by throttling retries
      const now = Date.now();
      if (now - lastInMemoryStalenessRetry > RETRY_COOLDOWN_MS) {
        lastInMemoryStalenessRetry = now;
        router.refresh();
      }
    }
  }, [router]);

  // Core freshness check logic - extracted so it can be reused
  const checkFreshness = useCallback(() => {
    const data = widgetDataRef.current;

    // Reset stale in-memory timestamps if cooldown has passed
    const now = Date.now();
    if (now - lastInMemoryStalenessRetry > RETRY_COOLDOWN_MS) {
      lastInMemoryStalenessRetry = 0;
    }
    if (now - lastInMemoryMissingRetry > RETRY_COOLDOWN_MS) {
      lastInMemoryMissingRetry = 0;
    }

    const todayISO = getTodayISO();

    // ========================================================================
    // Check 1: Success / Cleanup
    // If we have full data, clear the missing-retry flags
    // ========================================================================
    if (data.dailyNumber && data.dailyDream) {
      try {
        sessionStorage.removeItem("convex-missing-retry");
      } catch { /* ignore */ }
      lastInMemoryMissingRetry = 0;
    }

    // ========================================================================
    // Check 2: Date Mismatch (Staleness)
    // ========================================================================
    if (data.dailyNumber?.date) {
      if (data.dailyNumber.date !== todayISO) {
        triggerSafeRefresh();
        return;
      } else {
        lastInMemoryStalenessRetry = 0;
      }
    }

    // ========================================================================
    // Check 3: Missing Data (Outage)
    // One-shot retry strategy
    // ========================================================================
    const isMissingData = !data.dailyNumber || !data.dailyDream;

    if (isMissingData) {
      try {
        const hasRetried = sessionStorage.getItem("convex-missing-retry");
        if (!hasRetried) {
          sessionStorage.setItem("convex-missing-retry", "true");
          router.refresh();
        }
      } catch {
        // Fallback for private mode: use in-memory timestamp throttle
        const now = Date.now();
        if (now - lastInMemoryMissingRetry > RETRY_COOLDOWN_MS) {
          lastInMemoryMissingRetry = now;
          router.refresh();
        }
      }
    }
  }, [router, triggerSafeRefresh]);

  useEffect(() => {
    // Run check on mount
    checkFreshness();

    // Handle bfcache restore (mobile back/forward navigation, history restore)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        checkFreshness();
      }
    };

    // Handle tab becoming visible (mobile app resume from background/sleep)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkFreshness();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkFreshness]);

  // This component doesn't render anything
  return null;
}
