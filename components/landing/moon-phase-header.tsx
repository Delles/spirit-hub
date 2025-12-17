"use client";

import { useDailyContent } from "@/components/providers/daily-content-provider";

/**
 * Moon Phase Header Component
 * Displays the current moon phase in the page header
 * Data is computed client-side - always available immediately
 */
export function MoonPhaseHeader() {
    const data = useDailyContent();

    // Loading state - show placeholder during SSR/initial render
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
