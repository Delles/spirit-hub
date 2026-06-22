import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DailyWidgetsClient } from "@/components/landing/daily-widgets-client";
import { MoonPhaseHeader } from "@/components/landing/moon-phase-header";
import { DateHeader } from "@/components/landing/date-header";
import { JsonLd, SPIRITHUB_ORGANIZATION } from "@/components/shared/json-ld";
import { guides } from "@/data/guides";

// Make homepage fully static - no ISR revalidation needed
// Daily content is computed client-side (always fresh)
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "SpiritHub.ro - Numerologie și Ghidaj Zilnic",
  description:
    "Descoperă energia zilei, calculează-ți numărul destinului și explorează compatibilitatea numerologică. Instrumente gratuite, rapide și fără cont.",
  keywords: [
    "numerologie online",
    "ghidaj zilnic",
    "energia zilei",
    "mesaj zilnic",
    "calea vieții",
    "compatibilitate numerologică",
  ],
  alternates: {
    canonical: "https://www.spirithub.ro/",
  },
  openGraph: {
    title: "SpiritHub.ro - Numerologie și Ghidaj Zilnic",
    description:
      "Instrumente gratuite de numerologie, energia zilei și ghidaj zilnic, disponibile rapid și fără cont.",
    url: "https://www.spirithub.ro/",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SpiritHub.ro - Numerologie și Ghidaj Zilnic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpiritHub.ro - Numerologie și Ghidaj Zilnic",
    description: "Instrumente gratuite de numerologie, energia zilei și ghidaj zilnic.",
    images: ["/og-image.jpg"],
  },
};

export default function DashboardPage() {
  // JSON-LD structured data for homepage
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SpiritHub.ro",
    url: "https://www.spirithub.ro",
    description:
      "Platformă românească pentru numerologie și ghidaj zilnic. Descoperă energia zilei, numărul destinului și compatibilitatea numerologică.",
    inLanguage: "ro-RO",
  };

  return (
    <>
      {/* Multiple JSON-LD scripts for different schema types */}
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={SPIRITHUB_ORGANIZATION} />
      <div className="flex min-h-screen flex-col text-foreground overflow-x-hidden selection:bg-[#9F2BFF] selection:text-white">

        <main className="flex-1 w-full relative">
          {/* Skip to main content link for screen readers */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Sari la conținutul principal
          </a>

          {/* Page Hero / Header Section */}
          <div className="text-center pt-8 pb-4 space-y-2 animate-fade-in">
            <h1 className="text-[#E0E0E0] uppercase tracking-[0.2em] text-sm font-medium">
              Energia Zilei
            </h1>
            {/* Date - computed client-side to always show "today" */}
            <DateHeader />
            {/* Moon phase - computed client-side */}
            <MoonPhaseHeader />
          </div>

          <div id="main-content" className="flex flex-col items-center justify-start p-4 md:p-4 lg:p-6 max-w-[1200px] mx-auto">

            {/* Daily Widgets - computed client-side */}
            <Suspense fallback={
              <div className="w-full h-[600px] animate-pulse bg-white/5 rounded-xl" />
            }>
              <DailyWidgetsClient />
            </Suspense>

            <section className="w-full mt-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-white">Ghiduri populare</h2>
                <Link href="/ghiduri" className="text-sm font-medium text-[#A5B4FC] hover:text-white">
                  Toate ghidurile
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {guides.slice(0, 3).map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/ghiduri/${guide.slug}`}
                    className="group rounded-lg border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5"
                  >
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[#A5B4FC]">
                      {guide.category}
                    </p>
                    <h3 className="mb-2 text-base font-semibold leading-snug text-white">
                      {guide.title}
                    </h3>
                    <div className="flex items-center text-sm font-medium text-[#9F2BFF]">
                      Citește
                      <ArrowLeft
                        className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* SEO / About Section */}
            <section className="w-full mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-white/40 text-sm max-w-2xl mx-auto leading-relaxed">
                SpiritHub.ro te ajută să explorezi numerologia și energia zilei. Pentru ciclurile
                fizice, emoționale și intelectuale, folosește{" "}
                <Link href="/bioritm" className="text-[#A5B4FC] underline-offset-4 hover:underline">
                  calculatorul de bioritm online
                </Link>
                .
              </p>
            </section>

          </div>
        </main>

      </div>
    </>
  );
}
