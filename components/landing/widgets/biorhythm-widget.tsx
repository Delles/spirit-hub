import { cn } from "@/lib/utils";
import Link from "next/link";

interface EnergiaZileiWidgetData {
  dayName: string;
  theme: string;
  shortHint: string;
  energyLevel: number;
  dominantEnergy: string;
  color: string;
  planetSymbol: string;
}

interface BiorhythmWidgetProps {
  data: EnergiaZileiWidgetData | null;
  className?: string;
}

export function BiorhythmWidget({ data, className }: BiorhythmWidgetProps) {
  if (!data) return null;

  // Use the color from energia zilei data
  const { color, energyLevel, dominantEnergy, theme, shortHint, planetSymbol } = data;

  // Generate accurate sine and cosine wave paths
  const width = 100;
  const height = 20;
  const centerY = height / 2;
  const amplitude = 8; // Peak-to-peak = 16, leaving 2px padding top/bottom

  const generateWavePath = (func: (x: number) => number, phaseShift = 0) => {
    let path = `M0 ${centerY - func(0 + phaseShift) * amplitude}`;
    for (let x = 1; x <= width; x++) {
      // 2 full cycles across the width (4PI)
      const angle = (x / width) * Math.PI * 4;
      const y = centerY - func(angle + phaseShift) * amplitude;
      path += ` L${x} ${y.toFixed(2)}`;
    }
    return path;
  };

  return (
    <Link
      href="/bioritm/energia-zilei"
      className={cn(
        "group relative flex flex-col justify-between p-8 rounded-[20px] overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(96,165,250,0.2)]",
        // Glassmorphism with subtle blur
        "bg-black/5 backdrop-blur-sm",
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.01)_0%,rgba(159,43,255,0.02)_100%)]",
        "border border-white/10 hover:border-white/20",
        "shadow-[0_2px_16px_rgba(0,0,0,0.15)]",
        className
      )}
    >
      {/* Mobile: Fully stacked | Desktop: Side-by-side with wave */}
      <div className="relative z-10 flex flex-col md:flex-row h-full">

        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-between md:pr-4">
          {/* Title badge */}
          <h3 className="font-medium text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-4 transition-colors duration-300" style={{ color }}>
            Energia Zilei
          </h3>

          {/* Theme with planet symbol */}
          <h4 className="text-white font-bold text-xl md:text-2xl font-heading leading-tight flex items-center gap-2 mb-2 md:mb-4">
            <span className="text-lg md:text-xl">{planetSymbol}</span>
            {theme}
          </h4>

          {/* Short hint */}
          <p className="text-[#E0E0E0] text-sm leading-relaxed opacity-80 mb-3 md:mb-4">
            {shortHint}
          </p>

          {/* Energy level */}
          <div className="flex items-baseline gap-2">
            <span
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{
                color,
                textShadow: `0 0 20px ${color}66`
              }}
            >
              {energyLevel}%
            </span>
            <span className="text-xs md:text-sm text-[#E0E0E0] uppercase tracking-wider opacity-60">
              {dominantEnergy}
            </span>
          </div>
        </div>

        {/* Wave Visualization - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex w-1/2 relative items-center justify-end opacity-60 group-hover:opacity-100 transition-opacity duration-500">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" style={{ transform: 'scale(1.5) translateX(10%)' }}>
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor={color} stopOpacity="0.2" />
                <stop offset="50%" stopColor={color} stopOpacity="0.8" />
                <stop offset="80%" stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            {/* Sine wave */}
            <path
              d={generateWavePath(Math.sin, 0)}
              fill="none"
              stroke={color}
              strokeWidth="1"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            />

            {/* Cosine wave */}
            <path
              d={generateWavePath(Math.cos, 0)}
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="1"
              opacity="0.7"
            />
          </svg>
        </div>

      </div>
    </Link>
  );
}
