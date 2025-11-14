import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">SpiritHub.ro</h1>
            <nav className="hidden gap-4 sm:flex">
              <Link href="/numerologie" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Numerologie
              </Link>
              <Link href="/vise" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Interpretare Vise
              </Link>
              <Link href="/bioritm" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Bioritm
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Descoperă-ți destinul spiritual
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Platformă completă pentru numerologie, interpretare vise și calcul bioritm. 
              Toate instrumentele de care ai nevoie pentru a înțelege semnele universului.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Numerology Card */}
            <Link href="/numerologie" className="group">
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Numerologie</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Calculează-ți numărul destinului, numărul căii vieții și compatibilitatea. 
                  Descoperă semnificația numerelor tale personale.
                </p>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Calculează acum
                </Button>
              </div>
            </Link>

            {/* Dream Interpretation Card */}
            <Link href="/vise" className="group">
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Moon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Interpretare Vise</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Peste 500 de simboluri onirice explicate. Caută în dicționarul nostru 
                  și descoperă semnificația viselor tale.
                </p>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Explorează dicționarul
                </Button>
              </div>
            </Link>

            {/* Biorhythm Card */}
            <Link href="/bioritm" className="group sm:col-span-2 lg:col-span-1">
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Bioritm</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Urmărește ciclurile tale fizice, emoționale și intelectuale. 
                  Obține ghidare zilnică bazată pe bioritmul tău.
                </p>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Calculează bioritmul
                </Button>
              </div>
            </Link>
          </div>

          {/* Features Section */}
          <div className="mx-auto mt-24 max-w-4xl">
            <h3 className="text-center text-2xl font-bold mb-12">
              De ce SpiritHub.ro?
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold mb-2">Rapid și Modern</h4>
                <p className="text-sm text-muted-foreground">
                  Încărcare sub 2 secunde, experiență asemănătoare unei aplicații
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">🇷🇴</span>
                </div>
                <h4 className="font-semibold mb-2">Autenticitate Culturală</h4>
                <p className="text-sm text-muted-foreground">
                  Interpretări bazate pe folclorul românesc, nu traduceri generice
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-semibold mb-2">Optimizat pentru Mobil</h4>
                <p className="text-sm text-muted-foreground">
                  Design responsive, perfect pentru dispozitive mobile
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SpiritHub.ro - Toate drepturile rezervate</p>
            <p className="mt-2">Platformă spirituală pentru comunitatea română</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
