import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import NumeDestinClient from "./client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { JsonLd } from "@/components/shared/json-ld";
import { FAQSection } from "@/components/shared/faq-section";
import { generateFAQJsonLd } from "@/lib/faq-schema";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Numărul Destinului - Calculator Numerologie | SpiritHub.ro",
  description:
    "Calculează-ți numărul destinului din numele complet și descoperă-ți misiunea în viață prin numerologie.",
  openGraph: {
    title: "Numărul Destinului - Calculator Numerologie | SpiritHub.ro",
    description:
      "Calculează-ți numărul destinului din numele complet și descoperă-ți misiunea în viață prin numerologie.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Numărul Destinului - SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Numărul Destinului - Calculator Numerologie | SpiritHub.ro",
    description: "Calculează-ți numărul destinului din numele complet și descoperă-ți misiunea în viață.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.spirithub.ro/numerologie/nume-destin",
  },
};

// FAQ Content for Nume Destin
const faqs = [
  {
    question: "Ce reprezintă Numărul Destinului?",
    answer: "Numărul Destinului (sau Numărul Expresiei) este o interpretare simbolică a talentelor, abilităților și felului în care îți exprimi potențialul. Nu este o predicție sau un verdict despre viața ta."
  },
  {
    question: "Cum se calculează Numărul Destinului?",
    answer: "Se folosește tabelul pitagoreic pentru a atribui o cifră fiecărei litere din numele complet de la naștere. Se adună valorile pentru fiecare nume (prenume, nume de familie) și apoi se reduc la o singură cifră sau număr maestru."
  },
  {
    question: "Trebuie să folosesc numele de la naștere sau numele după căsătorie?",
    answer: "Pentru reperul de bază se folosește de obicei numele complet de la naștere. Poți calcula separat și numele actual pentru a compara cele două interpretări, fără a trata rezultatul ca pe un destin fix."
  }
];

export default function NumeDestinPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Acasă", url: "https://www.spirithub.ro" },
        { name: "Numerologie", url: "https://www.spirithub.ro/numerologie" },
        { name: "Numărul Destinului" }
      ]} />
      <JsonLd data={generateFAQJsonLd(faqs)} />

      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
          <NumeDestinClient />
        </Suspense>

        <aside className="container mx-auto px-4 pb-8" aria-labelledby="destiny-guide-title">
          <Card className="mx-auto max-w-4xl p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#9F2BFF]/40 bg-[#9F2BFF]/10">
                  <BookOpen className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="destiny-guide-title" className="mb-1 text-lg font-semibold text-white">
                    Cum se transformă literele numelui în număr?
                  </h2>
                  <p className="text-sm leading-relaxed text-[#E0E0E0]/80">
                    Vezi tabelul 1–9, un exemplu complet și limitele interpretării numerologice.
                  </p>
                </div>
              </div>
              <Link
                href="/ghiduri/cum-se-calculeaza-numarul-destinului"
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
