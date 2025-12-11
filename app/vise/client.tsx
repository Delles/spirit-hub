"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon, Sparkles, BookOpen, Brain, X } from "lucide-react";
import type { StaticDreamSymbol } from "@/lib/dream-data";
import { DreamSearchHero } from "@/components/vise/dream-search-hero";
import { DreamCategoryGrid } from "@/components/vise/dream-category-grid";
import { DreamAZIndex } from "@/components/vise/dream-az-index";
import { DreamResultList } from "@/components/vise/dream-result-list";

interface SearchItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription?: string;
  interpretation?: string;
}

// ============================================================================
// Analytics Tracking (non-intrusive, respects user privacy)
// ============================================================================

function trackIntent(intent: "dictionary" | "ai-interpretation") {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as any).gtag("event", "feature_interest", {
      feature: intent,
      page: "/vise",
    });
  }
}

// ============================================================================
// Components
// ============================================================================

interface ViseClientProps {
  featuredSymbols: StaticDreamSymbol[];
}

export function ViseClient({ featuredSymbols }: ViseClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category");
  const letterParam = searchParams.get("letter");

  const [index, setIndex] = useState<SearchItem[]>([]);
  const [filteredSymbols, setFilteredSymbols] = useState<SearchItem[]>([]);
  const [isIndexLoaded, setIsIndexLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load index if filtering is active
  useEffect(() => {
    async function loadIndex() {
      if (isIndexLoaded) return;
      setIsLoading(true);
      try {
        const res = await fetch("/dreams-search-index.json");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const adapted = data.map((item: any) => ({
          ...item,
          id: item.slug,
          shortDescription: "Vezi semnificația completă..."
        }));
        setIndex(adapted);
        setIsIndexLoaded(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    if (categoryParam || letterParam) {
      loadIndex();
    }
  }, [categoryParam, letterParam, isIndexLoaded]);

  // Apply filters
  useEffect(() => {
    if (!index.length) return;

    let results = index;

    if (categoryParam) {
      results = results.filter(s => s.category.toLowerCase() === categoryParam.toLowerCase());
    } else if (letterParam) {
      results = results.filter(s => s.name.toUpperCase().startsWith(letterParam.toUpperCase()));
    }

    setFilteredSymbols(results);
  }, [index, categoryParam, letterParam]);

  const clearFilters = () => {
    router.push("/vise", { scroll: false });
  };

  const isFiltering = !!(categoryParam || letterParam);

  // If filtering, show results ONLY (cleaner UI)
  if (isFiltering) {
    return (
      <div className="space-y-8 min-h-[60vh]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {categoryParam && `Categorie: ${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}`}
            {letterParam && `Index: ${letterParam}`}
          </h2>
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="w-4 h-4" /> Șterge filtrele
          </Button>
        </div>

        <DreamResultList
          symbols={filteredSymbols as any}
          isLoading={isLoading}
          onSelectSymbol={(s) => router.push(`/vise/${s.slug}`)}
          emptyMessage="Nu am găsit vise pentru această selecție."
        />

        <div className="pt-8 border-t border-white/10">
          <h3 className="text-center text-white/60 mb-4">Caută altceva</h3>
          <DreamSearchHero />
        </div>
      </div>
    );
  }

  // Default Hub View
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8 pb-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 mb-6">
          <Moon className="h-8 w-8 text-[#9F2BFF]" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Ce ai visat azi-noapte?
        </h1>

        <p className="text-lg text-[#E0E0E0]/80 max-w-2xl mx-auto">
          Descoperă semnificația pentru peste 4000 de vise și mesaje din subconștient.
        </p>

        <div className="pt-4 pb-2">
          <DreamSearchHero />
        </div>
      </div>

      {/* Daily Dream Teaser */}
      <div className="max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
        <Link href="/vise/visul-zilei">
          <Button
            variant="secondary"
            className="w-full h-auto py-5 px-6 flex items-center justify-between gap-4 bg-gradient-to-r from-[#9F2BFF]/20 to-[#4F46E5]/20 border border-[#9F2BFF]/30 hover:border-[#9F2BFF]/60"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#9F2BFF]/20">
                <Sparkles className="h-5 w-5 text-[#9F2BFF]" />
              </div>
              <div className="text-left">
                <span className="block font-semibold text-white text-lg">Visul Zilei</span>
                <span className="text-xs text-[#E0E0E0]/80">Descoperă mesajul mistic de astăzi</span>
              </div>
            </div>
          </Button>
        </Link>
      </div>

      {/* Categories & Index */}
      <div className="space-y-12">
        <DreamCategoryGrid />
        <DreamAZIndex />
      </div>

      {/* Featured Symbols Grid */}
      <div className="space-y-6 pt-8 border-t border-white/5">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Simboluri Populare
          </h3>
          <p className="text-sm text-[#E0E0E0]/70">
            Cele mai căutate interpretări din ultima perioadă
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredSymbols.map((symbol) => (
            <Link key={symbol.slug} href={`/vise/${symbol.slug}`}>
              <Card className="p-4 h-full bg-white/5 border-white/10 hover:border-[#9F2BFF]/60 hover:bg-white/10 transition-all hover:-translate-y-1 cursor-pointer group">
                <div className="space-y-2">
                  <h4 className="font-semibold text-white group-hover:text-[#9F2BFF] transition-colors">
                    {symbol.name}
                  </h4>
                  <p className="text-xs text-[#E0E0E0]/60 capitalize px-2 py-0.5 rounded-full bg-black/20 w-fit">
                    {symbol.category}
                  </p>
                  <p className="text-sm text-[#E0E0E0]/80 line-clamp-2">
                    {symbol.shortMeaning}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Educational Content */}
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 bg-transparent border-white/10">
          <h3 className="text-xl font-semibold mb-3 text-white">
            Despre Interpretarea Viselor
          </h3>
          <div className="space-y-3 text-[#E0E0E0]/80">
            <p>
              <strong className="text-white">Tradiție românească:</strong>{" "}
              Interpretările noastre sunt bazate pe folclorul și tradițiile
              românești, transmise din generație în generație.
            </p>
            <p>
              <strong className="text-white">Simboluri universale:</strong>{" "}
              Visele folosesc un limbaj simbolic care transcende culturile,
              dar fiecare tradiție adaugă nuanțe specifice.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
