"use client";

import { useDailyContent } from "@/components/providers/daily-content-provider";
import { ResultCard } from "@/components/shared/result-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calculator, Sparkles, Heart, ArrowLeft } from "lucide-react";
import { getInterpretation } from "@/lib/interpretations";

/**
 * Loading skeleton
 */
function LoadingSkeleton() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4 text-center">
          <div className="h-9 w-64 mx-auto bg-white/10 rounded animate-pulse" />
          <div className="h-6 w-48 mx-auto bg-white/10 rounded animate-pulse" />
        </div>
        <div className="h-96 bg-white/5 rounded-xl animate-pulse" />
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

export default function NumarZilnicClient() {
  const data = useDailyContent();

  // Loading state - show skeleton during SSR/initial render
  if (!data) {
    return <LoadingSkeleton />;
  }

  // Get interpretation from static data
  const interpretation = getInterpretation("daily", data.dailyNumber.number);
  const romanianDate = formatRomanianDate(data.date);

  const dailyData = interpretation
    ? {
      number: data.dailyNumber.number,
      title: interpretation.title,
      description: interpretation.description,
      fullText: interpretation.fullText,
    }
    : null;

  // Share URL and title
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = dailyData
    ? `Numărul zilei: ${dailyData.number} - ${dailyData.title}`
    : "Numărul Zilei - SpiritHub.ro";

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page Introduction */}
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-white">Numărul Zilei de Astăzi</h2>
          <p className="text-lg text-[#E0E0E0] leading-relaxed">
            Energia numerologică pentru {romanianDate}
          </p>
        </div>

        {/* Error State */}
        {dailyData === null && (
          <Card className="p-6 text-center">
            <p className="text-red-400">Nu am putut încărca numărul zilei. Te rugăm să reîncarci pagina.</p>
          </Card>
        )}

        {/* Results Section */}
        {dailyData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <Link href="/numerologie" className="inline-block">
              <Button
                variant="ghost"
                className="gap-2 pl-0 hover:pl-2 transition-all text-white/70 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Înapoi la Numerologie
              </Button>
            </Link>

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
