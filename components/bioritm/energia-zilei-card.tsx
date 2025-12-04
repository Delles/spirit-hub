"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EnergiaZileiData } from "@/lib/energia-zilei";
import type { MoonPhaseData } from "@/lib/moon-phase";
import { Check, X } from "lucide-react";

interface EnergiaZileiCardProps {
  energia: EnergiaZileiData;
  moonPhase: MoonPhaseData;
  className?: string;
}

export function EnergiaZileiCard({ energia, moonPhase, className }: EnergiaZileiCardProps) {
  return (
    <Card className={cn("p-6 lg:p-8 space-y-8", className)}>
      {/* Header - Planet & Theme */}
      <div className="text-center space-y-4">
        {/* Planet Symbol */}
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl"
          style={{
            backgroundColor: `${energia.color}15`,
            border: `2px solid ${energia.color}40`,
            boxShadow: `0 0 30px ${energia.color}20`,
          }}
        >
          {energia.planetSymbol}
        </div>

        {/* Planet Name & Day */}
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-wider text-[#E0E0E0]/60">
            {energia.dayName} • {energia.planet}
          </p>
          <h2
            className="text-2xl lg:text-3xl font-bold"
            style={{ color: energia.color }}
          >
            {energia.theme}
          </h2>
        </div>

        {/* Energy Level Bar */}
        <div className="max-w-xs mx-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#E0E0E0]/60">Nivel energetic</span>
            <span className="font-semibold" style={{ color: energia.color }}>
              {energia.energyLevel}%
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${energia.energyLevel}%`,
                backgroundColor: energia.color,
                boxShadow: `0 0 10px ${energia.color}`,
              }}
            />
          </div>
        </div>

        {/* Dominant Energy Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <span className="text-sm text-[#E0E0E0]/80">Energie dominantă:</span>
          <span className="text-sm font-medium text-white">{energia.dominantEnergy}</span>
        </div>
      </div>

      {/* Description */}
      <div className="text-center">
        <p className="text-[#E0E0E0] leading-relaxed max-w-2xl mx-auto">
          {energia.description}
        </p>
      </div>

      {/* Moon Phase Context */}
      <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10">
        <span className="text-2xl">{moonPhase.emoji}</span>
        <div className="text-left">
          <p className="text-xs uppercase tracking-wider text-[#E0E0E0]/50">Faza Lunii</p>
          <p className="text-sm text-white">{moonPhase.labelRo}</p>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white text-center">Sfaturi pentru Astăzi</h3>
        <div className="grid gap-2">
          {energia.tips.map((tip, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
            >
              <div
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ backgroundColor: `${energia.color}20`, color: energia.color }}
              >
                {index + 1}
              </div>
              <p className="text-sm text-[#E0E0E0] leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Embrace / Avoid Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* To Embrace */}
        <div className="space-y-3">
          <h4 className="text-base font-medium text-white flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${energia.color}20` }}
            >
              <Check className="w-4 h-4" style={{ color: energia.color }} />
            </span>
            Activități Recomandate
          </h4>
          <ul className="space-y-2">
            {energia.toEmbrace.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#E0E0E0]">
                <span style={{ color: energia.color }}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* To Avoid */}
        <div className="space-y-3">
          <h4 className="text-base font-medium text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500/20">
              <X className="w-4 h-4 text-red-400" />
            </span>
            De Evitat
          </h4>
          <ul className="space-y-2">
            {energia.toAvoid.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#E0E0E0]">
                <span className="text-red-400">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

