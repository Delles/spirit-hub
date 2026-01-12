import { Metadata } from "next";
import { EnergiaZileiClient } from "./client";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";

// Static page - daily content computed client-side via DailyContentProvider
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Energia Zilei - Ghid Energetic Zilnic | SpiritHub.ro",
  description:
    "Descoperă energia zilei de astăzi bazată pe tradiția planetară. Află ce teme, activități și energii favorizează ziua curentă pentru a-ți alinia acțiunile cu ritmul cosmic.",
  openGraph: {
    title: "Energia Zilei - Ghid Energetic Zilnic | SpiritHub.ro",
    description:
      "Descoperă energia zilei de astăzi și aliniază-ți acțiunile cu ritmul cosmic.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Energia Zilei - SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Energia Zilei - Ghid Energetic Zilnic | SpiritHub.ro",
    description: "Descoperă energia zilei de astăzi și aliniază-ți acțiunile cu ritmul cosmic.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.spirithub.ro/bioritm/energia-zilei",
  },
};

export default function EnergiaZileiPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Acasă", url: "https://www.spirithub.ro" },
        { name: "Bioritm", url: "https://www.spirithub.ro/bioritm" },
        { name: "Energia Zilei" }
      ]} />
      <EnergiaZileiClient />
    </>
  );
}
