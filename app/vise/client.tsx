"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon, Sparkles, BookOpen, Brain } from "lucide-react";
import type { StaticDreamSymbol } from "@/lib/dream-data";

// ============================================================================
// Analytics Tracking (non-intrusive, respects user privacy)
// ============================================================================

/**
 * Track user intent for feature interest
 * Uses simple analytics events, no email capture
 */
function trackIntent(intent: "dictionary" | "ai-interpretation") {
  // Send to analytics (e.g., Google Analytics, Plausible, etc.)
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag(
      "event",
      "feature_interest",
      {
        feature: intent,
        page: "/vise",
      }
    );
  }

  // Also log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] User expressed interest in: ${intent}`);
  }
}

// ============================================================================
// Components
// ============================================================================

interface ViseClientProps {
  featuredSymbols: StaticDreamSymbol[];
}

/**
 * Dream Dictionary Hub Client Component
 *
 * Features:
 * - Hero section with mystic branding
 * - Link to daily dream widget
 * - Teaser grid of 7 featured symbols
 * - Intent capture CTAs (analytics only)
 * - Educational content
 */
export function ViseClient({ featuredSymbols }: ViseClientProps) {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40">
          <Moon className="h-8 w-8 text-[#9F2BFF]" />
        </div>
        <h2 className="text-3xl font-bold text-white">Interpretare Vise</h2>
        <p className="text-[#E0E0E0] max-w-2xl mx-auto">
          Descoperă semnificația viselor tale prin simboluri onirice tradiționale
          românești. Explorează interpretări profunde și mesaje din subconștient.
        </p>
      </div>

      {/* Daily Dream Link - Primary CTA */}
      <div className="max-w-md mx-auto">
        <Link href="/vise/visul-zilei">
          <Button
            variant="secondary"
            className="w-full h-auto py-4 px-6 flex flex-col items-start gap-2 hover:border-[#9F2BFF]/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#9F2BFF]" />
              <span className="font-semibold text-white">Visul Zilei</span>
            </div>
            <span className="text-sm text-[#E0E0E0]/80 text-left">
              Descoperă simbolul zilei și semnificația sa mistică
            </span>
          </Button>
        </Link>
      </div>

      {/* Featured Symbols Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Simboluri Populare
          </h3>
          <p className="text-sm text-[#E0E0E0]/70">
            Explorează cele mai căutate interpretări de vise
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredSymbols.map((symbol) => (
            <Link key={symbol.slug} href={`/vise/${symbol.slug}`}>
              <Card className="p-4 h-full hover:border-[#9F2BFF]/60 transition-all hover:scale-[1.02] cursor-pointer group">
                <div className="space-y-2">
                  <h4 className="font-semibold text-white group-hover:text-[#9F2BFF] transition-colors">
                    {symbol.name}
                  </h4>
                  <p className="text-xs text-[#E0E0E0]/60 capitalize">
                    {symbol.category}
                  </p>
                  <p className="text-sm text-[#E0E0E0] line-clamp-2">
                    {symbol.shortMeaning}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Intent Capture CTAs */}
      <Card className="p-6 space-y-4 bg-gradient-to-br from-[#9F2BFF]/5 to-transparent border-[#9F2BFF]/20">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">
            Vrei mai multe interpretări?
          </h3>
          <p className="text-sm text-[#E0E0E0]/80">
            Ajută-ne să îmbunătățim dicționarul de vise
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            className="gap-2 hover:border-[#9F2BFF]/60"
            onClick={() => trackIntent("dictionary")}
          >
            <BookOpen className="h-4 w-4" />
            <span>Vreau dicționar complet</span>
          </Button>

          <Button
            variant="outline"
            className="gap-2 hover:border-[#9F2BFF]/60"
            onClick={() => trackIntent("ai-interpretation")}
          >
            <Brain className="h-4 w-4" />
            <span>Vreau interpretare AI</span>
          </Button>
        </div>

        <p className="text-xs text-center text-[#E0E0E0]/50">
          Feedback-ul tău ne ajută să dezvoltăm funcționalități noi
        </p>
      </Card>

      {/* Educational Content */}
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-3 text-white">
            Despre Interpretarea Viselor
          </h3>
          <div className="space-y-3 text-[#E0E0E0]">
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

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-3 text-white">
            Categorii de Simboluri
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <span className="text-[#E0E0E0]">Animale</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-[#E0E0E0]">Natură</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-[#E0E0E0]">Obiecte</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-400" />
              <span className="text-[#E0E0E0]">Emoții</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="text-[#E0E0E0]">Persoane</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-400" />
              <span className="text-[#E0E0E0]">Acțiuni</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-[#E0E0E0]">Locuri</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
