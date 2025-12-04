"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, Sparkles } from "lucide-react";

export interface CriticalDaysListProps {
  criticalDays: Array<{
    date: string; // ISO 8601 format: "YYYY-MM-DD"
    cycles: ("physical" | "emotional" | "intellectual")[];
  }>;
}

interface CycleInfo {
  type: "physical" | "emotional" | "intellectual";
  label: string;
  color: string;
  bgColor: string;
  glowColor: string;
}

// Colors from design.json chart palette
const CYCLE_INFO: Record<string, CycleInfo> = {
  physical: {
    type: "physical",
    label: "Fizic",
    color: "oklch(0.6 0.28 300)", // Purple (chart1)
    bgColor: "oklch(0.6 0.28 300 / 0.15)",
    glowColor: "oklch(0.6 0.28 300 / 0.3)",
  },
  emotional: {
    type: "emotional",
    label: "Emoțional",
    color: "oklch(0.55 0.24 260)", // Blue (chart2)
    bgColor: "oklch(0.55 0.24 260 / 0.15)",
    glowColor: "oklch(0.55 0.24 260 / 0.3)",
  },
  intellectual: {
    type: "intellectual",
    label: "Intelectual",
    color: "oklch(0.769 0.188 70.08)", // Warm amber (chart3)
    bgColor: "oklch(0.769 0.188 70.08 / 0.15)",
    glowColor: "oklch(0.769 0.188 70.08 / 0.3)",
  },
};

const ROMANIAN_DAYS = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];

const ROMANIAN_MONTHS = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
];

const ROMANIAN_MONTHS_SHORT = [
  "ian",
  "feb",
  "mar",
  "apr",
  "mai",
  "iun",
  "iul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

function formatRomanianDate(dateString: string): {
  formatted: string;
  dayOfWeek: string;
  short: string;
} {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = ROMANIAN_MONTHS[date.getMonth()];
  const monthShort = ROMANIAN_MONTHS_SHORT[date.getMonth()];
  const year = date.getFullYear();
  const dayOfWeek = ROMANIAN_DAYS[date.getDay()];

  return {
    formatted: `${day} ${month} ${year}`,
    dayOfWeek,
    short: `${day} ${monthShort}`,
  };
}

function getCriticalDayGuidance(cycles: ("physical" | "emotional" | "intellectual")[]): string {
  const hasPhysical = cycles.includes("physical");
  const hasEmotional = cycles.includes("emotional");
  const hasIntellectual = cycles.includes("intellectual");

  const parts: string[] = [];

  if (hasPhysical) {
    parts.push("efortul fizic");
  }
  if (hasEmotional) {
    parts.push("gestionarea emoțiilor");
  }
  if (hasIntellectual) {
    parts.push("deciziile importante");
  }

  if (parts.length === 0) return "";
  if (parts.length === 1) return `Fii atent la ${parts[0]}.`;
  if (parts.length === 2) return `Fii atent la ${parts[0]} și ${parts[1]}.`;

  return `Fii atent la ${parts[0]}, ${parts[1]} și ${parts[2]}.`;
}

// Calculate summary stats
function getSummaryStats(criticalDays: CriticalDaysListProps["criticalDays"]) {
  const cycleCounts = {
    physical: 0,
    emotional: 0,
    intellectual: 0,
  };

  criticalDays.forEach((day) => {
    day.cycles.forEach((cycle) => {
      cycleCounts[cycle]++;
    });
  });

  const firstDate = criticalDays.length > 0 ? formatRomanianDate(criticalDays[0].date) : null;
  const lastDate =
    criticalDays.length > 0
      ? formatRomanianDate(criticalDays[criticalDays.length - 1].date)
      : null;

  return { cycleCounts, firstDate, lastDate };
}

export function CriticalDaysList({ criticalDays }: CriticalDaysListProps) {
  // Empty state
  if (!criticalDays || criticalDays.length === 0) {
    return (
      <Card className="w-full p-6 md:p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
          {/* Glowing checkmark */}
          <div className="relative animate-in fade-in zoom-in duration-500">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-emerald-400" aria-hidden="true" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xl font-semibold text-white">
              Nicio zi critică în următoarele 30 de zile!
            </p>
            <p className="text-sm text-[#E0E0E0]/70 max-w-md">
              Ciclurile tale bioritmice sunt stabile în această perioadă. Este un moment
              favorabil pentru activități importante și decizii majore.
            </p>
          </div>

          {/* Positive energy indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-emerald-300">Energie stabilă</span>
          </div>
        </div>
      </Card>
    );
  }

  const { cycleCounts, firstDate, lastDate } = getSummaryStats(criticalDays);

  return (
    <div className="space-y-6">
      {/* Summary Stats Card */}
      <Card className="w-full p-6 md:p-8">
        <div className="space-y-6">
          {/* Main stat with glow */}
          <div className="flex flex-col items-center text-center">
            <div className="relative animate-in fade-in zoom-in duration-500">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#9F2BFF]/20 blur-3xl rounded-full scale-150" />
              {/* Number */}
              <div className="relative text-6xl md:text-7xl font-bold bg-gradient-to-br from-[#9F2BFF] to-[#4D5FFF] bg-clip-text text-transparent">
                {criticalDays.length}
              </div>
            </div>
            <p className="text-lg text-white mt-2 font-medium">
              {criticalDays.length === 1 ? "Zi Critică" : "Zile Critice"}
            </p>
            <p className="text-sm text-[#E0E0E0]/60 mt-1">în următoarele 30 de zile</p>
          </div>

          {/* Date range */}
          {firstDate && lastDate && (
            <div className="flex items-center justify-center gap-4 text-sm text-[#E0E0E0]/70">
              <span>Prima: <span className="text-white font-medium">{firstDate.short}</span></span>
              <span className="text-[#E0E0E0]/30">•</span>
              <span>Ultima: <span className="text-white font-medium">{lastDate.short}</span></span>
            </div>
          )}

          {/* Cycle breakdown badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Object.entries(cycleCounts).map(([cycle, count]) => {
              if (count === 0) return null;
              const info = CYCLE_INFO[cycle];
              return (
                <div
                  key={cycle}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: info.bgColor,
                    border: `1px solid ${info.color}`,
                    boxShadow: `0 0 20px ${info.glowColor}`,
                  }}
                >
                  <span className="text-sm font-medium" style={{ color: info.color }}>
                    {info.label}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: info.color, color: "#0C0B10" }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Critical Days List */}
      <Card className="w-full p-6 md:p-8">
        <div className="space-y-6">
          {/* Section Heading */}
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-semibold text-white">Calendar Zile Critice</h3>
            <p className="text-sm text-[#E0E0E0]/60">
              Zilele când ciclurile tale trec prin zero necesită atenție sporită.
            </p>
          </div>

          {/* Days List */}
          <div className="space-y-4">
            {criticalDays.map((day, index) => {
              const { formatted, dayOfWeek } = formatRomanianDate(day.date);
              const guidance = getCriticalDayGuidance(day.cycles);

              return (
                <div
                  key={index}
                  className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-4 md:p-5 space-y-4 transition-all duration-300 hover:border-[#9F2BFF]/30 hover:bg-[#9F2BFF]/5 animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Date Header with Warning Icon */}
                  <div className="flex items-start gap-3">
                    {/* Warning icon with glow */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-amber-500/30 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                        <AlertTriangle
                          className="h-5 w-5 text-amber-400"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-base md:text-lg font-semibold text-white">{formatted}</div>
                      <div className="text-sm text-[#E0E0E0]/60">{dayOfWeek}</div>
                    </div>

                    {/* Cycle count indicator */}
                    <div className="flex-shrink-0 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      <span className="text-xs font-medium text-[#E0E0E0]">
                        {day.cycles.length} {day.cycles.length === 1 ? "ciclu" : "cicluri"}
                      </span>
                    </div>
                  </div>

                  {/* Affected Cycles */}
                  <div className="flex flex-wrap gap-2">
                    {day.cycles.map((cycle) => {
                      const info = CYCLE_INFO[cycle];
                      return (
                        <span
                          key={cycle}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-transform duration-200 hover:scale-105"
                          style={{
                            backgroundColor: info.bgColor,
                            color: info.color,
                            border: `1px solid ${info.color}`,
                          }}
                        >
                          {info.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Guidance Text */}
                  {guidance && (
                    <p className="text-sm text-[#E0E0E0]/80 leading-relaxed pl-[52px]">
                      {guidance}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
