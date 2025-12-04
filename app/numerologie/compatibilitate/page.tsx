import { Metadata } from "next";
import { Suspense } from "react";
import CompatibilitateClient from "./client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const metadata: Metadata = {
  title: "Compatibilitate Numerologică | SpiritHub.ro",
  description:
    "Verifică compatibilitatea numerologică între două persoane folosind numele și datele de naștere. Descoperă cât de bine vă potriviți din punct de vedere numerologic.",
  openGraph: {
    title: "Compatibilitate Numerologică | SpiritHub.ro",
    description:
      "Verifică compatibilitatea numerologică între două persoane folosind numele și datele de naștere.",
    type: "website",
  },
  alternates: {
    canonical: "https://spirithub.ro/numerologie/compatibilitate",
  },
};

export default function CompatibilitatePage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
      <CompatibilitateClient />
    </Suspense>
  );
}
