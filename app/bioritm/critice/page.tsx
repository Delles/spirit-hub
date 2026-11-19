import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { parseISO, isValid } from "date-fns";
import { redirect } from "next/navigation";
import { createCriticalDaysReport } from "@/lib/biorhythm-report";
import { getBucharestCalendarDate } from "@/lib/bucharest-calendar";
import CriticalDaysView from "./view";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Card } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Calculator Zile Critice Bioritm | SpiritHub.ro",
  description: "Află zilele critice din bioritmul tău când ciclurile fizice, emoționale și intelectuale trec prin zero. Planifică-ți activitățile și evită riscurile în perioadele instabile.",
  openGraph: {
    title: "Calculator Zile Critice Bioritm | SpiritHub.ro",
    description: "Află zilele critice din bioritmul tău și planifică-ți activitățile pentru performanță maximă.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Calculator Zile Critice Bioritm - SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculator Zile Critice Bioritm | SpiritHub.ro",
    description: "Află zilele critice din bioritmul tău și planifică-ți activitățile inteligent.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.spirithub.ro/bioritm/critice",
  },
};

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function CriticeDaysPage({ searchParams }: PageProps) {
  const { date: dateParam } = await searchParams;

  // Validate date param on server - redirect if invalid
  if (dateParam && !isValid(parseISO(dateParam))) {
    redirect("/bioritm/critice");
  }

  // Compute critical days on server if date is valid
  let criticalDays: Array<{
    date: string;
    cycles: ("physical" | "emotional" | "intellectual")[];
  }> | null = null;

  if (dateParam) {
    try {
      const birth = parseISO(dateParam);
      const start = parseISO(getBucharestCalendarDate());
      const report = createCriticalDaysReport({ birthDate: birth, startDate: start, days: 30 });
      criticalDays = report.days.map((day) => ({
        ...day,
        date: day.date.toISOString(),
      }));
    } catch {
      criticalDays = null;
    }
  }

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Acasă", url: "https://www.spirithub.ro" },
        { name: "Bioritm", url: "https://www.spirithub.ro/bioritm" },
        { name: "Zile Critice" }
      ]} />
      <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
        <CriticalDaysView
          criticalDays={criticalDays}
          birthDate={dateParam ?? null}
        />
      </Suspense>

      <aside className="mx-auto w-full max-w-4xl pb-12" aria-labelledby="critice-guides-heading">
        <Card className="space-y-4 p-6">
          <div className="space-y-1">
            <h2 id="critice-guides-heading" className="text-xl font-semibold text-white">
              Ghiduri și instrumente utile
            </h2>
            <p className="text-sm text-[#E0E0E0]/80">
              Află cum funcționează intervalul de tranziție și explorează celelalte calculatoare
              de bioritm.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/ghiduri/zile-critice-in-bioritm"
              className="group rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5"
            >
              <h3 className="text-sm font-semibold text-white group-hover:text-[#A5B4FC]">
                Zile critice în bioritm
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#E0E0E0]/75">
                Metoda de calcul cu pragul ±0,15 și exemple concrete pe ciclul de 23 de zile.
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
                Înțelege cele trei cicluri și limitele interpretării simbolice.
              </p>
              <span className="mt-3 inline-flex items-center text-xs font-medium text-[#9F2BFF]">
                Citește ghidul
                <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/bioritm/compatibilitate"
              className="group rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5"
            >
              <h3 className="text-sm font-semibold text-white group-hover:text-[#A5B4FC]">
                Compatibilitate bioritm
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#E0E0E0]/75">
                Compară sincronizarea ciclurilor între două date de naștere.
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
