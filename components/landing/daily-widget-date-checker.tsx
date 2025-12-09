"use client";

import { useEffect, useCallback, useRef } from "react";
import { DailyWidgetData } from "@/lib/daily-widget-server";

// Module-level timestamps to track retries in memory (persist across soft refreshes)
// These act as backups when sessionStorage is blocked (Private Mode)
// Using timestamps allows the flag to "expire" so users can retry on later visits
// while still preventing tight infinite refresh loops
let lastInMemoryReloadTimestamp = 0;

// Cooldown between reload attempts (prevents infinite reload loops)
const RELOAD_COOLDOWN_MS = 10000; // 10 seconds

// Session storage keys
const STORAGE_KEY_RELOAD_LOCK = "spirithub-reload-lock";
const STORAGE_KEY_MISSING_RETRY = "spirithub-missing-retry";

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
 * Trigger a hard page reload with cache busting.
 * Uses sessionStorage (with in-memory fallback) to prevent infinite reload loops.
 * Returns true if reload was triggered, false if blocked by cooldown.
 */
function triggerHardReload(): boolean {
  const now = Date.now();

  try {
    const lastReload = sessionStorage.getItem(STORAGE_KEY_RELOAD_LOCK);
    const lastReloadTime = lastReload ? parseInt(lastReload, 10) : 0;

    if (now - lastReloadTime < RELOAD_COOLDOWN_MS) {
      // Still in cooldown, don't reload
      return false;
    }

    sessionStorage.setItem(STORAGE_KEY_RELOAD_LOCK, now.toString());
  } catch {
    // Fallback if sessionStorage fails (e.g., Private Mode)
    if (now - lastInMemoryReloadTimestamp < RELOAD_COOLDOWN_MS) {
      return false;
    }
    lastInMemoryReloadTimestamp = now;
  }

  // Force a hard reload bypassing cache
  // Note: The `true` parameter is deprecated but still works in most browsers
  // For modern browsers, we use cache-busting via the reload itself
  window.location.reload();
  return true;
}

/**
 * Client-side component that checks if the daily widget data matches today's date.
 * 
 * Strategy:
 * 1. **Initial Mount Check**: Always checks on first mount to catch stale cached HTML
 * 2. **Page Restore Check**: Checks on pageshow event (covers bfcache AND history navigation)
 * 3. **Tab Visibility Check**: Checks when tab becomes visible (mobile app resume)
 * 4. **Hard Reload on Stale**: Uses window.location.reload() instead of router.refresh()
 *    to bypass all cache layers (browser HTTP cache, CDN cache)
 * 5. **Loop Protection**: 10-second cooldown between reload attempts
 */
export function DailyWidgetDateChecker({ widgetData }: DailyWidgetDateCheckerProps) {
  // Keep a ref to widgetData so event handlers always see current value
  const widgetDataRef = useRef(widgetData);
  // Track if initial mount check has been performed
  const hasRunInitialCheck = useRef(false);

  // Core freshness check logic
  const checkFreshness = useCallback((source: string) => {
    const data = widgetDataRef.current;
    const todayISO = getTodayISO();

    // ========================================================================
    // Check 1: Date Mismatch (Staleness) - PRIMARY CHECK
    // If data exists but is from a different day, force hard reload
    // ========================================================================
    if (data.dailyNumber?.date) {
      if (data.dailyNumber.date !== todayISO) {
        console.log(`[DailyWidgetDateChecker] Stale data detected (${source}): data date ${data.dailyNumber.date} !== today ${todayISO}`);
        triggerHardReload();
        return;
      }
    }

    // ========================================================================
    // Check 2: Success - Clear any retry flags
    // If we have fresh, complete data, cleanup stale state
    // ========================================================================
    if (data.dailyNumber && data.dailyDream && data.dailyNumber.date === todayISO) {
      try {
        sessionStorage.removeItem(STORAGE_KEY_MISSING_RETRY);
      } catch { /* ignore */ }
      return;
    }

    // ========================================================================
    // Check 3: Missing Data (Outage) - ONE-SHOT RETRY
    // If data is missing entirely, try one reload to recover
    // ========================================================================
    const isMissingData = !data.dailyNumber || !data.dailyDream;

    if (isMissingData) {
      try {
        const hasRetried = sessionStorage.getItem(STORAGE_KEY_MISSING_RETRY);
        if (!hasRetried) {
          console.log(`[DailyWidgetDateChecker] Missing data detected (${source}), attempting recovery reload`);
          sessionStorage.setItem(STORAGE_KEY_MISSING_RETRY, "true");
          triggerHardReload();
        }
      } catch {
        // Fallback for private mode: triggerHardReload() already implements cooldown logic
        console.log(`[DailyWidgetDateChecker] Missing data detected in private mode (${source}), attempting recovery reload`);
        triggerHardReload();
      }
    }
  }, []);

  // Update ref when widgetData prop changes
  useEffect(() => {
    widgetDataRef.current = widgetData;
  }, [widgetData]);

  // ========================================================================
  // INITIAL MOUNT CHECK (Solution 4)
  // This runs once on component mount to catch stale cached HTML
  // regardless of how the page was loaded (history, shortcut, direct, etc.)
  // ========================================================================
  useEffect(() => {
    if (!hasRunInitialCheck.current) {
      hasRunInitialCheck.current = true;
      // Small delay to ensure hydration is complete
      const timeoutId = setTimeout(() => {
        checkFreshness("initial-mount");
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [checkFreshness]);

  // ========================================================================
  // EVENT LISTENERS for ongoing freshness checks
  // ========================================================================
  useEffect(() => {
    // Handle pageshow - fires on ALL page displays including:
    // - bfcache restore (event.persisted === true)
    // - History navigation (event.persisted may be false)
    // - Fresh loads (event.persisted === false)
    // We check on ALL pageshow events, not just persisted ones
    const handlePageShow = (event: PageTransitionEvent) => {
      // For persisted pages (bfcache), always check
      // For non-persisted, the initial mount check already handles it
      if (event.persisted) {
        checkFreshness("pageshow-bfcache");
      }
    };

    // Handle tab becoming visible (mobile app resume from background/sleep)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkFreshness("visibility-change");
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
