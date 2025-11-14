import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Bioritm - SpiritHub.ro",
  description: "Calculează-ți bioritmul și urmărește ciclurile tale fizice, emoționale și intelectuale. Obține ghidare zilnică bazată pe bioritmul tău.",
};

export default function BioritmPage() {
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
            <h1 className="text-2xl font-bold text-primary">Bioritm</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Calculator Bioritm</h2>
            <p className="text-muted-foreground">
              Urmărește ciclurile tale fizice, emoționale și intelectuale
            </p>
          </div>

          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Ce este bioritmul?</h3>
              <p className="text-muted-foreground mb-4">
                Bioritmul reprezintă ciclurile naturale ale corpului tău, care influențează 
                performanța ta fizică, starea emoțională și capacitatea intelectuală.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 mt-6">
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Ciclu Fizic</h4>
                  <p className="text-sm text-muted-foreground">23 de zile</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Ciclu Emoțional</h4>
                  <p className="text-sm text-muted-foreground">28 de zile</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Ciclu Intelectual</h4>
                  <p className="text-sm text-muted-foreground">33 de zile</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button className="w-full" disabled>
                Calculează bioritmul meu
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-4">
                Calculatorul de bioritm va fi disponibil în curând
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

