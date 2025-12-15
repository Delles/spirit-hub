import { Metadata } from "next";
import { EnergiaZileiClient } from "./client";
import { getTodayISOBucharest } from "@/lib/daily-content";
import { DailyPageDateChecker } from "@/components/shared/daily-page-date-checker";
import { getEnergiaZilei } from "@/lib/energia-zilei";
import { getMoonPhase } from "@/lib/moon-phase";
import { formatRomanianDate, getBucharestDate } from "@/lib/utils";

// ISR: Revalidate every 24 hours - content changes at midnight (date checker handles it)
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Energia Zilei - Ghid Energetic Zilnic | SpiritHub.ro",
  description:
    "Descoperă energia zilei de astăzi bazată pe tradiția planetară. Află ce teme, activități și energii favorizează ziua curentă pentru a-ți alinia acțiunile cu ritmul cosmic.",
  openGraph: {
    title: "Energia Zilei - Ghid Energetic Zilnic | SpiritHub.ro",
    description:
      "Descoperă energia zilei de astăzi și aliniază-ți acțiunile cu ritmul cosmic.",
    type: "website",
  },
  alternates: {
    canonical: "https://spirithub.ro/bioritm/energia-zilei",
  },
};

export default function EnergiaZileiPage() {
  // Compute all data server-side to ensure consistency with serverDate
  const todayISO = getTodayISOBucharest();
  const bucharestDate = getBucharestDate();
  const romanianDate = formatRomanianDate(bucharestDate);
  const energia = getEnergiaZilei(bucharestDate);
  const moonPhase = getMoonPhase(bucharestDate);

  return (
    <>
      <DailyPageDateChecker serverDate={todayISO} />
      <EnergiaZileiClient
        energia={energia}
        moonPhase={moonPhase}
        romanianDate={romanianDate}
      />
    </>
  );
}


