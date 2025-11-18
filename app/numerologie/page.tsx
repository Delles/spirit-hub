import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft, Calculator, Heart, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Numerologie - SpiritHub.ro",
  description:
    "Calculează-ți numărul destinului, numărul căii vieții, compatibilitatea și numerele zilnice. Descoperă semnificația numerelor tale personale.",
};

export default function NumerologiePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Calculatoare Numerologie</h2>
          <p className="text-muted-foreground">
            Descoperă semnificația numerelor tale personale și cum influențează destinul tău
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/numerologie/calea-vietii"
            className="group rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(159,43,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Calculator className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Calea Vieții</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Descoperă-ți numărul Căii Vieții din data nașterii și înțelege-ți scopul și direcția
              în viață
            </p>
            <div className="flex items-center text-sm font-medium text-primary">
              Calculează acum
              <ArrowLeft
                className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </Link>

          <Link
            href="/numerologie/nume-destin"
            className="group rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(159,43,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Numărul Destinului</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Calculează-ți numărul destinului din numele complet și descoperă-ți misiunea în
              viață
            </p>
            <div className="flex items-center text-sm font-medium text-primary">
              Calculează acum
              <ArrowLeft
                className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </Link>

          <Link
            href="/numerologie/compatibilitate"
            className="group rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(159,43,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Compatibilitate</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Verifică compatibilitatea numerologică între două persoane folosind numele și datele
              de naștere
            </p>
            <div className="flex items-center text-sm font-medium text-primary">
              Calculează acum
              <ArrowLeft
                className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </Link>

          <Link
            href="/numerologie/numar-zilnic"
            className="group rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(159,43,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Calendar className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Numărul Zilei</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Descoperă numărul zilei de astăzi și primește îndrumări numerologice pentru ziua
              curentă
            </p>
            <div className="flex items-center text-sm font-medium text-primary">
              Vezi numărul zilei
              <ArrowLeft
                className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
