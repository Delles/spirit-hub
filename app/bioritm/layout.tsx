import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = {
  title: "Calculator Bioritm | SpiritHub.ro",
  description:
    "Calculează-ți bioritmul zilnic și descoperă ciclurile tale fizice, emoționale și intelectuale. Obține ghidare zilnică bazată pe bioritmul tău.",
  keywords: [
    "bioritm",
    "calculator bioritm",
    "ciclu fizic",
    "ciclu emoțional",
    "ciclu intelectual",
    "zile critice",
    "spiritualitate",
  ],
  openGraph: {
    title: "Calculator Bioritm | SpiritHub.ro",
    description:
      "Calculează-ți bioritmul zilnic și descoperă ciclurile tale fizice, emoționale și intelectuale.",
    type: "website",
    locale: "ro_RO",
  },
};

export default function BioritmLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <SectionHeader />
      {children}
    </MainLayout>
  );
}
