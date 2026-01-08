import { Metadata } from "next";
import { Suspense } from "react";
import NumeDestinClient from "./client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { JsonLd } from "@/components/shared/json-ld";
import { FAQSection } from "@/components/shared/faq-section";
import { generateFAQJsonLd } from "@/lib/faq-schema";

export const metadata: Metadata = {
  title: "Numărul Destinului - Calculator Numerologie | SpiritHub.ro",
  description:
    "Calculează-ți numărul destinului din numele complet și descoperă-ți misiunea în viață prin numerologie.",
  openGraph: {
    title: "Numărul Destinului - Calculator Numerologie | SpiritHub.ro",
    description:
      "Calculează-ți numărul destinului din numele complet și descoperă-ți misiunea în viață prin numerologie.",
    type: "website",
  },
  alternates: {
    canonical: "https://spirithub.ro/numerologie/nume-destin",
  },
};

// FAQ Content for Nume Destin
const faqs = [
  {
    question: "Ce reprezintă Numărul Destinului?",
    answer: "Numărul Destinului (sau Numărul Expresiei) arată talentele naturale, abilitățile și potențialul cu care te-ai născut. Este \"trusa de unelte\" pe care o ai la dispoziție pentru a-ți împlini Calea Vieții."
  },
  {
    question: "Cum se calculează Numărul Destinului?",
    answer: "Se folosește tabelul pitagoreic pentru a atribui o cifră fiecărei litere din numele complet de la naștere. Se adună valorile pentru fiecare nume (prenume, nume de familie) și apoi se reduc la o singură cifră sau număr maestru."
  },
  {
    question: "Trebuie să folosesc numele de la naștere sau numele după căsătorie?",
    answer: "Pentru Numărul Destinului, se folosește întotdeauna **numele complet de la naștere**, așa cum apare în certificatul de naștere. Numele dobândit prin căsătorie sau schimbare adaugă o \"vibrație minoră\", dar nu schimbă destinul fundamental."
  }
];

export default function NumeDestinPage() {
  return (
    <>
      <JsonLd data={generateFAQJsonLd(faqs)} />

      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
          <NumeDestinClient />
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
