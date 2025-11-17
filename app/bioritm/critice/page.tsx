import { Metadata } from "next";
import CriticeDaysClient from "./client";

export const metadata: Metadata = {
  title: "Zile Critice Bioritm | SpiritHub.ro",
  description: "Descoperă zilele critice din bioritmul tău când ciclurile trec prin zero.",
};

export default function CriticeDaysPage() {
  return <CriticeDaysClient />;
}
