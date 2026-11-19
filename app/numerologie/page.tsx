import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft, Calculator, Heart, Calendar, CalendarDays, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FAQSection } from "@/components/shared/faq-section";
import { generateFAQJsonLd } from "@/lib/faq-schema";
import { JsonLd } from "@/components/shared/json-ld";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Calculatoare de Numerologie Online | SpiritHub.ro",
  description:
    "Alege dintre 5 calculatoare de numerologie gratuite: calea vieții, anul personal, numărul destinului, compatibilitate și numărul zilei. Rezultate instant, fără cont.",
  alternates: {
    canonical: "https://www.spirithub.ro/numerologie",
  },
  openGraph: {
    title: "Calculatoare de Numerologie Online | SpiritHub.ro",
    description:
      "Calculează gratuit calea vieții, anul personal, numărul destinului, compatibilitatea sau numărul zilei.",
    url: "https://www.spirithub.ro/numerologie",
    type: "website",
    locale: "ro_RO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculatoare de Numerologie Online | SpiritHub.ro",
    description:
      "Calculează gratuit calea vieții, anul personal, numărul destinului, compatibilitatea sau numărul zilei.",
  },
};

// FAQ content for SEO - Romanian
const numerologieFAQs = [
  {
    question: "Ce este numerologia?",
    answer:
      "Numerologia este un sistem simbolic care atribuie semnificații numerelor obținute din data nașterii sau din nume. Poate fi folosită ca exercițiu de reflecție personală, dar nu este o metodă științifică și nu prezice evenimente.",
  },
  {
    question: "Cum se calculează Numărul Căii Vieții?",
    answer:
      "Numărul Căii Vieții se calculează adunând toate cifrele din data nașterii tale până când obții un singur digit (sau un număr master: 11, 22, 33). De exemplu, pentru 15 august 1990: 1+5+8+1+9+9+0 = 33, care este un număr master și rămâne așa.",
  },
  {
    question: "Care este diferența dintre Calea Vieții și Numărul Destinului?",
    answer:
      "Calea Vieții se calculează din data nașterii și este interpretată ca o temă generală de dezvoltare. Numărul Destinului se calculează din numele complet și este folosit pentru a explora simbolic aptitudini, moduri de exprimare și direcții personale.",
  },
  {
    question: "Ce sunt numerele master (11, 22, 33)?",
    answer:
      "În unele școli de numerologie, 11, 22 și 33 sunt păstrate fără reducere la o singură cifră. Interpretările tradiționale le asociază cu intuiția, construcția și responsabilitatea, însă aceste sensuri rămân simbolice.",
  },
];

export default function NumerologiePage() {
  return (
    <>
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={[
        { name: "Acasă", url: "https://www.spirithub.ro" },
        { name: "Numerologie" }
      ]} />
      {/* FAQ Schema for rich results */}
      <JsonLd data={generateFAQJsonLd(numerologieFAQs)} />

      <div className="py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40">
              <Sparkles className="h-8 w-8 text-[#9F2BFF]" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-white">
              Calculatoare de numerologie online
            </h1>
            <p className="text-[#E0E0E0]">
              Alege instrumentul potrivit datelor pe care le ai și primești imediat o interpretare
              clară, în limba română. Nu ai nevoie de cont.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/numerologie/calea-vietii" className="group">
              <Card className="p-6 h-full">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 transition-colors group-hover:bg-[#9F2BFF]/20">
                  <Calculator className="h-6 w-6 text-[#9F2BFF]" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-white">Calea Vieții</h2>
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
                <h2 className="text-xl font-semibold mb-2 text-white">Numărul Destinului</h2>
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
                <h2 className="text-xl font-semibold mb-2 text-white">Compatibilitate</h2>
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
                <h2 className="text-xl font-semibold mb-2 text-white">Numărul Zilei</h2>
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

            <Link href="/numerologie/an-personal" className="group sm:col-span-2">
              <Card className="p-6 h-full">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 transition-colors group-hover:bg-[#9F2BFF]/20">
                  <CalendarDays className="h-6 w-6 text-[#9F2BFF]" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-white">Anul Personal</h2>
                <p className="text-sm text-[#E0E0E0] mb-4">
                  Calculează cifra anului personal pentru 2026, 2027 sau orice alt an și explorează
                  ciclul tău complet de 9 ani pas cu pas
                </p>
                <div className="flex items-center text-sm font-medium text-[#9F2BFF]">
                  Calculează Anul Personal
                  <ArrowLeft
                    className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Card>
            </Link>
          </div>

          <section className="mt-12" aria-labelledby="alege-calculatorul">
            <h2 id="alege-calculatorul" className="mb-4 text-2xl font-semibold text-white">
              Cum alegi calculatorul potrivit
            </h2>
            <div className="space-y-3 text-[#E0E0E0]">
              <p>
                Dacă ai doar data nașterii, începe cu Calea Vieții sau cu Anul Personal pentru a
                vedea tema generală a anului 2026 ori 2027. Pentru Numărul Destinului ai nevoie de
                numele complet, iar calculatorul de compatibilitate folosește numele și datele de
                naștere ale ambelor persoane. Numărul Zilei este instrumentul scurt pentru orientarea
                de astăzi.
              </p>
              <p>
                Rezultatele sunt simbolice și utile pentru reflecție personală. Ele nu înlocuiesc
                decizii medicale, financiare, juridice sau de relație.
              </p>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="ghiduri-numerologie">
            <div className="mb-5 flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-[#9F2BFF]" aria-hidden="true" />
              <h2 id="ghiduri-numerologie" className="text-2xl font-semibold text-white">
                Înțelege cum se calculează rezultatele
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/ghiduri/ce-este-calea-vietii-in-numerologie"
                className="rounded-lg border border-[#9F2BFF]/30 bg-white/5 p-4 text-sm text-[#E0E0E0] transition-colors hover:border-[#9F2BFF]/60 hover:bg-white/10"
              >
                <span className="font-semibold text-white">Calea Vieții</span>
                <span className="mt-2 block">Formula din data nașterii și sensul rezultatului.</span>
              </Link>
              <Link
                href="/ghiduri/ce-este-anul-personal-in-numerologie"
                className="rounded-lg border border-[#9F2BFF]/30 bg-white/5 p-4 text-sm text-[#E0E0E0] transition-colors hover:border-[#9F2BFF]/60 hover:bg-white/10"
              >
                <span className="font-semibold text-white">Anul Personal</span>
                <span className="mt-2 block">Formula fără anul nașterii și ciclul de 9 ani.</span>
              </Link>
              <Link
                href="/ghiduri/cum-se-calculeaza-numarul-destinului"
                className="rounded-lg border border-[#9F2BFF]/30 bg-white/5 p-4 text-sm text-[#E0E0E0] transition-colors hover:border-[#9F2BFF]/60 hover:bg-white/10"
              >
                <span className="font-semibold text-white">Numărul Destinului</span>
                <span className="mt-2 block">Conversia literelor și reducerea numărului final.</span>
              </Link>
              <Link
                href="/ghiduri/compatibilitate-numerologica-interpretare-scor"
                className="rounded-lg border border-[#9F2BFF]/30 bg-white/5 p-4 text-sm text-[#E0E0E0] transition-colors hover:border-[#9F2BFF]/60 hover:bg-white/10"
              >
                <span className="font-semibold text-white">Compatibilitate</span>
                <span className="mt-2 block">Ce intră în scor și cum îl interpretezi realist.</span>
              </Link>
            </div>
          </section>

          {/* FAQ Section for SEO */}
          <div className="mt-12">
            <FAQSection faqs={numerologieFAQs} />
          </div>
        </div>
      </div>
    </>
  );
}
