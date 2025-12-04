"use client";

import { EnergiaZileiCard } from "@/components/bioritm/energia-zilei-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getEnergiaZilei } from "@/lib/energia-zilei";
import { getMoonPhase } from "@/lib/moon-phase";
import { formatRomanianDate } from "@/lib/utils";
import { Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

export function EnergiaZileiClient() {
  const today = new Date();
  const romanianDate = formatRomanianDate(today);
  const energiaZilei = getEnergiaZilei(today);
  const moonPhase = getMoonPhase(today);

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Date Display */}
        <div className="text-center space-y-2">
          <p className="text-sm text-[#E0E0E0]/60 uppercase tracking-wide">Energia Zilei</p>
          <p className="text-2xl font-semibold text-[#9F2BFF]">{romanianDate}</p>
        </div>

        {/* Main Energy Card */}
        <EnergiaZileiCard energia={energiaZilei} moonPhase={moonPhase} />

        {/* Educational Content */}
        <Card className="p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Despre Energia Zilei</h3>

          <div className="space-y-4 text-[#E0E0E0]">
            <div className="space-y-2">
              <h4 className="text-base font-medium text-white">Tradiția Planetară</h4>
              <p className="text-sm leading-relaxed">
                Din cele mai vechi timpuri, fiecare zi a săptămânii a fost asociată cu un corp
                ceresc care îi influențează energia. Această înțelepciune se regăsește în multe
                culturi și limbi - numele zilelor în română păstrează aceste conexiuni cosmice.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-medium text-white">Cum să folosești această ghidare</h4>
              <p className="text-sm leading-relaxed">
                Energia zilei oferă un cadru general pentru a-ți planifica activitățile în armonie
                cu ritmurile cosmice. Nu este o predicție rigidă, ci o invitație de a fi mai conștient
                de calitatea energetică a fiecărei zile.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-medium text-white">Faza Lunii: {moonPhase.emoji} {moonPhase.labelRo}</h4>
              <p className="text-sm leading-relaxed">
                Faza lunii adaugă un strat suplimentar de influență energetică. Luna plină intensifică
                emoțiile, luna nouă favorizează noi începuturi, iar fazele intermediare susțin
                acțiunea sau reflecția.
              </p>
            </div>
          </div>
        </Card>

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

