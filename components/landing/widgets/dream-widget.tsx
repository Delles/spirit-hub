import { DailyWidgetData } from "@/lib/daily-widget-server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DreamWidgetProps {
  data: DailyWidgetData["dailyDream"];
  className?: string;
}

export function DreamWidget({ data, className }: DreamWidgetProps) {
  if (!data) return null;

  return (
    <Link
      href="/vise/visul-zilei"
      className={cn(
        // Mobile: compact stacked | Desktop: spread to fill height
        "group relative flex flex-col gap-4 md:gap-0 md:justify-between p-8 rounded-[20px] overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(159,43,255,0.2)]",
        // Glassmorphism with subtle blur
        "bg-black/5 backdrop-blur-sm",
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.01)_0%,rgba(159,43,255,0.02)_100%)]",
        "border border-white/10 hover:border-white/20",
        "shadow-[0_2px_16px_rgba(0,0,0,0.15)]",
        className
      )}
    >
      
      {/* Top Content */}
      <div className="relative z-10 space-y-4 md:space-y-6">
        <div className="space-y-3 md:space-y-4">
          <Badge className="bg-[#9F2BFF]/20 text-[#E0E0E0] hover:bg-[#9F2BFF]/30 border-[#9F2BFF]/40 backdrop-blur-md">
            Simbolul Viselor
          </Badge>
          
          <div>
            <span className="text-xs md:text-sm text-white/60 font-medium uppercase tracking-wider block mb-1">
              Visul Zilei
            </span>
            <h2 className="text-white font-heading text-2xl md:text-3xl font-bold leading-tight">
              {data.name}
            </h2>
          </div>
        </div>

        <p className="text-[#E0E0E0] text-sm italic border-l-2 border-[#9F2BFF]/50 pl-3 leading-relaxed">
          {data.shortDescription}
        </p>
      </div>

      {/* Bottom Action */}
      <div className="relative z-10">
        <Button 
          variant="outline" 
          className="rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white backdrop-blur-md w-auto px-6 h-9 text-xs uppercase tracking-wider transition-all duration-300 hover:border-[#9F2BFF]/50"
        >
          Dicționar Vise
        </Button>
      </div>
    </Link>
  );
}
