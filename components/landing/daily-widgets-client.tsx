"use client";

import { useDailyContent } from "@/components/providers/daily-content-provider";
import { DailyNumberWidget } from "./widgets/daily-number-widget";
import { DreamWidget } from "./widgets/dream-widget";
import { BiorhythmWidget } from "./widgets/biorhythm-widget";
import { QuickToolsWidget } from "./widgets/quick-tools-widget";
import { getInterpretation, type DailyInterpretation } from "@/lib/interpretations";

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
 * Renders the homepage widgets using daily content computed client-side.
 * Shows skeleton during SSR/initial render for hydration safety.
 * 
 * Data flow:
 * - Daily number: computed locally + interpretation from static JSON
 * - Daily dream: computed locally from static JSON
 * - Energia Zilei: computed locally
 * - Moon Phase: computed locally (displayed in parent component)
 */
export function DailyWidgetsClient() {
    const data = useDailyContent();

    // Loading state - show skeleton during SSR/initial render
    if (!data) {
        return <WidgetsSkeleton />;
    }

    // Get interpretation from static data
    const interpretation = getInterpretation<DailyInterpretation>("daily", data.dailyNumber.number);

    // Prepare widget data
    const dailyNumberData = interpretation
        ? {
            number: data.dailyNumber.number,
            title: interpretation.hero.title,
            description: interpretation.hero.headline,
            date: data.date,
        }
        : null;

    const dailyDreamData = data.dailyDream
        ? {
            name: data.dailyDream.name,
            category: data.dailyDream.category,
            shortDescription: data.dailyDream.shortMeaning,
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

