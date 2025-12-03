"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/shared/share-button";
import { Heart, Sparkles } from "lucide-react";

export interface CompatibilityCardProps {
  score: number;
  interpretation: {
    title: string;
    description: string;
    fullText: string;
  };
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
}

const masterNumbers = [11, 22, 33];

export function CompatibilityCard({
  score,
  interpretation,
  person1,
  person2,
}: CompatibilityCardProps) {
  // Determine color based on score
  const getScoreColor = (s: number) => {
    if (s >= 76)
      return {
        badge: "bg-green-500/20 border-green-500/30 text-green-200",
        gradient: "from-green-400 to-emerald-400",
        glow: "bg-green-500/20",
      };
    if (s >= 51)
      return {
        badge: "bg-blue-500/20 border-blue-500/30 text-blue-200",
        gradient: "from-blue-400 to-cyan-400",
        glow: "bg-blue-500/20",
      };
    if (s >= 26)
      return {
        badge: "bg-yellow-500/20 border-yellow-500/30 text-yellow-200",
        gradient: "from-yellow-400 to-amber-400",
        glow: "bg-yellow-500/20",
      };
    return {
      badge: "bg-red-500/20 border-red-500/30 text-red-200",
      gradient: "from-red-400 to-rose-400",
      glow: "bg-red-500/20",
    };
  };

  const colors = getScoreColor(score);

  return (
    <Card className="w-full">
      <CardHeader className="px-6 pt-6 pb-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <Heart className="h-6 w-6" />
              Compatibilitate Numerologică
            </CardTitle>
            <CardDescription className="text-[#E0E0E0]/60">
              {interpretation.title}
            </CardDescription>
          </div>
          <Badge variant="secondary" className={`ml-2 ${colors.badge}`}>
            {score}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Large animated score display */}
        <div className="flex items-center justify-center py-8">
          <div className="relative animate-in fade-in zoom-in duration-500">
            {/* Glow effect */}
            <div className={`absolute inset-0 ${colors.glow} blur-3xl rounded-full`} />

            {/* Score */}
            <div
              className={`relative text-7xl font-bold bg-gradient-to-br ${colors.gradient} bg-clip-text text-transparent`}
            >
              {score}
              <span className="text-4xl">%</span>
            </div>
          </div>
        </div>

        {/* Two-column layout with both people's numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Person 1 */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-[#E0E0E0]/60 mb-3">Persoana 1</p>
            <p className="text-lg font-semibold mb-4 text-white">{person1.name}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#E0E0E0]">Calea Vieții:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#9F2BFF]">{person1.lifePath}</span>
                  {masterNumbers.includes(person1.lifePath) && (
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#E0E0E0]">Destinul:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#9F2BFF]">{person1.destiny}</span>
                  {masterNumbers.includes(person1.destiny) && (
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Person 2 */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-[#E0E0E0]/60 mb-3">Persoana 2</p>
            <p className="text-lg font-semibold mb-4 text-white">{person2.name}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#E0E0E0]">Calea Vieții:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#9F2BFF]">{person2.lifePath}</span>
                  {masterNumbers.includes(person2.lifePath) && (
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#E0E0E0]">Destinul:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#9F2BFF]">{person2.destiny}</span>
                  {masterNumbers.includes(person2.destiny) && (
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-base text-[#E0E0E0] leading-relaxed">{interpretation.description}</p>
        </div>

        {/* Full interpretation */}
        <div className="max-w-none">
          <div className="text-[#E0E0E0] leading-relaxed whitespace-pre-line">
            {interpretation.fullText}
          </div>
        </div>

        {/* Share button */}
        <div className="pt-4 border-t border-white/10">
          <ShareButton
            url={typeof window !== "undefined" ? window.location.href : ""}
            title={`Compatibilitatea noastră numerologică este ${score}%`}
            text={`${person1.name} și ${person2.name} au o compatibilitate numerologică de ${score}%! ${interpretation.title}. Descoperă și tu pe SpiritHub.ro`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
