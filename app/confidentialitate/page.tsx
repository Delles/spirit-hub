import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";

export const metadata: Metadata = {
  title: "Politica de Confidențialitate | SpiritHub.ro",
  description:
    "Politica de confidențialitate SpiritHub.ro: ce date sunt folosite, analytics, publicitate și drepturile vizitatorilor.",
  alternates: {
    canonical: "https://www.spirithub.ro/confidentialitate",
  },
};

export default function ConfidentialitatePage() {
  return (
    <MainLayout>
      <article className="mx-auto max-w-3xl space-y-8 py-8 text-[#E0E0E0]">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9F2BFF]">
            Ultima actualizare: 11 iunie 2026
          </p>
          <h1 className="text-3xl font-bold text-white">Politica de Confidențialitate</h1>
          <p>
            Această pagină explică modul în care SpiritHub.ro tratează informațiile asociate
            vizitatorilor și folosirii instrumentelor de pe site.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Date introduse în calculatoare</h2>
          <p>
            Unele instrumente pot cere nume, date de naștere sau alte informații necesare pentru
            calcul. Aceste date sunt folosite pentru afișarea rezultatului și pentru generarea
            linkurilor partajabile. SpiritHub.ro nu solicită cont și nu vinde date personale.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Analytics și performanță</h2>
          <p>
            Site-ul poate folosi servicii precum Vercel Analytics și Speed Insights pentru a
            înțelege performanța paginilor, erorile tehnice și experiența generală de navigare.
            Aceste informații ajută la îmbunătățirea site-ului.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Publicitate</h2>
          <p>
            SpiritHub.ro poate afișa reclame prin parteneri precum Google AdSense. Partenerii de
            publicitate pot folosi cookie-uri sau tehnologii similare pentru măsurarea reclamelor
            și, unde este permis, pentru personalizare. Setările exacte depind de furnizorii de
            publicitate și de preferințele exprimate de vizitator.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Drepturile tale</h2>
          <p>
            Dacă ai întrebări despre confidențialitate sau dorești clarificări despre datele
            asociate utilizării site-ului, ne poți contacta la contact@spirithub.ro.
          </p>
        </section>
      </article>
    </MainLayout>
  );
}
