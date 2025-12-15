"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// Query param used to force a fresh server render
const URL_DAILY_CACHE_BUST_PARAM = "__dw";
// Cooldown between reload attempts
const RELOAD_COOLDOWN_MS = 10000;
// Only log in development to reduce noise and mobile perf impact
const DEBUG = process.env.NODE_ENV !== "production";

// Module-level navigation guard
let isNavigating = false;

/**
 * Get today's date in ISO format (YYYY-MM-DD) in Europe/Bucharest timezone.
 * Uses formatToParts for maximum mobile browser compatibility.
 * (toLocaleDateString can have edge cases on older Android/Samsung Internet)
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

interface DailyPageDateCheckerProps {
    /** The date the page was rendered (ISO format: YYYY-MM-DD) */
    serverDate: string;
}

/**
 * Lightweight date checker for daily content pages.
 * 
 * Ensures users always see today's content by comparing the server-rendered date
 * with the client's current Bucharest date. If stale, triggers a cache-busted
 * navigation to force a fresh ISR render.
 * 
 * Shows an offline banner if content is stale but user is offline.
 */
export function DailyPageDateChecker({ serverDate }: DailyPageDateCheckerProps) {
    const lastCheckTime = useRef(0);
    const hasChecked = useRef(false);
    const [showOfflineBanner, setShowOfflineBanner] = useState(false);

    // Reset navigation guard on mount (handles cases where previous navigation failed)
    useEffect(() => {
        isNavigating = false;
    }, []);

    const checkFreshness = useCallback(() => {
        // Guard against concurrent navigation attempts
        if (isNavigating) {
            if (DEBUG) console.log("[DailyPageDateChecker] checkFreshness blocked: already navigating");
            return;
        }

        const now = Date.now();

        // Cooldown to prevent rapid reloads
        if (now - lastCheckTime.current < RELOAD_COOLDOWN_MS) {
            if (DEBUG) console.log("[DailyPageDateChecker] checkFreshness blocked: cooldown");
            return;
        }
        lastCheckTime.current = now;

        const todayISO = getTodayISO();

        if (DEBUG) console.log(`[DailyPageDateChecker] serverDate: ${serverDate}, todayISO: ${todayISO}`);

        if (serverDate !== todayISO) {
            // Don't try to refresh if offline - show banner instead
            if (typeof navigator !== "undefined" && !navigator.onLine) {
                if (DEBUG) console.log("[DailyPageDateChecker] Offline - showing banner");
                setShowOfflineBanner(true);
                return;
            }

            // Hide banner if we're online now
            setShowOfflineBanner(false);

            // Navigate to cache-busted URL
            try {
                const url = new URL(window.location.href);
                const current = url.searchParams.get(URL_DAILY_CACHE_BUST_PARAM);
                if (DEBUG) console.log(`[DailyPageDateChecker] current __dw: ${current}, target: ${todayISO}`);

                // Logic to prevent infinite loops and CDN variant explosion:
                // 1. No param OR param is from a different day → add today's date
                // 2. Param is exactly today's date → add fixed "-r2" suffix (one retry attempt)
                // 3. Param already has "-r2" suffix → GIVE UP, ISR is stuck
                // Using fixed suffix instead of timestamp to cap CDN variants to 2 per day per route

                if (!current || !current.startsWith(todayISO)) {
                    // Case 1: First attempt - add today's date
                    url.searchParams.set(URL_DAILY_CACHE_BUST_PARAM, todayISO);
                    if (DEBUG) console.log(`[DailyPageDateChecker] First attempt, navigating to: ${url.toString()}`);
                    isNavigating = true;
                    window.location.replace(url.toString());
                } else if (current === todayISO) {
                    // Case 2: Already tried with date, add fixed retry suffix
                    const retryValue = `${todayISO}-r2`;
                    url.searchParams.set(URL_DAILY_CACHE_BUST_PARAM, retryValue);
                    if (DEBUG) console.log(`[DailyPageDateChecker] Second attempt with -r2, navigating to: ${url.toString()}`);
                    isNavigating = true;
                    window.location.replace(url.toString());
                } else {
                    // Case 3: Already has suffix - ISR is serving stale content, give up
                    if (DEBUG) console.log(`[DailyPageDateChecker] Already tried with -r2, giving up.`);
                    // Show offline banner as a way to indicate something is wrong
                    setShowOfflineBanner(true);
                    return;
                }
            } catch (err) {
                console.error("[DailyPageDateChecker] Navigation failed:", err);
                // Don't retry on error to prevent loops
            }
        } else {
            // Content is fresh - hide banner and clean up URL
            setShowOfflineBanner(false);
            try {
                const url = new URL(window.location.href);
                if (url.searchParams.has(URL_DAILY_CACHE_BUST_PARAM)) {
                    url.searchParams.delete(URL_DAILY_CACHE_BUST_PARAM);
                    window.history.replaceState(null, "", url.toString());
                }
            } catch { /* ignore */ }
        }
    }, [serverDate]);

    // Check on mount
    useEffect(() => {
        if (!hasChecked.current) {
            hasChecked.current = true;
            // Small delay to ensure hydration is complete
            const timeoutId = setTimeout(() => checkFreshness(), 100);
            return () => clearTimeout(timeoutId);
        }
    }, [checkFreshness]);

    // Check on visibility change (tab resume)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                checkFreshness();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [checkFreshness]);

    // Check on pageshow (bfcache restore)
    useEffect(() => {
        const handlePageShow = () => checkFreshness();
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, [checkFreshness]);

    // Listen for online event to refresh when connection is restored
    useEffect(() => {
        const handleOnline = () => {
            if (showOfflineBanner) {
                checkFreshness();
            }
        };
        window.addEventListener("online", handleOnline);
        return () => window.removeEventListener("online", handleOnline);
    }, [showOfflineBanner, checkFreshness]);

    if (!showOfflineBanner) {
        return null;
    }

    return (
        <div
            role="alert"
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-lg border border-yellow-500/30 bg-yellow-900/90 px-4 py-3 text-center text-sm text-yellow-100 shadow-lg backdrop-blur-sm"
        >
            📶 Ești offline — conținutul se va actualiza când revii online
        </div>
    );
}

