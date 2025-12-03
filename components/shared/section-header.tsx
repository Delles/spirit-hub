"use client";

import { BreadcrumbNav } from "./breadcrumb-nav";

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-black/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.01)_0%,rgba(159,43,255,0.02)_100%)] backdrop-blur-sm fixed top-0 left-0 right-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <BreadcrumbNav />
        {title && (
          <div className="mt-4 pb-2 text-center space-y-1">
            <h1
              className="text-white font-bold"
              style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-[#A5B4FC] text-sm">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

