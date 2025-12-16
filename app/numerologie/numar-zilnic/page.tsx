import { Metadata } from "next";
import NumarZilnicClient from "./client";

// Static page - daily content fetched client-side from Convex
export const dynamic = "force-static";

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
  return <NumarZilnicClient />;
}
