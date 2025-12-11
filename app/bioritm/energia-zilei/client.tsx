"use client";

import { EnergiaZileiCard } from "@/components/bioritm/energia-zilei-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getEnergiaZilei } from "@/lib/energia-zilei";
import { getMoonPhase } from "@/lib/moon-phase";
import { formatRomanianDate, getBucharestDate } from "@/lib/utils";
import { Calculator, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function EnergiaZileiClient() {
  // Use Bucharest timezone for consistent date across all users
  const today = getBucharestDate();
  const romanianDate = formatRomanianDate(today);
  const energiaZilei = getEnergiaZilei(today);
  const moonPhase = getMoonPhase(today);

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex justify-start">
          <Link href="/bioritm" className="inline-block">
            <Button
              variant="ghost"
              className="gap-2 pl-0 hover:pl-2 transition-all text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Înapoi la Bioritm
            </Button>
          </Link>
        </div>

        {/* Page Introduction */}
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-white">Energia Zilei de Astăzi</h2>
          <p className="text-lg text-[#E0E0E0] leading-relaxed">
            Descoperă influența cosmică a zilei de {romanianDate}. Folosește această energie pentru
            a-ți planifica activitățile în armonie cu ritmurile universale.
          </p>
        </div>

        {/* Main Energy Card */}
        <EnergiaZileiCard energia={energiaZilei} moonPhase={moonPhase} />

        {/* CTA to Personal Biorhythm */}
        <Card className="p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40">
              <Calculator className="w-7 h-7 text-[#9F2BFF]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                Vrei o analiză personalizată?
              </h3>
              <p className="text-[#E0E0E0] max-w-md mx-auto">
                Energia zilei este universală, dar bioritmul tău personal oferă îndrumări specifice
                bazate pe ciclurile tale fizice, emoționale și intelectuale calculate din data nașterii.
              </p>
            </div>

            <Link href="/bioritm">
              <Button className="gap-2 min-h-[44px]">
                Calculează Bioritmul Personal
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Return Tomorrow */}
        <div className="text-center py-4">
          <p className="text-sm text-[#E0E0E0]/60">
            ✨ Revino mâine pentru a descoperi energia unei noi zile ✨
          </p>
        </div>
      </div>
    </div>
  );
}

