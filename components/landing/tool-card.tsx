"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * ToolCard - Client component for tool cards on landing page
 * Handles hover interactions and animations
 */
export function ToolCard({ href, icon, title, description }: ToolCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <div 
        className="h-full p-6 rounded-2xl border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg relative overflow-hidden bg-card/50 backdrop-blur-[20px] border-border"
      >
        {/* Hover Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10 flex flex-col h-full space-y-4">
          <div className="p-3 bg-muted/5 rounded-xl w-fit border border-border/50 group-hover:border-primary/30 transition-colors">
            {icon}
          </div>
          
          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary/80 transition-colors flex items-center gap-2">
              {title}
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

