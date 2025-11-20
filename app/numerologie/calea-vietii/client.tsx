"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { Calculator } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { calculateLifePath } from "@/lib/numerology";
import { NumerologyForm, type NumerologyFormData } from "@/components/numerologie/numerology-form";
import { LifePathCard } from "@/components/numerologie/life-path-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { parseISO } from "date-fns";

interface Props {
  initialBirthDate?: string;
}

export default function CaleaVietiiClient({ initialBirthDate }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const dateParam = searchParams.get("date");

  const [birthDate, setBirthDate] = useState<string>(
    initialBirthDate || dateParam || ""
  );

  const [lifePathNumber, setLifePathNumber] = useState<number | null>(() => {
    const date = initialBirthDate || dateParam;
    return date ? calculateLifePath(parseISO(date)) : null;
  });

  const [hasSubmitted, setHasSubmitted] = useState(!!(initialBirthDate || dateParam));

  // Sync state with URL params on mount and update
  useEffect(() => {
    if (dateParam && dateParam !== birthDate) {
      setBirthDate(dateParam);
      const number = calculateLifePath(parseISO(dateParam));
      setLifePathNumber(number);
      setHasSubmitted(true);
    }
  }, [dateParam, birthDate]);

  // Query interpretation from Convex (supports Master Numbers 11, 22, 33)
  const interpretation = useQuery(
    api.numerology.getLifePathInterpretation,
    lifePathNumber !== null ? { number: lifePathNumber } : "skip",
  );

  const handleSubmit = (data: NumerologyFormData) => {
    if (data.type === "lifePath") {
      const date = parseISO(data.birthDate);

      // Calculate Life Path number with Master Number detection
      const number = calculateLifePath(date);

      setLifePathNumber(number);
      setBirthDate(data.birthDate);
      setHasSubmitted(true);

      // Update URL
      const params = new URLSearchParams(searchParams);
      params.set("date", data.birthDate);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Info Section */}
        <div className="rounded-lg border bg-card p-6 space-y-3">
          <h2 className="text-xl font-semibold">Ce este Calea Vieții?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Calea Vieții este cel mai important număr în numerologie, calculat din data ta de
            naștere. Acesta reprezintă lecțiile pe care trebuie să le înveți, provocările pe care
            le vei întâmpina și oportunitățile care ți se vor deschide pe parcursul vieții. Este
            ca o hartă a destinului tău, oferindu-ți îndrumări despre cine ești cu adevărat și ce
            ai venit să realizezi în această viață.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Numerele Maestru (11, 22, 33) sunt numere speciale care poartă o vibrație spirituală
            intensă și o responsabilitate mai mare. Dacă primești un Număr Maestru, înseamnă că ai
            un potențial spiritual deosebit și o misiune importantă în această viață.
          </p>
        </div>

        {/* Form Section */}
        <div>
          <NumerologyForm
            type="lifePath"
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

        {/* Results Section */}
        {interpretation && hasSubmitted && lifePathNumber !== null && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <LifePathCard
              number={lifePathNumber}
              interpretation={{
                title: interpretation.title,
                description: interpretation.description,
                fullText: interpretation.fullText,
              }}
              birthDate={birthDate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
