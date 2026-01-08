import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft, Calculator, Heart, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FAQSection } from "@/components/shared/faq-section";
import { generateFAQJsonLd } from "@/lib/faq-schema";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Numerologie - SpiritHub.ro",
  description:
    "Calculează-ți numărul destinului, numărul căii vieții, compatibilitatea și numerele zilnice. Descoperă semnificația numerelor tale personale.",
  alternates: {
    canonical: "https://spirithub.ro/numerologie",
  },
};

// FAQ content for SEO - Romanian
const numerologieFAQs = [
  {
    question: "Ce este numerologia?",
    answer:
      "Numerologia este studiul semnificațiilor mistice ale numerelor și al influenței lor asupra vieții umane. Această practică străveche consideră că fiecare număr poartă o vibrație unică ce influențează personalitatea, destinul și evenimentele din viața noastră.",
  },
  {
    question: "Cum se calculează Numărul Căii Vieții?",
    answer:
      "Numărul Căii Vieții se calculează adunând toate cifrele din data nașterii tale până când obții un singur digit (sau un număr master: 11, 22, 33). De exemplu, pentru 15 august 1990: 1+5+8+1+9+9+0 = 33, care este un număr master și rămâne așa.",
  },
  {
    question: "Care este diferența dintre Calea Vieții și Numărul Destinului?",
    answer:
      "Calea Vieții reflectă traseul tău de viață și lecțiile pe care ai venit să le înveți, fiind calculată din data nașterii. Numărul Destinului reprezintă misiunea ta și talentele cu care te-ai născut, fiind calculat din numele complet.",
  },
  {
    question: "Ce sunt numerele master (11, 22, 33)?",
    answer:
      "Numerele master sunt numere speciale în numerologie care nu se reduc la un singur digit. Ele poartă vibrații mai puternice și indică un potențial spiritual sau misiune de viață mai intensă. 11 este maestrul intuiției, 22 este maestrul constructor, iar 33 este maestrul învățător.",
  },
];

export default function NumerologiePage() {
  return (
    <>
      {/* FAQ Schema for rich results */}
      <JsonLd data={generateFAQJsonLd(numerologieFAQs)} />

      <div className="py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40">
              <Sparkles className="h-8 w-8 text-[#9F2BFF]" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-white">Calculatoare Numerologie</h1>
            <p className="text-[#E0E0E0]">
              Descoperă semnificația numerelor tale personale și cum influențează destinul tău
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/numerologie/calea-vietii" className="group">
              <Card className="p-6 h-full">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 transition-colors group-hover:bg-[#9F2BFF]/20">
                  <Calculator className="h-6 w-6 text-[#9F2BFF]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Calea Vieții</h3>
                <p className="text-sm text-[#E0E0E0] mb-4">
                  Descoperă-ți numărul Căii Vieții din data nașterii și înțelege-ți scopul și direcția
                  în viață
                </p>
                <div className="flex items-center text-sm font-medium text-[#9F2BFF]">
                  Calculează acum
                  <ArrowLeft
                    className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Card>
            </Link>

            <Link href="/numerologie/nume-destin" className="group">
              <Card className="p-6 h-full">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 transition-colors group-hover:bg-[#9F2BFF]/20">
                  <Sparkles className="h-6 w-6 text-[#9F2BFF]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Numărul Destinului</h3>
                <p className="text-sm text-[#E0E0E0] mb-4">
                  Calculează-ți numărul destinului din numele complet și descoperă-ți misiunea în
                  viață
                </p>
                <div className="flex items-center text-sm font-medium text-[#9F2BFF]">
                  Calculează acum
                  <ArrowLeft
                    className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Card>
            </Link>

            <Link href="/numerologie/compatibilitate" className="group">
              <Card className="p-6 h-full">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 transition-colors group-hover:bg-[#9F2BFF]/20">
                  <Heart className="h-6 w-6 text-[#9F2BFF]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Compatibilitate</h3>
                <p className="text-sm text-[#E0E0E0] mb-4">
                  Verifică compatibilitatea numerologică între două persoane folosind numele și datele
                  de naștere
                </p>
                <div className="flex items-center text-sm font-medium text-[#9F2BFF]">
                  Calculează acum
                  <ArrowLeft
                    className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Card>
            </Link>

            <Link href="/numerologie/numar-zilnic" className="group">
              <Card className="p-6 h-full">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 transition-colors group-hover:bg-[#9F2BFF]/20">
                  <Calendar className="h-6 w-6 text-[#9F2BFF]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Numărul Zilei</h3>
                <p className="text-sm text-[#E0E0E0] mb-4">
                  Descoperă numărul zilei de astăzi și primește îndrumări numerologice pentru ziua
                  curentă
                </p>
                <div className="flex items-center text-sm font-medium text-[#9F2BFF]">
                  Vezi numărul zilei
                  <ArrowLeft
                    className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Card>
            </Link>
          </div>

          {/* FAQ Section for SEO */}
          <div className="mt-12">
            <FAQSection faqs={numerologieFAQs} />
          </div>
        </div>
      </div>
    </>
  );
}
