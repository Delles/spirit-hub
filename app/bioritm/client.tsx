"use client";

import { useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Calendar, Hash, Moon, ArrowLeft, AlertTriangle } from "lucide-react";
import {
  getPhysicalCycle,
  getEmotionalCycle,
  getIntellectualCycle,
  getBiorhythmInterpretation,
  getPhysicalTrajectory,
  getEmotionalTrajectory,
  getIntellectualTrajectory,
  getCycleIntensityLevel,
  getWeekOutlook,
  type Trajectory,
  type DayOutlook,
} from "@/lib/biorhythm";
import { getTodayISOBucharest } from "@/lib/daily-content";
import { BiorhythmForm } from "@/components/bioritm/biorhythm-form";
import { BiorhythmChart } from "@/components/bioritm/biorhythm-chart";
import { BiorhythmCard } from "@/components/bioritm/biorhythm-card";
import { BiorhythmWeekPreview } from "@/components/bioritm/biorhythm-week-preview";
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

      const pTraj = getPhysicalTrajectory(birth, target);
      const eTraj = getEmotionalTrajectory(birth, target);
      const iTraj = getIntellectualTrajectory(birth, target);

      // Get the rich interpretation based on the cycles
      const interpretation = getBiorhythmInterpretation(physical, emotional, intellectual);

      // Determine which trajectory to show (must match getBiorhythmInterpretation logic)
      let trajectory: Trajectory = 'stable';
      const pLevel = getCycleIntensityLevel(physical);
      const eLevel = getCycleIntensityLevel(emotional);
      const iLevel = getCycleIntensityLevel(intellectual);

      if (pLevel === 'critical') trajectory = pTraj;
      else if (eLevel === 'critical') trajectory = eTraj;
      else if (iLevel === 'critical') trajectory = iTraj;
      else if (physical > 0.35 && emotional > 0.35 && intellectual > 0.35) trajectory = pTraj; // Super Day
      else if (physical < -0.35 && emotional < -0.35 && intellectual < -0.35) trajectory = pTraj; // Recharge Day
      else {
        const pAbs = Math.abs(physical);
        const eAbs = Math.abs(emotional);
        const iAbs = Math.abs(intellectual);
        const maxAbs = Math.max(pAbs, eAbs, iAbs);

        if (maxAbs === pAbs) trajectory = pTraj;
        else if (maxAbs === eAbs) trajectory = eTraj;
        else trajectory = iTraj;
      }

      // Calculate week outlook for week preview
      const weekOutlook = getWeekOutlook(birth, target, 7);

      return {
        physical,
        emotional,
        intellectual,
        interpretation,
        trajectory,
        birthDate,
        targetDate,
        weekOutlook,
      };
    } catch (error) {
      console.error("Error calculating biorhythm:", error);
      return null;
    }
  }, [shouldQueryBiorhythm, birthDate, targetDate]);

  const isLoading = shouldQueryBiorhythm && biorhythm === undefined;

  const handleSubmit = (birth: string, target: string) => {
    // Update URL - derived values will automatically reflect the new params
    const params = new URLSearchParams(searchParams.toString());
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
            {/* Page Introduction */}
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold text-white">Calculator Bioritm</h1>
              <p className="text-lg text-[#E0E0E0] leading-relaxed">
                Explorează cele 3 cicluri naturale (Fizic, Emoțional, Intelectual) care îți
                influențează energia zilnică și descoperă zilele tale critice.
              </p>
            </div>

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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            {/* 1. Chart Visualization */}
            <Card className="p-6 lg:p-8 bg-black/40 backdrop-blur-xl border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Grafic Bioritm</h3>
              <BiorhythmChart
                physical={biorhythm.physical}
                emotional={biorhythm.emotional}
                intellectual={biorhythm.intellectual}
                birthDate={biorhythm.birthDate}
                targetDate={biorhythm.targetDate}
              />
            </Card>

            {/* 2. Interpretation Card (The "Stream of Cards") */}
            <BiorhythmCard
              interpretation={biorhythm.interpretation}
              trajectory={biorhythm.trajectory}
            />

            {/* 3. Week Preview */}
            <BiorhythmWeekPreview
              weekOutlook={biorhythm.weekOutlook}
              birthDateParam={biorhythm.birthDate}
            />

            {/* Share Section - matching daily-card layout */}
            <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10">
              <div className="text-center mb-4">
                <h3 className="font-semibold mb-1 text-white">Distribuie rezultatul tău</h3>
                <p className="text-sm text-[#E0E0E0]">Împărtășește bioritmul tău cu prietenii</p>
              </div>
              <div className="flex justify-center">
                <ShareButton
                  url={shareUrl}
                  title="Bioritmul meu - SpiritHub.ro"
                  text={`Bioritmul meu pentru ${format(parseISO(targetDate), "d MMMM yyyy", { locale: ro })}`}
                />
              </div>
            </Card>

            {/* CTA Section - Explore More */}
            <Card className="p-6 space-y-6 bg-black/40 backdrop-blur-xl border-white/10">
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
                    <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5 bg-black/20 border-white/10">
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
                    <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5 bg-black/20 border-white/10">
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

                  <Link href="/bioritm/energia-zilei" className="group">
                    <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5 bg-black/20 border-white/10">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                          <Moon className="w-5 h-5 text-[#9F2BFF]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-white text-sm">Energia Zilei</h4>
                          <p className="text-xs text-[#E0E0E0]/70">
                            Descoperă energia planetară
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
