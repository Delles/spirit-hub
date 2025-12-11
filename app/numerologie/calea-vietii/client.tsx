"use client";

import { useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getInterpretation } from "@/lib/interpretations";
import { calculateLifePath } from "@/lib/numerology";
import { NumerologyForm, type NumerologyFormData } from "@/components/numerologie/numerology-form";
import { LifePathCard } from "@/components/numerologie/life-path-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { parseISO, isValid } from "date-fns";
import { Calendar, Sparkles, Heart, ArrowLeft } from "lucide-react";



// Safe calculation that returns null on invalid input
function safeCalculateLifePath(dateStr: string): number | null {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return null;
    return calculateLifePath(date);
  } catch {
    return null;
  }
}

export default function CaleaVietiiClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const dateParam = searchParams.get("date");

  // Derive values from URL params - reactive to URL changes (back/forward navigation, shared links)
  const birthDate = dateParam || "";
  const lifePathNumber = birthDate ? safeCalculateLifePath(birthDate) : null;
  const hasSubmitted = !!dateParam;
  const shouldQueryInterpretation = hasSubmitted && lifePathNumber !== null;

  // Clean up invalid URL params (e.g., invalid date formats)
  useEffect(() => {
    if (dateParam && lifePathNumber === null) {
      // Invalid date param - clean up URL without adding to history
      router.replace(pathname);
    }
  }, [dateParam, lifePathNumber, router, pathname]);

  // Query interpretation from static library
  const interpretation = useMemo(() => {
    if (!shouldQueryInterpretation || lifePathNumber === null) return undefined;
    const result = getInterpretation('life-path', lifePathNumber);
    // If not found, return null to show error state, mirroring a missing backend record
    return result || null;
  }, [shouldQueryInterpretation, lifePathNumber]);

  const isLoading = shouldQueryInterpretation && interpretation === undefined;

  const handleSubmit = (data: NumerologyFormData) => {
    if (data.type === "lifePath") {
      // Update URL - derived values will automatically reflect the new params
      const params = new URLSearchParams(searchParams);
      params.set("date", data.birthDate);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  // Reset function to go back to form view
  const handleReset = () => {
    // Clear URL params - derived values will automatically reset
    router.push(pathname);
  };

  // Determine if we should show results view
  const showResults = hasSubmitted && interpretation && lifePathNumber !== null;

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Show form view when no results yet */}
        {!showResults && (
          <>
            {/* Page Introduction */}
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold text-white">Calculator Calea Vieții</h2>
              <p className="text-lg text-[#E0E0E0] leading-relaxed">
                Descoperă cel mai important număr din numerologie. Calea Vieții îți dezvăluie
                lecțiile majore, provocările și oportunitățile destinului tău, calculate din data
                nașterii.
              </p>
            </div>

            {/* Form Section */}
            <div>
              <NumerologyForm
                type="lifePath"
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>

            {/* Loading State */}
            {isLoading && <LoadingSpinner text="Se încarcă interpretarea..." />}

            {/* Error State */}
            {interpretation === null && shouldQueryInterpretation && (
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

            <LifePathCard
              number={lifePathNumber}
              interpretation={{
                title: interpretation.title,
                description: interpretation.description,
                fullText: interpretation.fullText,
              }}
              birthDate={birthDate}
            />

            {/* CTA Section - Explore More */}
            <Card className="p-6 space-y-6">
              {/* Calculate for Different Date */}
              <div className="text-center border-b border-white/10 pb-6">
                <p className="text-lg font-medium text-[#9F2BFF]">
                  ✨ Vrei să calculezi pentru altă dată? ✨
                </p>
                <p className="text-sm text-[#E0E0E0] mt-2 mb-4">
                  Poți afla Calea Vieții pentru oricine, folosind data lui de naștere.
                </p>
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Calculează pentru altă dată
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