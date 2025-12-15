"use client";

import { useEffect, useCallback, useRef } from "react";
import { DailyWidgetData } from "@/lib/daily-widget-server";

// Cooldown between reload attempts (prevents infinite reload loops)
const RELOAD_COOLDOWN_MS = 10000; // 10 seconds
const MAX_BACKOFF_MS = 300000; // 5 minutes
const MAX_PRIVATE_MODE_RETRIES = 3; // Hard cap for private mode retries

// Session storage keys
const STORAGE_KEY_RELOAD_LOCK = "spirithub-reload-lock";
const STORAGE_KEY_MISSING_RETRY = "spirithub-missing-retry";

// Cookie name for private mode retry persistence (survives page reloads)
const COOKIE_PRIVATE_MODE_RETRY = "spirithub-pm-retry";
// Token used in window.name as a last-resort persistence when BOTH sessionStorage AND cookies are blocked
const WINDOW_NAME_RETRY_TOKEN = "__spirithub_pm_retry__";
// URL query param used as ultimate fallback when all storage mechanisms fail
const URL_RETRY_PARAM = "pmr";
// URL query param used to force a fresh server render when HTML is stale (ISR/bfcache/disk cache).
// Use a stable value (YYYY-MM-DD) to avoid creating infinite CDN cache variants.
const URL_DAILY_CACHE_BUST_PARAM = "__dw";

/**
 * Get private mode retry state from cookie
 * Returns { count: number, timestamp: number } or null if no cookie
 */
function getPrivateModeRetryCookie(): { count: number; timestamp: number } | null {
  try {
    const match = document.cookie.match(new RegExp(`${COOKIE_PRIVATE_MODE_RETRY}=([^;]+)`));
    if (match) {
      const [count, timestamp] = match[1].split(":").map(Number);
      if (!isNaN(count) && !isNaN(timestamp)) {
        return { count, timestamp };
      }
    }
  } catch { /* ignore */ }
  return null;
}

/**
 * Set private mode retry cookie (expires in 10 minutes)
 */
function setPrivateModeRetryCookie(count: number, timestamp: number): void {
  try {
    const expires = new Date(Date.now() + 600000).toUTCString(); // 10 min expiry
    document.cookie = `${COOKIE_PRIVATE_MODE_RETRY}=${count}:${timestamp}; path=/; expires=${expires}; SameSite=Lax`;
  } catch { /* ignore */ }
}

/**
 * Clear private mode retry cookie
 */
function clearPrivateModeRetryCookie(): void {
  try {
    document.cookie = `${COOKIE_PRIVATE_MODE_RETRY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch { /* ignore */ }
}

/**
 * Read retry state from window.name (last-resort persistence when all storage is blocked)
 * Format: "...|||__spirithub_pm_retry__=count:timestamp"
 */
function getWindowNameRetry(): { count: number; timestamp: number } | null {
  try {
    const match = window.name.match(new RegExp(`${WINDOW_NAME_RETRY_TOKEN}=([0-9]+):([0-9]+)`));
    if (match) {
      const count = parseInt(match[1], 10);
      const timestamp = parseInt(match[2], 10);
      if (!isNaN(count) && !isNaN(timestamp)) {
        return { count, timestamp };
      }
    }
  } catch { /* ignore */ }
  return null;
}

/**
 * Write retry state to window.name without destroying existing content
 */
function setWindowNameRetry(count: number, timestamp: number): void {
  try {
    const entries = (window.name || "")
      .split("|||")
      .filter(Boolean)
      .filter((part) => !part.startsWith(`${WINDOW_NAME_RETRY_TOKEN}=`));
    entries.push(`${WINDOW_NAME_RETRY_TOKEN}=${count}:${timestamp}`);
    window.name = entries.join("|||");
  } catch { /* ignore */ }
}

/**
 * Clear retry state from window.name
 */
function clearWindowNameRetry(): void {
  try {
    const entries = (window.name || "")
      .split("|||")
      .filter(Boolean)
      .filter((part) => !part.startsWith(`${WINDOW_NAME_RETRY_TOKEN}=`));
    window.name = entries.join("|||");
  } catch { /* ignore */ }
}

/**
 * Read retry state from the URL (count:timestamp) used as ultimate fallback.
 */
function getUrlRetryState(): { count: number; timestamp: number } | null {
  try {
    const search = new URL(window.location.href).searchParams.get(URL_RETRY_PARAM);
    if (!search) return null;
    const [countStr, tsStr] = search.split(":");
    const count = parseInt(countStr ?? "", 10);
    const timestamp = parseInt(tsStr ?? "", 10);
    if (!isNaN(count) && !isNaN(timestamp)) {
      return { count, timestamp };
    }
  } catch { /* ignore */ }
  return null;
}

/**
 * Persist retry state in the URL query param (count:timestamp).
 */
function setUrlRetryState(count: number, timestamp: number): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set(URL_RETRY_PARAM, `${count}:${timestamp}`);
    window.history.replaceState(null, "", url.toString());
  } catch { /* ignore */ }
}

/**
 * Clear retry state from the URL query param.
 */
function clearUrlRetryState(): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete(URL_RETRY_PARAM);
    window.history.replaceState(null, "", url.toString());
  } catch { /* ignore */ }
}

/**
 * Remove the daily cache-bust param from the URL (cosmetic; avoids sharing the param).
 */
function clearDailyCacheBustParam(): void {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(URL_DAILY_CACHE_BUST_PARAM)) return;
    url.searchParams.delete(URL_DAILY_CACHE_BUST_PARAM);
    window.history.replaceState(null, "", url.toString());
  } catch { /* ignore */ }
}

interface DailyWidgetDateCheckerProps {
  widgetData: DailyWidgetData;
  onGaveUp?: () => void; // Callback when max retries reached in private mode
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

// Cookie name for reload lock in private mode (survives page reloads)
const COOKIE_RELOAD_LOCK = "spirithub-reload-lock";

/**
 * Get reload lock timestamp from cookie
 */
function getReloadLockCookie(): number {
  try {
    const match = document.cookie.match(new RegExp(`${COOKIE_RELOAD_LOCK}=([^;]+)`));
    if (match) {
      return parseInt(match[1], 10) || 0;
    }
  } catch { /* ignore */ }
  return 0;
}

/**
 * Set reload lock cookie (expires in 1 minute)
 */
function setReloadLockCookie(timestamp: number): void {
  try {
    const expires = new Date(Date.now() + 60000).toUTCString(); // 1 min expiry
    document.cookie = `${COOKIE_RELOAD_LOCK}=${timestamp}; path=/; expires=${expires}; SameSite=Lax`;
  } catch { /* ignore */ }
}

// Flag to prevent multiple simultaneous navigation attempts
let isNavigating = false;

/**
 * Trigger a hard page reload with cache busting.
 * Uses sessionStorage (with cookie fallback) to prevent infinite reload loops.
 * Returns true if reload was triggered, false if blocked by cooldown.
 */
function triggerHardReload(): boolean {
  if (isNavigating) {
    console.log("[DateChecker] triggerHardReload blocked: already navigating");
    return false;
  }

  const now = Date.now();

  try {
    const lastReload = sessionStorage.getItem(STORAGE_KEY_RELOAD_LOCK);
    const lastReloadTime = lastReload ? parseInt(lastReload, 10) : 0;

    if (now - lastReloadTime < RELOAD_COOLDOWN_MS) {
      console.log(`[DateChecker] triggerHardReload blocked: cooldown (${now - lastReloadTime}ms < ${RELOAD_COOLDOWN_MS}ms)`);
      return false;
    }

    sessionStorage.setItem(STORAGE_KEY_RELOAD_LOCK, now.toString());
  } catch {
    // Fallback if sessionStorage fails (e.g., Private Mode) - use cookies
    const lastReloadTime = getReloadLockCookie();
    if (now - lastReloadTime < RELOAD_COOLDOWN_MS) {
      console.log(`[DateChecker] triggerHardReload blocked: cooldown via cookie`);
      return false;
    }
    setReloadLockCookie(now);
  }

  console.log("[DateChecker] triggerHardReload: executing window.location.reload()");
  isNavigating = true;
  window.location.reload();
  return true;
}

/**
 * Force a full navigation to a cache-busted URL so we always get a fresh HTML/RSC response.
 * This is more reliable than location.reload() for Android Chrome shortcuts / bfcache restores.
 * 
 * Returns true if navigation was triggered, false if we gave up (to prevent infinite loops).
 */
function triggerCacheBustedNavigation(todayISO: string): boolean {
  if (isNavigating) {
    console.log("[DateChecker] triggerCacheBustedNavigation blocked: already navigating");
    return false;
  }

  try {
    const url = new URL(window.location.href);
    const current = url.searchParams.get(URL_DAILY_CACHE_BUST_PARAM);
    console.log(`[DateChecker] triggerCacheBustedNavigation: current __dw=${current}, target=${todayISO}`);

    // Logic to prevent infinite loops:
    // 1. No param OR param is from a different day → add today's date
    // 2. Param is exactly today's date → add timestamp suffix (one retry attempt)
    // 3. Param already has timestamp suffix (todayISO-*) → GIVE UP, ISR is stuck

    if (!current || !current.startsWith(todayISO)) {
      // Case 1: First attempt - add today's date
      url.searchParams.set(URL_DAILY_CACHE_BUST_PARAM, todayISO);
      console.log(`[DateChecker] First attempt, navigating to: ${url.toString()}`);
      isNavigating = true;
      window.location.replace(url.toString());
      return true;
    } else if (current === todayISO) {
      // Case 2: Already tried with date, add timestamp for one more attempt
      const uniqueValue = `${todayISO}-${Date.now()}`;
      url.searchParams.set(URL_DAILY_CACHE_BUST_PARAM, uniqueValue);
      console.log(`[DateChecker] Second attempt with timestamp, navigating to: ${url.toString()}`);
      isNavigating = true;
      window.location.replace(url.toString());
      return true;
    } else {
      // Case 3: Already has timestamp suffix - ISR is serving stale content, give up
      console.log(`[DateChecker] Already tried with timestamp suffix, giving up. ISR may be serving stale content.`);
      return false;
    }
  } catch (err) {
    console.error("[DateChecker] URL construction failed:", err);
    // Don't retry on error to prevent loops
    return false;
  }
}

/**
 * Client-side component that checks if the daily widget data matches today's date.
 * 
 * Strategy:
 * 1. **Initial Mount Check**: Always checks on first mount to catch stale cached HTML
 * 2. **Page Restore Check**: Checks on pageshow event (covers bfcache AND history navigation)
 * 3. **Tab Visibility Check**: Checks when tab becomes visible (mobile app resume)
 * 4. **Cache-busted Navigation on Stale**: Navigates to `/?__dw=YYYY-MM-DD` to force a fresh
 *    server render, bypassing stale ISR HTML and bfcache/disk cache edge cases.
 * 5. **Loop Protection**: 10-second cooldown between reload attempts
 */
export function DailyWidgetDateChecker({ widgetData, onGaveUp }: DailyWidgetDateCheckerProps) {
  // Keep a ref to widgetData so event handlers always see current value
  const widgetDataRef = useRef(widgetData);
  // Track if initial mount check has been performed
  const hasRunInitialCheck = useRef(false);
  // Track backoff timeout to clear on unmount
  const backoffTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Track if we've already given up (to prevent duplicate onGaveUp calls)
  const hasGivenUp = useRef(false);
  // In-memory fallback counter for when BOTH sessionStorage AND cookies are blocked
  // This survives within the same page session but resets on reload
  // Combined with the pending timeout check, this prevents runaway loops
  const inMemoryRetryCount = useRef(0);
  const inMemoryLastAttempt = useRef(0);

  // Reset navigation guard on mount (handles cases where previous navigation failed)
  useEffect(() => {
    isNavigating = false;
  }, []);

  // Helper to clear any pending reload timeout
  const clearPendingReload = useCallback(() => {
    if (backoffTimeoutRef.current) {
      clearTimeout(backoffTimeoutRef.current);
      backoffTimeoutRef.current = null;
    }
  }, []);

  // Core freshness check logic
  const checkFreshness = useCallback((source: string) => {
    const data = widgetDataRef.current;
    const todayISO = getTodayISO();
    const now = Date.now();

    // Debug logging for mobile issue investigation
    console.log(`[DateChecker] checkFreshness called from: ${source}`);
    console.log(`[DateChecker] todayISO: ${todayISO}`);
    console.log(`[DateChecker] data.dailyNumber?.date: ${data.dailyNumber?.date}`);
    console.log(`[DateChecker] serverRenderTimestamp: ${data.serverRenderTimestamp}, age: ${now - (data.serverRenderTimestamp || 0)}ms`);

    // ========================================================================
    // Check 0: Server Render Timestamp (Failsafe for bfcache)
    // If the page was rendered more than 6 hours ago, force reload
    // This catches edge cases where date comparison might fail or bfcache serves stale HTML
    // ========================================================================
    if (data.serverRenderTimestamp) {
      const ageMs = now - data.serverRenderTimestamp;
      const maxAgeMs = 6 * 60 * 60 * 1000; // 6 hours (more aggressive for daily content)
      if (ageMs > maxAgeMs) {
        console.log(`[DateChecker] Timestamp failsafe triggered: page is ${ageMs}ms old (>${maxAgeMs}ms)`);
        triggerCacheBustedNavigation(todayISO);
        return;
      }
    }

    // ========================================================================
    // Check 1: Date Mismatch (Staleness) - PRIMARY CHECK
    // If data exists but is from a different day, force hard reload
    // ========================================================================
    if (data.dailyNumber?.date) {
      if (data.dailyNumber.date !== todayISO) {
        console.log(`[DateChecker] Date mismatch detected: ${data.dailyNumber.date} !== ${todayISO}`);
        // This is the common case after midnight with ISR: first request returns yesterday HTML.
        // Cache-busted navigation ensures we get today's server render immediately.
        triggerCacheBustedNavigation(todayISO);
        return;
      }
    }

    // ========================================================================
    // Check 2: Success - Clear any retry flags and pending timeouts
    // If we have fresh, complete data, cleanup stale state
    // ========================================================================
    if (data.dailyNumber && data.dailyDream && data.dailyNumber.date === todayISO) {
      // Cancel any pending reload since data arrived
      clearPendingReload();
      try {
        sessionStorage.removeItem(STORAGE_KEY_MISSING_RETRY);
        sessionStorage.removeItem(STORAGE_KEY_RELOAD_LOCK);
      } catch { /* ignore */ }
      clearPrivateModeRetryCookie();
      clearWindowNameRetry();
      clearUrlRetryState();
      clearDailyCacheBustParam();
      inMemoryRetryCount.current = 0;
      inMemoryLastAttempt.current = 0;
      hasGivenUp.current = false; // Reset for future retries
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
          sessionStorage.setItem(STORAGE_KEY_MISSING_RETRY, "true");
          triggerHardReload();
        }
      } catch {
        // Fallback for private mode: use cookies that survive page reloads
        const now = Date.now();
        const cookieState = getPrivateModeRetryCookie();
        const windowNameState = getWindowNameRetry();
        const urlState = getUrlRetryState();

        // Prefer cookie, then window.name, then URL param, then in-memory as last resort
        const usingCookie = cookieState !== null;
        const usingWindowName = !usingCookie && windowNameState !== null;
        const usingUrl = !usingCookie && !usingWindowName && urlState !== null;

        let retryCount: number;
        let lastAttempt: number;

        if (usingCookie) {
          retryCount = cookieState.count;
          lastAttempt = cookieState.timestamp;
        } else if (usingWindowName) {
          retryCount = windowNameState!.count;
          lastAttempt = windowNameState!.timestamp;
        } else if (usingUrl) {
          retryCount = urlState!.count;
          lastAttempt = urlState!.timestamp;
        } else {
          retryCount = inMemoryRetryCount.current;
          lastAttempt = inMemoryLastAttempt.current;
        }

        // Check if we've hit the hard cap (works for both cookie and in-memory)
        if (retryCount >= MAX_PRIVATE_MODE_RETRIES) {
          if (!hasGivenUp.current) {
            hasGivenUp.current = true;
            onGaveUp?.();
          }
          return;
        }

        // Don't schedule if we already have a pending timeout
        if (backoffTimeoutRef.current) {
          return;
        }

        // Calculate backoff: 10s -> 20s -> 40s -> ... -> 5m cap
        const backoffMs = Math.min(
          RELOAD_COOLDOWN_MS * Math.pow(2, retryCount),
          MAX_BACKOFF_MS
        );

        // Calculate remaining delay (schedule even if partially elapsed)
        const elapsed = now - lastAttempt;
        const remainingDelay = usingCookie || usingWindowName || usingUrl
          ? Math.max(0, backoffMs - elapsed)
          : backoffMs;

        const nextCount = retryCount + 1;
        // Update retry count in the active persistence layer (promote to cookie/window.name/url if currently in-memory)
        if (usingCookie) {
          setPrivateModeRetryCookie(nextCount, now);
        } else if (usingWindowName) {
          setWindowNameRetry(nextCount, now);
        } else if (usingUrl) {
          setUrlRetryState(nextCount, now);
        } else {
          // Try to promote to cookie first
          setPrivateModeRetryCookie(nextCount, now);
          const cookieAfterWrite = getPrivateModeRetryCookie();
          if (cookieAfterWrite) {
            // Promotion succeeded; optionally update lastAttempt for remainingDelay parity
          } else {
            // Try window.name fallback
            setWindowNameRetry(nextCount, now);
            const windowNameAfterWrite = getWindowNameRetry();
            if (windowNameAfterWrite) {
              // ok
            } else {
              // Try URL param fallback
              setUrlRetryState(nextCount, now);
              const urlAfterWrite = getUrlRetryState();
              if (!urlAfterWrite) {
                // Final fallback: in-memory only (does not survive hard reloads)
                inMemoryRetryCount.current = nextCount;
                inMemoryLastAttempt.current = now;
              }
            }
          }
        }


        // Schedule reload with remaining delay (or full backoff for in-memory)
        backoffTimeoutRef.current = setTimeout(() => {
          backoffTimeoutRef.current = null;
          triggerHardReload();
        }, remainingDelay);
      }
    }
  }, [onGaveUp, clearPendingReload]);

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
      if (backoffTimeoutRef.current) {
        clearTimeout(backoffTimeoutRef.current);
        backoffTimeoutRef.current = null;
      }
    };
  }, [checkFreshness]);

  // This component doesn't render anything
  return null;
}
