import { Metadata } from "next";
import { Suspense } from "react";
import CriticeDaysClient from "./client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

// ISR: Revalidate every 6 hours for freshness
export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Zile Critice Bioritm | SpiritHub.ro",
  description: "Descoperă zilele critice din bioritmul tău când ciclurile trec prin zero.",
  alternates: {
    canonical: "https://spirithub.ro/bioritm/critice",
  },
};

export default function CriticeDaysPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
      <CriticeDaysClient />
    </Suspense>
  );
}
