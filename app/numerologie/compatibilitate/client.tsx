"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getCompatibilityResult } from "@/lib/numerology-results";
import { NumerologyForm, type NumerologyFormData } from "@/components/numerologie/numerology-form";
import { CompatibilityCard } from "@/components/numerologie/compatibility-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdSlot } from "@/components/monetization/ad-slot";
import { adSlots } from "@/config/monetization";
import Link from "next/link";
import { Heart, Compass, Sparkles, Calendar, ArrowLeft } from "lucide-react";

export default function CompatibilitateClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get URL params
  const name1Param = searchParams.get("name1");
  const date1Param = searchParams.get("date1");
  const name2Param = searchParams.get("name2");
  const date2Param = searchParams.get("date2");

  const hasAllParams = !!(name1Param && date1Param && name2Param && date2Param);
  const calculatedData = hasAllParams
    ? getCompatibilityResult({
        person1: { name: name1Param, birthDate: date1Param },
        person2: { name: name2Param, birthDate: date2Param },
      })
    : null;

  const scores = calculatedData?.scores ?? null;
  const person1Data = calculatedData?.person1 ?? null;
  const person2Data = calculatedData?.person2 ?? null;
  const hasSubmitted = hasAllParams && calculatedData !== null;

  // Check if we have any params but they're invalid or incomplete
  // NOTE: Server-side validation in page.tsx handles redirects for invalid params,
  // so this is just for state derivation

  const interpretation = hasAllParams ? calculatedData?.interpretation ?? null : undefined;

  const handleSubmit = (data: NumerologyFormData) => {
    if (data.type === "compatibility") {
      // Update URL for shareable link - derived values will automatically reflect the new params
      const params = new URLSearchParams();
      params.set("name1", data.name1);
      params.set("date1", data.birthDate1);
      params.set("name2", data.name2);
      params.set("date2", data.birthDate2);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  // Reset function to go back to form view
  const handleReset = () => {
    // Clear URL params - derived values will automatically reset
    router.push(pathname);
  };

  // Determine if we should show results view
  const showResults = hasSubmitted && interpretation && scores !== null && person1Data && person2Data;

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Show form view when no results yet */}
        {!showResults && (
          <>
            {/* Page Introduction */}
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold text-white">
                Calculator Compatibilitate Numerologică
              </h1>
              <p className="text-lg text-[#E0E0E0] leading-relaxed">
                Introdu numele complete și datele de naștere pentru două persoane. Calculatorul
                compară Calea Vieții și Numărul Destinului, apoi îți arată un scor rapid de
                compatibilitate numerologică și o interpretare a dinamicii dintre voi.
              </p>
            </div>

            {/* Form Section */}
            <div>
              <NumerologyForm
                type="compatibility"
                onSubmit={handleSubmit}
                isLoading={interpretation === undefined && hasSubmitted}
              />
            </div>

            <section
              aria-labelledby="compatibility-calculator-details"
              className="space-y-4 text-[#E0E0E0]"
            >
              <div className="space-y-2 text-center">
                <h2
                  id="compatibility-calculator-details"
                  className="text-2xl font-semibold text-white"
                >
                  Ce verifică acest calculator
                </h2>
                <p className="leading-relaxed">
                  Compatibilitatea numerologică este calculată din două perechi de valori: data
                  nașterii pentru Calea Vieții și numele complet pentru Numărul Destinului. Rezultatul
                  nu decide viitorul relației, dar poate evidenția ritmul comun, diferențele și
                  zonele unde comunicarea contează mai mult.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <h3 className="font-semibold text-white">Calea Vieții</h3>
                  <p className="mt-2 text-sm leading-relaxed">
                    Arată energia de bază a fiecărei persoane, calculată din data nașterii.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <h3 className="font-semibold text-white">Numărul Destinului</h3>
                  <p className="mt-2 text-sm leading-relaxed">
                    Completează analiza cu vibrația numelui complet și felul în care fiecare se
                    exprimă în relație.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <h3 className="font-semibold text-white">Scor și interpretare</h3>
                  <p className="mt-2 text-sm leading-relaxed">
                    Primești o potrivire generală, plus observații despre armonie, diferențe și
                    potențialul de creștere.
                  </p>
                </div>
              </div>
            </section>

            {/* Loading State */}
            {interpretation === undefined && hasSubmitted && (
              <LoadingSpinner text="Se calculează compatibilitatea..." />
            )}

            {/* Error State */}
            {interpretation === null && hasSubmitted && (
              <ErrorMessage
                title="Eroare la încărcare"
                message="Nu am putut încărca interpretarea. Te rugăm să încerci din nou."
              />
            )}
          </>
        )}

        {/* Results View - only shown after successful calculation */}
        {showResults && (
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

            <CompatibilityCard
              score={scores.average}
              interpretation={interpretation}
              person1={person1Data}
              person2={person2Data}
              shareUrl={`https://www.spirithub.ro${pathname}?name1=${encodeURIComponent(person1Data.name)}&date1=${date1Param}&name2=${encodeURIComponent(person2Data.name)}&date2=${date2Param}`}
            />

            <AdSlot slotId={adSlots.resultInline} />

            {/* CTA Section - Explore More */}
            <Card className="p-6 space-y-6">
              {/* Calculate for Different Couple */}
              <div className="text-center border-b border-white/10 pb-6">
                <p className="text-lg font-medium text-[#9F2BFF]">
                  Vrei să calculezi pentru alt cuplu?
                </p>
                <p className="text-sm text-[#E0E0E0] mt-2 mb-4">
                  Poți verifica compatibilitatea numerologică pentru oricine.
                </p>
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Calculează pentru alt cuplu
                </Button>
              </div>

              {/* Explore Other Calculators */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white">
                    Explorează Numerologia
                  </h3>
                  <p className="text-sm text-[#E0E0E0] mt-1">
                    Descoperă alte aspecte ale destinului tău numerologic
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Link href="/numerologie/calea-vietii" className="group">
                    <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                          <Compass className="w-5 h-5 text-[#9F2BFF]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-white text-sm">Calea Vieții</h4>
                          <p className="text-xs text-[#E0E0E0]/70">
                            Descoperă lecțiile tale din data nașterii
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

                  <Link href="/numerologie/numar-zilnic" className="group">
                    <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                          <Calendar className="w-5 h-5 text-[#9F2BFF]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-white text-sm">Numărul Zilei</h4>
                          <p className="text-xs text-[#E0E0E0]/70">
                            Descoperă energia zilei de astăzi
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[#9F2BFF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Descoperă
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
