"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getPlanetaryIcon } from "@/lib/planetary-icons";
import { Check, X, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import type { BiorhythmInterpretationData } from "@/lib/biorhythm";

// Re-export for consumers who import from this file
export type BiorhythmInterpretation = BiorhythmInterpretationData;

interface BiorhythmCardProps {
  interpretation: BiorhythmInterpretation;
  className?: string;
}

export function BiorhythmCard({ interpretation, className }: BiorhythmCardProps) {
  const IconComponent = getPlanetaryIcon(interpretation.hero.icon);

  return (
    <div
      className={cn("w-full space-y-6", className)}
      role="article"
      aria-label="Interpretare Bioritm"
    >
      {/* Main Container with Glassmorphism */}
      <Card className="w-full overflow-hidden bg-black/40 backdrop-blur-xl ring-1 ring-white/5 shadow-2xl">
        {/* 1. HERO SECTION */}
        <div className="relative overflow-hidden p-8 pt-10 text-white">
          {/* Subtle gradient overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-20",
              interpretation.theme.primary,
            )}
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Icon */}
            <div
              className={cn(
                "p-4 rounded-2xl mb-5 shadow-lg ring-1 ring-white/20 bg-opacity-20 backdrop-blur-md bg-gradient-to-br",
                interpretation.theme.primary,
              )}
            >
              <IconComponent size={32} className="text-white drop-shadow-md" aria-hidden="true" />
            </div>
            {/* Text Content */}
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2 font-medium">
              {interpretation.hero.subtitle}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80">
              {interpretation.hero.title}
            </h1>
            <p className="text-lg text-white/90 font-serif italic max-w-md mx-auto leading-relaxed">
              &ldquo;{interpretation.hero.headline}&rdquo;
            </p>
          </div>
        </div>

        <div className="px-6 pb-8 relative z-20 space-y-8">
          {/* 2. TAGS */}
          <div
            className="flex flex-wrap justify-center gap-2"
            role="list"
            aria-label="Teme principale"
          >
            {interpretation.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-white/5 hover:bg-white/10 text-white/80 border-white/10 backdrop-blur-sm px-3 py-1"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* 3. MAIN INSIGHT (3-Beat Rhythm) */}
          <div className="space-y-4">
            <div className="prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white prose-strong:font-semibold max-w-none">
              <ReactMarkdown>{interpretation.content.main_text}</ReactMarkdown>
            </div>
          </div>

          {/* 4. TACTICAL GRID */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Do's */}
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-5 backdrop-blur-sm space-y-3">
              <h3 className="text-emerald-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wide">
                <Check size={16} aria-hidden="true" /> Ce să faci
              </h3>
              <ul className="space-y-2">
                {interpretation.content.dos.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-emerald-500/50 mt-1" aria-hidden="true">
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Don'ts */}
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-5 backdrop-blur-sm space-y-3">
              <h3 className="text-amber-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wide">
                <X size={16} aria-hidden="true" /> Ce să eviți
              </h3>
              <ul className="space-y-2">
                {interpretation.content.donts.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-amber-500/50 mt-1" aria-hidden="true">
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 5. MANTRA */}
          <div className="mt-8 mb-4 text-center" role="complementary" aria-label="Mantra zilei">
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden group">
              <div
                className={cn(
                  "absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50",
                  interpretation.theme.primary,
                )}
              />
              <Quote className="w-8 h-8 text-white/10 mx-auto mb-4" aria-hidden="true" />
              <p className="font-serif text-xl italic text-white/95 mb-4 relative z-10">
                &ldquo;{interpretation.mantra}&rdquo;
              </p>
              <p className="text-xs uppercase tracking-widest text-white/40">Mantra Zilei</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
