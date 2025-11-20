import { Metadata } from "next";
import NumeDestinClient from "./client";

export const metadata: Metadata = {
  title: "Numărul Destinului - Calculator Numerologie | SpiritHub.ro",
  description:
    "Calculează-ți numărul destinului din numele complet și descoperă-ți misiunea în viață prin numerologie.",
  openGraph: {
    title: "Numărul Destinului - Calculator Numerologie | SpiritHub.ro",
    description:
      "Calculează-ți numărul destinului din numele complet și descoperă-ți misiunea în viață prin numerologie.",
    type: "website",
  },
  alternates: {
    canonical: "https://spirithub.ro/numerologie/nume-destin",
  },
};

export default function NumeDestinPage() {
  return <NumeDestinClient />;
}
