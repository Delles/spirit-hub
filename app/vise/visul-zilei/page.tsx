import { VisulZileiClient } from "./client";
import type { Metadata } from "next";
import { getDailyDream, getTodayISOBucharest } from "@/lib/daily-content";
import { getBucharestDate, formatRomanianDate } from "@/lib/utils";
import { DailyPageDateChecker } from "@/components/shared/daily-page-date-checker";

// ISR: Revalidate every 24 hours - content changes at midnight (date checker handles it)
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Visul Zilei - SpiritHub.ro",
  description:
    "Descoperă visul zilei și află ce înseamnă. În fiecare zi un nou simbol cu interpretare completă din tradiția românească.",
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
        <DailyPageDateChecker serverDate={isoDate} />
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

