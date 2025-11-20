import { Metadata } from "next";
import BioritmClient from "./client";
import { format, parseISO } from "date-fns";
import { ro } from "date-fns/locale";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const targetDate = resolvedParams.target as string | undefined;
  const birthDate = resolvedParams.date as string | undefined;

  const canonicalUrl = new URL("https://spirithub.ro/bioritm");
  if (birthDate) canonicalUrl.searchParams.set("date", birthDate);
  if (targetDate) canonicalUrl.searchParams.set("target", targetDate);

  if (targetDate) {
    const formattedDate = format(parseISO(targetDate), "d MMMM yyyy", { locale: ro });
    return {
      title: `Bioritmul meu pentru ${formattedDate} | SpiritHub.ro`,
      description: "Vezi ciclurile mele fizice, emoționale și intelectuale pe SpiritHub.ro.",
      alternates: {
        canonical: canonicalUrl.toString(),
      },
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
    alternates: {
      canonical: canonicalUrl.toString(),
    },
  };
}

import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default async function BioritmPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  return (
    <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
      <BioritmClient
        initialBirthDate={resolvedParams.date as string}
        initialTargetDate={resolvedParams.target as string}
      />
    </Suspense>
  );
}
