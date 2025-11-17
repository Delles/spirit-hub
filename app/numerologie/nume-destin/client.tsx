"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { Sparkles } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { calculateDestinyNumber } from "@/lib/numerology";
import { NumerologyForm, type NumerologyFormData } from "@/components/numerologie/numerology-form";
import { DestinyCard } from "@/components/numerologie/destiny-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";

export default function NumeDestinClient() {
  const [name, setName] = useState<string>("");
  const [destinyNumber, setDestinyNumber] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Query interpretation from Convex (supports Master Numbers 11, 22, 33)
  const interpretation = useQuery(
    api.numerology.getDestinyInterpretation,
    destinyNumber !== null ? { number: destinyNumber } : "skip"
  );

  const handleSubmit = (data: NumerologyFormData) => {
    if (data.type === "destiny") {
      // Calculate Destiny number with Master Number detection
      // Romanian diacritics (ă, â, î, ș, ț) are handled by calculateDestinyNumber
      const number = calculateDestinyNumber(data.name);
      
      setDestinyNumber(number);
      setName(data.name);
      setHasSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Numărul Destinului
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descoperă-ți numărul destinului din numele complet și înțelege-ți misiunea și potențialul în viață
            </p>
          </div>

          {/* Info Section */}
          <div className="rounded-lg border bg-card p-6 space-y-3">
            <h2 className="text-xl font-semibold">Ce este Numărul Destinului?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Numărul Destinului este calculat din numele tău complet și reprezintă misiunea ta în viață, 
              talentele înnăscute și potențialul pe care l-ai venit să-l realizezi. Spre deosebire de Calea Vieții 
              (care arată lecțiile pe care trebuie să le înveți), Numărul Destinului îți arată ce ai venit să faci 
              și ce daruri ai de oferit lumii.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fiecare literă din numele tău poartă o vibrație numerologică specifică. Sistemul nostru recunoaște 
              corect diacriticele românești (ă, â, î, ș, ț) și calculează valoarea exactă a numelui tău.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Numerele Maestru (11, 22, 33) indică un potențial spiritual deosebit și o responsabilitate mai mare 
              în realizarea misiunii tale de viață.
            </p>
          </div>

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

          {/* Results Section */}
          {interpretation && hasSubmitted && destinyNumber !== null && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <DestinyCard
                number={destinyNumber}
                interpretation={{
                  title: interpretation.title,
                  description: interpretation.description,
                  fullText: interpretation.fullText,
                }}
                name={name}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
