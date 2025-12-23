"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/shared/share-button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import {
  Heart,
  Sparkles,
  User,
  CheckCircle2,
  AlertTriangle,
  Quote,
  Gem,
  Zap,
  ShieldCheck,
  LucideIcon
} from "lucide-react";
import type { CompatibilityInterpretation } from "@/lib/interpretations";

export interface CompatibilityCardProps {
  score: number;
  lifePathCompatibility: number;
  destinyCompatibility: number;
  interpretation: CompatibilityInterpretation;
  person1: {
    name: string;
    lifePath: number;
    destiny: number;
  };
  person2: {
    name: string;
    lifePath: number;
    destiny: number;
  };
  shareUrl?: string;
}

const masterNumbers = [11, 22, 33];

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Gem,
  Zap,
  ShieldCheck
};

export function CompatibilityCard({
  score,
  lifePathCompatibility,
  destinyCompatibility,
  interpretation,
  person1,
  person2,
  shareUrl = "",
}: CompatibilityCardProps) {
  const IconComponent = iconMap[interpretation.hero.icon] || Heart;

  return (
    <div className="w-full space-y-6">
      {/* Main Container with Glassmorphism */}
      <Card className={cn(
        "w-full overflow-hidden border-0 shadow-2xl",
        "bg-black/40 backdrop-blur-xl",
        "ring-1 ring-white/5"
      )}>

        {/* 1. HERO SECTION */}
        <div className="relative overflow-hidden p-8 pt-10 text-white">
          {/* Subtle gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${interpretation.theme.primary} opacity-20`} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Icon Box */}
            <div className={`p-4 rounded-full mb-6 shadow-xl ring-1 ring-white/20 bg-gradient-to-br ${interpretation.theme.primary} bg-opacity-20 backdrop-blur-md`}>
              <IconComponent size={40} className="text-white drop-shadow-md" />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 drop-shadow-sm">
              {interpretation.hero.title}
            </h1>

            {/* Headline */}
            <p className="text-lg font-medium text-white/90 italic max-w-lg mx-auto leading-relaxed opacity-90">
              &ldquo;{interpretation.hero.headline}&rdquo;
            </p>
          </div>
        </div>

        <div className="px-6 pb-8 relative z-20 space-y-8">

          {/* 2. SCORE DISPLAY & PERSONS */}
          <div className="pt-4 pb-2">
            {/* Large animated score */}
            <div className="flex justify-center mb-8">
              <div className="relative flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-white/10 bg-white/5 backdrop-blur-sm shadow-inner">
                <span className={`text-4xl font-bold bg-gradient-to-br ${interpretation.theme.primary} bg-clip-text text-transparent`}>
                  {score}%
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Compatibilitate</span>
              </div>
            </div>

            {/* Couple Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              {/* Person 1 used to be Tu */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
                  <div className="w-8 h-8 rounded-full bg-[#9F2BFF]/20 flex items-center justify-center text-[#9F2BFF]">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Partener 1</p>
                    <p className="font-semibold text-white">{person1.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-white/40 block text-xs">Calea Vieții</span>
                    <span className="text-[#9F2BFF] font-bold text-lg flex items-center gap-1">
                      {person1.lifePath}
                      {masterNumbers.includes(person1.lifePath) && <Sparkles size={12} className="text-yellow-400" />}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-xs">Destin</span>
                    <span className="text-[#9F2BFF] font-bold text-lg flex items-center gap-1">
                      {person1.destiny}
                      {masterNumbers.includes(person1.destiny) && <Sparkles size={12} className="text-yellow-400" />}
                    </span>
                  </div>
                </div>
              </div>

              {/* Connection Icon (Hidden on mobile) */}
              <div className="hidden md:flex flex-col items-center justify-center text-white/20">
                <div className="h-8 w-px bg-current"></div>
                <Heart className={`w-6 h-6 my-2 text-white/40 fill-white/10`} />
                <div className="h-8 w-px bg-current"></div>
              </div>

              {/* Person 2 */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
                  <div className="w-8 h-8 rounded-full bg-[#4D5FFF]/20 flex items-center justify-center text-[#4D5FFF]">
                    <Heart size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Partener 2</p>
                    <p className="font-semibold text-white">{person2.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-white/40 block text-xs">Calea Vieții</span>
                    <span className="text-[#4D5FFF] font-bold text-lg flex items-center gap-1">
                      {person2.lifePath}
                      {masterNumbers.includes(person2.lifePath) && <Sparkles size={12} className="text-yellow-400" />}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-xs">Destin</span>
                    <span className="text-[#4D5FFF] font-bold text-lg flex items-center gap-1">
                      {person2.destiny}
                      {masterNumbers.includes(person2.destiny) && <Sparkles size={12} className="text-yellow-400" />}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. TAGS */}
          <div className="flex flex-wrap justify-center gap-2">
            {interpretation.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-white/5 hover:bg-white/10 text-white/80 border-white/10 px-3 py-1 text-xs backdrop-blur-sm transition-all"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* 4. MAIN INSIGHT */}
          <div className="space-y-4">
            <div className="prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white prose-strong:font-semibold max-w-none text-center sm:text-left">
              <ReactMarkdown>
                {interpretation.content.main_text}
              </ReactMarkdown>
            </div>
          </div>

          {/* 5. TACTICAL GRID (Dos & Donts) */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
            {/* Dos Card */}
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-5 backdrop-blur-sm">
              <h3 className="font-semibold text-emerald-400 flex items-center gap-2 mb-4 text-base">
                <CheckCircle2 className="w-4 h-4" /> Ce să faceți
              </h3>
              <ul className="space-y-3">
                {interpretation.content.dos.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-300 items-start">
                    <div className="w-1 h-1 rounded-full bg-emerald-500/60 mt-2 shrink-0" />
                    <span className="leading-relaxed opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Donts Card */}
            <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-5 backdrop-blur-sm">
              <h3 className="font-semibold text-rose-400 flex items-center gap-2 mb-4 text-base">
                <AlertTriangle className="w-4 h-4" /> La ce să fiți atenți
              </h3>
              <ul className="space-y-3">
                {interpretation.content.donts.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-300 items-start">
                    <div className="w-1 h-1 rounded-full bg-rose-500/60 mt-2 shrink-0" />
                    <span className="leading-relaxed opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 6. MANTRA */}
          <div className="mt-8 mb-4 text-center">
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 ring-1 ring-white/5 overflow-hidden group">
              <Quote className="w-6 h-6 text-white/20 mx-auto mb-4" />
              <p className="relative z-10 font-serif text-lg italic leading-relaxed text-white/90 drop-shadow-md">
                &ldquo;{interpretation.content.mantra}&rdquo;
              </p>
            </div>
          </div>

          {/* Footer Share Button */}
          <div className="pt-4 border-t border-white/5 flex justify-center">
            <ShareButton
              url={shareUrl}
              title={`Compatibilitatea noastră este ${score}% - ${interpretation.hero.title}`}
              text={`${person1.name} și ${person2.name} au o compatibilitate de ${score}%: ${interpretation.hero.title}. "${interpretation.hero.headline}" Descoperă pe SpiritHub.ro`}
            />
          </div>

        </div>
      </Card>
    </div>
  );
}
