import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DailyWidget } from "@/components/layout/daily-widget";
import { getCachedDailyWidgetData } from "@/lib/daily-widget-server";
import { ToolCard } from "@/components/landing/tool-card";
import { Calculator, Moon, Activity } from "lucide-react";

export default async function DashboardPage() {
  // Fetch daily widget data server-side with Next.js caching
  const dailyWidgetData = await getCachedDailyWidgetData();
  return (
    <div className="flex min-h-screen flex-col text-foreground overflow-x-hidden">
      <Header />
      
      <main className="flex-1 w-full">
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Sari la conținutul principal
        </a>

        {/* Background Effects - Subtle gradient orb */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div id="main-content" className="flex flex-col items-center justify-start p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto space-y-12">
        
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center space-y-8 pt-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary/80 to-secondary/80">
              Descoperă energia zilei de azi
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Bine ai venit pe SpiritHub. Aici găsești instrumente pentru autocunoaștere și echilibru.
            </p>
          </div>

          {/* Daily Widget - Centerpiece */}
          <div className="w-full">
            <DailyWidget data={dailyWidgetData} />
          </div>
        </section>

        {/* Explore Tools Section */}
        <section className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Explorează Instrumentele</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Numerology Card */}
            <ToolCard
              href="/numerologie"
              icon={<Calculator className="w-8 h-8 text-primary" />}
              title="Numerologie"
              description="Calculează Cifra Destinului, Anul Personal și descoperă semnificația numerelor din viața ta."
            />

            {/* Dream Interpretation Card */}
            <ToolCard
              href="/vise"
              icon={<Moon className="w-8 h-8 text-secondary" />}
              title="Interpretare Vise"
              description="Descifrează mesajele subconștientului tău. Caută simboluri și află ce înseamnă visele tale."
            />

            {/* Biorhythm Card */}
            <ToolCard
              href="/bioritm"
              icon={<Activity className="w-8 h-8 text-chart-3" />}
              title="Bioritm"
              description="Vizualizează ciclurile tale fizice, emoționale și intelectuale pentru a-ți planifica mai bine timpul."
            />
          </div>
        </section>

        {/* SEO / About Section */}
        <section className="w-full pt-8 border-t border-border">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="text-xl font-medium text-primary/80">Despre SpiritHub.ro</h3>
            <p className="text-muted-foreground leading-relaxed">
              SpiritHub este platforma ta de referință pentru numerologie, interpretarea viselor și calculul bioritmului. 
              Credem că autocunoașterea este cheia unei vieți echilibrate. Instrumentele noastre sunt create pentru a oferi 
              claritate și ghidare, respectând tradițiile spirituale dar într-un format modern și accesibil.
            </p>
            <p className="text-muted-foreground/70 text-sm">
              Explorează gratuit interpretările noastre și revino zilnic pentru energia zilei.
            </p>
          </div>
        </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

