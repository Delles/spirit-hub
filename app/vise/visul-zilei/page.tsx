import { VisulZileiClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visul Zilei - SpiritHub.ro",
  description:
    "Descoperă simbolul zilei din dicționarul de vise. Fiecare zi aduce un nou simbol oniric cu interpretare completă bazată pe folclorul românesc.",
  alternates: {
    canonical: "https://spirithub.ro/vise/visul-zilei",
  },
};

export default function VisulZileiPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page Introduction */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Simbolul Oniric al Zilei</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Fiecare zi aduce un nou simbol din dicționarul nostru de vise. Descoperă semnificația
            simbolului de astăzi și reflectează asupra mesajului său pentru viața ta.
          </p>
        </div>

        {/* Client Component with Daily Dream */}
        <VisulZileiClient />

        {/* Educational Content */}
        <div className="mt-12 space-y-6 border-t pt-8">
          <h3 className="text-xl font-semibold">Despre Visul Zilei</h3>

          <div className="space-y-4 text-muted-foreground">
            <div className="space-y-2">
              <h4 className="text-base font-medium text-foreground">
                Un simbol nou în fiecare zi
              </h4>
              <p className="text-sm leading-relaxed">
                Visul zilei este selectat în mod deterministic pentru fiecare dată, ceea ce
                înseamnă că toți utilizatorii văd același simbol în aceeași zi. Revino mâine
                pentru a descoperi un nou simbol oniric.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-medium text-foreground">
                Reflectează asupra mesajului
              </h4>
              <p className="text-sm leading-relaxed">
                Chiar dacă nu ai visat acest simbol recent, interpretarea sa poate oferi
                perspective valoroase pentru situația ta actuală. Gândește-te cum se aplică
                mesajul la viața ta de zi cu zi.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-medium text-foreground">
                Explorează mai multe simboluri
              </h4>
              <p className="text-sm leading-relaxed">
                Dacă vrei să afli mai multe despre alte simboluri din visele tale, folosește
                funcția de căutare pentru a explora întregul nostru dicționar de interpretare
                vise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
