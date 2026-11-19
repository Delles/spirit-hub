import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Activity, ArrowLeft, BookOpen, Calculator, Heart } from "lucide-react";
import BiorhythmCompatibilityClient from "./client";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";
import { FAQSection } from "@/components/shared/faq-section";
import { JsonLd } from "@/components/shared/json-ld";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Card } from "@/components/ui/card";
import { generateFAQJsonLd, type FAQItem } from "@/lib/faq-schema";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Calculator Compatibilitate Bioritm – Fizic, Emoțional, Intelectual | SpiritHub.ro",
  description:
    "Calculează compatibilitatea bioritmului între două date de naștere. Vezi procentul de sincronizare fizică, emoțională și intelectuală instant, gratuit și fără cont.",
  keywords: [
    "compatibilitate bioritm",
    "calculator compatibilitate bioritm",
    "bioritm cuplu",
    "sincronizare bioritm",
    "bioritm fizic emotional intelectual",
  ],
  alternates: {
    canonical: "https://www.spirithub.ro/bioritm/compatibilitate",
  },
  openGraph: {
    title: "Calculator Compatibilitate Bioritm – Fizic, Emoțional, Intelectual | SpiritHub.ro",
    description:
      "Calculează compatibilitatea bioritmului între două date de naștere. Vezi procentul de sincronizare fizică, emoțională și intelectuală instant, gratuit și fără cont.",
    url: "https://www.spirithub.ro/bioritm/compatibilitate",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Calculator Compatibilitate Bioritm | SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculator Compatibilitate Bioritm – Fizic, Emoțional, Intelectual | SpiritHub.ro",
    description:
      "Calculează compatibilitatea bioritmului între două date de naștere. Vezi procentul de sincronizare fizică, emoțională și intelectuală instant, gratuit și fără cont.",
    images: ["/og-image.jpg"],
  },
};

const faqs: FAQItem[] = [
  {
    question: "Cum se calculează compatibilitatea bioritmului?",
    answer:
      "Calculatorul măsoară diferența exactă în zile calendaristice dintre cele două date de naștere și aplică formula |cos(π × diferența de zile / durata ciclului)| pentru ciclul fizic de 23 de zile, ciclul emoțional de 28 de zile și ciclul intelectual de 33 de zile. Scorul general este media rotunjită a celor trei valori.",
  },
  {
    question: "De ce o diferență de 14 zile arată 0% la ciclul emoțional, iar 28 de zile 100%?",
    answer:
      "Ciclul emoțional durează 28 de zile. La 14 zile distanță, unghiul π × 14 / 28 devine π / 2, iar cos(π / 2) este 0, ceea ce indică faze complet decalate (0%). La 28 de zile distanță, cos(π × 28 / 28) are modulul 1, deci rezultă 100% sincronizare de fază.",
  },
  {
    question: "Contează ordinea în care introduc cele două date de naștere?",
    answer:
      "Nu. Calculul depinde doar de diferența absolută în zile dintre cele două date de naștere, așa că rezultatul rămâne identic indiferent de ordinea introducerii.",
  },
  {
    question: "Compatibilitatea bioritmului este o metodă științifică sau o predicție?",
    answer:
      "Nu. Bioritmul este un model simbolic și matematic de reflecție personală, nu o metodă științifică validată și nu o predicție despre succesul unei relații.",
  },
];

export default function BiorhythmCompatibilityPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Acasă", url: "https://www.spirithub.ro" },
          { name: "Bioritm", url: "https://www.spirithub.ro/bioritm" },
          { name: "Compatibilitate" },
        ]}
      />
      <JsonLd data={generateFAQJsonLd(faqs)} />

      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
          <BiorhythmCompatibilityClient />
        </Suspense>

        <section
          className="mx-auto w-full max-w-4xl space-y-6 pb-10"
          aria-labelledby="biorhythm-compat-methodology"
        >
          <Card className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#9F2BFF]/40 bg-[#9F2BFF]/10">
                <Calculator className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
              </div>
              <h2
                id="biorhythm-compat-methodology"
                className="text-xl font-semibold text-white"
              >
                Cum funcționează calculul compatibilității bioritmului
              </h2>
            </div>

            <div className="space-y-3 text-sm leading-relaxed text-[#E0E0E0]/85">
              <p>
                Pentru fiecare dintre cele trei cicluri clasice (23 de zile pentru ciclul fizic,
                28 de zile pentru ciclul emoțional și 33 de zile pentru ciclul intelectual),
                calculatorul determină mai întâi diferența exactă în zile calendaristice dintre cele
                două date de naștere, apoi aplică formula{" "}
                <span className="font-mono text-white">
                  |cos(π × diferența de zile / durata ciclului)|
                </span>{" "}
                exprimată în procente de la 0% la 100%. Scorul general este media rotunjită a celor
                trei cicluri.
              </p>
              <p>
                <strong className="text-white">Exemplu concret:</strong> două persoane născute la
                14 zile distanță au o sincronizare emoțională de 0%, deoarece 14 zile reprezintă
                exact jumătate din ciclul de 28 de zile, iar{" "}
                <span className="font-mono text-white">|cos(π × 14 / 28)| = 0</span> (ritmuri
                decalate complementar). În schimb, o diferență de 28 de zile produce{" "}
                <span className="font-mono text-white">|cos(π × 28 / 28)| = 1</span>, adică 100%
                aliniere de fază pentru ciclul emoțional.
              </p>
              <p>
                <strong className="text-white">Limită de interpretare:</strong> acest calculator
                este un instrument simbolic de reflecție și dialog. Nu reprezintă o metodă
                științifică, un test psihologic sau o garanție privind evoluția unei relații.
              </p>
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="text-xl font-semibold text-white">Continuă explorarea pe SpiritHub</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link href="/bioritm" className="group">
                <div className="flex h-full flex-col justify-between rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                  <div className="space-y-2">
                    <Activity className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-white">Calculator Bioritm</h3>
                    <p className="text-xs leading-relaxed text-[#E0E0E0]/75">
                      Vezi curbele fizică, emoțională și intelectuală pentru azi și 7 zile.
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-[#A5B4FC] group-hover:text-white">
                    Deschide
                    <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                  </span>
                </div>
              </Link>

              <Link href="/numerologie/compatibilitate" className="group">
                <div className="flex h-full flex-col justify-between rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                  <div className="space-y-2">
                    <Heart className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-white">
                      Compatibilitate Numerologică
                    </h3>
                    <p className="text-xs leading-relaxed text-[#E0E0E0]/75">
                      Compară Calea Vieții și Numărul Destinului din nume și data nașterii.
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-[#A5B4FC] group-hover:text-white">
                    Deschide
                    <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                  </span>
                </div>
              </Link>

              <Link href="/ghiduri/ce-este-bioritmul" className="group">
                <div className="flex h-full flex-col justify-between rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                  <div className="space-y-2">
                    <BookOpen className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-white">Ce este bioritmul?</h3>
                    <p className="text-xs leading-relaxed text-[#E0E0E0]/75">
                      Citește ghidul complet despre ciclurile de 23, 28 și 33 de zile.
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-[#A5B4FC] group-hover:text-white">
                    Citește ghidul
                    <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </div>
          </Card>

          <FAQSection faqs={faqs} />
        </section>
      </div>
    </>
  );
}
