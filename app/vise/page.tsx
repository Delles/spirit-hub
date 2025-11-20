import type { Metadata } from "next";
import { ViseClient } from "./client";

export const metadata: Metadata = {
  title: "Interpretare Vise - SpiritHub.ro",
  description:
    "Dicționar complet de interpretare vise cu peste 100 de simboluri onirice explicate în detaliu. Caută semnificația viselor tale bazată pe folclorul românesc.",
  alternates: {
    canonical: "https://spirithub.ro/vise",
  },
};

export default function VisePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <ViseClient />
      </div>
    </div>
  );
}
