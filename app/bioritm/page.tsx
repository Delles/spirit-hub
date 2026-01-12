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
  title: "Calculator Bioritm | SpiritHub.ro",
  description:
    "Calculează-ți bioritmul zilnic și descoperă ciclurile tale fizice, emoționale și intelectuale.",
  openGraph: {
    title: "Calculator Bioritm | SpiritHub.ro",
    description: "Calculează-ți bioritmul zilnic și descoperă ciclurile tale fizice, emoționale și intelectuale.",
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
    title: "Calculator Bioritm | SpiritHub.ro",
    description: "Calculează-ți bioritmul zilnic și descoperă ciclurile tale fizice, emoționale și intelectuale.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.spirithub.ro/bioritm",
  },
};

// FAQ Content for Bioritm
const faqs = [
  {
    question: "Ce este Bioritmul?",
    answer: "Teoria bioritmurilor susține că viața noastră este guvernată de cicluri biologice ritmice care încep la naștere: ciclul Fizic (23 zile), cel Emoțional (28 zile) și cel Intelectual (33 zile)."
  },
  {
    question: "Cum interpretez graficul bioritmului?",
    answer: "Valorile deasupra liniei mediane (pozitive) indică energie ridicată, optimism și claritate mentală. Valorile sub linie (negative) sugerează perioade de refacere, pasivitate sau instabilitate emoțională."
  },
  {
    question: "Ce este o \"zi critică\" în bioritm?",
    answer: "Zilele critice sunt cele în care curbele intersectează linia mediană (trec de la pozitiv la negativ sau invers). În aceste zile, fluxul energetic este instabil, iar riscul de erori, accidente sau confuzie este ușor mai ridicat."
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
