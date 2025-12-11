"use client";

import { DreamDetailCard } from "@/components/vise/dream-detail-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { StaticDreamSymbol } from "@/lib/dream-data";

import { RelatedDreamsWidget } from "@/components/vise/related-dreams-widget";

interface DreamSymbolContentProps {
  dream: StaticDreamSymbol;
  relatedDreams?: StaticDreamSymbol[];
}

/**
 * Dream Symbol Content Component
 *
 * Displays the full interpretation for a dream symbol.
 * Receives pre-loaded data from parent server component (no loading states needed).
 */
export function DreamSymbolContent({ dream, relatedDreams }: DreamSymbolContentProps) {
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-sm text-[#E0E0E0]/60">
          <Link href="/" className="hover:text-white transition-colors">Acasă</Link>
          <span>/</span>
          <Link href="/vise" className="hover:text-white transition-colors">Vise</Link>
          <span>/</span>
          <Link href={`/vise?category=${dream.category}`} className="hover:text-white transition-colors capitalize">{dream.category}</Link>
          <span>/</span>
          <span className="text-white">{dream.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <Link href="/vise" className="inline-block">
              <Button
                variant="ghost"
                className="gap-2 pl-0 hover:pl-2 transition-all text-white/80 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Înapoi la dicționar
              </Button>
            </Link>

            <DreamDetailCard symbol={symbol} />

            {/* Inline Search for Mobile/Tablet */}
            <div className="lg:hidden mt-12 pt-8 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Caută alt vis</h3>
              {/* We can import DreamSearchHero here if we want, or keep it simple */}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Search Widget */}
            <div className="bg-[#1A1A2E]/50 p-6 rounded-xl border border-white/10 sticky top-24">
              <h3 className="text-xl font-semibold text-white mb-4">Caută alt simbol</h3>
              <p className="text-sm text-[#E0E0E0]/60 mb-4">
                Explorează alte semnificații din dicționarul nostru.
              </p>
              <Link href="/vise">
                <Button className="w-full bg-[#9F2BFF]/20 hover:bg-[#9F2BFF]/30 text-[#9F2BFF] border border-[#9F2BFF]/50">
                  Căutare Avansată
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep default export for backward compatibility
export default DreamSymbolContent;
