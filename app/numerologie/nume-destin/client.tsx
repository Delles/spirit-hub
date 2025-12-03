"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { calculateDestinyNumber } from "@/lib/numerology";
import { NumerologyForm, type NumerologyFormData } from "@/components/numerologie/numerology-form";
import { DestinyCard } from "@/components/numerologie/destiny-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Calendar, Compass, Heart, ArrowLeft } from "lucide-react";

interface Props {
  initialName?: string;
}

export default function NumeDestinClient({ initialName }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const nameParam = searchParams.get("name");

  const [name, setName] = useState<string>(initialName || nameParam || "");

  const [destinyNumber, setDestinyNumber] = useState<number | null>(() => {
    const initialValue = initialName || nameParam;
    return initialValue ? calculateDestinyNumber(initialValue) : null;
  });

  const [hasSubmitted, setHasSubmitted] = useState(!!(initialName || nameParam));

  // Sync state with URL params on mount and update
  useEffect(() => {
    if (nameParam && nameParam !== name) {
      // URL has name param - sync state from URL
      setName(nameParam);
      const number = calculateDestinyNumber(nameParam);
      setDestinyNumber(number);
      setHasSubmitted(true);
    } else if (!nameParam && hasSubmitted) {
      // URL has no name param but state shows submitted - reset to form view
      setName("");
      setDestinyNumber(null);
      setHasSubmitted(false);
    }
  }, [nameParam, name, hasSubmitted]);

  // Query interpretation from Convex (supports Master Numbers 11, 22, 33)
  const interpretation = useQuery(
    api.numerology.getDestinyInterpretation,
    destinyNumber !== null ? { number: destinyNumber } : "skip",
  );

  const handleSubmit = (data: NumerologyFormData) => {
    if (data.type === "destiny") {
      // Calculate Destiny number with Master Number detection
      // Romanian diacritics (ă, â, î, ș, ț) are handled by calculateDestinyNumber
      const number = calculateDestinyNumber(data.name);

      setDestinyNumber(number);
      setName(data.name);
      setHasSubmitted(true);

      // Update URL
      const params = new URLSearchParams(searchParams);
      params.set("name", data.name);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  // Reset function to go back to form view
  const handleReset = () => {
    setHasSubmitted(false);
    setDestinyNumber(null);
    setName("");
    // Clear URL params
    router.push(pathname);
  };

  // Determine if we should show results view
  const showResults = hasSubmitted && interpretation && destinyNumber !== null;

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Show form view when no results yet */}
        {!showResults && (
          <>
            {/* Info Section */}
            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-white">Ce este Numărul Destinului?</h2>
              <p className="text-sm text-[#E0E0E0] leading-relaxed">
                Numărul Destinului este calculat din numele tău complet și reprezintă misiunea ta în
                viață, talentele înnăscute și potențialul pe care l-ai venit să-l realizezi. Spre
                deosebire de Calea Vieții (care arată lecțiile pe care trebuie să le înveți), Numărul
                Destinului îți arată ce ai venit să faci și ce daruri ai de oferit lumii.
              </p>
              <p className="text-sm text-[#E0E0E0] leading-relaxed">
                Fiecare literă din numele tău poartă o vibrație numerologică specifică. Sistemul nostru
                recunoaște corect diacriticele românești (ă, â, î, ș, ț) și calculează valoarea exactă a
                numelui tău.
              </p>
              <p className="text-sm text-[#E0E0E0] leading-relaxed">
                Numerele Maestru (11, 22, 33) indică un potențial spiritual deosebit și o
                responsabilitate mai mare în realizarea misiunii tale de viață.
              </p>
            </Card>

            {/* Form Section */}
            <div>
              <NumerologyForm
                type="destiny"
                onSubmit={handleSubmit}
                isLoading={interpretation === undefined && hasSubmitted}
              />
            </div>

            {/* Loading State */}
            {interpretation === undefined && hasSubmitted && (
              <LoadingSpinner text="Se încarcă interpretarea..." />
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
            <DestinyCard
              number={destinyNumber}
              interpretation={{
                title: interpretation.title,
                description: interpretation.description,
                fullText: interpretation.fullText,
              }}
              name={name}
            />

            {/* CTA Section - Explore More */}
            <Card className="p-6 space-y-6">
              {/* Calculate for Different Name */}
              <div className="text-center border-b border-white/10 pb-6">
                <p className="text-lg font-medium text-[#9F2BFF]">
                  ✨ Vrei să calculezi pentru alt nume? ✨
                </p>
                <p className="text-sm text-[#E0E0E0] mt-2 mb-4">
                  Poți afla Numărul Destinului pentru oricine, folosind numele complet.
                </p>
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  Calculează pentru alt nume
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

                  <Link href="/numerologie/numar-zilnic" className="group">
                    <Card className="p-6 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
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
