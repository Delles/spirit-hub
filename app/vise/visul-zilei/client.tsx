/**
 * Daily Dream Client Component
 *
 * Displays a deterministically selected dream symbol for the current day.
 * All users see the same symbol on the same date.
 */
"use client";

import { useMemo } from "react";
import { getDailyDream } from "@/lib/daily-content";
import { DreamDetailCard } from "@/components/vise/dream-detail-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { formatRomanianDate } from "@/lib/utils";
import Link from "next/link";

export function VisulZileiClient() {
  // Get current date in ISO format (YYYY-MM-DD)
  const today = new Date();
  const isoDate = today.toISOString().split("T")[0];

  // Fetch daily dream symbol locally
  const dailyDream = useMemo(() => {
    try {
      return getDailyDream(isoDate);
    } catch {
      return null;
    }
  }, [isoDate]);

  // Format date in Romanian
  const romanianDate = formatRomanianDate(today);

  // Error state - symbol not found
  if (dailyDream === null) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            Nu am putut încărca visul zilei. Te rugăm să încerci din nou mai târziu.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Link href="/vise">
            <Button variant="secondary" className="min-h-[44px]">
              Caută alte simboluri
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Map to DreamSymbol interface expected by card
  const mappedSymbol = dailyDream ? {
    id: dailyDream.slug,
    name: dailyDream.name,
    slug: dailyDream.slug,
    category: dailyDream.category,
    interpretation: dailyDream.fullInterpretation,
    shortDescription: dailyDream.shortMeaning,
  } : null;

  return (
    <div className="space-y-8">
      {/* Date Display */}
      <div className="text-center space-y-2">
        <p className="text-sm text-[#E0E0E0]/60 uppercase tracking-wide">Visul Zilei</p>
        <p className="text-xl font-semibold text-[#9F2BFF]">{romanianDate}</p>
      </div>

      {/* Dream Symbol Detail */}
      {mappedSymbol && <DreamDetailCard symbol={mappedSymbol} />}

      {/* Link back to search */}
      <div className="flex justify-center pt-4">
        <Link href="/vise">
          <Button variant="secondary" className="min-h-[44px]">
            Caută alte simboluri
          </Button>
        </Link>
      </div>
    </div>
  );
}
