import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EnergiaZileiClient } from "./client";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";
import { Card } from "@/components/ui/card";

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

      <aside className="mx-auto w-full max-w-4xl pb-12" aria-labelledby="energia-guides-heading">
        <Card className="space-y-4 p-6">
          <div className="space-y-1">
            <h2 id="energia-guides-heading" className="text-xl font-semibold text-white">
              Ghiduri și instrumente pentru ritmul zilnic
            </h2>
            <p className="text-sm text-[#E0E0E0]/80">
              Află cum se combină energia zilei cu ciclurile personale de bioritm.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/ghiduri/energia-zilei-cum-sa-o-folosesti"
              className="group rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5"
            >
              <h3 className="text-sm font-semibold text-white group-hover:text-[#A5B4FC]">
                Energia zilei: cum să o folosești
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#E0E0E0]/75">
                Pași simpli pentru dimineață și seară, fără interpretări forțate.
              </p>
              <span className="mt-3 inline-flex items-center text-xs font-medium text-[#9F2BFF]">
                Citește ghidul
                <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/ghiduri/ce-este-bioritmul"
              className="group rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5"
            >
              <h3 className="text-sm font-semibold text-white group-hover:text-[#A5B4FC]">
                Ce este bioritmul?
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#E0E0E0]/75">
                Vezi cum sunt calculate curbele fizică, emoțională și intelectuală.
              </p>
              <span className="mt-3 inline-flex items-center text-xs font-medium text-[#9F2BFF]">
                Citește ghidul
                <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/bioritm"
              className="group rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5"
            >
              <h3 className="text-sm font-semibold text-white group-hover:text-[#A5B4FC]">
                Calculator bioritm personal
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#E0E0E0]/75">
                Calculează ciclurile tale pentru azi și următoarele 7 zile.
              </p>
              <span className="mt-3 inline-flex items-center text-xs font-medium text-[#9F2BFF]">
                Deschide calculatorul
                <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </Card>
      </aside>
    </>
  );
}
