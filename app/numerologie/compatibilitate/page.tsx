import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import CompatibilitateClient from "./client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { parseISO, isValid } from "date-fns";
import { JsonLd } from "@/components/shared/json-ld";
import { FAQSection } from "@/components/shared/faq-section";
import { generateFAQJsonLd } from "@/lib/faq-schema";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Calculator Compatibilitate Numerologică | SpiritHub.ro",
  description:
    "Calculează compatibilitatea numerologică pentru două persoane folosind numele complete și datele de naștere. Primești scor și interpretare rapidă online.",
  openGraph: {
    title: "Calculator Compatibilitate Numerologică | SpiritHub.ro",
    description:
      "Calculează compatibilitatea numerologică pentru două persoane folosind numele complete și datele de naștere.",
    type: "website",
    url: "https://www.spirithub.ro/numerologie/compatibilitate",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Calculator compatibilitate numerologică - SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculator Compatibilitate Numerologică | SpiritHub.ro",
    description:
      "Calculează compatibilitatea numerologică folosind numele și datele de naștere.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.spirithub.ro/numerologie/compatibilitate",
  },
};

// FAQ Content for Compatibilitate
const faqs = [
  {
    question: "Cum funcționează calculatorul de compatibilitate numerologică?",
    answer:
      "Calculatorul compară pentru două persoane numărul Căii Vieții, calculat din data nașterii, și Numărul Destinului, calculat din numele complet. Rezultatul combină aceste două potriviri într-un scor general și o interpretare a dinamicii relației.",
  },
  {
    question: "De ce sunt necesare numele și datele de naștere?",
    answer:
      "Data nașterii este folosită pentru Calea Vieții, iar numele complet este folosit pentru Numărul Destinului. Împreună, aceste valori oferă o imagine mai echilibrată decât un calcul bazat pe o singură cifră.",
  },
  {
    question: "Rezultatul arată dacă o relație va funcționa?",
    answer:
      "Nu. Compatibilitatea numerologică este o interpretare simbolică, nu o predicție sau o garanție. Scorul poate evidenția puncte de armonie, diferențe și teme de comunicare, dar relația depinde de alegeri, maturitate și contextul real al celor doi.",
  },
];

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CompatibilitatePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const name1 = typeof params.name1 === "string" ? params.name1 : undefined;
  const date1 = typeof params.date1 === "string" ? params.date1 : undefined;
  const name2 = typeof params.name2 === "string" ? params.name2 : undefined;
  const date2 = typeof params.date2 === "string" ? params.date2 : undefined;

  // Server-side validation: if we have any params but they're incomplete or invalid, redirect to clean URL
  const hasAnyParams = !!(name1 || date1 || name2 || date2);
  const hasAllParams = !!(name1 && date1 && name2 && date2);

  if (hasAnyParams) {
    // Case 1: Incomplete params (not all 4 present)
    if (!hasAllParams) {
      redirect("/numerologie/compatibilitate");
    }

    // Case 2: All params present but dates are invalid
    const parsedDate1 = parseISO(date1!);
    const parsedDate2 = parseISO(date2!);
    if (!isValid(parsedDate1) || !isValid(parsedDate2)) {
      redirect("/numerologie/compatibilitate");
    }

    // Case 3: Names are empty after trimming
    if (!name1!.trim() || !name2!.trim()) {
      redirect("/numerologie/compatibilitate");
    }
  }

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Acasă", url: "https://www.spirithub.ro" },
        { name: "Numerologie", url: "https://www.spirithub.ro/numerologie" },
        { name: "Compatibilitate" }
      ]} />
      <JsonLd data={generateFAQJsonLd(faqs)} />

      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
          <CompatibilitateClient />
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
