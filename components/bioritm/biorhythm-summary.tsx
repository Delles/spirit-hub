"use client";

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
  // Cycle indicators with colors matching the chart (from design.json)
  // chart1 (Physical): oklch(0.6 0.28 300) - Purple
  // chart2 (Emotional): oklch(0.55 0.24 260) - Blue
  // chart3 (Intellectual): oklch(0.769 0.188 70.08) - Warm accent
  const cycles: CycleIndicator[] = [
    {
      name: "Fizic",
      value: physical,
      color: "oklch(0.6 0.28 300)",
      gradientFrom: "oklch(0.6 0.28 300)",
      gradientTo: "oklch(0.75 0.2 300)",
    },
    {
      name: "Emoțional",
      value: emotional,
      color: "oklch(0.55 0.24 260)",
      gradientFrom: "oklch(0.55 0.24 260)",
      gradientTo: "oklch(0.7 0.18 260)",
    },
    {
      name: "Intelectual",
      value: intellectual,
      color: "oklch(0.769 0.188 70.08)",
      gradientFrom: "oklch(0.769 0.188 70.08)",
      gradientTo: "oklch(0.85 0.14 70.08)",
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Heading */}
      <h3 className="text-xl md:text-2xl font-semibold text-white">Interpretare</h3>

      {/* Summary Text */}
      <p className="text-base leading-relaxed text-[#E0E0E0]">{summary}</p>

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
  );
}
