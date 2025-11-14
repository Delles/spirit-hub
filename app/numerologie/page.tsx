import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Numerologie - SpiritHub.ro",
  description: "Calculează-ți numărul destinului, numărul căii vieții, compatibilitatea și numerele zilnice. Descoperă semnificația numerelor tale personale.",
};

export default function NumerologiePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">Numerologie</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
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
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Numărul Căii Vieții</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Calculează numărul căii vieții bazat pe data nașterii tale
              </p>
              <Button className="w-full" disabled>
                În curând
              </Button>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Numărul Destinului</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Descoperă numărul destinului bazat pe numele tău complet
              </p>
              <Button className="w-full" disabled>
                În curând
              </Button>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Compatibilitate</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Verifică compatibilitatea numerologică cu partenerul tău
              </p>
              <Button className="w-full" disabled>
                În curând
              </Button>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Numere Zilnice</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Obține numerele tale norocoase pentru astăzi
              </p>
              <Button className="w-full" disabled>
                În curând
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

