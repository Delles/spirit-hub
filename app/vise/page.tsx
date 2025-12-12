import type { Metadata } from "next";
import { Suspense } from "react";
import { ViseClient } from "./client";
import { getRandomFeaturedSymbols } from "@/lib/dream-data";
import { getDailyDream, getTodayISOBucharest } from "@/lib/daily-content";

export const metadata: Metadata = {
  title: "Interpretare Vise - Dicționar de Vise | SpiritHub.ro",
  description:
    "Află ce înseamnă visele tale. Peste 98 de interpretări din tradiția și folclorul românesc.",
  alternates: {
    canonical: "https://spirithub.ro/vise",
  },
};

// ISR: Revalidate hourly to keep daily dream fresh
export const revalidate = 3600;

export default function VisePage() {
  // Get random featured symbols at build time (SSG) - rotates daily
  const featuredSymbols = getRandomFeaturedSymbols(8);

  // Get today's daily dream for the Visul Zilei card
  const isoDate = getTodayISOBucharest();
  const dailyDream = getDailyDream(isoDate);

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl">
        <Suspense fallback={<div className="h-96 flex items-center justify-center text-white">Se încarcă...</div>}>
          <ViseClient featuredSymbols={featuredSymbols} dailyDream={dailyDream} />
        </Suspense>
      </div>
    </div>
  );
}
