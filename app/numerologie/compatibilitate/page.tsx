import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import CompatibilitateClient from "./client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { parseISO, isValid } from "date-fns";
import { JsonLd } from "@/components/shared/json-ld";
import { FAQSection } from "@/components/shared/faq-section";
import { generateFAQJsonLd } from "@/lib/faq-schema";

export const metadata: Metadata = {
  title: "Compatibilitate Numerologică | SpiritHub.ro",
  description:
    "Verifică compatibilitatea numerologică între două persoane folosind numele și datele de naștere. Descoperă cât de bine vă potriviți din punct de vedere numerologic.",
  openGraph: {
    title: "Compatibilitate Numerologică | SpiritHub.ro",
    description:
      "Verifică compatibilitatea numerologică între două persoane folosind numele și datele de naștere.",
    type: "website",
  },
  alternates: {
    canonical: "https://spirithub.ro/numerologie/compatibilitate",
  },
};

// FAQ Content for Compatibilitate
const faqs = [
  {
    question: "Cum funcționează compatibilitatea numerologică?",
    answer: "Compatibilitatea analizează armonia dintre numerele Căii Vieții și/sau ale Destinului a două persoane. Ea arată punctele forte ale relației, potențialele fricțiuni și lecțiile pe care cei doi le au de învățat împreună."
  },
  {
    question: "Există numere \"incompatibile\"?",
    answer: "În numerologie, nu există incompatibilitate totală. Anumite combinații necesită mai multă muncă, înțelegere și compromis (de exemplu 4 și 5), în timp ce altele curg mai natural (de exemplu 3 și 5). Orice relație poate funcționa cu conștientizare."
  },
  {
    question: "Ce se întâmplă dacă avem același număr al Căii Vieții?",
    answer: "A avea același număr indică o înțelegere profundă reciprocă, deoarece vedeți lumea similar. Totuși, poate duce și la lipsă de echilibru sau plictiseală dacă nu vă stimulați reciproc să creșteți."
  }
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
