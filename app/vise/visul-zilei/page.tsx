import { VisulZileiClient } from "./client";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";
import { getDailyDream, getTodayISOBucharest } from "@/lib/daily-content";
import { getBucharestDate, formatRomanianDate } from "@/lib/utils";

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
          <h2 className="text-3xl font-bold text-white">Simbolul Oniric al Zilei</h2>
          <p className="text-lg text-[#E0E0E0] leading-relaxed">
            Fiecare zi aduce un nou simbol din dicționarul nostru de vise. Descoperă semnificația
            simbolului de astăzi și reflectează asupra mesajului său pentru viața ta.
          </p>
        </div>

        {/* Client Component with Daily Dream */}
        <VisulZileiClient dailyDream={mappedSymbol} romanianDate={romanianDate} />

        {/* Educational Content */}
        <Card className="mt-12 p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Despre Visul Zilei</h3>

          <div className="space-y-4 text-[#E0E0E0]">
            <div className="space-y-2">
              <h4 className="text-base font-medium text-white">Un simbol nou în fiecare zi</h4>
              <p className="text-sm leading-relaxed">
                Visul zilei este selectat în mod deterministic pentru fiecare dată, ceea ce înseamnă
                că toți utilizatorii văd același simbol în aceeași zi. Revino mâine pentru a
                descoperi un nou simbol oniric.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-medium text-white">Reflectează asupra mesajului</h4>
              <p className="text-sm leading-relaxed">
                Chiar dacă nu ai visat acest simbol recent, interpretarea sa poate oferi perspective
                valoroase pentru situația ta actuală. Gândește-te cum se aplică mesajul la viața ta
                de zi cu zi.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-medium text-white">Explorează mai multe simboluri</h4>
              <p className="text-sm leading-relaxed">
                Dacă vrei să afli mai multe despre alte simboluri din visele tale, folosește funcția
                de căutare pentru a explora întregul nostru dicționar de interpretare vise.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
