import { Metadata } from "next";
import CaleaVietiiClient from "./client";
import { calculateLifePath } from "@/lib/numerology";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const date = resolvedParams.date as string | undefined;

  if (date) {
    const number = calculateLifePath(new Date(date));
    return {
      title: `Calea Vieții mele este ${number} | SpiritHub.ro`,
      description: `Am descoperit că numărul Căii Vieții mele este ${number}. Află ce spune numerologia despre destinul tău!`,
      openGraph: {
        title: `Calea Vieții mele este ${number} | SpiritHub.ro`,
        description: `Am descoperit că numărul Căii Vieții mele este ${number}. Află ce spune numerologia despre destinul tău!`,
      },
    };
  }

  return {
    title: "Calea Vieții - Calculator Numerologie | SpiritHub.ro",
    description:
      "Descoperă-ți numărul Căii Vieții și înțelege-ți scopul și direcția în viață prin numerologie.",
    openGraph: {
      title: "Calea Vieții - Calculator Numerologie | SpiritHub.ro",
      description:
        "Descoperă-ți numărul Căii Vieții și înțelege-ți scopul și direcția în viață prin numerologie.",
      type: "website",
    },
  };
}

import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function CaleaVietiiPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
      <CaleaVietiiClient />
    </Suspense>
  );
}
