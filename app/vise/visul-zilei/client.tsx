/**
 * Daily Dream Client Component
 *
 * Displays a deterministically selected dream symbol for the current day.
 * Receives the resolved symbol from the server component.
 */
"use client";

import { DreamDetailCard } from "@/components/vise/dream-detail-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { DreamSymbol } from "@/lib/dreams";

interface Props {
  dailyDream: DreamSymbol;
  romanianDate: string;
}

export function VisulZileiClient({ dailyDream, romanianDate }: Props) {
  return (
    <div className="space-y-8">
      {/* Date Display */}
      <div className="text-center space-y-2">
        <p className="text-sm text-[#E0E0E0]/60 uppercase tracking-wide">Visul Zilei</p>
        <p className="text-xl font-semibold text-[#9F2BFF]">{romanianDate}</p>
      </div>

      {/* Dream Symbol Detail */}
      <DreamDetailCard symbol={dailyDream} />

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
