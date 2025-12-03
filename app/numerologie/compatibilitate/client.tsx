"use client";

import { useState } from "react";
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
import { parseISO } from "date-fns";

interface PersonData {
  name: string;
  lifePath: number;
  destiny: number;
}

export default function CompatibilitateClient() {
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [person1Data, setPerson1Data] = useState<PersonData | null>(null);
  const [person2Data, setPerson2Data] = useState<PersonData | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Query interpretation from Convex based on compatibility score
  const interpretation = useQuery(
    api.numerology.getCompatibilityInterpretation,
    compatibilityScore !== null ? { score: compatibilityScore } : "skip",
  );

  const handleSubmit = (data: NumerologyFormData) => {
    if (data.type === "compatibility") {
      // Calculate Life Path numbers for both people (with Master Number detection)
      const date1 = parseISO(data.birthDate1);
      const date2 = parseISO(data.birthDate2);
      const lifePath1 = calculateLifePath(date1);
      const lifePath2 = calculateLifePath(date2);

      // Calculate Destiny numbers for both people (with Master Number detection)
      // Romanian diacritics are handled correctly by calculateDestinyNumber
      const destiny1 = calculateDestinyNumber(data.name1);
      const destiny2 = calculateDestinyNumber(data.name2);

      // Calculate compatibility scores using Master Numbers at full value (not reduced)
      const lifePathCompat = calculateCompatibility(lifePath1, lifePath2);
      const destinyCompat = calculateCompatibility(destiny1, destiny2);

      // Average the two compatibility scores
      const avgScore = Math.round((lifePathCompat + destinyCompat) / 2);

      // Store results
      setCompatibilityScore(avgScore);
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
    }
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
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

        {/* Results Section */}
        {interpretation &&
          hasSubmitted &&
          compatibilityScore !== null &&
          person1Data &&
          person2Data && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CompatibilityCard
                score={compatibilityScore}
                interpretation={{
                  title: interpretation.title,
                  description: interpretation.description,
                  fullText: interpretation.fullText,
                }}
                person1={person1Data}
                person2={person2Data}
              />
            </div>
          )}
      </div>
    </div>
  );
}
