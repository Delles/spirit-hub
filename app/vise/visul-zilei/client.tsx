/**
 * Daily Dream Client Component
 *
 * Fetches the daily dream from Convex and displays it.
 */
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DreamDetailCard } from "@/components/vise/dream-detail-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getAllSymbols } from "@/lib/dream-data";

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
  const data = useQuery(api.daily.getDailyContent);

  // Loading state
  if (!data) {
    return <LoadingSkeleton />;
  }

  // Get dream from static data using index from Convex
  const allSymbols = getAllSymbols();
  const dailyDream = allSymbols[data.dailyDreamIndex];
  const romanianDate = formatRomanianDate(data.date);

  // Map to DreamSymbol interface expected by card
  const mappedSymbol = {
    id: dailyDream.slug,
    name: dailyDream.name,
    slug: dailyDream.slug,
    category: dailyDream.category,
    interpretation: dailyDream.fullInterpretation,
    shortDescription: dailyDream.shortMeaning,
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
