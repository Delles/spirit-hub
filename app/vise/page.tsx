import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, ArrowLeft, Search } from "lucide-react";

export const metadata = {
  title: "Interpretare Vise - SpiritHub.ro",
  description: "Dicționar complet de interpretare vise cu peste 500 de simboluri onirice explicate. Caută semnificația viselor tale.",
};

export default function VisePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]" aria-label="Înapoi la pagina principală">
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">Interpretare Vise</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Moon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Dicționar de Interpretare Vise</h2>
            <p className="text-muted-foreground mb-6">
              Peste 500 de simboluri onirice explicate. Caută semnificația viselor tale
            </p>

            {/* Search Bar */}
            <div className="relative mb-8">
              <label htmlFor="dream-search" className="sr-only">
                Caută simboluri onirice
              </label>
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                id="dream-search"
                type="text"
                placeholder="Caută simboluri onirice..."
                className="w-full rounded-lg border bg-background pl-10 pr-4 py-3 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus-visible:ring-[3px]"
                disabled
                aria-label="Caută simboluri onirice"
              />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm text-center">
            <p className="text-muted-foreground mb-4">
              Dicționarul de interpretare vise va fi disponibil în curând.
            </p>
            <p className="text-sm text-muted-foreground">
              Vom include peste 500 de simboluri onirice cu interpretări detaliate bazate pe folclorul românesc.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

