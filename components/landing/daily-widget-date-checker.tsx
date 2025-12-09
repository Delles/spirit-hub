"use client";

import { useEffect, useCallback, useRef } from "react";
import { DailyWidgetData } from "@/lib/daily-widget-server";

// Module-level timestamps and counters to track retries in memory (persist across soft refreshes)
// These act as backups when sessionStorage is blocked (Private Mode)
// Using timestamps allows the flag to "expire" so users can retry on later visits
// while still preventing tight infinite refresh loops
let lastInMemoryReloadTimestamp = 0;
let privateModeMissingRetryCount = 0;

// Cooldown between reload attempts (prevents infinite reload loops)
const RELOAD_COOLDOWN_MS = 10000; // 10 seconds
const MAX_BACKOFF_MS = 300000; // 5 minutes

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

  // Force a hard reload - browsers will bypass cache for location.reload()
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
      console.log(`[DailyWidgetDateChecker] Data is fresh (${source}): ${todayISO}`);
      try {
        sessionStorage.removeItem(STORAGE_KEY_MISSING_RETRY);
        sessionStorage.removeItem(STORAGE_KEY_RELOAD_LOCK);
      } catch { /* ignore */ }
      // Reset in-memory timestamp and counters on success
      lastInMemoryReloadTimestamp = 0;
      privateModeMissingRetryCount = 0;
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
        // Fallback for private mode with exponential backoff
        // Calculate backoff: 10s -> 20s -> 40s -> ... -> 5m cap
        const backoffMs = Math.min(
          RELOAD_COOLDOWN_MS * Math.pow(2, privateModeMissingRetryCount),
          MAX_BACKOFF_MS
        );
        const now = Date.now();

        // Check if we waited long enough since the last attempt
        if (now - lastInMemoryReloadTimestamp >= backoffMs) {
          console.log(`[DailyWidgetDateChecker] Missing data in private mode (${source}), retry #${privateModeMissingRetryCount + 1} in ${backoffMs}ms`);

          // We set the timestamp update here effectively starting the "cooldown" for the next check
          // but we also rely on setTimeout ensuring we actually wait this duration before reloading.
          lastInMemoryReloadTimestamp = now;
          privateModeMissingRetryCount++;

          // Use setTimeout to enforce the backoff delay before the hard reload occurs
          // This prevents tight loops even if in-memory state is lost on reload
          setTimeout(() => {
            triggerHardReload();
          }, backoffMs);
        }
      }
    }
  }, []);

  // Update ref after render via useEffect
  // This ensures event handlers see the latest widgetData
  useEffect(() => {
    widgetDataRef.current = widgetData;
  }, [widgetData]);

  // ========================================================================
  // INITIAL MOUNT CHECK (Solution 4)
  // This runs once on component mount to catch stale cached HTML
  // regardless of how the page was loaded (history, shortcut, direct, etc.)
  // ========================================================================
  useEffect(() => {
    // Small delay to ensure hydration is complete
    const timeoutId = setTimeout(() => {
      if (!hasRunInitialCheck.current) {
        hasRunInitialCheck.current = true;
        checkFreshness("initial-mount");
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [checkFreshness]);

  // ========================================================================
  // EVENT LISTENERS for ongoing freshness checks
  // ========================================================================
  useEffect(() => {
    // Handle pageshow - fires on ALL page displays including:
    // - bfcache restore (event.persisted === true)
    // - History navigation from disk cache (event.persisted === false)
    // - Fresh loads (event.persisted === false)
    // We check on ALL pageshow events to catch disk-cached HTML that may be stale
    const handlePageShow = () => {
      checkFreshness("pageshow");
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
