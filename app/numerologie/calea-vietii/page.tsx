import { Metadata } from "next";
import CaleaVietiiClient from "./client";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

// Force static generation - client handles URL params
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Calea Vieții - Calculator Numerologie | SpiritHub.ro",
  description:
    "Descoperă-ți numărul Căii Vieții și înțelege-ți scopul și direcția în viață prin numerologie.",
  alternates: {
    canonical: "https://spirithub.ro/numerologie/calea-vietii",
  },
  openGraph: {
    title: "Calea Vieții - Calculator Numerologie | SpiritHub.ro",
    description:
      "Descoperă-ți numărul Căii Vieții și înțelege-ți scopul și direcția în viață prin numerologie.",
    type: "website",
  },
};

export default function CaleaVietiiPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
      <CaleaVietiiClient />
    </Suspense>
  );
}
