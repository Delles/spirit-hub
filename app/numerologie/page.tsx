import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft, Calculator, Heart, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Numerologie - SpiritHub.ro",
  description:
    "Calculează-ți numărul destinului, numărul căii vieții, compatibilitatea și numerele zilnice. Descoperă semnificația numerelor tale personale.",
  alternates: {
    canonical: "https://spirithub.ro/numerologie",
  },
};

export default function NumerologiePage() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40">
            <Sparkles className="h-8 w-8 text-[#9F2BFF]" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">Calculatoare Numerologie</h2>
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
      </div>
    </div>
  );
}
