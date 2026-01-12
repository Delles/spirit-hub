import { Suspense } from "react";
import { DailyWidgetsClient } from "@/components/landing/daily-widgets-client";
import { MoonPhaseHeader } from "@/components/landing/moon-phase-header";
import { DateHeader } from "@/components/landing/date-header";
import { JsonLd, SPIRITHUB_ORGANIZATION } from "@/components/shared/json-ld";

// Make homepage fully static - no ISR revalidation needed
// Daily content is computed client-side (always fresh)
export const dynamic = "force-static";

export default function DashboardPage() {
  // JSON-LD structured data for homepage
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SpiritHub.ro",
    url: "https://www.spirithub.ro",
    description:
      "Platformă spirituală românească pentru numerologie și bioritm. Descoperă-ți numărul destinului și urmărește ciclurile tale fizice, emoționale și intelectuale.",
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

            {/* SEO / About Section */}
            <section className="w-full mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-white/40 text-sm max-w-2xl mx-auto leading-relaxed">
                SpiritHub.ro - Călătoria ta spre autocunoaștere prin numerologie și bioritm.
              </p>
            </section>

          </div>
        </main>

      </div>
    </>
  );
}
