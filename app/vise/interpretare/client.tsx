/**
 * Multi-Symbol Dream Interpreter Client Component
 *
 * Allows users to select 2-3 dream symbols and combine their interpretations
 * into a comprehensive, coherent analysis.
 */
"use client";

import { useState } from "react";
import { DreamComboForm } from "@/components/vise/dream-combo-form";
import { ResultCard } from "@/components/shared/result-card";
import { DreamSymbol, combineInterpretations } from "@/lib/dreams";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function InterpretareClient() {
  const [combinedResult, setCombinedResult] = useState<{
    symbols: DreamSymbol[];
    interpretation: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle symbol combination
  const handleCombine = (symbols: DreamSymbol[]) => {
    try {
      setError(null);

      // Validate symbol count
      if (symbols.length < 2) {
        setError("Selectează cel puțin 2 simboluri pentru a combina interpretările.");
        return;
      }

      if (symbols.length > 3) {
        setError("Poți selecta maximum 3 simboluri pentru interpretare.");
        return;
      }

      // Generate combined interpretation
      const interpretation = combineInterpretations(symbols);

      setCombinedResult({
        symbols,
        interpretation,
      });
    } catch (err) {
      console.error("Error combining interpretations:", err);
      setError("A apărut o eroare la combinarea interpretărilor. Te rugăm să încerci din nou.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Educational Content */}
      <div className="space-y-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            Visele complexe conțin adesea mai multe simboluri care interacționează între ele.
            Selectează 2-3 simboluri principale din visul tău pentru a primi o interpretare
            comprehensivă care ia în considerare relația dintre ele.
          </p>
        </div>
      </div>

      {/* Combo Form */}
      <DreamComboForm onCombine={handleCombine} maxSymbols={3} />

      {/* Validation Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Combined Result */}
      {combinedResult && (
        <div className="space-y-4">
          <ResultCard
            title="Interpretare Combinată"
            description={`Simboluri: ${combinedResult.symbols.map((s) => s.name).join(", ")}`}
            interpretation={combinedResult.interpretation}
            shareUrl={typeof window !== "undefined" ? window.location.href : ""}
            shareTitle={`Interpretare vis: ${combinedResult.symbols.map((s) => s.name).join(", ")}`}
          />
        </div>
      )}
    </div>
  );
}
