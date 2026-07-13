"use client";

import { useDailyContent } from "@/components/providers/daily-content-provider";
import { formatRomanianLongCalendarDate } from "@/lib/bucharest-calendar";

/**
 * Format date string (YYYY-MM-DD) in Romanian
 */
/**
 * Date Header Component
 * 
 * Displays the current date computed client-side from the DailyContentProvider.
 * This ensures the date is always "today" (Bucharest time) rather than build time.
 */
export function DateHeader() {
    const data = useDailyContent();

    // Loading state - show placeholder during SSR/initial render
    if (!data) {
        return (
            <p className="text-white font-heading text-3xl md:text-4xl font-bold">
                <span className="inline-block w-64 h-10 bg-white/10 rounded animate-pulse" />
            </p>
        );
    }

    const formattedDate = formatRomanianLongCalendarDate(data.date);

    return (
        <time
            dateTime={data.date}
            className="block text-white font-heading text-3xl md:text-4xl font-bold"
        >
            {formattedDate}
        </time>
    );
}

