import { DailyWidgetData } from "@/lib/daily-widget-server";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BiorhythmWidgetProps {
  data: DailyWidgetData["biorhythmHint"];
  className?: string;
}

export function BiorhythmWidget({ data, className }: BiorhythmWidgetProps) {
  if (!data) return null;

  // Map hint title to energy type and color
  const energyMap: Record<string, { type: string; percentage: number; color: string }> = {
    "Zi de Odihnă": { type: "Regenerare", percentage: 90, color: "#A5B4FC" },
    "Energie Fizică": { type: "Fizic", percentage: 85, color: "#F472B6" },
    "Claritate Mentală": { type: "Intelectual", percentage: 88, color: "#60A5FA" },
    "Echilibru Emoțional": { type: "Emoțional", percentage: 80, color: "#34D399" },
    "Creativitate": { type: "Creativ", percentage: 92, color: "#FBBF24" },
    "Socializare": { type: "Social", percentage: 85, color: "#F87171" },
    "Reflecție": { type: "Spiritual", percentage: 75, color: "#818CF8" },
  };

  const energy = energyMap[data.title] || { type: "General", percentage: 70, color: "#A5B4FC" };

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

  // Sine wave (white/pulsing)
  const sinePath = generateWavePath(Math.sin);
  
  // Cosine wave (colored)
  const cosinePath = generateWavePath(Math.cos);

  return (
    <Link
      href="/bioritm"
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
      
      <div className="relative z-10 flex flex-row h-full">
        
        {/* Left Side: Text & Info */}
        <div className="w-1/2 flex flex-col justify-between pr-4">
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4 transition-colors duration-300" style={{ color: energy.color }}>
              Sfatul Bioritmului
            </h3>
            
            <div className="space-y-1 mb-4">
              <h4 className="text-white font-bold text-2xl font-heading leading-tight">
                {data.title}
              </h4>
              <p className="text-[#E0E0E0] text-sm leading-relaxed opacity-80">
                {data.hint}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span 
                className="text-5xl font-bold text-white tracking-tight" 
                style={{ 
                  color: energy.color,
                  textShadow: `0 0 20px ${energy.color}66` // Adding 40% opacity (hex 66) to the energy color
                }}
              >
                {energy.percentage}%
              </span>
              <span className="text-sm text-[#E0E0E0] uppercase tracking-wider opacity-60">
                {energy.type}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Pure Visual Wave */}
        <div className="w-1/2 relative flex items-center justify-end opacity-60 group-hover:opacity-100 transition-opacity duration-500">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" style={{ transform: 'scale(1.5) translateX(10%)' }}>
             <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor={energy.color} stopOpacity="0.2" />
                <stop offset="50%" stopColor={energy.color} stopOpacity="0.8" />
                <stop offset="80%" stopColor={energy.color} stopOpacity="0.2" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            
            {/* Sine wave (thinner) */}
            <path 
              d={generateWavePath(Math.sin, 0)}
              fill="none" 
              stroke={energy.color}
              strokeWidth="1"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            />

            {/* Cosine wave (thinner, slightly offset phase/opacity for depth) */}
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
