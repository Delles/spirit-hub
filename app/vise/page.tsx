import type { Metadata } from "next";
import { Suspense } from "react";
import { ViseClient } from "./client";
import { getFeaturedSymbols } from "@/lib/dream-data";

export const metadata: Metadata = {
  title: "Interpretare Vise - Dicționar de Simboluri Onirice | SpiritHub.ro",
  description:
    "Descoperă semnificația viselor tale prin simboluri onirice tradiționale românești. Explorează interpretări profunde bazate pe folclorul și tradițiile românești.",
  alternates: {
    canonical: "https://spirithub.ro/vise",
  },
};

export default function VisePage() {
  // Get featured symbols at build time (SSG)
  const featuredSymbols = getFeaturedSymbols();

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl">
        <Suspense fallback={<div className="h-96 flex items-center justify-center text-white">Se încarcă...</div>}>
          <ViseClient featuredSymbols={featuredSymbols} />
        </Suspense>
      </div>
    </div>
  );
}
