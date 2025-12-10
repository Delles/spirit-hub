"use client";

import { useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getInterpretation } from "@/lib/interpretations";
import {
  calculateLifePath,
  calculateDestinyNumber,
  calculateCompatibility,
} from "@/lib/numerology";
import { NumerologyForm, type NumerologyFormData } from "@/components/numerologie/numerology-form";
import { CompatibilityCard } from "@/components/numerologie/compatibility-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { parseISO, isValid } from "date-fns";
import { Heart, Compass, Sparkles, Calendar, ArrowLeft } from "lucide-react";

interface PersonData {
  name: string;
  lifePath: number;
  destiny: number;
}

interface CompatibilityScores {
  average: number;
  lifePath: number;
  destiny: number;
}

// Safe calculation that returns null on invalid input
function safeCalculateFromParams(
  name1: string,
  date1: string,
  name2: string,
  date2: string
): { person1: PersonData; person2: PersonData; scores: CompatibilityScores } | null {
  try {
    const parsedDate1 = parseISO(date1);
    const parsedDate2 = parseISO(date2);

    if (!isValid(parsedDate1) || !isValid(parsedDate2)) return null;
    if (!name1.trim() || !name2.trim()) return null;

    const lifePath1 = calculateLifePath(parsedDate1);
    const lifePath2 = calculateLifePath(parsedDate2);
    const destiny1 = calculateDestinyNumber(name1);
    const destiny2 = calculateDestinyNumber(name2);

    const lifePathCompat = calculateCompatibility(lifePath1, lifePath2);
    const destinyCompat = calculateCompatibility(destiny1, destiny2);
    const avgScore = Math.round((lifePathCompat + destinyCompat) / 2);

    return {
      person1: { name: name1, lifePath: lifePath1, destiny: destiny1 },
      person2: { name: name2, lifePath: lifePath2, destiny: destiny2 },
      scores: { average: avgScore, lifePath: lifePathCompat, destiny: destinyCompat },
    };
  } catch {
    return null;
  }
}

export default function CompatibilitateClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get URL params
  const name1Param = searchParams.get("name1");
  const date1Param = searchParams.get("date1");
  const name2Param = searchParams.get("name2");
  const date2Param = searchParams.get("date2");

  // Derive values from URL params - reactive to URL changes (back/forward navigation, shared links)
  // Use useMemo to avoid recalculating on every render
  const calculatedData = useMemo(() => {
    if (name1Param && date1Param && name2Param && date2Param) {
      return safeCalculateFromParams(name1Param, date1Param, name2Param, date2Param);
    }
    return null;
  }, [name1Param, date1Param, name2Param, date2Param]);

  const scores = calculatedData?.scores ?? null;
  const person1Data = calculatedData?.person1 ?? null;
  const person2Data = calculatedData?.person2 ?? null;
  const hasSubmitted = calculatedData !== null;

  // Check if we have any params but they're invalid or incomplete
  const hasAnyParams = !!(name1Param || date1Param || name2Param || date2Param);
  const hasAllParams = !!(name1Param && date1Param && name2Param && date2Param);

  // Clean up invalid or partial URL params
  useEffect(() => {
    // Case 1: Partial params (not all 4 are present)
    // Case 2: All params present but calculation failed (invalid data)
    if ((hasAnyParams && !hasAllParams) || (hasAllParams && calculatedData === null)) {
      // Invalid/partial params - clean up URL without adding to history
      router.replace(pathname);
    }
  }, [hasAnyParams, hasAllParams, calculatedData, router, pathname]);

  // Query interpretation from static library
  const interpretation = useMemo(() => {
    if (scores === null) return undefined;
    const result = getInterpretation("compatibility", scores.average);
    return result || null;
  }, [scores]);

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
            {/* Info Section */}
            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-white">Ce este Compatibilitatea Numerologică?</h2>
              <p className="text-sm text-[#E0E0E0] leading-relaxed">
                Compatibilitatea numerologică analizează armonia dintre două persoane pe baza numerelor
                lor de viață. Calculăm atât Calea Vieții (din data nașterii), cât și Numărul Destinului
                (din nume) pentru fiecare persoană, apoi determinăm cât de bine se potrivesc aceste
                energii numerologice.
              </p>
              <p className="text-sm text-[#E0E0E0] leading-relaxed">
                Un scor mare indică o conexiune naturală și armonioasă, în timp ce un scor mai mic
                sugerează că relația va necesita mai mult efort și înțelegere reciprocă. Numerele Maestru
                (11, 22, 33) sunt evaluate la valoarea lor completă, reflectând intensitatea lor
                spirituală unică.
              </p>
            </Card>

            {/* Form Section */}
            <div>
              <NumerologyForm
                type="compatibility"
                onSubmit={handleSubmit}
                isLoading={interpretation === undefined && hasSubmitted}
              />
            </div>

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
            <CompatibilityCard
              score={scores.average}
              lifePathCompatibility={scores.lifePath}
              destinyCompatibility={scores.destiny}
              interpretation={{
                title: interpretation.title,
                description: interpretation.description,
                fullText: interpretation.fullText,
              }}
              person1={person1Data}
              person2={person2Data}
            />

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
