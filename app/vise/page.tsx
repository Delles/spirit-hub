import type { Metadata } from "next";
import { Suspense } from "react";
import { ViseClient } from "./client";
import { getRandomFeaturedSymbols } from "@/lib/dream-data";
import { getDailyDream, getTodayISOBucharest } from "@/lib/daily-content";
import { DailyPageDateChecker } from "@/components/shared/daily-page-date-checker";

export const metadata: Metadata = {
  title: "Interpretare Vise - Dicționar de Vise | SpiritHub.ro",
  description:
    "Află ce înseamnă visele tale. Peste 98 de interpretări din tradiția și folclorul românesc.",
  alternates: {
    canonical: "https://spirithub.ro/vise",
  },
};

// ISR: Revalidate every 6 hours - data changes daily, client date checker handles midnight edge case
export const revalidate = 21600;

export default function VisePage() {
  // Extract date once to ensure consistency across midnight boundary
  // Both featured symbols and daily dream will use the exact same date
  const todayISO = getTodayISOBucharest();

  // Get random featured symbols using the same date
  const featuredSymbols = getRandomFeaturedSymbols(8, todayISO);

  // Get today's daily dream using the same date
  const dailyDream = getDailyDream(todayISO);

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl">
        <DailyPageDateChecker serverDate={todayISO} />
        <Suspense fallback={<div className="h-96 flex items-center justify-center text-white">Se încarcă...</div>}>
          <ViseClient featuredSymbols={featuredSymbols} dailyDream={dailyDream} />
        </Suspense>
      </div>
    </div>
  );
}

