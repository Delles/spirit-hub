"use client";

import type { LucideIcon } from "lucide-react";
import type { Components } from "react-markdown";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Quote,
  Zap,
  BatteryLow,
  Heart,
  Lightbulb,
  BrainCircuit,
  Star,
  BatteryCharging,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import BIORHYTHM_DATA from "@/data/interpretations/biorhythm.json";

export interface CriticalDaysListProps {
  criticalDays: Array<{
    date: string; // ISO 8601 format
    cycles: ("physical" | "emotional" | "intellectual")[];
  }>;
}

// Icon map with proper typing
const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  BatteryLow,
  AlertTriangle,
  Heart,
  CloudRain: BatteryLow,
  Lightbulb,
  BrainCircuit,
  Star,
  BatteryCharging,
};

interface CycleInfo {
  type: "physical" | "emotional" | "intellectual";
  label: string;
  color: string;
  bgColor: string;
  glowColor: string;
  jsonKey: "physical_critical" | "emotional_critical" | "intellectual_critical";
}

const CYCLE_INFO: Record<string, CycleInfo> = {
  physical: {
    type: "physical",
    label: "Fizic",
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    glowColor: "rgba(239, 68, 68, 0.3)",
    jsonKey: "physical_critical",
  },
  emotional: {
    type: "emotional",
    label: "Emoțional",
    color: "#0EA5E9",
    bgColor: "rgba(14, 165, 233, 0.15)",
    glowColor: "rgba(14, 165, 233, 0.3)",
    jsonKey: "emotional_critical",
  },
  intellectual: {
    type: "intellectual",
    label: "Intelectual",
    color: "#EAB308",
    bgColor: "rgba(234, 179, 8, 0.15)",
    glowColor: "rgba(234, 179, 8, 0.3)",
    jsonKey: "intellectual_critical",
  },
};

const ROMANIAN_DAYS = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];

const ROMANIAN_MONTHS = [
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
];

const ROMANIAN_MONTHS_SHORT = [
  "ian", "feb", "mar", "apr", "mai", "iun",
  "iul", "aug", "sep", "oct", "nov", "dec",
];

// ✅ Memoized markdown components - defined outside component to avoid re-creation
const MARKDOWN_COMPONENTS: Components = {
  p: ({ children }) => (
    <p className="text-white/80 text-base leading-relaxed mb-4 last:mb-0">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="text-white font-bold">{children}</strong>
  ),
};

// ✅ Hydration-safe date formatter using UTC to avoid timezone mismatches
function formatRomanianDate(isoString: string): {
  formatted: string;
  dayOfWeek: string;
  short: string;
  dayNum: number;
} {
  const date = new Date(isoString);
  // Use UTC methods to ensure server/client consistency
  const day = date.getUTCDate();
  const monthIndex = date.getUTCMonth();
  const year = date.getUTCFullYear();
  const dayOfWeekIndex = date.getUTCDay();

  const month = ROMANIAN_MONTHS[monthIndex] ?? "???";
  const monthShort = ROMANIAN_MONTHS_SHORT[monthIndex] ?? "???";
  const dayOfWeek = ROMANIAN_DAYS[dayOfWeekIndex] ?? "???";

  return {
    formatted: `${day} ${month} ${year}`,
    dayOfWeek,
    short: `${day} ${monthShort}`,
    dayNum: day,
  };
}

// ✅ Defensive data access with validation
type BiorhythmKey = keyof typeof BIORHYTHM_DATA;

function getCycleData(jsonKey: string) {
  const data = BIORHYTHM_DATA[jsonKey as BiorhythmKey];
  if (!data?.hero?.icon || !data?.content?.main_text || !data?.mantra) {
    console.error(`[CriticalDaysList] Invalid biorhythm data for key: ${jsonKey}`);
    return null;
  }
  return data;
}

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

// Reusable glass card styles
const glassCardStyles = cn(
  "w-full overflow-hidden border-0",
  "bg-black/40 backdrop-blur-xl",
  "ring-1 ring-white/5 shadow-2xl"
);

export function CriticalDaysList({ criticalDays }: CriticalDaysListProps) {
  // Empty state
  if (!criticalDays || criticalDays.length === 0) {
    return (
      <Card className={cn(glassCardStyles, "p-8 relative")}>
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "linear-gradient(to bottom right, rgba(16, 185, 129, 0.1), transparent)" }}
        />
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-8 relative z-10">
          <div className="relative animate-in fade-in zoom-in duration-500">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150" />
            <div className={cn(
              "relative w-20 h-20 rounded-full",
              "bg-gradient-to-br from-emerald-400/20 to-emerald-600/20",
              "border border-emerald-500/30",
              "flex items-center justify-center backdrop-blur-md"
            )}>
              <Sparkles className="h-10 w-10 text-emerald-400" aria-hidden="true" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-bold font-heading text-white tracking-tight">
              Nicio zi critică
            </h3>
            <p className="text-lg text-emerald-100/80">în următoarele 30 de zile</p>
            <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
              Ciclurile tale bioritmice sunt stabile în această perioadă. Este un moment
              favorabil pentru activități importante și decizii majore.
            </p>
          </div>

          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm"
          )}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-emerald-300">Energie stabilă</span>
          </div>
        </div>
      </Card>
    );
  }

  const { cycleCounts, firstDate, lastDate } = getSummaryStats(criticalDays);

  return (
    <div className="space-y-12">
      {/* Summary Stats Card */}
      <Card className={cn(glassCardStyles, "relative p-8")}>
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: "linear-gradient(to bottom right, rgba(139, 92, 246, 0.1), transparent)" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold font-heading text-white tracking-tight">
              Raport Zile Critice
            </h2>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              {firstDate && lastDate && (
                <>
                  <span>{firstDate.short}</span>
                  <span>-</span>
                  <span>{lastDate.short}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <div className={cn(
                "text-5xl font-bold font-heading",
                "text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
              )}>
                {criticalDays.length}
              </div>
              <div className="text-xs uppercase tracking-widest text-white/40 font-semibold mt-1">
                Zile
              </div>
            </div>

            <div className="h-12 w-px bg-white/10" />

            <div className="flex flex-col gap-2">
              {Object.entries(cycleCounts).map(([cycle, count]) => {
                if (count === 0) return null;
                const info = CYCLE_INFO[cycle];
                return (
                  <div key={cycle} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="text-sm text-white/80">{info.label}:</span>
                    <span className="text-sm font-bold text-white">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Days Stream */}
      <div className="space-y-12">
        {criticalDays.map((day, index) => {
          const dateInfo = formatRomanianDate(day.date);

          // Skip days with empty cycles array
          if (day.cycles.length === 0) return null;

          return (
            <div key={day.date} className="space-y-6 relative">
              {/* Timeline Connector */}
              {index !== criticalDays.length - 1 && (
                <div className={cn(
                  "absolute left-[19px] top-[60px] bottom-[-48px] w-px",
                  "bg-gradient-to-b from-white/20 to-transparent",
                  "md:left-1/2 md:-translate-x-1/2 z-0 hidden md:block"
                )} />
              )}

              {/* Date Heading */}
              <div className={cn(
                "flex items-center gap-4 sticky top-4 z-30",
                "bg-black/80 backdrop-blur-md p-2 rounded-2xl",
                "border border-white/5 shadow-2xl",
                "md:justify-center md:w-fit md:mx-auto"
              )}>
                <div className={cn(
                  "flex flex-col items-center justify-center w-12 h-12 rounded-xl",
                  "bg-white/5 border border-white/10 shadow-inner"
                )}>
                  <span className="text-xs text-white/60 uppercase font-bold">
                    {dateInfo.dayOfWeek.substring(0, 3)}
                  </span>
                  <span className="text-lg font-bold text-white leading-none">
                    {dateInfo.dayNum}
                  </span>
                </div>
                <div className="hidden md:block">
                  <div className="text-lg font-bold text-white">{dateInfo.formatted}</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest">Zi Critică</div>
                </div>
                <div className="md:hidden">
                  <div className="text-base font-bold text-white">{dateInfo.formatted}</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest">
                    {dateInfo.dayOfWeek}
                  </div>
                </div>
              </div>

              {/* Cards for each cycle in this day */}
              <div className="grid grid-cols-1 gap-6">
                {day.cycles.map((cycle) => {
                  const info = CYCLE_INFO[cycle];
                  const data = getCycleData(info.jsonKey);

                  // Skip rendering if data is invalid
                  if (!data) return null;

                  const Icon = ICON_MAP[data.hero.icon] ?? AlertTriangle;

                  return (
                    <Card
                      key={`${day.date}-${cycle}`}
                      className={cn(glassCardStyles, "relative group")}
                    >
                      {/* Dynamic gradient overlay using inline style */}
                      <div
                        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(to bottom right, ${data.theme.hex}40, transparent)`
                        }}
                      />

                      {/* Hero Section */}
                      <div className={cn(
                        "relative p-6 md:p-8",
                        "flex flex-col md:flex-row items-start md:items-center gap-6",
                        "border-b border-white/5"
                      )}>
                        <div
                          className={cn(
                            "p-4 rounded-2xl shadow-lg",
                            "ring-1 ring-white/10 backdrop-blur-xl"
                          )}
                          style={{
                            background: `linear-gradient(to bottom right, ${data.theme.hex}30, ${data.theme.hex}10)`
                          }}
                        >
                          <Icon className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3
                              className="text-2xl font-bold font-heading tracking-tight"
                              style={{ color: data.theme.hex }}
                            >
                              {data.hero.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className="border-white/10 bg-white/5 text-white/70 backdrop-blur-md"
                            >
                              {data.hero.subtitle}
                            </Badge>
                          </div>
                          <p className="text-lg text-white/90 font-medium leading-relaxed">
                            &quot;{data.hero.headline}&quot;
                          </p>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 md:p-8 space-y-8">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {data.tags.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className={cn(
                                "bg-white/5 hover:bg-white/10",
                                "text-white/80 border-white/10 backdrop-blur-sm",
                                "px-3 py-1"
                              )}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Main Text - Using memoized ReactMarkdown components */}
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown components={MARKDOWN_COMPONENTS}>
                            {data.content.main_text}
                          </ReactMarkdown>
                        </div>

                        {/* Tactical Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Do's */}
                          <div className={cn(
                            "rounded-xl p-5 backdrop-blur-sm space-y-3",
                            "bg-emerald-500/5 border border-emerald-500/10",
                            "transition-colors hover:bg-emerald-500/10"
                          )}>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              <h4 className="font-bold text-emerald-100 uppercase tracking-wider text-xs">
                                Ce să faci
                              </h4>
                            </div>
                            <ul className="space-y-2">
                              {data.content.dos.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-emerald-50/90">
                                  <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Don'ts */}
                          <div className={cn(
                            "rounded-xl p-5 backdrop-blur-sm space-y-3",
                            "bg-amber-500/5 border border-amber-500/10",
                            "transition-colors hover:bg-amber-500/10"
                          )}>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-5 h-5 text-amber-400" />
                              <h4 className="font-bold text-amber-100 uppercase tracking-wider text-xs">
                                Ce să eviți
                              </h4>
                            </div>
                            <ul className="space-y-2">
                              {data.content.donts.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-amber-50/90">
                                  <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Mantra */}
                        <div className={cn(
                          "relative p-6 rounded-2xl text-center",
                          "bg-gradient-to-br from-white/5 to-white/0",
                          "border border-white/10"
                        )}>
                          <Quote className="w-6 h-6 text-white/20 mx-auto mb-4" />
                          <p className="font-serif text-xl italic text-white/90">
                            &quot;{data.mantra}&quot;
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
