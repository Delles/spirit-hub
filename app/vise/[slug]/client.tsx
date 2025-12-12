"use client";

import { DreamDetailCard } from "@/components/vise/dream-detail-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, Sparkles, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { StaticDreamSymbol } from "@/lib/dream-data";

interface DreamSymbolContentProps {
  dream: StaticDreamSymbol;
}

/**
 * Dream Symbol Content Component
 *
 * Displays the full interpretation for a dream symbol.
 * Simplified single-column layout with CTA sections at bottom.
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
    <div className="py-6 md:py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <Link href="/vise" className="inline-block mb-6">
          <Button
            variant="ghost"
            className="gap-2 pl-0 hover:pl-2 transition-all text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la dicționar
          </Button>
        </Link>

        {/* Main Dream Card */}
        <DreamDetailCard symbol={symbol} />

        {/* CTA Section - Search More Dreams */}
        <div className="mt-8">
          <Card className="p-6 bg-gradient-to-br from-[#9F2BFF]/10 to-[#4F46E5]/10 border-[#9F2BFF]/20">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="p-3 rounded-full bg-[#9F2BFF]/20 shrink-0">
                <Search className="h-5 w-5 text-[#9F2BFF]" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-white text-lg">Descoperă alte vise</h3>
                <p className="text-sm text-[#E0E0E0]/70 mt-1">
                  Explorează dicționarul cu peste 98 de simboluri și semnificații
                </p>
              </div>
              <Link href="/vise" className="shrink-0">
                <Button className="gap-2 bg-[#9F2BFF] hover:bg-[#8B24E0] text-white min-h-[44px]">
                  Caută alt vis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Cross-Feature CTAs */}
        <div className="mt-10">
          <h3 className="text-center text-white/60 text-sm font-medium uppercase tracking-wider mb-5">
            Explorează alte funcții
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Numerologie CTA */}
            <Link href="/numerologie" className="block group">
              <Card className="p-5 h-full bg-white/5 border-white/10 hover:border-[#9F2BFF]/40 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/30 shrink-0 group-hover:bg-[#9F2BFF]/20 transition-colors">
                    <Sparkles className="h-5 w-5 text-[#9F2BFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-base group-hover:text-[#9F2BFF] transition-colors">
                      Numerologie
                    </h4>
                    <p className="text-sm text-[#E0E0E0]/70 mt-1 leading-relaxed">
                      Descoperă-ți calea vieții și numărul destinului
                    </p>
                    <span className="inline-flex items-center text-sm text-[#9F2BFF] mt-3 font-medium group-hover:translate-x-1 transition-transform">
                      Calculează
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Bioritm CTA */}
            <Link href="/bioritm" className="block group">
              <Card className="p-5 h-full bg-white/5 border-white/10 hover:border-[#9F2BFF]/40 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/30 shrink-0 group-hover:bg-[#9F2BFF]/20 transition-colors">
                    <Activity className="h-5 w-5 text-[#9F2BFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-base group-hover:text-[#9F2BFF] transition-colors">
                      Bioritm
                    </h4>
                    <p className="text-sm text-[#E0E0E0]/70 mt-1 leading-relaxed">
                      Află cum te afectează ciclurile bioenergetice
                    </p>
                    <span className="inline-flex items-center text-sm text-[#9F2BFF] mt-3 font-medium group-hover:translate-x-1 transition-transform">
                      Calculează
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Return Tomorrow Message */}
        <div className="text-center pt-8">
          <p className="text-sm text-[#E0E0E0]/50">
            ✨ Revino mâine pentru a descoperi noi simboluri în Visul Zilei ✨
          </p>
        </div>
      </div>
    </div>
  );
}

// Keep default export for backward compatibility
export default DreamSymbolContent;
