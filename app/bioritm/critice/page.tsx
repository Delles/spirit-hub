import { Metadata } from "next";
import { Suspense } from "react";
import { parseISO, isValid } from "date-fns";
import { redirect } from "next/navigation";
import { getCriticalDays } from "@/lib/biorhythm";
import { getTodayISOBucharest } from "@/lib/daily-content";
import CriticalDaysView from "./view";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zile Critice Bioritm | SpiritHub.ro",
  description: "Descoperă zilele critice din bioritmul tău când ciclurile trec prin zero.",
  openGraph: {
    title: "Zile Critice Bioritm | SpiritHub.ro",
    description: "Descoperă zilele critice din bioritmul tău când ciclurile trec prin zero.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zile Critice Bioritm - SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zile Critice Bioritm | SpiritHub.ro",
    description: "Descoperă zilele critice din bioritmul tău când ciclurile trec prin zero.",
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
    <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
      <CriticalDaysView
        criticalDays={criticalDays}
        birthDate={dateParam ?? null}
      />
    </Suspense>
  );
}
