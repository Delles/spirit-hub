"use client";

import { useMemo } from "react";
import { calculateDailyNumber, getTodayISOBucharest } from "@/lib/daily-content";
import { getInterpretation } from "@/lib/interpretations";
import { ResultCard } from "@/components/shared/result-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Calculator, Sparkles, Heart, ArrowLeft } from "lucide-react";

// Romanian month names
const romanianMonths = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
];

// Format date in Romanian (e.g., "17 noiembrie 2025")
function formatRomanianDate(date: Date): string {
  const day = date.getDate();
  const month = romanianMonths[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export default function NumarZilnicClient() {
  // Get current date in Bucharest timezone (ISO format)
  const today = new Date();
  const todayISO = getTodayISOBucharest();
  const romanianDate = formatRomanianDate(today);

  // Calculate daily number and get interpretation locally
  const dailyData = useMemo(() => {
    const number = calculateDailyNumber(todayISO);
    const interpretation = getInterpretation("daily", number);

    if (!interpretation) return null;

    return {
      number,
      title: interpretation.title,
      description: interpretation.description,
      fullText: interpretation.fullText,
    };
  }, [todayISO]);

  // Share URL and title
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = dailyData
    ? `Numărul zilei: ${dailyData.number} - ${dailyData.title}`
    : "Numărul Zilei - SpiritHub.ro";

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Date Display */}
        <div className="text-center">
          <p className="text-2xl font-semibold text-[#9F2BFF]">{romanianDate}</p>
        </div>

        {/* Info Section */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-white">Ce este Numărul Zilei?</h2>
          <p className="text-sm text-[#E0E0E0] leading-relaxed">
            Numărul Zilei este calculat din data curentă și oferă îndrumări specifice pentru ziua de
            astăzi. Fiecare zi are propria sa energie numerologică care influențează activitățile,
            deciziile și interacțiunile tale. Înțelegând energia zilei, poți să îți aliniezi
            acțiunile cu ritmul natural al universului.
          </p>
          <p className="text-sm text-[#E0E0E0] leading-relaxed">
            Numărul zilei se schimbă în fiecare zi, oferindu-ți o perspectivă nouă și îndrumări fresh
            pentru fiecare zi din viața ta. Revino mâine pentru un nou număr și noi îndrumări!
          </p>
        </Card>

        {/* Loading State */}
        {dailyData === undefined && <LoadingSpinner text="Se încarcă numărul zilei..." />}

        {/* Error State */}
        {dailyData === null && (
          <ErrorMessage
            title="Eroare la încărcare"
            message="Nu am putut încărca numărul zilei. Te rugăm să reîncarci pagina."
          />
        )}

        {/* Results Section */}
        {dailyData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <ResultCard
              title={dailyData.title}
              number={dailyData.number}
              description={dailyData.description}
              interpretation={dailyData.fullText}
              shareUrl={shareUrl}
              shareTitle={shareTitle}
            />

            {/* Enhanced Section: Explore More */}
            <Card className="p-6 space-y-6">
              {/* Return Tomorrow Message */}
              <div className="text-center border-b border-white/10 pb-6">
                <p className="text-lg font-medium text-[#9F2BFF]">
                  ✨ Revino mâine pentru un nou număr! ✨
                </p>
                <p className="text-sm text-[#E0E0E0] mt-2">
                  Fiecare zi aduce o energie nouă și îndrumări fresh pentru călătoria ta.
                </p>
              </div>

              {/* Explore Other Calculators */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white">
                    Descoperă-ți Numerele Personale
                  </h3>
                  <p className="text-sm text-[#E0E0E0] mt-1">
                    Explorează alte aspecte ale destinului tău numerologic
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Link href="/numerologie/calea-vietii" className="group">
                    <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                          <Calculator className="w-5 h-5 text-[#9F2BFF]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-white text-sm">Calea Vieții</h4>
                          <p className="text-xs text-[#E0E0E0]/70">
                            Descoperă-ți scopul și direcția în viață
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[#9F2BFF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Calculează
                          <ArrowLeft className="w-3 h-3 rotate-180" />
                        </span>
                      </div>
                    </Card>
                  </Link>

                  <Link href="/numerologie/nume-destin" className="group">
                    <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                          <Sparkles className="w-5 h-5 text-[#9F2BFF]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-white text-sm">Numărul Destinului</h4>
                          <p className="text-xs text-[#E0E0E0]/70">
                            Află-ți misiunea din numele tău
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[#9F2BFF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Calculează
                          <ArrowLeft className="w-3 h-3 rotate-180" />
                        </span>
                      </div>
                    </Card>
                  </Link>

                  <Link href="/numerologie/compatibilitate" className="group">
                    <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                          <Heart className="w-5 h-5 text-[#9F2BFF]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-white text-sm">Compatibilitate</h4>
                          <p className="text-xs text-[#E0E0E0]/70">
                            Verifică potrivirea cu partenerul
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[#9F2BFF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Calculează
                          <ArrowLeft className="w-3 h-3 rotate-180" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
