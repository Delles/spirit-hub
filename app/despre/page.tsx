import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";

export const metadata: Metadata = {
  title: "Despre SpiritHub.ro",
  description:
    "Ce calculează SpiritHub.ro: instrumente gratuite de numerologie, bioritm și texte simbolice zilnice în limba română.",
  alternates: {
    canonical: "https://www.spirithub.ro/despre",
  },
};

export default function DesprePage() {
  return (
    <MainLayout>
      <article className="mx-auto max-w-3xl space-y-8 py-8 text-[#E0E0E0]">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9F2BFF]">SpiritHub.ro</p>
          <h1 className="text-3xl font-bold text-white">Despre</h1>
          <p className="text-lg leading-relaxed">
            SpiritHub.ro oferă calculatoare gratuite de numerologie și bioritm, alături de ghiduri
            și texte de reflecție în limba română.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Ce calculează SpiritHub</h2>
          <p>
            Calculatoarele transformă data nașterii și numele complet în indicatori numerologici:
            Calea Vieții, Anul Personal, Numărul Destinului, Numărul Zilei și compatibilitatea
            numerică. Modulul de bioritm calculează curbele pentru ciclurile fizic de 23 de zile,
            emoțional de 28 de zile și intelectual de 33 de zile, împreună cu zilele de tranziție.
          </p>
          <p>
            Secțiunile zilnice afișează faza lunii, tema simbolică a zilei și un mesaj scurt pentru
            reflecție personală.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Cum funcționează</h2>
          <p>
            Calculele folosesc formule matematice deterministe și texte statice redactate în
            română. Datele introduse nu necesită cont de utilizator și nu sunt folosite pentru a
            construi profiluri personale.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Scop simbolic și limitări</h2>
          <p>
            Numerologia, bioritmul și textele zilnice au caracter simbolic și recreativ. Aceste
            metode nu au bază științifică și nu înlocuiesc sfatul medical, psihologic, financiar sau
            juridic.
          </p>
        </section>
      </article>
    </MainLayout>
  );
}
