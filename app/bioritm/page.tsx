import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BioritmClient from "./client";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/shared/json-ld";
import { FAQSection } from "@/components/shared/faq-section";
import { generateFAQJsonLd } from "@/lib/faq-schema";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";

// Force static generation - client handles URL params
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Calcul Bioritm Personal – Grafic 7 Zile | SpiritHub.ro",
  description:
    "Introdu data nașterii și vezi graficul ciclurilor fizic, emoțional și intelectual pentru azi și următoarele 7 zile. Gratuit, fără cont.",
  keywords: [
    "bioritm calcul",
    "calculator bioritm",
    "bioritm online",
    "calcul bioritm",
    "bioritm personal",
    "calcul bioritm zilnic",
    "calculator bioritm online",
    "zile critice bioritm",
  ],
  openGraph: {
    title: "Calcul Bioritm Personal – Grafic 7 Zile | SpiritHub.ro",
    description:
      "Introdu data nașterii și vezi graficul ciclurilor fizic, emoțional și intelectual pentru azi și următoarele 7 zile.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Calcul Bioritm Personal - Grafic 7 Zile | SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calcul Bioritm Personal – Grafic 7 Zile | SpiritHub.ro",
    description:
      "Vezi graficul bioritmului fizic, emoțional și intelectual pentru azi și următoarele 7 zile.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.spirithub.ro/bioritm",
  },
};

// FAQ Content for Bioritm
const faqs = [
  {
    question: "Cum fac un calcul de bioritm personal?",
    answer:
      "Introdu data nașterii și data pentru care vrei calculul. Calculatorul folosește ciclul fizic de 23 de zile, ciclul emoțional de 28 de zile și ciclul intelectual de 33 de zile pentru a estima energia zilei."
  },
  {
    question: "Ce înseamnă bioritm fizic, emoțional și intelectual?",
    answer:
      "Bioritmul fizic este asociat cu vitalitatea și efortul, cel emoțional cu dispoziția și sensibilitatea, iar cel intelectual cu atenția și claritatea mentală."
  },
  {
    question: "Ce este o zi critică în bioritm?",
    answer:
      "O zi critică apare când unul dintre cicluri trece prin linia de echilibru. Interpretarea sugerează o zi de tranziție, în care merită să fii mai atent la decizii, efort și reacții."
  }
];

export default function BioritmPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Acasă", url: "https://www.spirithub.ro" },
        { name: "Bioritm" }
      ]} />
      <JsonLd data={generateFAQJsonLd(faqs)} />

      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
          <BioritmClient />
        </Suspense>

        <section
          className="container mx-auto px-4 pb-8"
          aria-labelledby="bioritm-resources-heading"
        >
          <div className="mx-auto max-w-4xl">
            <Card className="space-y-4 p-6">
              <div className="space-y-1">
                <h2 id="bioritm-resources-heading" className="text-xl font-semibold text-white">
                  Instrumente și ghiduri pentru bioritm
                </h2>
                <p className="text-sm text-[#E0E0E0]/80">
                  Compară ciclurile cu altă persoană sau aprofundează modul de calcul al fazelor și
                  al zilelor critice.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/bioritm/compatibilitate"
                  className="group rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#A5B4FC]">
                    Compatibilitate bioritm
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#E0E0E0]/75">
                    Compară două date de naștere pe ciclurile fizic, emoțional și intelectual.
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-[#9F2BFF]">
                    Deschide calculatorul
                    <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                  </span>
                </Link>

                <Link
                  href="/ghiduri/ce-este-bioritmul"
                  className="group rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#A5B4FC]">
                    Ce este bioritmul?
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#E0E0E0]/75">
                    Explică formula sinusoidală pentru ciclurile de 23, 28 și 33 de zile.
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-[#9F2BFF]">
                    Citește ghidul
                    <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                  </span>
                </Link>

                <Link
                  href="/ghiduri/zile-critice-in-bioritm"
                  className="group rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#A5B4FC]">
                    Zile critice în bioritm
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#E0E0E0]/75">
                    Află cum se calculează trecerile prin zero și cum le abordezi calm.
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-[#9F2BFF]">
                    Citește ghidul
                    <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                  </span>
                </Link>

                <Link
                  href="/ghiduri/energia-zilei-cum-sa-o-folosesti"
                  className="group rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#A5B4FC]">
                    Energia zilei: cum să o folosești
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#E0E0E0]/75">
                    Combină ritmul personal din bioritm cu tema simbolică a zilei curente.
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-[#9F2BFF]">
                    Citește ghidul
                    <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            <FAQSection faqs={faqs} />
          </div>
        </div>
      </div>
    </>
  );
}
