import { Metadata } from "next";
import NumarZilnicClient from "./client";
import { JsonLd } from "@/components/shared/json-ld";
import { FAQSection } from "@/components/shared/faq-section";
import { generateFAQJsonLd } from "@/lib/faq-schema";

// Static page - daily content computed client-side via DailyContentProvider
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Numărul Zilei - Numerologie Zilnică | SpiritHub.ro",
  description:
    "Descoperă numărul zilei de astăzi și primește îndrumări numerologice pentru ziua curentă. Fiecare zi aduce o energie nouă și perspective fresh.",
  openGraph: {
    title: "Numărul Zilei - Numerologie Zilnică | SpiritHub.ro",
    description:
      "Descoperă numărul zilei de astăzi și primește îndrumări numerologice pentru ziua curentă.",
    type: "website",
  },
  alternates: {
    canonical: "https://spirithub.ro/numerologie/numar-zilnic",
  },
};

// FAQ Content for Numar Zilnic
const faqs = [
  {
    question: "Ce este Numărul Zilei?",
    answer: "Numărul Zilei indică vibrația și energia specifică a zilei curente. Te ajută să știi la ce să te aștepți și cum să îți planifici activitățile pentru a fi în flux cu universul (ex: o zi de 1 e bună pentru începuturi, o zi de 9 pentru finalizări)."
  },
  {
    question: "Cum mă influențează energia zilei?",
    answer: "Energia zilei \"colorează\" experiențele tale. Dacă ești într-o zi guvernată de numărul 5, te poți aștepta la schimbări și surprize; într-o zi de 6, accentul va fi pe familie și responsabilități."
  },
  {
    question: "Se schimbă semnificația numărului de la o zi la alta?",
    answer: "Semnificația de bază a numărului (1-9) rămâne aceeași, dar contextul se schimbă zilnic. Interpretarea depinde de combinația dintre energia zilei, a lunii și anul personal."
  }
];

export default function NumarZilnicPage() {
  return (
    <>
      <JsonLd data={generateFAQJsonLd(faqs)} />

      <div className="flex flex-col min-h-screen">
        <NumarZilnicClient />

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
