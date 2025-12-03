import { getCachedDailyWidgetData } from "@/lib/daily-widget-server";
import { getCachedMoonPhaseForBucharest } from "@/lib/moon-phase-server";
import { DailyNumberWidget } from "@/components/landing/widgets/daily-number-widget";
import { DreamWidget } from "@/components/landing/widgets/dream-widget";
import { BiorhythmWidget } from "@/components/landing/widgets/biorhythm-widget";
import { QuickToolsWidget } from "@/components/landing/widgets/quick-tools-widget";
import { DailyWidgetDateChecker } from "@/components/landing/daily-widget-date-checker";

// ISR: Revalidate every hour for optimal balance between freshness and caching
// - Edge CDN serves cached HTML instantly (great performance)
// - Background revalidation every hour keeps data fresh
// - Client-side date checker handles edge case right after midnight
// - Data only changes once per day, so 1-hour revalidation is more than sufficient
export const revalidate = 3600; // 1 hour in seconds

// Helper for date formatting - uses Bucharest timezone for consistency with daily widget data
function getFormattedDate() {
  const options: Intl.DateTimeFormatOptions = { 
    timeZone: 'Europe/Bucharest',
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  // Capitalize first letter
  const dateStr = new Date().toLocaleDateString('ro-RO', options);
  return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

export default async function DashboardPage() {
  // Fetch daily widget data and moon phase server-side with Next.js caching
  const [dailyWidgetData, moonPhase] = await Promise.all([
    getCachedDailyWidgetData(),
    getCachedMoonPhaseForBucharest(),
  ]);
  
  const currentDate = getFormattedDate();

  return (
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
          <h2 className="text-[#E0E0E0] uppercase tracking-[0.2em] text-sm font-medium">
            Energia Zilei
          </h2>
          <h1 className="text-white font-heading text-3xl md:text-4xl font-bold">
            {currentDate}
          </h1>
          <p className="text-[#A5B4FC] text-sm flex items-center justify-center gap-2">
            {moonPhase.labelRo} {moonPhase.emoji}
          </p>
        </div>

        <div id="main-content" className="flex flex-col items-center justify-start p-4 md:p-4 lg:p-6 max-w-[1200px] mx-auto">
          
          {/* Client-side date checker - ensures data matches current date */}
          <DailyWidgetDateChecker widgetData={dailyWidgetData} />
          
          {/* Bento Grid Layout */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 auto-rows-min gap-4">
            
            {/* 1. Numerology: Large Square (Left) - Spans 2 cols, 2 rows approx */}
            <div className="md:col-span-2 md:row-span-2 min-h-[350px]">
              <DailyNumberWidget 
                data={dailyWidgetData.dailyNumber} 
                className="h-full"
              />
            </div>

            {/* 2. Dream: Tall Rectangle (Right) - Spans 1 col, 2 rows */}
            <div className="md:col-span-1 md:row-span-2 min-h-[350px]">
              <DreamWidget 
                data={dailyWidgetData.dailyDream} 
                className="h-full"
              />
            </div>

            {/* 3. Biorhythm: Wide Rectangle (Bottom Left) - Spans 2 cols */}
            <div className="md:col-span-2 min-h-[200px]">
              <BiorhythmWidget 
                data={dailyWidgetData.biorhythmHint} 
                className="h-full"
              />
            </div>

            {/* 4. Quick Tools: Small Strip (Bottom Right) - Spans 1 col */}
            <div className="md:col-span-1 min-h-[120px]">
              <QuickToolsWidget className="h-full" />
            </div>

          </div>

          {/* SEO / About Section (Simplified) */}
          <section className="w-full mt-8 pt-6 border-t border-white/5 text-center">
             <p className="text-white/40 text-sm max-w-2xl mx-auto leading-relaxed">
               SpiritHub.ro - Călătoria ta spre autocunoaștere prin numerologie, simbolismul viselor și bioritm.
             </p>
          </section>

        </div>
      </main>

    </div>
  );
}
