import { Metadata } from "next";
import BioritmClient from "./client";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

// Force static generation - client handles URL params
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Calculator Bioritm | SpiritHub.ro",
  description:
    "Calculează-ți bioritmul zilnic și descoperă ciclurile tale fizice, emoționale și intelectuale.",
  alternates: {
    canonical: "https://spirithub.ro/bioritm",
  },
};

export default function BioritmPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
      <BioritmClient />
    </Suspense>
  );
}
