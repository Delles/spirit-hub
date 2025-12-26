"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";
import { getTodayISOBucharest, calculateDailyNumber } from "@/lib/daily-content";
import { getEnergiaZilei, type EnergiaZileiData } from "@/lib/energia-zilei";
import { getMoonGuide, type MoonGuideData } from "@/lib/moon-guide";
import { getDailyOracle, type OracleMessage } from "@/lib/oracle";
import { getBucharestDate } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface DailyContent {
    /** Current date in YYYY-MM-DD format (Bucharest timezone) */
    date: string;
    /** Daily numerology number (1-9 or master numbers) */
    dailyNumber: {
        number: number;
    };
    /** Planetary day energy data */
    energiaZilei: EnergiaZileiData;
    /** Moon phase with spiritual guidance (includes phaseKey, emoji, labelRo) */
    moonGuide: MoonGuideData;
    /** Daily oracle message */
    dailyOracle: OracleMessage;
}

interface DailyContentContextValue {
    data: DailyContent | null;
    isLoading: boolean;
    /** Force recalculation (useful for testing) */
    refresh: () => void;
}

// ============================================================================
// Context
// ============================================================================

const DailyContentContext = createContext<DailyContentContextValue | null>(null);

// ============================================================================
// Computation
// ============================================================================

/**
 * Compute all daily content from lib/ functions
 * This is pure computation - no network calls
 */
function computeDailyContent(): DailyContent {
    const dateISO = getTodayISOBucharest();
    const bucharestDate = getBucharestDate();
    const dailyNumber = calculateDailyNumber(dateISO);
    const energiaZilei = getEnergiaZilei(bucharestDate);
    const moonGuide = getMoonGuide(bucharestDate);
    const dailyOracle = getDailyOracle(bucharestDate);

    return {
        date: dateISO,
        dailyNumber: { number: dailyNumber },
        energiaZilei,
        moonGuide,
        dailyOracle,
    };
}

// ============================================================================
// Provider
// ============================================================================

interface DailyContentProviderProps {
    children: ReactNode;
}

/**
 * DailyContentProvider
 * 
 * Provides daily content computed entirely client-side from lib/ functions.
 * No network requests - data available after initial client mount.
 * 
 * SSR Safety: Initializes with null to avoid baking build-time content into
 * static HTML. Content is computed on first client render.
 * 
 * Automatically refreshes when:
 * - Page is restored from bfcache (pageshow event)
 * - Tab becomes visible (visibilitychange)
 * - Window gains focus
 * - Every 60 seconds while visible (catches midnight transitions)
 */
export function DailyContentProvider({ children }: DailyContentProviderProps) {
    // Start with null to avoid SSR hydration mismatch
    // Content will be computed on client mount
    const [content, setContent] = useState<DailyContent | null>(null);
    const [currentDate, setCurrentDate] = useState<string | null>(null);

    /**
     * Check if date has changed and refresh if needed
     */
    const maybeRefresh = useCallback(() => {
        const nowDate = getTodayISOBucharest();
        if (nowDate !== currentDate) {
            setCurrentDate(nowDate);
            setContent(computeDailyContent());
        }
    }, [currentDate]);

    /**
     * Force refresh (useful for testing or manual trigger)
     */
    const forceRefresh = useCallback(() => {
        setCurrentDate(getTodayISOBucharest());
        setContent(computeDailyContent());
    }, []);

    // Initial client-side computation
    useEffect(() => {
        // Compute content on first mount (client-side only)
        if (content === null) {
            setCurrentDate(getTodayISOBucharest());
            setContent(computeDailyContent());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Event listeners for date change detection
    useEffect(() => {
        // Only set up listeners after initial content is computed
        if (content === null) return;

        // Handler for pageshow - fires on bfcache restore AND normal navigation
        const handlePageShow = () => {
            maybeRefresh();
        };

        // Handler for visibility change - fires when tab becomes visible
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                maybeRefresh();
            }
        };

        // Handler for focus - covers some edge cases
        const handleFocus = () => {
            maybeRefresh();
        };

        // Add event listeners
        window.addEventListener("pageshow", handlePageShow);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", handleFocus);

        // Low-frequency interval check (every 60s while visible)
        // This catches midnight transitions without setTimeout to exact midnight
        // (which is problematic with DST and timezone edge cases)
        const intervalId = setInterval(() => {
            if (document.visibilityState === "visible") {
                maybeRefresh();
            }
        }, 60_000);

        return () => {
            window.removeEventListener("pageshow", handlePageShow);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", handleFocus);
            clearInterval(intervalId);
        };
    }, [content, maybeRefresh]);

    const value = useMemo(
        () => ({
            data: content,
            isLoading: content === null,
            refresh: forceRefresh
        }),
        [content, forceRefresh]
    );

    return (
        <DailyContentContext.Provider value={value}>
            {children}
        </DailyContentContext.Provider>
    );
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * useDailyContent
 * 
 * Returns the current daily content, computed client-side.
 * Returns null during SSR and initial client render (use isLoading to check).
 * 
 * @throws Error if used outside DailyContentProvider
 */
export function useDailyContent(): DailyContent | null {
    const context = useContext(DailyContentContext);
    if (!context) {
        throw new Error("useDailyContent must be used within a DailyContentProvider");
    }
    return context.data;
}

/**
 * useDailyContentRequired
 * 
 * Returns daily content, throwing during loading.
 * Use this only when you're certain content is loaded (e.g., in deeply nested components).
 * 
 * @throws Error if content is null or used outside DailyContentProvider
 */
export function useDailyContentRequired(): DailyContent {
    const context = useContext(DailyContentContext);
    if (!context) {
        throw new Error("useDailyContentRequired must be used within a DailyContentProvider");
    }
    if (!context.data) {
        throw new Error("Daily content is not yet loaded");
    }
    return context.data;
}

/**
 * useDailyContentWithState
 * 
 * Returns daily content plus loading state and refresh function.
 * Preferred hook for components that need to handle loading states.
 */
export function useDailyContentWithState(): DailyContentContextValue {
    const context = useContext(DailyContentContext);
    if (!context) {
        throw new Error("useDailyContentWithState must be used within a DailyContentProvider");
    }
    return context;
}

