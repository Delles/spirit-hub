"use client";

import Link from "next/link";
import { ArrowRight, AlertTriangle, Star, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DayOutlook } from "@/lib/biorhythm";

interface BiorhythmWeekPreviewProps {
    weekOutlook: DayOutlook[];
    birthDateParam: string; // ISO date string for critice link
}

const ROMANIAN_DAYS_SHORT = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];

const CYCLE_LABELS: Record<string, string> = {
    physical: "Fizic",
    emotional: "Emoțional",
    intellectual: "Intelectual",
};

/**
 * Returns emoji and color class for a day's overall status
 */
function getStatusIndicator(status: DayOutlook["overallStatus"]) {
    switch (status) {
        case "positive":
            return { emoji: "🟢", bgClass: "bg-green-500/20", borderClass: "border-green-500/40" };
        case "mixed":
            return { emoji: "🟡", bgClass: "bg-yellow-500/20", borderClass: "border-yellow-500/40" };
        case "negative":
            return { emoji: "🟠", bgClass: "bg-orange-500/20", borderClass: "border-orange-500/40" };
        case "critical":
            return { emoji: "🔴", bgClass: "bg-red-500/20", borderClass: "border-red-500/40" };
        default:
            return { emoji: "⚪", bgClass: "bg-gray-500/20", borderClass: "border-gray-500/40" };
    }
}

/**
 * Formats a date as Romanian day name and day number
 */
function formatDay(date: Date): { dayName: string; dayNum: number } {
    // Use UTC to avoid hydration mismatches
    const dayOfWeek = date.getUTCDay();
    const dayNum = date.getUTCDate();
    return {
        dayName: ROMANIAN_DAYS_SHORT[dayOfWeek],
        dayNum,
    };
}

/**
 * Formats a date for display in callouts (e.g., "Joi 16")
 */
function formatCalloutDate(date: Date): string {
    const { dayName, dayNum } = formatDay(date);
    return `${dayName} ${dayNum}`;
}

/**
 * Identifies key days to highlight (best day, critical days)
 */
function getKeyCallouts(weekOutlook: DayOutlook[]): {
    bestDay: { date: Date; cycle: string } | null;
    criticalDays: { date: Date; cycles: string[] }[];
} {
    // Find the best day (highest positive cycle value)
    let bestDay: { date: Date; cycle: string; value: number } | null = null;

    for (const day of weekOutlook) {
        if (day.bestCycle) {
            const value = day[day.bestCycle];
            if (!bestDay || value > bestDay.value) {
                bestDay = { date: day.date, cycle: day.bestCycle, value };
            }
        }
    }

    // Find critical days
    const criticalDays = weekOutlook
        .filter((day) => day.isCritical)
        .map((day) => ({
            date: day.date,
            cycles: day.criticalCycles,
        }));

    return {
        bestDay: bestDay ? { date: bestDay.date, cycle: bestDay.cycle } : null,
        criticalDays,
    };
}

export function BiorhythmWeekPreview({
    weekOutlook,
    birthDateParam,
}: BiorhythmWeekPreviewProps) {
    const { bestDay, criticalDays } = getKeyCallouts(weekOutlook);

    // Build critice link with birth date param
    const criticeLink = `/bioritm/critice?date=${birthDateParam}`;

    return (
        <Card className="p-4 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#9F2BFF]" />
                <h3 className="text-lg font-semibold text-white">Săptămâna Ta</h3>
            </div>

            {/* 7-Day Timeline - Horizontal scroll on mobile */}
            <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex gap-2 min-w-max sm:min-w-0 sm:justify-between">
                    {weekOutlook.map((day, index) => {
                        const { dayName, dayNum } = formatDay(day.date);
                        const { emoji, bgClass, borderClass } = getStatusIndicator(day.overallStatus);
                        const isToday = index === 0;

                        return (
                            <div
                                key={day.date.toISOString()}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-2 rounded-lg border min-w-[52px]",
                                    "transition-all duration-200",
                                    bgClass,
                                    borderClass,
                                    isToday && "ring-2 ring-[#9F2BFF]/50"
                                )}
                            >
                                <span className="text-xs text-[#E0E0E0]/70 font-medium">
                                    {dayName}
                                </span>
                                <span className="text-sm font-bold text-white">{dayNum}</span>
                                <span className="text-lg" role="img" aria-label={day.overallStatus}>
                                    {emoji}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Key Callouts */}
            <div className="space-y-2">
                {bestDay && (
                    <div className="flex items-start gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-[#E0E0E0]">
                            <span className="font-medium text-white">
                                {formatCalloutDate(bestDay.date)}
                            </span>
                            {" — "}
                            {CYCLE_LABELS[bestDay.cycle]} la maxim
                        </span>
                    </div>
                )}

                {criticalDays.slice(0, 2).map((critical) => (
                    <div
                        key={critical.date.toISOString()}
                        className="flex items-start gap-2 text-sm"
                    >
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-[#E0E0E0]">
                            <span className="font-medium text-white">
                                {formatCalloutDate(critical.date)}
                            </span>
                            {" — Zi critică "}
                            {critical.cycles.length === 1
                                ? CYCLE_LABELS[critical.cycles[0]].toLowerCase()
                                : `(${critical.cycles.map((c) => CYCLE_LABELS[c]).join(", ")})`}
                        </span>
                    </div>
                ))}

                {!bestDay && criticalDays.length === 0 && (
                    <p className="text-sm text-[#E0E0E0]/70">
                        Săptămână echilibrată — fără extreme sau zile critice.
                    </p>
                )}
            </div>

            {/* CTA to Critice */}
            <div className="pt-2 border-t border-white/10">
                <Link href={criticeLink}>
                    <Button
                        variant="ghost"
                        className="w-full justify-between text-[#9F2BFF] hover:text-white hover:bg-[#9F2BFF]/10"
                    >
                        <span>Vezi zile critice</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
