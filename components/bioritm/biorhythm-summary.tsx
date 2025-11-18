"use client";

import { Card } from "@/components/ui/card";

export interface BiorhythmSummaryProps {
  summary: string;
  physical: number;
  emotional: number;
  intellectual: number;
}

interface CycleIndicator {
  name: string;
  value: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

export function BiorhythmSummary({
  summary,
  physical,
  emotional,
  intellectual,
}: BiorhythmSummaryProps) {
  // Cycle indicators with colors matching the chart
  const cycles: CycleIndicator[] = [
    {
      name: "Fizic",
      value: physical,
      color: "#ef4444",
      gradientFrom: "#ef4444",
      gradientTo: "#fca5a5",
    },
    {
      name: "Emoțional",
      value: emotional,
      color: "#3b82f6",
      gradientFrom: "#3b82f6",
      gradientTo: "#93c5fd",
    },
    {
      name: "Intelectual",
      value: intellectual,
      color: "#10b981",
      gradientFrom: "#10b981",
      gradientTo: "#6ee7b7",
    },
  ];

  return (
    <Card className="w-full p-6 md:p-8">
      <div className="space-y-6">
        {/* Heading */}
        <h3 className="text-xl md:text-2xl font-semibold text-white">Interpretare</h3>

        {/* Summary Text */}
        <p className="text-base leading-relaxed text-[#D0D0D0]">{summary}</p>

        {/* Cycle Indicators */}
        <div className="space-y-4 pt-2">
          {cycles.map((cycle, index) => {
            const percentage = Math.round(cycle.value * 100);
            const absPercentage = Math.abs(percentage);
            const fillPercentage = Math.min(absPercentage, 100);
            const isNegative = percentage < 0;

            return (
              <div key={index} className="space-y-2">
                {/* Cycle Name and Percentage */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{cycle.name}</span>
                  <span className="text-sm font-medium" style={{ color: cycle.color }}>
                    {percentage > 0 ? "+" : ""}
                    {percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-6 rounded-full overflow-hidden bg-[oklch(1_0_0_/_0.12)]">
                  {/* Fill Bar */}
                  <div
                    className="absolute top-0 h-full rounded-full transition-all duration-300"
                    style={{
                      background: `linear-gradient(90deg, ${cycle.gradientFrom}, ${cycle.gradientTo})`,
                      width: `${fillPercentage}%`,
                      left: isNegative ? "auto" : "0",
                      right: isNegative ? "0" : "auto",
                    }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={-100}
                    aria-valuemax={100}
                    aria-label={`${cycle.name}: ${percentage}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
