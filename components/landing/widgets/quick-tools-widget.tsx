import { cn } from "@/lib/utils";
import Link from "next/link";
import { Calculator, Moon, Activity } from "lucide-react";

interface QuickToolsWidgetProps {
  className?: string;
}

export function QuickToolsWidget({ className }: QuickToolsWidgetProps) {
  const tools = [
    {
      icon: Calculator,
      label: "Numerologie",
      link: "/numerologie",
      color: "text-[#C084FC]" // Purple-ish
    },
    {
      icon: Moon,
      label: "Interpretare Vise",
      link: "/vise",
      color: "text-[#818CF8]" // Indigo-ish
    },
    {
      icon: Activity,
      label: "Calculator Bioritm",
      link: "/bioritm",
      color: "text-[#F472B6]" // Pink-ish
    }
  ];

  return (
    <div className={cn(
      // Glassmorphism with subtle blur
      "bg-black/5 backdrop-blur-sm",
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.01)_0%,rgba(159,43,255,0.02)_100%)]",
      "border border-white/10 hover:border-white/20",
      "shadow-[0_2px_16px_rgba(0,0,0,0.15)]",
      "rounded-[20px] p-6 flex flex-col",
      className
    )}    >
      {/* Header */}
      <div className="w-full text-left mb-4">
        <h3 className="text-[#A5B4FC] font-medium text-sm uppercase tracking-wider">
          Explorează
        </h3>
      </div>
      
      {/* Tools */}
      <div className="flex items-start justify-between w-full px-2 gap-3 mt-10">
        {tools.map((tool, index) => (
          <Link 
            key={index} 
            href={tool.link}
            className="group flex flex-col items-center gap-2 transition-transform hover:scale-105 flex-1"
          >
            {/* Icon with dark purple circle background */}
            <div className={cn(
              "w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center bg-[#1a0b2e] border border-white/10 transition-all duration-300",
              "group-hover:bg-[#2D1B4E] group-hover:border-[#9F2BFF]/50 group-hover:shadow-[0_0_15px_rgba(159,43,255,0.4)]",
              "shadow-inner"
            )}>
              <tool.icon className={cn("w-5 h-5", tool.color)} strokeWidth={2} />
            </div>
            <span className="text-xs font-medium text-[#E0E0E0] text-center uppercase tracking-wide opacity-80 group-hover:opacity-100 group-hover:text-white transition-all w-full px-1">
              {tool.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
