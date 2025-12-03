import { Metadata } from "next";
import { Suspense } from "react";
import NumeDestinClient from "./client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const metadata: Metadata = {
  title: "Numărul Destinului - Calculator Numerologie | SpiritHub.ro",
  description:
    "Calculează-ți numărul destinului din numele complet și descoperă-ți misiunea în viață prin numerologie.",
  openGraph: {
    title: "Numărul Destinului - Calculator Numerologie | SpiritHub.ro",
    description:
      "Calculează-ți numărul destinului din numele complet și descoperă-ți misiunea în viață prin numerologie.",
    type: "website",
  },
  alternates: {
    canonical: "https://spirithub.ro/numerologie/nume-destin",
  },
};

export default function NumeDestinPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
      <NumeDestinClient />
    </Suspense>
  );
}
