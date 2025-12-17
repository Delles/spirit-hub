import type { Metadata } from "next";
import { VisulZileiClient } from "./client";

// Static page - daily content fetched client-side from Convex
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Visul Zilei - SpiritHub.ro",
  description:
    "Descoperă visul zilei și află ce înseamnă. În fiecare zi un nou simbol cu interpretare completă din tradiția românească.",
  alternates: {
    canonical: "https://spirithub.ro/vise/visul-zilei",
  },
};

export default function VisulZileiPage() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page Introduction */}
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-white">Visul Zilei de Astăzi</h2>
          <p className="text-lg text-[#E0E0E0] leading-relaxed">
            Descoperă simbolul care îți ghidează pașii astăzi. Chiar dacă nu l-ai visat, mesajul său
            îți poate oferi un răspuns sau o nouă perspectivă asupra situațiilor tale actuale.
          </p>
        </div>

        {/* Client Component fetches from Convex */}
        <VisulZileiClient />
      </div>
    </div>
  );
}
