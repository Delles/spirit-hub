"use client";

import Link from "next/link";
import { ArrowRight, AlertTriangle, Star, Calendar, Activity, Heart, Brain, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DayOutlook } from "@/lib/biorhythm";

interface BiorhythmWeekPreviewProps {
    weekOutlook: DayOutlook[];
    birthDateParam: string;
}

const ROMANIAN_DAYS_SHORT = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
const ROMANIAN_DAYS_FULL = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];

const CYCLE_CONFIG = {
    physical: { label: "Fizic", color: "#EF4444", icon: Activity },
    emotional: { label: "Emoțional", color: "#3B82F6", icon: Heart },
    intellectual: { label: "Intelectual", color: "#10B981", icon: Brain },
};

/**
 * Visualizer Bar Component
 * Renders a vertical bar representing the cycle value (-1 to 1)
 */
function CycleBar({ value, color }: { value: number; color: string }) {
    // Height of the container in pixels (approx) matches h-12 (48px)
    // We use percentages for responsiveness
    const isPositive = value >= 0;
    const heightPercent = Math.max(Math.abs(value) * 50, 4); // Min 4% height to be visible

    return (
        <div className="relative w-1.5 h-12 bg-white/5 rounded-full overflow-hidden flex flex-col justify-center">
            {/* Center Line Marker */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 z-10" />

            {/* The Bar */}
            <div
                className={cn(
                    "absolute w-full rounded-full transition-all duration-500",
                    "shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                )}
                style={{
                    backgroundColor: color,
                    height: `${heightPercent}%`,
                    boxShadow: `0 0 5px ${color}40`, // localized glow
                    // If positive, bottom is 50%. If negative, top is 50%.
                    ...(isPositive
                        ? { bottom: '50%' }
                        : { top: '50%' }
                    )
                }}
            />
        </div>
    );
}

/**
 * Formats a date
 */
function formatDay(date: Date): { dayShort: string; dayFull: string; dayNum: number } {
    const dayOfWeek = date.getDay();
    const dayNum = date.getDate();
    return {
        dayShort: ROMANIAN_DAYS_SHORT[dayOfWeek],
        dayFull: ROMANIAN_DAYS_FULL[dayOfWeek],
        dayNum,
    };
}

/**
 * Get key callouts
 */
function getKeyCallouts(weekOutlook: DayOutlook[]) {
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
        <Card className="p-0 overflow-hidden bg-black/40 backdrop-blur-xl border-white/10">
            {/* Compact Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#9F2BFF]" />
                    <h3 className="text-base font-semibold text-white">Prognoza Săptămânii</h3>
                </div>

                {/* Compact Legend */}
                <div className="flex gap-3 text-[10px] text-white/50">
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span>Fizic</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Emoțional</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Intelectual</span>
                    </div>
                </div>
            </div>

            {/* 7-Day Visualizer Scroll */}
            <div className="p-4 overflow-x-auto sm:overflow-visible">
                <div className="flex sm:grid sm:grid-cols-7 gap-2 min-w-[320px] sm:min-w-0">
                    {weekOutlook.map((day, index) => {
                        const { dayShort, dayNum } = formatDay(day.date);
                        const isToday = index === 0;

                        return (
                            <div
                                key={day.date.toISOString()}
                                className={cn(
                                    "flex flex-col items-center gap-3 p-2 rounded-xl transition-all min-w-[44px] sm:w-full",
                                    isToday ? "bg-[#9F2BFF]/10 ring-1 ring-[#9F2BFF]/30" : "hover:bg-white/5"
                                )}
                            >
                                {/* Date Header */}
                                <div className="text-center space-y-0.5">
                                    <div className="text-[10px] font-medium text-white/40 uppercase">
                                        {dayShort}
                                    </div>
                                    <div className={cn(
                                        "text-sm font-bold",
                                        isToday ? "text-[#9F2BFF]" : "text-white"
                                    )}>
                                        {dayNum}
                                    </div>
                                </div>

                                {/* The Visualizer Bars */}
                                <div className="flex gap-1">
                                    <CycleBar value={day.physical} color={CYCLE_CONFIG.physical.color} />
                                    <CycleBar value={day.emotional} color={CYCLE_CONFIG.emotional.color} />
                                    <CycleBar value={day.intellectual} color={CYCLE_CONFIG.intellectual.color} />
                                </div>

                                {/* Status Indicator (Critical Dot) */}
                                <div className="h-4 flex items-center justify-center">
                                    {day.isCritical ? (
                                        <AlertTriangle className="w-3 h-3 text-red-400" />
                                    ) : day.overallStatus === "positive" ? (
                                        <Star className="w-3 h-3 text-yellow-400/50" />
                                    ) : (
                                        // Spacer
                                        <div className="w-3 h-3" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Smart Insights Footer */}
            <div className="bg-white/5 p-4 space-y-3">
                {/* Insight 1: Best Day */}
                {bestDay && (
                    <div className="flex items-center gap-3 text-sm group cursor-default">
                        <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500/20 transition-colors">
                            <Star className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-white font-medium">Momentul de vârf</div>
                            <div className="text-white/60 text-xs">
                                {ROMANIAN_DAYS_FULL[bestDay.date.getDay()]} e perfect pentru activități {CYCLE_CONFIG[bestDay.cycle as keyof typeof CYCLE_CONFIG].label.toLowerCase()}e.
                            </div>
                        </div>
                    </div>
                )}

                {/* Insight 2: Next Critical Day (if any) */}
                {criticalDays.length > 0 && (
                    <div className="flex items-center gap-3 text-sm group cursor-default">
                        <div className="p-2 rounded-full bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-white font-medium">Atenție {ROMANIAN_DAYS_FULL[criticalDays[0].date.getDay()]}</div>
                            <div className="text-white/60 text-xs">
                                Zi critică ({criticalDays[0].cycles.map(c => CYCLE_CONFIG[c as keyof typeof CYCLE_CONFIG].label).join(", ")}). Evită riscurile.
                            </div>
                        </div>
                    </div>
                )}

                {/* CTA Button */}
                <Link href={criticeLink} className="block mt-2">
                    <Button
                        variant="outline"
                        className="w-full border-white/10 hover:bg-white/5 text-xs h-9"
                    >
                        Vezi calendarul detaliat (30 zile)
                        <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
