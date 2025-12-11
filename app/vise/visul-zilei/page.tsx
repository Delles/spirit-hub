import { VisulZileiClient } from "./client";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";
import { getDailyDream, getTodayISOBucharest } from "@/lib/daily-content";
import { getBucharestDate, formatRomanianDate } from "@/lib/utils";

// ISR: Revalidate every hour to ensure daily content stays fresh
// Data only changes at midnight Bucharest time, but 1-hour revalidation provides safety margin
export const revalidate = 3600; // 1 hour in seconds

export const metadata: Metadata = {
  title: "Visul Zilei - SpiritHub.ro",
  description:
    "Descoperă simbolul zilei din dicționarul de vise. Fiecare zi aduce un nou simbol oniric cu interpretare completă bazată pe folclorul românesc.",
  alternates: {
    canonical: "https://spirithub.ro/vise/visul-zilei",
  },
};

export default function VisulZileiPage() {
  // Resolve daily dream server-side to keep dataset off client bundle
  const isoDate = getTodayISOBucharest();
  const dailyDream = getDailyDream(isoDate);
  const romanianDate = formatRomanianDate(getBucharestDate());

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
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page Introduction */}
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-white">Visul Zilei de Astăzi</h2>
          <p className="text-lg text-[#E0E0E0] leading-relaxed">
            Descoperă simbolul care îți ghidează pașii astăzi. Chiar dacă nu l-ai visat, mesajul său
            îți poate oferi un răspuns sau o nouă perspectivă asupra situațiilor tale actuale.
          </p>
        </div>

        {/* Client Component with Daily Dream */}
        <VisulZileiClient dailyDream={mappedSymbol} romanianDate={romanianDate} />
      </div>
    </div>
  );
}
