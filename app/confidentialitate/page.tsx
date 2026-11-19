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
            Ultima actualizare: 19 noiembrie 2026
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
          <h2 className="text-xl font-semibold text-white">
            Găzduire, securitate și măsurarea traficului
          </h2>
          <p>
            SpiritHub.ro este găzduit pe Google Cloud Run și protejat prin rețeaua CDN și de
            securitate Cloudflare. Pentru măsurarea performanței paginilor, a indicatorilor Core Web
            Vitals și a vizitelor agregate, site-ul poate folosi Cloudflare Web Analytics fără
            cookie-uri și fără urmărire între site-uri.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Publicitate</h2>
          <p>
            SpiritHub.ro poate afișa reclame prin parteneri precum Google AdSense. Partenerii de
            publicitate pot folosi cookie-uri sau identificatori tehnici pentru măsurarea reclamelor
            și, în Spațiul Economic European (SEE), exclusiv în funcție de preferințele de
            consimțământ exprimate de vizitator conform GDPR. Îți poți modifica sau retrage oricând
            acordul din setările de consimțământ sau din browser.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Drepturile tale</h2>
          <p>
            Conform GDPR, ai dreptul la informare, acces, rectificare, ștergere, restricționare sau
            opoziție privind datele asociate utilizării site-ului, în măsura în care acestea sunt
            prelucrate. Pentru orice solicitare sau întrebare despre confidențialitate, ne poți
            scrie la contact@spirithub.ro.
          </p>
        </section>
      </article>
    </MainLayout>
  );
}
