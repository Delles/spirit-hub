"use client";

import { useMemo, useState, useEffect } from "react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { Card } from "@/components/ui/card";

export interface BiorhythmChartProps {
  physical: number;
  emotional: number;
  intellectual: number;
  birthDate: string;
  targetDate: string;
}

interface CycleData {
  name: string;
  color: string;
  value: number;
  cycleDays: number;
}

export function BiorhythmChart({
  physical,
  emotional,
  intellectual,
  birthDate,
  targetDate,
}: BiorhythmChartProps) {
  // Chart dimensions
  const width = 800;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Determine window size based on viewport (desktop: 15 days, mobile: 11 days)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const daysWindow = useMemo(() => (isMobile ? 11 : 15), [isMobile]);
  const daysBefore = useMemo(() => Math.floor(daysWindow / 2), [daysWindow]);
  const daysAfter = useMemo(() => Math.floor(daysWindow / 2), [daysWindow]);

  // Cycle definitions - memoized to prevent unnecessary recalculations
  // Using design system chart colors from design.json:
  // chart1 (Physical): oklch(0.6 0.28 300) - Purple
  // chart2 (Emotional): oklch(0.55 0.24 260) - Blue
  // chart3 (Intellectual): oklch(0.769 0.188 70.08) - Warm accent
  const cycles: CycleData[] = useMemo(
    () => [
      { name: "Fizic", color: "oklch(0.6 0.28 300)", value: physical, cycleDays: 23 },
      { name: "Emoțional", color: "oklch(0.55 0.24 260)", value: emotional, cycleDays: 28 },
      { name: "Intelectual", color: "oklch(0.769 0.188 70.08)", value: intellectual, cycleDays: 33 },
    ],
    [physical, emotional, intellectual],
  );

  // Calculate sine wave paths
  const paths = useMemo(() => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    return cycles.map((cycle) => {
      const points: string[] = [];

      for (let i = -daysBefore; i <= daysAfter; i++) {
        const currentDate = new Date(target.getTime() + i * millisecondsPerDay);
        const daysLived = Math.floor(
          (currentDate.getTime() - birth.getTime()) / millisecondsPerDay,
        );

        // Calculate cycle value using sine wave
        const cycleValue = Math.sin((2 * Math.PI * daysLived) / cycle.cycleDays);

        // Map to chart coordinates
        const x = padding.left + ((i + daysBefore) / daysWindow) * chartWidth;
        const y = padding.top + chartHeight / 2 - (cycleValue * chartHeight) / 2;

        points.push(`${x},${y}`);
      }

      return {
        ...cycle,
        path: `M ${points.join(" L ")}`,
      };
    });
  }, [
    birthDate,
    targetDate,
    daysBefore,
    daysAfter,
    daysWindow,
    chartWidth,
    chartHeight,
    cycles,
    padding.left,
    padding.top,
  ]);

  // Calculate current day position
  const currentDayX = useMemo(
    () => padding.left + (daysBefore / daysWindow) * chartWidth,
    [daysBefore, daysWindow, padding.left, chartWidth],
  );

  // Check if target date is today
  const isToday = useMemo(() => {
    const target = new Date(targetDate);
    const today = new Date();
    return (
      target.getDate() === today.getDate() &&
      target.getMonth() === today.getMonth() &&
      target.getFullYear() === today.getFullYear()
    );
  }, [targetDate]);

  // Format date label: "Astăzi" if today, otherwise Romanian date format
  const dateLabel = useMemo(() => {
    if (isToday) {
      return "Astăzi";
    }
    const target = new Date(targetDate);
    return format(target, "dd MMMM yyyy", { locale: ro });
  }, [isToday, targetDate]);

  // Grid lines at -100%, -50%, 0%, +50%, +100% - memoized
  const gridLines = useMemo(
    () =>
      [-1, -0.5, 0, 0.5, 1].map((value) => {
        const y = padding.top + chartHeight / 2 - (value * chartHeight) / 2;
        return { y, value, isZero: value === 0 };
      }),
    [padding.top, chartHeight],
  );

  return (
    <Card className="w-full p-4 md:p-6">
      <div className="space-y-4">
        {/* Chart Title */}
        <h3 className="text-xl md:text-2xl font-semibold text-white">Grafic Bioritm</h3>

        {/* SVG Chart */}
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
              Grafic bioritm arătând ciclul fizic la {Math.round(physical * 100)}%, ciclul emoțional
              la {Math.round(emotional * 100)}%, și ciclul intelectual la{" "}
              {Math.round(intellectual * 100)}% pentru data de{" "}
              {new Date(targetDate).toLocaleDateString("ro-RO")}
            </desc>
            {/* Background Grid */}
            <g aria-hidden="true">
              {gridLines.map((line, index) => (
                <line
                  key={index}
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

            {/* Y-axis labels */}
            <g aria-hidden="true">
              {gridLines.map((line, index) => (
                <text
                  key={index}
                  x={padding.left - 10}
                  y={line.y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="white"
                  opacity="0.6"
                  fontSize="12"
                >
                  {line.value > 0 ? "+" : ""}
                  {Math.round(line.value * 100)}%
                </text>
              ))}
            </g>

            {/* Cycle Curves */}
            {paths.map((cycle, index) => (
              <g key={index} aria-label={`Ciclu ${cycle.name}`}>
                <path
                  d={cycle.path}
                  fill="none"
                  stroke={cycle.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-label={`${cycle.name}: ${Math.round(cycle.value * 100)}%`}
                />
              </g>
            ))}

            {/* Current Day Indicator */}
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

            {/* Value Markers at Current Day */}
            {paths.map((cycle, index) => {
              const y = padding.top + chartHeight / 2 - (cycle.value * chartHeight) / 2;
              return (
                <g
                  key={index}
                  aria-label={`${cycle.name} astăzi: ${Math.round(cycle.value * 100)}%`}
                >
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

        {/* Legend */}
        <div
          className="flex flex-wrap gap-4 justify-center md:justify-start"
          role="list"
          aria-label="Legendă cicluri bioritm"
        >
          {cycles.map((cycle, index) => (
            <div key={index} className="flex items-center gap-2" role="listitem">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: cycle.color }}
                aria-hidden="true"
              />
              <span className="text-sm text-white">{cycle.name}</span>
              <span className="text-sm text-muted-foreground">
                ({Math.round(cycle.value * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
