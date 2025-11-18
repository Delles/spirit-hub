"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/shared/share-button";
import { Sparkles } from "lucide-react";

export interface DestinyCardProps {
  number: number;
  interpretation: {
    title: string;
    description: string;
    fullText: string;
  };
  name: string;
}

const masterNumbers = [11, 22, 33];

export function DestinyCard({ number, interpretation, name }: DestinyCardProps) {
  const isMasterNumber = masterNumbers.includes(number);

  // Get reduced number for Master Numbers
  const getReducedNumber = (n: number): number => {
    if (n === 11) return 2;
    if (n === 22) return 4;
    if (n === 33) return 6;
    return n;
  };

  const reducedNumber = isMasterNumber ? getReducedNumber(number) : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Numărul Destinului</CardTitle>
            <CardDescription>{interpretation.title}</CardDescription>
          </div>
          {isMasterNumber && (
            <Badge
              variant="secondary"
              className="ml-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-200"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Număr Maestru
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name display */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Numele tău</p>
          <p className="text-xl font-semibold text-foreground">{name}</p>
        </div>

        {/* Large animated number display */}
        <div className="flex items-center justify-center py-8">
          <div className="relative animate-in fade-in zoom-in duration-500">
            {/* Glow effect */}
            <div
              className={`absolute inset-0 blur-3xl rounded-full ${
                isMasterNumber
                  ? "bg-gradient-to-br from-yellow-500/30 to-amber-500/30"
                  : "bg-primary/20"
              }`}
            />

            {/* Number */}
            <div
              className={`relative text-7xl font-bold bg-clip-text text-transparent ${
                isMasterNumber
                  ? "bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500"
                  : "bg-gradient-to-br from-primary to-secondary"
              }`}
            >
              {number}
            </div>
          </div>
        </div>

        {/* Master Number explanation */}
        {isMasterNumber && reducedNumber && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-200/90 leading-relaxed">
              <strong>Număr Maestru {number}:</strong> Acest număr poartă o vibrație spirituală
              intensă și o responsabilitate mai mare. Deși se reduce la {reducedNumber}, energia sa
              este mult mai amplificată și vine cu provocări și oportunități unice.
            </p>
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <p className="text-base text-muted-foreground leading-relaxed">
            {interpretation.description}
          </p>
        </div>

        {/* Full interpretation */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {interpretation.fullText}
          </div>
        </div>

        {/* Share button */}
        <div className="pt-4 border-t">
          <ShareButton
            url={typeof window !== "undefined" ? window.location.href : ""}
            title={`Numărul Destinului meu este ${number}${isMasterNumber ? " (Număr Maestru)" : ""}`}
            text={`Am descoperit că Numărul Destinului meu este ${number}${isMasterNumber ? " - un Număr Maestru" : ""}! ${interpretation.title}. Descoperă și tu pe SpiritHub.ro`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
