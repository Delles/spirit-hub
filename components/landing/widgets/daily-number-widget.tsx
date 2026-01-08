import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface DailyNumberData {
  number: number;
  title: string;
  description: string;
  date: string;
}

interface DailyNumberWidgetProps {
  data: DailyNumberData | null;
  className?: string;
}

export function DailyNumberWidget({ data, className }: DailyNumberWidgetProps) {
  if (!data) return null;

  return (
    <Link
      href="/numerologie/numar-zilnic"
      className={cn(
        "group relative flex flex-col justify-between p-8 rounded-[20px] overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(159,43,255,0.2)]",
        // Glassmorphism with subtle blur
        "bg-black/5 backdrop-blur-sm",
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.01)_0%,rgba(159,43,255,0.02)_100%)]",
        // Visible border for card definition
        "border border-white/10 hover:border-white/20",
        // Minimal shadow
        "shadow-[0_2px_16px_rgba(0,0,0,0.15)]",
        className
      )}
    >
      {/* Header */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="text-white font-bold text-xl">Numerologie</h3>
          <p className="text-sm text-white/60 font-medium uppercase tracking-wider">
            {data.title}
          </p>
        </div>

        {/* Geometric Number Icon (Abstract representation) */}
        <div className="w-10 h-10 rounded-full border border-[#9F2BFF]/40 flex items-center justify-center bg-[#9F2BFF]/10 group-hover:bg-[#9F2BFF]/20 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9F2BFF]">
            <path d="M19 13C19 17.4183 15.4183 21 11 21C6.58172 21 3 17.4183 3 13C3 8.58172 6.58172 5 11 5C15.4183 5 19 8.58172 19 13Z" stroke="currentColor" strokeWidth="2" />
            <path d="M19 5L14 13L19 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Main Content - Left Aligned */}
      <div className="relative z-10 flex-1 flex flex-col items-start justify-center py-6 space-y-2">
        <Badge className="bg-[#9F2BFF]/20 text-[#E0E0E0] hover:bg-[#9F2BFF]/30 border-[#9F2BFF]/40 backdrop-blur-md">
          Cifra Zilei
        </Badge>
        <div className="relative">
          <div className="absolute inset-0 bg-[#9F2BFF]/20 blur-3xl rounded-full" />
          <span
            className="relative text-8xl font-bold text-white font-heading"
            style={{ textShadow: "0 0 20px rgba(144, 107, 232, 0.4)" }}
          >
            {data.number}
          </span>
        </div>
      </div>

      {/* Footer - Description */}
      <div className="relative z-10 mb-6">
        <p className="text-[#E0E0E0] text-sm leading-relaxed text-left">
          {data.description}
        </p>
      </div>

      {/* CTA */}
      <div className="relative z-10 flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
        <span>Vezi interpretarea completă</span>
        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
