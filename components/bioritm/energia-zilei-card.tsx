"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EnergiaZileiData } from "@/lib/energia-zilei";
import type { MoonGuideData } from "@/lib/moon-guide";
import { Check, X, Quote, Moon, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

interface EnergiaZileiCardProps {
  energia: EnergiaZileiData;
  moonGuide?: MoonGuideData;
  className?: string;
}

export function EnergiaZileiCard({ energia, moonGuide, className }: EnergiaZileiCardProps) {
  return (
    <div className={cn("w-full space-y-6", className)} role="article" aria-label="Energia Zilei">
      {/* Main Container with Glassmorphism */}
      <Card className="w-full overflow-hidden bg-black/40 backdrop-blur-xl ring-1 ring-white/5 shadow-2xl">

        {/* 1. HERO SECTION */}
        <div className="relative overflow-hidden p-8 pt-10 text-white">
          {/* Subtle gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${energia.theme.primary} opacity-20`} />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Planet Symbol */}
            <div className={`p-4 rounded-2xl mb-5 shadow-lg ring-1 ring-white/20 bg-gradient-to-br ${energia.theme.primary} bg-opacity-20 backdrop-blur-md`}>
              <span className="text-4xl text-white drop-shadow-md" aria-hidden="true">
                {energia.hero.icon}
              </span>
            </div>
            {/* Text Content */}
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2 font-medium">
              {energia.hero.subtitle}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80">
              {energia.hero.title}
            </h1>
            <p className="text-lg text-white/90 font-serif italic max-w-md mx-auto leading-relaxed">
              &ldquo;{energia.hero.headline}&rdquo;
            </p>
          </div>
        </div>

        <div className="px-6 pb-8 relative z-20 space-y-8">
          {/* 2. TAGS */}
          <div className="flex flex-wrap justify-center gap-2" role="list" aria-label="Teme zilei">
            {energia.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-white/5 hover:bg-white/10 text-white/80 border-white/10 backdrop-blur-sm px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>

          {/* 3. MAIN INSIGHT (3-Beat Rhythm) */}
          <div className="space-y-4">
            <div className="prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white prose-strong:font-semibold max-w-none">
              <ReactMarkdown>
                {energia.content.main_text}
              </ReactMarkdown>
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
                {energia.content.dos.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-emerald-500/50 mt-1" aria-hidden="true">•</span>
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
                {energia.content.donts.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-amber-500/50 mt-1" aria-hidden="true">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 5. MANTRA */}
          <div className="mt-8 mb-4 text-center" role="complementary" aria-label="Mantra zilei">
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden group">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${energia.theme.primary} opacity-50`} />
              <Quote className="w-8 h-8 text-white/10 mx-auto mb-4" aria-hidden="true" />
              <p className="font-serif text-xl italic text-white/95 mb-4 relative z-10">
                &ldquo;{energia.mantra}&rdquo;
              </p>
              <p className="text-xs uppercase tracking-widest text-white/40">Mantra Zilei</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 6. MOON GUIDE SECTION */}
      {moonGuide && (
        <Card className="w-full overflow-hidden bg-black/40 backdrop-blur-xl ring-1 ring-white/5 shadow-2xl">
          {/* Moon Header */}
          <div className="relative overflow-hidden p-6 text-white">
            <div className={`absolute inset-0 bg-gradient-to-br ${moonGuide.theme.primary} opacity-15`} />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Moon Emoji */}
              <div className={`p-3 rounded-xl mb-4 shadow-lg ring-1 ring-white/20 bg-gradient-to-br ${moonGuide.theme.primary} bg-opacity-20 backdrop-blur-md`}>
                <span className="text-3xl" aria-hidden="true">{moonGuide.emoji}</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Moon size={14} className={moonGuide.theme.accent} aria-hidden="true" />
                <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-medium">
                  Faza Lunii
                </p>
              </div>

              <h2 className="text-2xl font-bold mb-1 font-heading text-white">
                {moonGuide.title}
              </h2>
              <p className="text-sm text-white/60 italic">
                {moonGuide.subtitle}
              </p>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-6">
            {/* Moon Insight */}
            <div className="prose prose-invert prose-sm prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white max-w-none">
              <ReactMarkdown>
                {moonGuide.insight}
              </ReactMarkdown>
            </div>

            {/* Moon Guidance Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Guidance Tips */}
              <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-4 backdrop-blur-sm space-y-3">
                <h3 className="text-indigo-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wide">
                  <Sparkles size={14} aria-hidden="true" /> Recomandări
                </h3>
                <ul className="space-y-2">
                  {moonGuide.guidance.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="text-indigo-500/50 mt-1" aria-hidden="true">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Avoid */}
              <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-4 backdrop-blur-sm space-y-3">
                <h3 className="text-rose-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wide">
                  <X size={14} aria-hidden="true" /> De evitat
                </h3>
                <ul className="space-y-2">
                  {moonGuide.avoid.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="text-rose-500/50 mt-1" aria-hidden="true">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Moon Mantra */}
            <div className="text-center pt-2">
              <div className="relative p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${moonGuide.theme.primary} opacity-40`} />
                <Quote className="w-6 h-6 text-white/10 mx-auto mb-3" aria-hidden="true" />
                <p className="font-serif text-lg italic text-white/90 mb-2">
                  &ldquo;{moonGuide.mantra}&rdquo;
                </p>
                <p className="text-xs uppercase tracking-widest text-white/40">Mantra Lunară</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
