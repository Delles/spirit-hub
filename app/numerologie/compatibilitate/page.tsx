import { Metadata } from "next";
import CompatibilitateClient from "./client";

export const metadata: Metadata = {
  title: "Compatibilitate Numerologică | SpiritHub.ro",
  description:
    "Verifică compatibilitatea numerologică între două persoane folosind numele și datele de naștere. Descoperă cât de bine vă potriviți din punct de vedere numerologic.",
  openGraph: {
    title: "Compatibilitate Numerologică | SpiritHub.ro",
    description:
      "Verifică compatibilitatea numerologică între două persoane folosind numele și datele de naștere.",
    type: "website",
  },
};

export default function CompatibilitatePage() {
  return <CompatibilitateClient />;
}
