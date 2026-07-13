"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import type { BiorhythmReport } from "@/lib/biorhythm-report";
import type { CycleName } from "@/lib/biorhythm";

export interface BiorhythmChartProps {
  chartSeries: BiorhythmReport["chartSeries"];
  chartTargetIndex: number;
  cycles: BiorhythmReport["cycles"];
}

const CYCLE_NAMES: CycleName[] = ["physical", "emotional", "intellectual"];

export function BiorhythmChart({
  chartSeries,
  chartTargetIndex,
  cycles,
}: BiorhythmChartProps) {
  const width = 800;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const visibleRange = useMemo(() => {
    if (!isMobile) return { start: 0, end: chartSeries.length };

    const start = Math.max(0, chartTargetIndex - 3);
    const end = Math.min(chartSeries.length, chartTargetIndex + 4);
    return { start, end };
  }, [chartSeries.length, chartTargetIndex, isMobile]);

  const visibleSeries = chartSeries.slice(visibleRange.start, visibleRange.end);
  const visibleTargetIndex = chartTargetIndex - visibleRange.start;
  const targetPoint = visibleSeries[visibleTargetIndex] ?? visibleSeries[0];

  const chartCycles = useMemo(
    () =>
      CYCLE_NAMES.map((name) => ({
        name,
        label: cycles[name].name,
        color: cycles[name].color,
        values: visibleSeries.map((point) => point[name]),
      })),
    [cycles, visibleSeries],
  );

  const paths = useMemo(() => {
    const denominator = Math.max(visibleSeries.length - 1, 1);

    return chartCycles.map((cycle) => {
      const points = cycle.values.map((value, index) => {
        const x = padding.left + (index / denominator) * chartWidth;
        const y = padding.top + chartHeight / 2 - (value * chartHeight) / 2;
        return `${x},${y}`;
      });

      return { ...cycle, path: `M ${points.join(" L ")}` };
    });
  }, [chartCycles, chartHeight, chartWidth, padding.left, padding.top, visibleSeries.length]);

  const currentDayX =
    padding.left +
    (visibleTargetIndex / Math.max(visibleSeries.length - 1, 1)) *
      chartWidth;

  const isToday = useMemo(() => {
    if (!targetPoint) return false;
    const today = new Date();
    return (
      targetPoint.date.getDate() === today.getDate() &&
      targetPoint.date.getMonth() === today.getMonth() &&
      targetPoint.date.getFullYear() === today.getFullYear()
    );
  }, [targetPoint]);

  const dateLabel = targetPoint
    ? isToday
      ? "Astăzi"
      : format(targetPoint.date, "dd MMMM yyyy", { locale: ro })
    : "";

  const gridLines = [-1, -0.5, 0, 0.5, 1].map((value) => ({
    y: padding.top + chartHeight / 2 - (value * chartHeight) / 2,
    value,
    isZero: value === 0,
  }));

  return (
    <div className="w-full space-y-4">
      <div className="w-full overflow-x-auto" role="region" aria-label="Grafic bioritm">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[300px] md:max-h-[400px]"
          role="img"
          aria-labelledby="biorhythm-chart-title"
          aria-describedby="biorhythm-chart-desc"
        >
          <title id="biorhythm-chart-title">Grafic Bioritm</title>
          <desc id="biorhythm-chart-desc">
            Grafic bioritm arătând ciclul fizic la {Math.round((targetPoint?.physical ?? 0) * 100)}%,
            ciclul emoțional la {Math.round((targetPoint?.emotional ?? 0) * 100)}%, și ciclul intelectual
            la {Math.round((targetPoint?.intellectual ?? 0) * 100)}% pentru data de {dateLabel}.
          </desc>

          <g aria-hidden="true">
            {gridLines.map((line) => (
              <line
                key={line.value}
                x1={padding.left}
                y1={line.y}
                x2={width - padding.right}
                y2={line.y}
                stroke="white"
                strokeWidth="1"
                opacity={line.isZero ? 0.15 : 0.08}
                strokeDasharray={line.isZero ? "none" : "4 4"}
              />
            ))}
          </g>

          <g aria-hidden="true">
            {gridLines.map((line) => (
              <text
                key={line.value}
                x={padding.left - 10}
                y={line.y}
                textAnchor="end"
                dominantBaseline="middle"
                fill="white"
                opacity="0.6"
                fontSize="12"
              >
                {line.value > 0 ? "+" : ""}{Math.round(line.value * 100)}%
              </text>
            ))}
          </g>

          {paths.map((cycle) => (
            <g key={cycle.name} aria-label={`Ciclu ${cycle.label}`}>
              <path
                d={cycle.path}
                fill="none"
                stroke={cycle.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label={`${cycle.label}: ${Math.round((targetPoint?.[cycle.name] ?? 0) * 100)}%`}
              />
            </g>
          ))}

          <line
            x1={currentDayX}
            y1={padding.top}
            x2={currentDayX}
            y2={height - padding.bottom}
            stroke="white"
            strokeWidth="2"
            opacity="0.3"
            aria-hidden="true"
          />
          <text
            x={currentDayX}
            y={padding.top - 10}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            aria-hidden="true"
          >
            {dateLabel}
          </text>

          {paths.map((cycle) => {
            const value = targetPoint?.[cycle.name] ?? 0;
            const y = padding.top + chartHeight / 2 - (value * chartHeight) / 2;
            return (
              <g key={cycle.name} aria-label={`${cycle.label} astăzi: ${Math.round(value * 100)}%`}>
                <circle
                  cx={currentDayX}
                  cy={y}
                  r="8"
                  fill={cycle.color}
                  stroke="white"
                  strokeWidth="2"
                  aria-hidden="true"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap gap-4 justify-center md:justify-start" role="list" aria-label="Legendă cicluri bioritm">
        {chartCycles.map((cycle) => (
          <div key={cycle.name} className="flex items-center gap-2" role="listitem">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cycle.color }} aria-hidden="true" />
            <span className="text-sm text-white">{cycle.label}</span>
            <span className="text-sm text-muted-foreground">
              ({Math.round((targetPoint?.[cycle.name] ?? 0) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
