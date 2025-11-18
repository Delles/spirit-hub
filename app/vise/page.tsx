import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ViseClient } from "./client";

export const metadata: Metadata = {
  title: "Interpretare Vise - SpiritHub.ro",
  description:
    "Dicționar complet de interpretare vise cu peste 100 de simboluri onirice explicate în detaliu. Caută semnificația viselor tale bazată pe folclorul românesc.",
};

export default function VisePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="min-h-[44px] min-w-[44px]"
                aria-label="Înapoi la pagina principală"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">Interpretare Vise</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <ViseClient />
        </div>
      </main>
    </div>
  );
}
