"use client";

import Link from "next/link";
import { ArrowRight, AlertTriangle, Star, Calendar, Activity, Heart, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DayOutlook } from "@/lib/biorhythm";

interface BiorhythmWeekPreviewProps {
    weekOutlook: DayOutlook[];
    birthDateParam: string;
}

const ROMANIAN_DAYS_SHORT = ["D", "L", "M", "Mi", "J", "V", "S"];
const ROMANIAN_DAYS_FULL = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];

const CYCLE_LABELS: Record<string, string> = {
    physical: "Fizic",
    emotional: "Emoțional",
    intellectual: "Intelectual",
};

const CYCLE_ICONS: Record<string, typeof Activity> = {
    physical: Activity,
    emotional: Heart,
    intellectual: Brain,
};

const CYCLE_COLORS: Record<string, string> = {
    physical: "#EF4444",
    emotional: "#3B82F6",
    intellectual: "#10B981",
};

/**
 * Returns color class for a cycle value
 */
function getCycleIndicator(value: number): { color: string; label: string } {
    if (value > 0.35) return { color: "bg-green-500", label: "+" };
    if (value > 0.15) return { color: "bg-green-400/70", label: "+" };
    if (value >= -0.15) return { color: "bg-yellow-500", label: "○" };
    if (value >= -0.35) return { color: "bg-orange-400/70", label: "-" };
    return { color: "bg-red-500", label: "-" };
}

/**
 * Returns background styling for a day's overall status
 */
function getDayStyle(status: DayOutlook["overallStatus"], isToday: boolean) {
    const base = isToday ? "ring-2 ring-[#9F2BFF]" : "";

    switch (status) {
        case "positive":
            return `${base} bg-green-500/10 border-green-500/30`;
        case "mixed":
            return `${base} bg-yellow-500/10 border-yellow-500/30`;
        case "negative":
            return `${base} bg-orange-500/10 border-orange-500/30`;
        case "critical":
            return `${base} bg-red-500/10 border-red-500/30`;
        default:
            return `${base} bg-gray-500/10 border-gray-500/30`;
    }
}

/**
 * Formats a date as Romanian day name and day number
 */
function formatDay(date: Date): { dayShort: string; dayFull: string; dayNum: number } {
    const dayOfWeek = date.getUTCDay();
    const dayNum = date.getUTCDate();
    return {
        dayShort: ROMANIAN_DAYS_SHORT[dayOfWeek],
        dayFull: ROMANIAN_DAYS_FULL[dayOfWeek],
        dayNum,
    };
}

/**
 * Formats a date for display in callouts (e.g., "Joi 16")
 */
function formatCalloutDate(date: Date): string {
    const dayOfWeek = date.getUTCDay();
    const dayNum = date.getUTCDate();
    return `${ROMANIAN_DAYS_FULL[dayOfWeek]} ${dayNum}`;
}

/**
 * Identifies key days to highlight
 */
function getKeyCallouts(weekOutlook: DayOutlook[]): {
    bestDay: { date: Date; cycle: string; value: number } | null;
    criticalDays: { date: Date; cycles: string[] }[];
} {
    let bestDay: { date: Date; cycle: string; value: number } | null = null;

    for (const day of weekOutlook) {
        if (day.bestCycle) {
            const value = day[day.bestCycle];
            if (!bestDay || value > bestDay.value) {
                bestDay = { date: day.date, cycle: day.bestCycle, value };
            }
        }
    }

    const criticalDays = weekOutlook
        .filter((day) => day.isCritical)
        .map((day) => ({
            date: day.date,
            cycles: day.criticalCycles,
        }));

    return { bestDay, criticalDays };
}

export function BiorhythmWeekPreview({
    weekOutlook,
    birthDateParam,
}: BiorhythmWeekPreviewProps) {
    const { bestDay, criticalDays } = getKeyCallouts(weekOutlook);
    const criticeLink = `/bioritm/critice?date=${birthDateParam}`;

    return (
        <Card className="p-4 sm:p-6 space-y-5">
            {/* Header with Legend */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#9F2BFF]" />
                    <h3 className="text-lg font-semibold text-white">Săptămâna Ta în Bioritm</h3>
                </div>

                {/* Mini Legend */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#E0E0E0]/80">
                    <div className="flex items-center gap-1.5">
                        <Activity className="w-3 h-3" style={{ color: CYCLE_COLORS.physical }} />
                        <span>Fizic</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Heart className="w-3 h-3" style={{ color: CYCLE_COLORS.emotional }} />
                        <span>Emoțional</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Brain className="w-3 h-3" style={{ color: CYCLE_COLORS.intellectual }} />
                        <span>Intelectual</span>
                    </div>
                </div>
            </div>

            {/* 7-Day Timeline - Horizontal scroll on mobile */}
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
                <div className="flex gap-2 min-w-max sm:min-w-0 sm:grid sm:grid-cols-7">
                    {weekOutlook.map((day, index) => {
                        const { dayShort, dayNum } = formatDay(day.date);
                        const isToday = index === 0;
                        const dayStyle = getDayStyle(day.overallStatus, isToday);

                        return (
                            <div
                                key={day.date.toISOString()}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-2.5 rounded-xl border min-w-[60px]",
                                    "transition-all duration-200 hover:scale-105",
                                    dayStyle
                                )}
                            >
                                {/* Day header */}
                                <div className="text-center">
                                    <div className="text-[10px] uppercase tracking-wider text-[#E0E0E0]/60 font-medium">
                                        {dayShort}
                                    </div>
                                    <div className={cn(
                                        "text-base font-bold",
                                        isToday ? "text-[#9F2BFF]" : "text-white"
                                    )}>
                                        {dayNum}
                                    </div>
                                    {isToday && (
                                        <div className="text-[9px] text-[#9F2BFF] font-medium">AZI</div>
                                    )}
                                </div>

                                {/* Cycle Mini-Indicators */}
                                <div className="flex flex-col gap-1">
                                    {/* Physical */}
                                    <div className="flex items-center gap-1">
                                        <div
                                            className={cn(
                                                "w-2 h-2 rounded-full",
                                                getCycleIndicator(day.physical).color
                                            )}
                                        />
                                        <Activity className="w-2.5 h-2.5" style={{ color: CYCLE_COLORS.physical }} />
                                    </div>
                                    {/* Emotional */}
                                    <div className="flex items-center gap-1">
                                        <div
                                            className={cn(
                                                "w-2 h-2 rounded-full",
                                                getCycleIndicator(day.emotional).color
                                            )}
                                        />
                                        <Heart className="w-2.5 h-2.5" style={{ color: CYCLE_COLORS.emotional }} />
                                    </div>
                                    {/* Intellectual */}
                                    <div className="flex items-center gap-1">
                                        <div
                                            className={cn(
                                                "w-2 h-2 rounded-full",
                                                getCycleIndicator(day.intellectual).color
                                            )}
                                        />
                                        <Brain className="w-2.5 h-2.5" style={{ color: CYCLE_COLORS.intellectual }} />
                                    </div>
                                </div>

                                {/* Critical Warning Badge */}
                                {day.isCritical && (
                                    <div className="mt-0.5">
                                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Color Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-[#E0E0E0]/60 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Pozitiv</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Neutru</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Negativ</span>
                </div>
            </div>

            {/* Key Callouts */}
            {(bestDay || criticalDays.length > 0) && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                    <h4 className="text-xs font-medium text-[#E0E0E0]/70 uppercase tracking-wider">
                        Puncte cheie
                    </h4>

                    {bestDay && (
                        <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
                            <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <span className="font-medium text-white">
                                    {formatCalloutDate(bestDay.date)}
                                </span>
                                <span className="text-[#E0E0E0]">
                                    {" — Cel mai bun moment pentru "}
                                    <span className="text-green-400 font-medium">
                                        {CYCLE_LABELS[bestDay.cycle].toLowerCase()}
                                    </span>
                                </span>
                            </div>
                        </div>
                    )}

                    {criticalDays.slice(0, 2).map((critical) => (
                        <div
                            key={critical.date.toISOString()}
                            className="flex items-start gap-2.5 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20"
                        >
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <span className="font-medium text-white">
                                    {formatCalloutDate(critical.date)}
                                </span>
                                <span className="text-[#E0E0E0]">
                                    {" — Zi critică "}
                                    <span className="text-red-400 font-medium">
                                        {critical.cycles.length === 1
                                            ? CYCLE_LABELS[critical.cycles[0]].toLowerCase()
                                            : `(${critical.cycles.map((c) => CYCLE_LABELS[c].toLowerCase()).join(", ")})`}
                                    </span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CTA to Critice */}
            <div className="pt-3 border-t border-white/10">
                <Link href={criticeLink}>
                    <Button
                        variant="ghost"
                        className="w-full justify-between text-[#9F2BFF] hover:text-white hover:bg-[#9F2BFF]/10 group"
                    >
                        <span className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Vezi toate zilele critice (30 zile)
                        </span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
