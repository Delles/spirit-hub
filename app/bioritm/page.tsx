import { Metadata } from "next";
import BioritmClient from "./client";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const targetDate = resolvedParams.target as string | undefined;

  if (targetDate) {
    const formattedDate = new Date(targetDate).toLocaleDateString("ro-RO");
    return {
      title: `Bioritmul meu pentru ${formattedDate} | SpiritHub.ro`,
      description: "Vezi ciclurile mele fizice, emoționale și intelectuale pe SpiritHub.ro.",
      openGraph: {
        title: `Bioritmul meu pentru ${formattedDate} | SpiritHub.ro`,
        description: "Vezi ciclurile mele fizice, emoționale și intelectuale pe SpiritHub.ro.",
      },
    };
  }

  return {
    title: "Calculator Bioritm | SpiritHub.ro",
    description:
      "Calculează-ți bioritmul zilnic și descoperă ciclurile tale fizice, emoționale și intelectuale.",
  };
}

import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function BioritmPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
      <BioritmClient />
    </Suspense>
  );
}
