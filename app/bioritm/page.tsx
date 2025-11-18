import { Metadata } from "next";
import BioritmClient from "./client";

export const metadata: Metadata = {
  title: "Calculator Bioritm | SpiritHub.ro",
  description:
    "Calculează-ți bioritmul zilnic și descoperă ciclurile tale fizice, emoționale și intelectuale.",
};

export default function BioritmPage() {
  return <BioritmClient />;
}
