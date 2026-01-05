"use client";

import { useState, useEffect } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  label?: string;
  className?: string;
}

export function ShareButton({ url, title, text, label, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      setCanShare(true);
    }
  }, []);

  const handleShare = async () => {
    // Try Web Share API first (mobile)
    if (canShare) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url,
        });
        return;
      } catch (err) {
        // User cancelled or error - fall through to copy
        if ((err as Error).name === "AbortError") {
          return;
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      const shareContent = text ? `"${text}" ${url}` : url;
      await navigator.clipboard.writeText(shareContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className={cn("gap-2 min-h-[44px]", className)}
      aria-label={copied ? "Link copiat" : (label || "Distribuie rezultatul")}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copiat!
        </>
      ) : (
        <>
          {canShare ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {label || "Distribuie"}
        </>
      )}
    </Button>
  );
}
