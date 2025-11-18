import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { InterpretareClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interpretare Vis Complex - SpiritHub.ro",
  description:
    "Combină 2-3 simboluri din visul tău pentru o interpretare comprehensivă. Descoperă cum simbolurile interacționează și ce mesaj transmit împreună.",
};

export default function InterpretarePage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Page Introduction */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Combină Simboluri pentru Interpretare Complexă</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Visele noastre sunt adesea complexe, conținând mai multe simboluri care lucrează
              împreună pentru a transmite un mesaj. Selectează 2-3 simboluri principale din visul
              tău pentru a primi o interpretare care ia în considerare relația dintre ele.
            </p>
          </div>

          {/* Client Component with Interactive Form */}
          <InterpretareClient />

          {/* Educational Content */}
          <div className="mt-12 space-y-6 border-t pt-8">
            <h3 className="text-xl font-semibold">Cum să folosești interpretarea complexă</h3>

            <div className="space-y-4 text-muted-foreground">
              <div className="space-y-2">
                <h4 className="text-base font-medium text-foreground">
                  1. Identifică simbolurile principale
                </h4>
                <p className="text-sm leading-relaxed">
                  Gândește-te la elementele care au fost cele mai pregnante în visul tău. Nu toate
                  detaliile sunt simboluri importante - concentrează-te pe cele care ți-au atras
                  atenția sau care au avut un rol central în vis.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-medium text-foreground">
                  2. Selectează 2-3 simboluri
                </h4>
                <p className="text-sm leading-relaxed">
                  Caută și selectează simbolurile din dicționarul nostru. Dacă visul tău conține mai
                  multe simboluri, alege pe cele mai semnificative. Interpretarea funcționează cel
                  mai bine cu 2-3 simboluri.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-medium text-foreground">
                  3. Reflectează asupra interpretării
                </h4>
                <p className="text-sm leading-relaxed">
                  Interpretarea combinată va lua în considerare fiecare simbol individual, dar și
                  modul în care acestea interacționează. Gândește-te cum se aplică mesajul la
                  situația ta actuală de viață.
                </p>
              </div>
            </div>
          </div>

        {/* Link back to search */}
        <div className="flex justify-center pt-8">
          <Link href="/vise">
            <Button variant="outline" className="min-h-[44px]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi la căutare simboluri
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
