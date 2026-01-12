import { Metadata } from "next";
import { Suspense } from "react";
import { parseISO, isValid } from "date-fns";
import { redirect } from "next/navigation";
import { getCriticalDays } from "@/lib/biorhythm";
import { getTodayISOBucharest } from "@/lib/daily-content";
import CriticalDaysView from "./view";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
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
      const start = parseISO(getTodayISOBucharest());
      criticalDays = getCriticalDays(birth, start, 30).map((day) => ({
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
    </>
  );
}
