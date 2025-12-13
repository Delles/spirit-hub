"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// Query param used to force a fresh server render
const URL_DAILY_CACHE_BUST_PARAM = "__dw";
// Cooldown between reload attempts
const RELOAD_COOLDOWN_MS = 10000;

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

    const checkFreshness = useCallback(() => {
        const now = Date.now();

        // Cooldown to prevent rapid reloads
        if (now - lastCheckTime.current < RELOAD_COOLDOWN_MS) {
            return;
        }
        lastCheckTime.current = now;

        const todayISO = getTodayISO();

        if (serverDate !== todayISO) {
            // Don't try to refresh if offline - show banner instead
            if (typeof navigator !== "undefined" && !navigator.onLine) {
                setShowOfflineBanner(true);
                return;
            }

            // Hide banner if we're online now
            setShowOfflineBanner(false);

            // Navigate to cache-busted URL
            try {
                const url = new URL(window.location.href);
                const current = url.searchParams.get(URL_DAILY_CACHE_BUST_PARAM);
                if (current === todayISO) {
                    // Already tried with today's date, just reload
                    window.location.reload();
                    return;
                }
                url.searchParams.set(URL_DAILY_CACHE_BUST_PARAM, todayISO);
                window.location.replace(url.toString());
            } catch {
                window.location.reload();
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

