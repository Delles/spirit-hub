import { Metadata } from "next";
import BioritmClient from "./client";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { JsonLd } from "@/components/shared/json-ld";
import { FAQSection } from "@/components/shared/faq-section";
import { generateFAQJsonLd } from "@/lib/faq-schema";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";

// Force static generation - client handles URL params
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Calculator Bioritm Online Gratuit | SpiritHub.ro",
  description:
    "Introdu data nașterii și calculează gratuit bioritmul de azi. Vezi instant ciclurile fizic, emoțional și intelectual, plus zilele critice.",
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
    title: "Calculator Bioritm Online Gratuit | SpiritHub.ro",
    description:
      "Calculează bioritmul personal de azi din data nașterii: fizic, emoțional, intelectual și zile critice.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Calculator Bioritm - SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculator Bioritm Online Gratuit | SpiritHub.ro",
    description:
      "Află bioritmul personal de azi: ciclul fizic, emoțional, intelectual și zile critice.",
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
