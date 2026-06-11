import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";

export const metadata: Metadata = {
  title: "Despre SpiritHub.ro",
  description:
    "Află ce este SpiritHub.ro: o platformă românească de numerologie, bioritm și ghidaj zilnic pentru reflecție personală.",
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
            SpiritHub.ro este o platformă românească pentru autocunoaștere, numerologie,
            bioritm și inspirație zilnică.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Misiune</h2>
          <p>
            Construim instrumente simple, rapide și prietenoase care transformă conceptele
            spirituale în momente de reflecție personală. Calculele și interpretările sunt
            oferite pentru inspirație, divertisment și explorare interioară.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Cum funcționează</h2>
          <p>
            Instrumentele SpiritHub folosesc formule numerologice, cicluri de bioritm și texte
            de interpretare scrise în limba română. Datele introduse în calculatoare sunt folosite
            local pentru generarea rezultatului și nu necesită cont de utilizator.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Notă importantă</h2>
          <p>
            Conținutul de pe SpiritHub.ro nu reprezintă sfat medical, psihologic, financiar sau
            juridic. Folosește-l ca punct de pornire pentru reflecție, nu ca înlocuitor pentru
            decizii importante sau consultanță specializată.
          </p>
        </section>
      </article>
    </MainLayout>
  );
}
