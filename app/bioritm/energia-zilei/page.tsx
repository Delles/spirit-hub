import { Metadata } from "next";
import { EnergiaZileiClient } from "./client";

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
  return <EnergiaZileiClient />;
}

