"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResultCard } from "@/components/shared/result-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Card } from "@/components/ui/card";

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
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Date Display */}
        <div className="text-center">
          <p className="text-2xl font-semibold text-[#9F2BFF]">{romanianDate}</p>
        </div>

        {/* Info Section */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-white">Ce este Numărul Zilei?</h2>
          <p className="text-sm text-[#E0E0E0] leading-relaxed">
            Numărul Zilei este calculat din data curentă și oferă îndrumări specifice pentru ziua de
            astăzi. Fiecare zi are propria sa energie numerologică care influențează activitățile,
            deciziile și interacțiunile tale. Înțelegând energia zilei, poți să îți aliniezi
            acțiunile cu ritmul natural al universului.
          </p>
          <p className="text-sm text-[#E0E0E0] leading-relaxed">
            Numărul zilei se schimbă în fiecare zi, oferindu-ți o perspectivă nouă și îndrumări fresh
            pentru fiecare zi din viața ta. Revino mâine pentru un nou număr și noi îndrumări!
          </p>
        </Card>

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
            <Card className="p-6 text-center bg-[#9F2BFF]/5">
              <p className="text-lg font-medium text-[#9F2BFF]">
                ✨ Revino mâine pentru un nou număr! ✨
              </p>
              <p className="text-sm text-[#E0E0E0] mt-2">
                Fiecare zi aduce o energie nouă și îndrumări fresh pentru călătoria ta.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
