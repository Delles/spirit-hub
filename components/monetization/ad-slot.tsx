"use client";

import { useEffect } from "react";
import { adsenseClientId } from "@/config/monetization";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  slotId: string;
  className?: string;
  label?: string;
  format?: string;
}

export function AdSlot({
  slotId,
  className,
  label = "Publicitate",
  format = "auto",
}: AdSlotProps) {
  const isEnabled = Boolean(adsenseClientId && slotId);

  useEffect(() => {
    if (!isEnabled) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers and consent tools may block the script. The page should continue normally.
    }
  }, [isEnabled, slotId]);

  if (!isEnabled) return null;

  return (
    <aside
      className={cn(
        "w-full rounded-lg border border-white/10 bg-black/20 p-3 text-center",
        className
      )}
      aria-label={label}
    >
      <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-white/35">{label}</p>
      <ins
        className="adsbygoogle block min-h-[120px]"
        data-ad-client={adsenseClientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
