import type { Metadata } from "next";
import { ViseClient } from "./client";

export const metadata: Metadata = {
  title: "Interpretare Vise - Dicționar de Vise | SpiritHub.ro",
  description:
    "Află ce înseamnă visele tale. Peste 98 de interpretări din tradiția și folclorul românesc.",
  alternates: {
    canonical: "https://spirithub.ro/vise",
  },
};

// Static page - daily content computed client-side via DailyContentProvider
export const dynamic = "force-static";

export default function VisePage() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl">
        <ViseClient />
      </div>
    </div>
  );
}
