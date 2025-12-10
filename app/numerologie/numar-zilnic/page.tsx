import { Metadata } from "next";
import NumarZilnicClient from "./client";
import { calculateDailyNumber, getTodayISOBucharest } from "@/lib/daily-content";
import { getInterpretation } from "@/lib/interpretations";
import { getBucharestDate, formatRomanianDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Numărul Zilei - Numerologie Zilnică | SpiritHub.ro",
  description:
    "Descoperă numărul zilei de astăzi și primește îndrumări numerologice pentru ziua curentă. Fiecare zi aduce o energie nouă și perspective fresh.",
  openGraph: {
    title: "Numărul Zilei - Numerologie Zilnică | SpiritHub.ro",
    description:
      "Descoperă numărul zilei de astăzi și primește îndrumări numerologice pentru ziua curentă.",
    type: "website",
  },
  alternates: {
    canonical: "https://spirithub.ro/numerologie/numar-zilnic",
  },
};

export default function NumarZilnicPage() {
  // Resolve daily number server-side to keep interpretation data off client bundle
  const todayISO = getTodayISOBucharest();
  const romanianDate = formatRomanianDate(getBucharestDate());
  const number = calculateDailyNumber(todayISO);
  const interpretation = getInterpretation("daily", number);

  const dailyData = interpretation ? {
    number,
    title: interpretation.title,
    description: interpretation.description,
    fullText: interpretation.fullText,
  } : null;

  return <NumarZilnicClient dailyData={dailyData} romanianDate={romanianDate} />;
}
