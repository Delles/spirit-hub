"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
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

  // Initialize state from URL params
  const [scores, setScores] = useState<CompatibilityScores | null>(() => {
    if (name1Param && date1Param && name2Param && date2Param) {
      const result = safeCalculateFromParams(name1Param, date1Param, name2Param, date2Param);
      return result?.scores ?? null;
    }
    return null;
  });

  const [person1Data, setPerson1Data] = useState<PersonData | null>(() => {
    if (name1Param && date1Param && name2Param && date2Param) {
      const result = safeCalculateFromParams(name1Param, date1Param, name2Param, date2Param);
      return result?.person1 ?? null;
    }
    return null;
  });

  const [person2Data, setPerson2Data] = useState<PersonData | null>(() => {
    if (name1Param && date1Param && name2Param && date2Param) {
      const result = safeCalculateFromParams(name1Param, date1Param, name2Param, date2Param);
      return result?.person2 ?? null;
    }
    return null;
  });

  const [hasSubmitted, setHasSubmitted] = useState(() => {
    if (name1Param && date1Param && name2Param && date2Param) {
      const result = safeCalculateFromParams(name1Param, date1Param, name2Param, date2Param);
      return result !== null;
    }
    return false;
  });

  // Sync state with URL params on change
  useEffect(() => {
    if (name1Param && date1Param && name2Param && date2Param) {
      const result = safeCalculateFromParams(name1Param, date1Param, name2Param, date2Param);
      if (result) {
        setScores(result.scores);
        setPerson1Data(result.person1);
        setPerson2Data(result.person2);
        setHasSubmitted(true);
      } else {
        // Invalid params - reset and clear URL
        setScores(null);
        setPerson1Data(null);
        setPerson2Data(null);
        setHasSubmitted(false);
        router.replace(pathname);
      }
    } else if (!name1Param && !date1Param && !name2Param && !date2Param) {
      // No params - reset to form view
      setScores(null);
      setPerson1Data(null);
      setPerson2Data(null);
      setHasSubmitted(false);
    }
  }, [name1Param, date1Param, name2Param, date2Param, pathname, router]);

  // Query interpretation from Convex based on compatibility score
  const interpretation = useQuery(
    api.numerology.getCompatibilityInterpretation,
    scores !== null ? { score: scores.average } : "skip",
  );

  const handleSubmit = (data: NumerologyFormData) => {
    if (data.type === "compatibility") {
      // Calculate Life Path numbers for both people (with Master Number detection)
      const date1 = parseISO(data.birthDate1);
      const date2 = parseISO(data.birthDate2);
      const lifePath1 = calculateLifePath(date1);
      const lifePath2 = calculateLifePath(date2);

      // Calculate Destiny numbers for both people (with Master Number detection)
      const destiny1 = calculateDestinyNumber(data.name1);
      const destiny2 = calculateDestinyNumber(data.name2);

      // Calculate compatibility scores
      const lifePathCompat = calculateCompatibility(lifePath1, lifePath2);
      const destinyCompat = calculateCompatibility(destiny1, destiny2);
      const avgScore = Math.round((lifePathCompat + destinyCompat) / 2);

      // Store results
      setScores({ average: avgScore, lifePath: lifePathCompat, destiny: destinyCompat });
      setPerson1Data({
        name: data.name1,
        lifePath: lifePath1,
        destiny: destiny1,
      });
      setPerson2Data({
        name: data.name2,
        lifePath: lifePath2,
        destiny: destiny2,
      });
      setHasSubmitted(true);

      // Update URL for shareable link
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
    setHasSubmitted(false);
    setScores(null);
    setPerson1Data(null);
    setPerson2Data(null);
    // Clear URL params
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
