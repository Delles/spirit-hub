"use client";

import { useQuery } from "convex/react";
import { Calendar } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { ResultCard } from "@/components/shared/result-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";

// Romanian month names
const romanianMonths = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
];

// Format date in Romanian (e.g., "17 noiembrie 2025")
function formatRomanianDate(date: Date): string {
  const day = date.getDate();
  const month = romanianMonths[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export default function NumarZilnicClient() {
  // Get current date in ISO format
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];
  const romanianDate = formatRomanianDate(today);

  // Query daily number and interpretation from Convex
  const dailyData = useQuery(api.numerology.getDailyNumber, { date: todayISO });

  // Share URL and title
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = dailyData
    ? `Numărul zilei: ${dailyData.number} - ${dailyData.title}`
    : "Numărul Zilei - SpiritHub.ro";

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Numărul Zilei</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descoperă numărul zilei de astăzi și primește îndrumări numerologice pentru ziua
              curentă
            </p>
          </div>

          {/* Date Display */}
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">{romanianDate}</p>
          </div>

          {/* Info Section */}
          <div className="rounded-lg border bg-card p-6 space-y-3">
            <h2 className="text-xl font-semibold">Ce este Numărul Zilei?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Numărul Zilei este calculat din data curentă și oferă îndrumări specifice pentru ziua
              de astăzi. Fiecare zi are propria sa energie numerologică care influențează
              activitățile, deciziile și interacțiunile tale. Înțelegând energia zilei, poți să îți
              aliniezi acțiunile cu ritmul natural al universului.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Numărul zilei se schimbă în fiecare zi, oferindu-ți o perspectivă nouă și îndrumări
              fresh pentru fiecare zi din viața ta. Revino mâine pentru un nou număr și noi
              îndrumări!
            </p>
          </div>

          {/* Loading State */}
          {dailyData === undefined && <LoadingSpinner text="Se încarcă numărul zilei..." />}

          {/* Error State */}
          {dailyData === null && (
            <ErrorMessage
              title="Eroare la încărcare"
              message="Nu am putut încărca numărul zilei. Te rugăm să reîncarci pagina."
            />
          )}

          {/* Results Section */}
          {dailyData && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <ResultCard
                title={dailyData.title}
                number={dailyData.number}
                description={dailyData.description}
                interpretation={dailyData.fullText}
                shareUrl={shareUrl}
                shareTitle={shareTitle}
              />

              {/* Return Tomorrow Message */}
              <div className="rounded-lg border bg-primary/5 p-6 text-center">
                <p className="text-lg font-medium text-primary">
                  ✨ Revino mâine pentru un nou număr! ✨
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Fiecare zi aduce o energie nouă și îndrumări fresh pentru călătoria ta.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
