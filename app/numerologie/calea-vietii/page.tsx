import { Metadata } from "next";
import CaleaVietiiClient from "./client";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { JsonLd } from "@/components/shared/json-ld";
import { FAQSection } from "@/components/shared/faq-section";
import { generateFAQJsonLd } from "@/lib/faq-schema";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";

import { redirect } from "next/navigation";
import { parseISO, isValid } from "date-fns";

export const metadata: Metadata = {
  title: "Calculator Calea Vieții - Numerologie | SpiritHub.ro",
  description: "Calculează numărul Căii Vieții și descoperă scopul și direcția ta în viață. Interpretări detaliate pentru toate numerele de la 1 la 9, 11, 22 și 33.",
  openGraph: {
    title: "Calculator Calea Vieții - Numerologie | SpiritHub.ro",
    description: "Calculează numărul Căii Vieții și descoperă scopul și direcția ta în viață.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Calculator Calea Vieții - SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculator Calea Vieții - Numerologie | SpiritHub.ro",
    description: "Calculează numărul Căii Vieții și descoperă scopul și direcția ta în viață.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.spirithub.ro/numerologie/calea-vietii",
  },
};

// FAQ Content for Calea Vietii
const faqs = [
  {
    question: "Ce este Calea Vieții în numerologie?",
    answer: "Calea Vieții este cel mai important indicator numerologic, calculat din data nașterii. Ea dezvăluie direcția majoră a vieții tale, oportunitățile, provocările și trăsăturile principale de personalitate."
  },
  {
    question: "Cum se calculează Numărul Căii Vieții?",
    answer: "Se adună toate cifrele din data nașterii (zi, lună, an) până se obține un singur digit (1-9), cu excepția numerelor maestre 11, 22 și 33 care nu se reduc. De exemplu, pentru 25.12.1990: 2+5 + 1+2 + 1+9+9+0 = 7 + 3 + 19 (1+9=10=1) = 7+3+1 = 11."
  },
  {
    question: "Ce înseamnă dacă am un Număr Maestru (11, 22, 33)?",
    answer: "Numerele Maestre indică un potențial spiritual ridicat și misiuni de viață speciale. Ele vin cu vibrații mai intense și provocări mai mari, cerând maturitate și conștientizare pentru a fi manifestate pozitiv."
  }
];

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

/**
 * Validation helper
 */
function isDateValid(dateStr?: string): boolean {
  if (!dateStr) return true; // Optional param
  try {
    const date = parseISO(dateStr);
    return isValid(date);
  } catch {
    return false;
  }
}

export default async function CaleaVietiiPage({ searchParams }: PageProps) {
  const { date } = await searchParams;

  // Validate date param on server
  if (date && !isDateValid(date)) {
    redirect("/numerologie/calea-vietii");
  }

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Acasă", url: "https://www.spirithub.ro" },
        { name: "Numerologie", url: "https://www.spirithub.ro/numerologie" },
        { name: "Calea Vieții" }
      ]} />
      <JsonLd data={generateFAQJsonLd(faqs)} />

      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
          <CaleaVietiiClient />
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
