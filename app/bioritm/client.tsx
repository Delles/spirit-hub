"use client";

import { useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Calendar, Hash, Moon, ArrowLeft, AlertTriangle } from "lucide-react";
import {
  getPhysicalCycle,
  getEmotionalCycle,
  getIntellectualCycle,
  getBiorhythmSummary
} from "@/lib/biorhythm";
import { getTodayISOBucharest } from "@/lib/daily-content";
import { BiorhythmForm } from "@/components/bioritm/biorhythm-form";
import { BiorhythmChart } from "@/components/bioritm/biorhythm-chart";
import { BiorhythmSummary } from "@/components/bioritm/biorhythm-summary";
import { ShareButton } from "@/components/shared/share-button";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO, isValid } from "date-fns";
import { ro } from "date-fns/locale";



export default function BioritmClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const dateParam = searchParams.get("date");
  const targetParam = searchParams.get("target");

  // Derive values from URL params - reactive to URL changes (back/forward navigation, shared links)
  const birthDate = dateParam || "";
  const targetDate = targetParam || getTodayISOBucharest();
  const hasSubmitted = !!dateParam;

  const birthDateValid = birthDate ? isValid(parseISO(birthDate)) : false;
  const targetDateValid = targetDate ? isValid(parseISO(targetDate)) : false;

  const shouldQueryBiorhythm = hasSubmitted && birthDateValid && targetDateValid;

  // Clean up invalid URL params (e.g., invalid date formats)
  useEffect(() => {
    const hasInvalidBirth = dateParam && !birthDateValid;
    const hasInvalidTarget = targetParam && !targetDateValid;
    if (hasInvalidBirth || hasInvalidTarget) {
      router.replace(pathname);
    }
  }, [dateParam, targetParam, birthDateValid, targetDateValid, router, pathname]);

  const biorhythm = useMemo(() => {
    if (!shouldQueryBiorhythm) return undefined;

    try {
      const birth = parseISO(birthDate);
      const target = parseISO(targetDate);

      const physical = getPhysicalCycle(birth, target);
      const emotional = getEmotionalCycle(birth, target);
      const intellectual = getIntellectualCycle(birth, target);
      const summary = getBiorhythmSummary(physical, emotional, intellectual);

      return {
        physical,
        emotional,
        intellectual,
        summary,
        birthDate,
        targetDate
      };
    } catch (error) {
      console.error("Error calculating biorhythm:", error);
      return null;
    }
  }, [shouldQueryBiorhythm, birthDate, targetDate]);

  const isLoading = shouldQueryBiorhythm && biorhythm === undefined;

  const handleSubmit = (birth: string, target: string) => {
    // Update URL - derived values will automatically reflect the new params
    const params = new URLSearchParams(searchParams);
    params.set("date", birth);
    params.set("target", target);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Reset function to go back to form view
  const handleReset = () => {
    // Clear URL params - derived values will automatically reset
    router.push(pathname);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  // Determine if we should show results view
  const showResults = hasSubmitted && biorhythm;

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Show form view when no results yet */}
        {!showResults && (
          <>
            {/* Info Section - Single comprehensive card */}
            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-white">Ce este Bioritmul?</h2>
              <p className="text-sm text-[#E0E0E0] leading-relaxed">
                Bioritmul este o teorie care descrie trei cicluri biologice naturale ce influențează
                capacitățile tale fizice, emoționale și intelectuale. Aceste cicluri încep de la
                naștere și oscilează în mod constant între valori pozitive (perioadă favorabilă) și
                negative (perioadă de recuperare).
              </p>
              <p className="text-sm text-[#E0E0E0] leading-relaxed">
                <strong className="text-white">Ciclul Fizic (23 zile)</strong> — energie, vitalitate
                și rezistență fizică.
                <br />
                <strong className="text-white">Ciclul Emoțional (28 zile)</strong> — stare de spirit,
                creativitate și sensibilitate.
                <br />
                <strong className="text-white">Ciclul Intelectual (33 zile)</strong> — claritate
                mentală, concentrare și memorie.
              </p>
              <p className="text-sm text-[#E0E0E0] leading-relaxed">
                Zilele critice apar când un ciclu trece prin zero — acestea sunt momente de tranziție
                care pot aduce instabilitate temporară în zona respectivă.
              </p>
            </Card>

            {/* Form Section */}
            <Card className="p-6 lg:p-8">
              <BiorhythmForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>

            {/* Loading State */}
            {isLoading && <LoadingSpinner text="Se calculează bioritmul..." />}

            {/* Error State */}
            {biorhythm === null && hasSubmitted && (
              <ErrorMessage
                title="Eroare la calculare"
                message="Nu am putut calcula bioritmul. Te rugăm să verifici datele introduse și să încerci din nou."
              />
            )}
          </>
        )}

        {/* Results View - only shown after successful calculation */}
        {showResults && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {/* Chart */}
            <Card className="p-6 lg:p-8">
              <BiorhythmChart
                physical={biorhythm.physical}
                emotional={biorhythm.emotional}
                intellectual={biorhythm.intellectual}
                birthDate={biorhythm.birthDate}
                targetDate={biorhythm.targetDate}
              />
            </Card>

            {/* Summary */}
            <Card className="p-6 lg:p-8">
              <BiorhythmSummary
                summary={biorhythm.summary}
                physical={biorhythm.physical}
                emotional={biorhythm.emotional}
                intellectual={biorhythm.intellectual}
              />
            </Card>

            {/* Share Section */}
            <Card className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6">
              <div className="text-center sm:text-left">
                <h3 className="font-semibold mb-1 text-white">Distribuie rezultatul tău</h3>
                <p className="text-sm text-[#E0E0E0]">Împărtășește bioritmul tău cu prietenii</p>
              </div>
              <ShareButton
                url={shareUrl}
                title="Bioritmul meu - SpiritHub.ro"
                text={`Bioritmul meu pentru ${format(parseISO(targetDate), "d MMMM yyyy", { locale: ro })}`}
              />
            </Card>

            {/* CTA Section - Explore More */}
            <Card className="p-6 space-y-6">
              {/* Calculate for Different Date */}
              <div className="text-center border-b border-white/10 pb-6">
                <p className="text-lg font-medium text-[#9F2BFF]">
                  ✨ Vrei să calculezi pentru altă zi? ✨
                </p>
                <p className="text-sm text-[#E0E0E0] mt-2 mb-4">
                  Explorează bioritmul tău pentru orice dată dorești sau pentru altcineva.
                </p>
                <Button variant="secondary" onClick={handleReset} className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Calculează pentru altă zi
                </Button>
              </div>

              {/* Explore Other Features */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white">Explorează Mai Mult</h3>
                  <p className="text-sm text-[#E0E0E0] mt-1">
                    Descoperă alte instrumente spirituale pe SpiritHub
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Link href="/bioritm/critice" className="group">
                    <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                          <AlertTriangle className="w-5 h-5 text-[#9F2BFF]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-white text-sm">Zile Critice</h4>
                          <p className="text-xs text-[#E0E0E0]/70">
                            Descoperă zilele de tranziție
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[#9F2BFF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Descoperă
                          <ArrowLeft className="w-3 h-3 rotate-180" />
                        </span>
                      </div>
                    </Card>
                  </Link>

                  <Link href="/numerologie" className="group">
                    <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                          <Hash className="w-5 h-5 text-[#9F2BFF]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-white text-sm">Numerologie</h4>
                          <p className="text-xs text-[#E0E0E0]/70">
                            Descoperă destinul tău numeric
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[#9F2BFF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Explorează
                          <ArrowLeft className="w-3 h-3 rotate-180" />
                        </span>
                      </div>
                    </Card>
                  </Link>

                  <Link href="/vise" className="group">
                    <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                          <Moon className="w-5 h-5 text-[#9F2BFF]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-white text-sm">Interpretare Vise</h4>
                          <p className="text-xs text-[#E0E0E0]/70">
                            Află semnificația viselor tale
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[#9F2BFF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Explorează
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
