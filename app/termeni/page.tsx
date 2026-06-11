import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";

export const metadata: Metadata = {
  title: "Termeni și Condiții | SpiritHub.ro",
  description:
    "Termenii de utilizare pentru SpiritHub.ro, platformă de numerologie, bioritm și conținut spiritual pentru divertisment.",
  alternates: {
    canonical: "https://www.spirithub.ro/termeni",
  },
};

export default function TermeniPage() {
  return (
    <MainLayout>
      <article className="mx-auto max-w-3xl space-y-8 py-8 text-[#E0E0E0]">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9F2BFF]">
            Ultima actualizare: 11 iunie 2026
          </p>
          <h1 className="text-3xl font-bold text-white">Termeni și Condiții</h1>
          <p>
            Prin folosirea SpiritHub.ro accepți acești termeni de utilizare. Dacă nu ești de acord
            cu ei, te rugăm să nu folosești site-ul.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Scopul conținutului</h2>
          <p>
            SpiritHub.ro oferă calculatoare, interpretări și mesaje zilnice pentru divertisment,
            inspirație și reflecție personală. Conținutul nu este destinat să înlocuiască sfatul
            unui specialist.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Folosirea responsabilă</h2>
          <p>
            Rezultatele numerologice, bioritmul și mesajele spirituale trebuie interpretate ca
            sugestii simbolice. Deciziile importante legate de sănătate, bani, relații sau carieră
            trebuie luate pe baza unor informații verificate și, când este cazul, cu ajutor
            specializat.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Disponibilitatea site-ului</h2>
          <p>
            Ne străduim să menținem site-ul rapid și disponibil, dar nu garantăm acces continuu
            sau lipsa totală a erorilor. Putem modifica, suspenda sau elimina funcționalități
            pentru mentenanță, îmbunătățiri sau motive operaționale.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Contact</h2>
          <p>Pentru întrebări despre acești termeni, ne poți contacta la contact@spirithub.ro.</p>
        </section>
      </article>
    </MainLayout>
  );
}
