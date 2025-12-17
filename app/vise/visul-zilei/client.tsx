/**
 * Daily Dream Client Component
 *
 * Displays the daily dream using locally computed content.
 */
"use client";

import { useDailyContent } from "@/components/providers/daily-content-provider";
import { DreamDetailCard } from "@/components/vise/dream-detail-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * Loading skeleton
 */
function LoadingSkeleton() {
  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="h-10 w-48 bg-white/10 rounded animate-pulse" />
        <div className="text-center space-y-3 pb-4">
          <div className="h-6 w-32 mx-auto bg-white/10 rounded animate-pulse" />
          <div className="h-10 w-64 mx-auto bg-white/10 rounded animate-pulse" />
        </div>
        <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Format date in Romanian
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

export function VisulZileiClient() {
  const data = useDailyContent();

  // Loading state - show skeleton during SSR/initial render
  if (!data) {
    return <LoadingSkeleton />;
  }

  const romanianDate = formatRomanianDate(data.date);

  // Map to DreamSymbol interface expected by card
  const mappedSymbol = {
    id: data.dailyDream.slug,
    name: data.dailyDream.name,
    slug: data.dailyDream.slug,
    category: data.dailyDream.category,
    interpretation: data.dailyDream.fullInterpretation,
    shortDescription: data.dailyDream.shortMeaning,
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/vise" className="inline-block">
            <Button
              variant="ghost"
              className="gap-2 pl-0 hover:pl-2 transition-all text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Înapoi la dicționar
            </Button>
          </Link>
          <span className="text-sm text-[#E0E0E0]/60 hidden sm:block">Visul Zilei</span>
        </div>

        {/* Date Header */}
        <div className="text-center space-y-3 pb-4">
          <div className="inline-block px-3 py-1 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/30 backdrop-blur-sm">
            <span className="text-sm font-medium text-[#c084fc] uppercase tracking-wider">Interpretare pentru</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight capitalize font-heading">
            {romanianDate}
          </h1>
        </div>

        {/* Dream Card - no wrapper to avoid double glass effect */}
        <DreamDetailCard symbol={mappedSymbol} />

        {/* Footer Actions */}
        <div className="flex justify-center pt-8 border-t border-white/5">
          <Link href="/vise">
            <Button className="gap-2 bg-[#9F2BFF] hover:bg-[#8B24E0] text-white px-6">
              Caută un alt vis specific
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
