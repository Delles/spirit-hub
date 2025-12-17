"use client";

import { useDailyContent } from "@/components/providers/daily-content-provider";

/**
 * Format date string (YYYY-MM-DD) in Romanian
 */
function formatRomanianDate(dateStr: string): string {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const formatted = date.toLocaleDateString("ro-RO", options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

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
            <h1 className="text-white font-heading text-3xl md:text-4xl font-bold">
                <span className="inline-block w-64 h-10 bg-white/10 rounded animate-pulse" />
            </h1>
        );
    }

    const formattedDate = formatRomanianDate(data.date);

    return (
        <h1 className="text-white font-heading text-3xl md:text-4xl font-bold">
            {formattedDate}
        </h1>
    );
}

