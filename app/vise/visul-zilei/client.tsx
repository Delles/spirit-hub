/**
 * Daily Dream Client Component
 *
 * Displays a deterministically selected dream symbol for the current day.
 * Receives the resolved symbol from the server component.
 */
"use client";

import { DreamDetailCard } from "@/components/vise/dream-detail-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { DreamSymbol } from "@/lib/dreams";

interface Props {
  dailyDream: DreamSymbol;
  romanianDate: string;
}

export function VisulZileiClient({ dailyDream, romanianDate }: Props) {
  const symbol = {
    ...dailyDream,
    category: dailyDream.category as any // simple cast to satisfy type
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/vise" className="inline-block">
            <Button
              variant="ghost"
              className="gap-2 pl-0 hover:pl-2 transition-all text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Înapoi la dicționar
            </Button>
          </Link>
          <span className="text-sm text-[#E0E0E0]/60 hidden sm:block">Visul Zilei</span>
        </div>

        {/* Date Header */}
        <div className="text-center space-y-3 pb-4">
          <div className="inline-block px-3 py-1 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/30 backdrop-blur-sm">
            <span className="text-sm font-medium text-[#c084fc] uppercase tracking-wider">Interpretare pentru</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight capitalize">
            {romanianDate}
          </h1>
        </div>

        {/* Dream Card Container */}
        <div className="bg-[#1A1A2E]/30 p-1 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm">
          <DreamDetailCard symbol={symbol} />
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center pt-8 border-t border-white/5">
          <Link href="/vise">
            <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
              Caută un alt vis specific
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
