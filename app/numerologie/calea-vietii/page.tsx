import { Metadata } from "next";
import CaleaVietiiClient from "./client";

export const metadata: Metadata = {
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

export default function CaleaVietiiPage() {
  return <CaleaVietiiClient />;
}
