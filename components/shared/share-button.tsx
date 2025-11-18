"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
}

export function ShareButton({ url, title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const canShare = typeof navigator !== "undefined" && "share" in navigator;

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
      await navigator.clipboard.writeText(url);
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
      className="gap-2 min-h-[44px]"
      aria-label={copied ? "Link copiat" : "Distribuie rezultatul"}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copiat!
        </>
      ) : (
        <>
          {canShare ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Distribuie
        </>
      )}
    </Button>
  );
}
