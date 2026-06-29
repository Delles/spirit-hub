import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import CompatibilitateClient from "./client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Card } from "@/components/ui/card";
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

        <aside className="container mx-auto px-4 pb-8" aria-labelledby="compatibility-guide-title">
          <Card className="mx-auto max-w-4xl p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#9F2BFF]/40 bg-[#9F2BFF]/10">
                  <BookOpen className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="compatibility-guide-title" className="mb-1 text-lg font-semibold text-white">
                    Cum se calculează și se interpretează scorul?
                  </h2>
                  <p className="text-sm leading-relaxed text-[#E0E0E0]/80">
                    Ghidul explică rolul numelor, al datelor de naștere și limitele procentului afișat.
                  </p>
                </div>
              </div>
              <Link
                href="/ghiduri/compatibilitate-numerologica-interpretare-scor"
                className="inline-flex shrink-0 items-center justify-center rounded-md border border-[#9F2BFF]/50 px-4 py-2 text-sm font-medium text-[#A5B4FC] transition-colors hover:bg-[#9F2BFF]/10 hover:text-white"
              >
                Citește ghidul
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </Card>
        </aside>

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
