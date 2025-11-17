"use client";

import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

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
}

const CYCLE_INFO: Record<string, CycleInfo> = {
  physical: {
    type: "physical",
    label: "Fizic",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.2)",
  },
  emotional: {
    type: "emotional",
    label: "Emoțional",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.2)",
  },
  intellectual: {
    type: "intellectual",
    label: "Intelectual",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.2)",
  },
};

const ROMANIAN_DAYS = [
  "Duminică",
  "Luni",
  "Marți",
  "Miercuri",
  "Joi",
  "Vineri",
  "Sâmbătă",
];

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

function formatRomanianDate(dateString: string): {
  formatted: string;
  dayOfWeek: string;
} {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = ROMANIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const dayOfWeek = ROMANIAN_DAYS[date.getDay()];

  return {
    formatted: `${day} ${month} ${year}`,
    dayOfWeek,
  };
}

function getCriticalDayGuidance(
  cycles: ("physical" | "emotional" | "intellectual")[]
): string {
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

export function CriticalDaysList({ criticalDays }: CriticalDaysListProps) {
  // Empty state
  if (!criticalDays || criticalDays.length === 0) {
    return (
      <Card className="w-full p-6 md:p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
          <CheckCircle className="h-12 w-12 text-[#10b981]" aria-hidden="true" />
          <p className="text-base text-white">
            Nu există zile critice în următoarele 30 de zile.
          </p>
          <p className="text-sm text-muted-foreground">
            Ciclurile tale sunt stabile în această perioadă.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-6 md:p-8">
      <div className="space-y-6">
        {/* Heading */}
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-semibold text-white">
            Zile Critice
          </h3>
          <p className="text-sm text-muted-foreground">
            Zilele când ciclurile tale trec prin zero necesită atenție sporită.
          </p>
        </div>

        {/* Critical Days List */}
        <div className="space-y-4">
          {criticalDays.map((day, index) => {
            const { formatted, dayOfWeek } = formatRomanianDate(day.date);
            const guidance = getCriticalDayGuidance(day.cycles);

            return (
              <div
                key={index}
                className="rounded-lg border border-[oklch(1_0_0_/_0.08)] bg-[oklch(0.18_0.03_280_/_0.3)] p-4 md:p-5 space-y-3"
              >
                {/* Date Header with Warning Icon */}
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="h-5 w-5 text-[#ef4444] flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <div className="text-base font-medium text-white">
                      {formatted}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {dayOfWeek}
                    </div>
                  </div>
                </div>

                {/* Affected Cycles */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-white">
                    Cicluri critice:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {day.cycles.map((cycle) => {
                      const info = CYCLE_INFO[cycle];
                      return (
                        <span
                          key={cycle}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: info.bgColor,
                            color: info.color,
                            border: `1px solid ${info.color}40`,
                          }}
                        >
                          {info.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Guidance Text */}
                {guidance && (
                  <p className="text-sm text-[#D0D0D0] leading-relaxed">
                    {guidance}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
