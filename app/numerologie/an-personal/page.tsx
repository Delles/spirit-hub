import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Activity, ArrowLeft, BookOpen, Calculator } from "lucide-react";
import PersonalYearClient from "./client";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";
import { FAQSection } from "@/components/shared/faq-section";
import { JsonLd } from "@/components/shared/json-ld";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Card } from "@/components/ui/card";
import { generateFAQJsonLd, type FAQItem } from "@/lib/faq-schema";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Calculator An Personal 2027 - Numerologie | SpiritHub.ro",
  description:
    "Calculează gratuit Anul tău Personal pentru 2026, 2027 sau orice alt an din data nașterii. Vezi formula pas cu pas, ciclul de 9 ani și interpretarea completă în română.",
  keywords: [
    "an personal 2027",
    "calculator an personal",
    "calcul an personal",
    "cifra anului personal",
    "an personal numerologie",
  ],
  alternates: {
    canonical: "https://www.spirithub.ro/numerologie/an-personal",
  },
  openGraph: {
    title: "Calculator An Personal 2027 - Numerologie | SpiritHub.ro",
    description:
      "Calculează gratuit Anul tău Personal pentru 2026, 2027 sau orice alt an din data nașterii. Vezi formula pas cu pas, ciclul de 9 ani și interpretarea completă în română.",
    url: "https://www.spirithub.ro/numerologie/an-personal",
    type: "website",
    locale: "ro_RO",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Calculator An Personal 2027 - SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculator An Personal 2027 - Numerologie | SpiritHub.ro",
    description:
      "Calculează gratuit Anul tău Personal pentru 2026, 2027 sau orice alt an din data nașterii. Vezi formula pas cu pas, ciclul de 9 ani și interpretarea completă în română.",
    images: ["/og-image.jpg"],
  },
};

const faqs: FAQItem[] = [
  {
    question: "Cum se calculează Anul Personal?",
    answer:
      "Se adună cifrele din ziua nașterii, luna nașterii și anul țintă analizat, iar suma obținută se reduce strict la o singură cifră de la 1 la 9. Spre deosebire de Calea Vieții, anul nașterii nu intră în calcul și numerele 11, 22 sau 33 se reduc la 2, 4 și 6.",
  },
  {
    question: "De ce nu se folosește anul nașterii la Anul Personal?",
    answer:
      "Anul nașterii definește Calea Vieții, care rămâne constantă toată viața. Anul Personal urmărește etapa actuală din ciclul de 9 ani raportată la un an calendaristic concret, motiv pentru care înlocuiește anul nașterii cu anul țintă.",
  },
  {
    question: "Care este Anul Universal pentru 2027?",
    answer:
      "Pentru 2027 se adună cifrele anului: 2 + 0 + 2 + 7 = 11, apoi 1 + 1 = 2. Anul Universal 2027 este 2, asociat simbolic cu răbdarea, colaborarea și consolidarea.",
  },
  {
    question: "Anul Personal este o metodă științifică sau o predicție sigură?",
    answer:
      "Nu. Numerologia este un sistem simbolic de reflecție și organizare a priorităților, nu o metodă științifică și nu o garanție privind evenimentele viitoare.",
  },
];

export default function PersonalYearPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Acasă", url: "https://www.spirithub.ro" },
          { name: "Numerologie", url: "https://www.spirithub.ro/numerologie" },
          { name: "Anul Personal" },
        ]}
      />
      <JsonLd data={generateFAQJsonLd(faqs)} />

      <div className="flex min-h-screen flex-col">
        <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
          <PersonalYearClient />
        </Suspense>

        <section
          className="mx-auto w-full max-w-4xl space-y-6 pb-10"
          aria-labelledby="personal-year-methodology"
        >
          <Card className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#9F2BFF]/40 bg-[#9F2BFF]/10">
                <Calculator className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
              </div>
              <h2
                id="personal-year-methodology"
                className="text-xl font-semibold text-white"
              >
                Cum se calculează Anul Personal
              </h2>
            </div>

            <div className="space-y-3 text-sm leading-relaxed text-[#E0E0E0]/85">
              <p>
                Formula folosește trei componente:{" "}
                <span className="font-semibold text-white">ziua nașterii + luna nașterii + anul țintă</span>.
                Anul nașterii nu este inclus în calcul, deoarece el aparține Căii Vieții, indicator
                care rămâne neschimbat, în timp ce Anul Personal arată tema simbolică a fiecărui an
                calendaristic din ciclul de 9 ani. Suma obținută se reduce strict până la o cifră
                cuprinsă între 1 și 9.
              </p>
              <p>
                <strong className="text-white">Anul Universal 2027:</strong> cifrele lui 2027 se
                adună astfel:{" "}
                <span className="font-mono text-white">2 + 0 + 2 + 7 = 11 → 1 + 1 = 2</span>. Anul
                Universal 2 este fundalul general peste care se așază cifra ta personală.
              </p>
              <p>
                <strong className="text-white">Exemplu pentru 14 iulie în 2027:</strong> ziua{" "}
                <span className="font-mono text-white">1 + 4 = 5</span>, luna{" "}
                <span className="font-mono text-white">7</span>, anul 2027{" "}
                <span className="font-mono text-white">2 + 0 + 2 + 7 = 11</span>. Suma este{" "}
                <span className="font-mono text-white">5 + 7 + 11 = 23 → 2 + 3 = 5</span>, deci
                rezultă <strong className="text-white">Anul Personal 5</strong>.
              </p>
              <p>
                <strong className="text-white">Limită de interpretare:</strong> acest calculator
                are rol simbolic de reflecție personală și planificare orientativă. Numerologia nu
                este o metodă științifică și nu înlocuiește deciziile profesionale, financiare sau
                medicale.
              </p>
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="text-xl font-semibold text-white">Continuă explorarea pe SpiritHub</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link href="/numerologie/calea-vietii" className="group">
                <div className="flex h-full flex-col justify-between rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                  <div className="space-y-2">
                    <Calculator className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-white">Calea Vieții</h3>
                    <p className="text-xs leading-relaxed text-[#E0E0E0]/75">
                      Calculează tema generală de parcurs din data completă a nașterii.
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-[#A5B4FC] group-hover:text-white">
                    Deschide
                    <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                  </span>
                </div>
              </Link>

              <Link href="/bioritm" className="group">
                <div className="flex h-full flex-col justify-between rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                  <div className="space-y-2">
                    <Activity className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-white">Calculator Bioritm</h3>
                    <p className="text-xs leading-relaxed text-[#E0E0E0]/75">
                      Vezi curbele fizică, emoțională și intelectuală pentru azi și 7 zile.
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-[#A5B4FC] group-hover:text-white">
                    Deschide
                    <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                  </span>
                </div>
              </Link>

              <Link href="/ghiduri/ce-este-anul-personal-in-numerologie" className="group">
                <div className="flex h-full flex-col justify-between rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                  <div className="space-y-2">
                    <BookOpen className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-white">
                      Ghid Anul Personal
                    </h3>
                    <p className="text-xs leading-relaxed text-[#E0E0E0]/75">
                      Citește explicația completă a etapelor 1 la 9 și a Anului Universal 2027.
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-[#A5B4FC] group-hover:text-white">
                    Citește ghidul
                    <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </div>
          </Card>

          <FAQSection faqs={faqs} />
        </section>
      </div>
    </>
  );
}
