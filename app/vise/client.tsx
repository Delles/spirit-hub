"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Moon, Sparkles } from "lucide-react";
import { getAllSymbols, getRandomFeaturedSymbols } from "@/lib/dream-data";
import { DreamSearchHero } from "@/components/vise/dream-search-hero";

// ============================================================================
// Quick Links - Popular dream symbols for instant navigation
// ============================================================================

const QUICK_LINKS = [
  { name: "Șarpe", slug: "sarpe" },
  { name: "Apă", slug: "apa" },
  { name: "Casă", slug: "casa" },
  { name: "Pisică", slug: "pisica" },
  { name: "A cădea", slug: "a-cadea" },
];

// ============================================================================
// Loading Skeleton
// ============================================================================

function LoadingSkeleton() {
  return (
    <div className="space-y-10">
      {/* Hero skeleton */}
      <div className="text-center space-y-6 pt-4 md:pt-8">
        <div className="mx-auto h-14 w-14 rounded-full bg-white/10 animate-pulse" />
        <div className="h-12 w-72 mx-auto bg-white/10 rounded animate-pulse" />
        <div className="h-6 w-96 mx-auto bg-white/10 rounded animate-pulse" />
        <div className="h-12 w-full max-w-md mx-auto bg-white/10 rounded-lg animate-pulse" />
      </div>
      {/* Daily dream card skeleton */}
      <div className="h-32 bg-white/5 rounded-xl animate-pulse" />
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ViseClient() {
  const data = useQuery(api.daily.getDailyContent);

  // Loading state
  if (!data) {
    return <LoadingSkeleton />;
  }

  // Get dream data from static JSON using index from Convex
  const allSymbols = getAllSymbols();
  const dailyDream = allSymbols[data.dailyDreamIndex];

  // Get featured symbols using the same date for consistency
  const featuredSymbols = getRandomFeaturedSymbols(8, data.date);

  return (
    <div className="space-y-10">
      {/* Hero Section - Mobile First */}
      <div className="text-center space-y-6 pt-4 md:pt-8">
        <div className="mx-auto flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 mb-4">
          <Moon className="h-7 w-7 md:h-8 md:w-8 text-[#9F2BFF]" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Ce ai visat azi-noapte?
        </h1>

        <p className="text-base md:text-lg text-[#E0E0E0]/80 max-w-xl mx-auto px-4">
          Caută visul tău și află ce înseamnă. Peste 98 de interpretări din tradiția românească.
        </p>

        {/* Search Input */}
        <div className="pt-2 pb-4 px-4 md:px-0">
          <DreamSearchHero />
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 px-4">
          <span className="text-sm text-[#E0E0E0]/50">Popular:</span>
          {QUICK_LINKS.map((link, idx) => (
            <span key={link.slug} className="flex items-center">
              <Link
                href={`/vise/${link.slug}`}
                className="text-sm text-[#9F2BFF] hover:text-[#B366FF] transition-colors hover:underline"
              >
                {link.name}
              </Link>
              {idx < QUICK_LINKS.length - 1 && (
                <span className="text-[#E0E0E0]/30 ml-2">·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Daily Dream Card - Similar to homepage widget */}
      <div className="px-4 md:px-0">
        <Link
          href="/vise/visul-zilei"
          className="block group"
        >
          <Card className="p-6 md:p-8 bg-black/20 backdrop-blur-sm border border-white/10 hover:border-[#9F2BFF]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#9F2BFF]/10">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              {/* Left: Icon + Badge */}
              <div className="flex items-center gap-4 md:flex-col md:items-start">
                <div className="p-3 rounded-full bg-[#9F2BFF]/20 shrink-0">
                  <Sparkles className="h-6 w-6 text-[#9F2BFF]" />
                </div>
                <span className="text-xs text-[#9F2BFF] font-medium uppercase tracking-wider">
                  Visul Zilei
                </span>
              </div>

              {/* Center: Dream Name + Description */}
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#9F2BFF] transition-colors">
                  {dailyDream.name}
                </h3>
                <p className="text-sm text-[#E0E0E0]/70 leading-relaxed line-clamp-2 border-l-2 border-[#9F2BFF]/50 pl-3 italic">
                  {dailyDream.shortMeaning}
                </p>
              </div>

              {/* Right: Arrow */}
              <div className="hidden md:flex items-center justify-center text-[#9F2BFF] group-hover:translate-x-1 transition-transform">
                <span className="text-2xl">→</span>
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="mt-4 md:hidden">
              <span className="text-sm text-[#9F2BFF] font-medium">
                Vezi interpretarea completă →
              </span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Featured Dreams Grid - Random Daily Rotation */}
      <div className="space-y-5 px-4 md:px-0">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-1">
            Ce înseamnă visele tale?
          </h2>
          <p className="text-sm text-[#E0E0E0]/60">
            Interpretări populare din dicționarul viselor
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featuredSymbols.map((symbol) => (
            <Link key={symbol.slug} href={`/vise/${symbol.slug}`}>
              <Card className="p-4 h-full bg-black/20 backdrop-blur-sm border-white/10 hover:border-[#9F2BFF]/50 hover:bg-white/10 transition-all hover:-translate-y-0.5 cursor-pointer group">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white group-hover:text-[#9F2BFF] transition-colors text-sm md:text-base">
                    {symbol.name}
                  </h3>
                  <p className="text-xs text-[#E0E0E0]/80 line-clamp-2 leading-relaxed">
                    {symbol.shortMeaning}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Minimal Footer Text */}
      <div className="text-center px-4 pt-4">
        <p className="text-sm text-[#E0E0E0]/40">
          Interpretări bazate pe tradiții și folclor românesc
        </p>
      </div>
    </div>
  );
}
