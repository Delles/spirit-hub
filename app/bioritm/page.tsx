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
  openGraph: {
    title: "Calculator Bioritm | SpiritHub.ro",
    description: "Calculează-ți bioritmul zilnic și descoperă ciclurile tale fizice, emoționale și intelectuale.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Calculator Bioritm - SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculator Bioritm | SpiritHub.ro",
    description: "Calculează-ți bioritmul zilnic și descoperă ciclurile tale fizice, emoționale și intelectuale.",
    images: ["/og-image.jpg"],
  },
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
