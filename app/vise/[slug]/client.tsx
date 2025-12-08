"use client";

import { DreamDetailCard } from "@/components/vise/dream-detail-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { StaticDreamSymbol } from "@/lib/dream-data";

interface DreamSymbolContentProps {
  dream: StaticDreamSymbol;
}

/**
 * Dream Symbol Content Component
 *
 * Displays the full interpretation for a dream symbol.
 * Receives pre-loaded data from parent server component (no loading states needed).
 */
export function DreamSymbolContent({ dream }: DreamSymbolContentProps) {
  // Transform StaticDreamSymbol to the format expected by DreamDetailCard
  const symbol = {
    id: dream.slug,
    name: dream.name,
    slug: dream.slug,
    category: dream.category,
    interpretation: dream.fullInterpretation,
    shortDescription: dream.shortMeaning,
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/vise" className="inline-block">
          <Button
            variant="ghost"
            className="gap-2 pl-0 hover:pl-2 transition-all text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la interpretări
          </Button>
        </Link>

        <DreamDetailCard symbol={symbol} />
      </div>
    </div>
  );
}

// Keep default export for backward compatibility
export default DreamSymbolContent;
