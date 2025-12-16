"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DailyNumberWidget } from "./widgets/daily-number-widget";
import { DreamWidget } from "./widgets/dream-widget";
import { BiorhythmWidget } from "./widgets/biorhythm-widget";
import { QuickToolsWidget } from "./widgets/quick-tools-widget";
import { getAllSymbols } from "@/lib/dream-data";
import { getInterpretation } from "@/lib/interpretations";

/**
 * Skeleton component for loading state
 * Matches the bento grid layout of the actual widgets
 */
function WidgetsSkeleton() {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 auto-rows-min gap-4">
            {/* Daily Number skeleton */}
            <div className="md:col-span-2 md:row-span-2 md:min-h-[350px]">
                <div className="h-full min-h-[280px] md:min-h-[350px] rounded-xl bg-white/5 animate-pulse flex flex-col items-center justify-center gap-4 p-6">
                    <div className="w-20 h-20 rounded-full bg-white/10" />
                    <div className="w-32 h-6 rounded bg-white/10" />
                    <div className="w-48 h-4 rounded bg-white/10" />
                </div>
            </div>

            {/* Dream widget skeleton */}
            <div className="md:col-span-1 md:row-span-2 md:min-h-[350px]">
                <div className="h-full min-h-[200px] md:min-h-[350px] rounded-xl bg-white/5 animate-pulse flex flex-col items-center justify-center gap-4 p-6">
                    <div className="w-12 h-12 rounded-full bg-white/10" />
                    <div className="w-24 h-5 rounded bg-white/10" />
                    <div className="w-32 h-3 rounded bg-white/10" />
                </div>
            </div>

            {/* Biorhythm widget skeleton */}
            <div className="md:col-span-2 md:min-h-[200px]">
                <div className="h-full min-h-[180px] md:min-h-[200px] rounded-xl bg-white/5 animate-pulse flex flex-col items-center justify-center gap-4 p-6">
                    <div className="w-40 h-5 rounded bg-white/10" />
                    <div className="w-full h-4 rounded bg-white/10" />
                    <div className="w-3/4 h-3 rounded bg-white/10" />
                </div>
            </div>

            {/* Quick tools skeleton */}
            <div className="md:col-span-1 md:min-h-[120px]">
                <div className="h-full min-h-[100px] md:min-h-[120px] rounded-xl bg-white/5 animate-pulse" />
            </div>
        </div>
    );
}

/**
 * Daily Widgets Client Component
 * 
 * Fetches daily content from Convex and renders the homepage widgets.
 * This component is client-side to enable real-time updates.
 * 
 * Data flow:
 * - Daily number: from Convex + interpretation from static JSON
 * - Daily dream: index from Convex, actual symbol from static JSON
 * - Energia Zilei: fully from Convex
 * - Moon Phase: from Convex (displayed in parent component)
 */
export function DailyWidgetsClient() {
    const data = useQuery(api.daily.getDailyContent);

    // Loading state - show skeleton
    if (!data) {
        return <WidgetsSkeleton />;
    }

    // Get dream from static data using index from Convex
    const allSymbols = getAllSymbols();
    const dailyDream = allSymbols[data.dailyDreamIndex];

    // Get interpretation from static data
    const interpretation = getInterpretation("daily", data.dailyNumber.number);

    // Prepare widget data
    const dailyNumberData = interpretation
        ? {
            number: data.dailyNumber.number,
            title: interpretation.title,
            description: interpretation.description,
            date: data.date,
        }
        : null;

    const dailyDreamData = dailyDream
        ? {
            name: dailyDream.name,
            category: dailyDream.category,
            shortDescription: dailyDream.shortMeaning,
        }
        : null;

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 auto-rows-min gap-4">
            {/* 1. Daily Number: Large Square (Left) - Spans 2 cols, 2 rows */}
            <div className="md:col-span-2 md:row-span-2 md:min-h-[350px]">
                <DailyNumberWidget data={dailyNumberData} className="md:h-full" />
            </div>

            {/* 2. Dream: Tall Rectangle (Right) - Spans 1 col, 2 rows */}
            <div className="md:col-span-1 md:row-span-2 md:min-h-[350px]">
                <DreamWidget data={dailyDreamData} className="md:h-full" />
            </div>

            {/* 3. Biorhythm: Wide Rectangle (Bottom Left) - Spans 2 cols */}
            <div className="md:col-span-2 md:min-h-[200px]">
                <BiorhythmWidget data={data.energiaZilei} className="md:h-full" />
            </div>

            {/* 4. Quick Tools: Small Strip (Bottom Right) - Spans 1 col */}
            <div className="md:col-span-1 md:min-h-[120px]">
                <QuickToolsWidget className="md:h-full" />
            </div>
        </div>
    );
}

/**
 * Export the moon phase data for use in the page header
 * This is a convenience hook for components that need just the moon phase
 */
export function useDailyContent() {
    return useQuery(api.daily.getDailyContent);
}
