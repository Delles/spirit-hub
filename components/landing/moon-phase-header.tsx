"use client";

import { useDailyContent } from "./daily-widgets-client";

/**
 * Moon Phase Header Component
 * Displays the current moon phase in the page header
 * Fetches data from Convex via the shared useDailyContent hook
 */
export function MoonPhaseHeader() {
    const data = useDailyContent();

    // Loading state
    if (!data) {
        return (
            <p className="text-[#A5B4FC] text-sm flex items-center justify-center gap-2 h-5">
                <span className="animate-pulse">●●●</span>
            </p>
        );
    }

    return (
        <p className="text-[#A5B4FC] text-sm flex items-center justify-center gap-2">
            {data.moonPhase.labelRo} {data.moonPhase.emoji}
        </p>
    );
}
