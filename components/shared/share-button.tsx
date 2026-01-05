"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, Check, Copy, Link, MessageCircle, Smartphone, Image, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ShareContentType =
  | 'calea-vietii'
  | 'destin'
  | 'numar-zilnic'
  | 'compatibilitate'
  | 'energia-zilei'
  | 'mesaj-zilnic';

export interface ShareButtonProps {
  /** Type of content for generating share images */
  contentType?: ShareContentType;
  /** ID or value for the content (number, score, date, etc.) */
  contentId?: string | number;
  /** URL to share (for link sharing) */
  url: string;
  /** Title for the share */
  title: string;
  /** Text/description for the share */
  text?: string;
  /** Button label */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

type ShareFormat = 'link' | 'story' | 'feed';

export function ShareButton({
  contentType,
  contentId,
  url,
  title,
  text,
  label,
  className
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<ShareFormat | null>(null);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if browser supports sharing files
    if (typeof navigator !== "undefined" && "canShare" in navigator) {
      // Test with a dummy file
      try {
        const testFile = new File(["test"], "test.png", { type: "image/png" });
        setCanShareFiles(navigator.canShare({ files: [testFile] }));
      } catch {
        setCanShareFiles(false);
      }
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleWhatsApp = () => {
    const shareText = text ? `${text}\n\n${url}` : url;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    setIsOpen(false);
  };

  const handleShareAsImage = async (format: 'story' | 'feed') => {
    if (!contentType || !contentId) {
      console.error("contentType and contentId required for image sharing");
      return;
    }

    setLoading(format);

    try {
      // Fetch the image from our API
      const imageUrl = `/api/og/${contentType}/${contentId}?format=${format}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `spirithub-${contentType}.png`, { type: "image/png" });

      // Try to share directly
      if (canShareFiles && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title,
        });
      } else {
        // Fallback: download the image
        downloadBlob(blob, `spirithub-${contentType}.png`);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed:", err);
      }
    } finally {
      setLoading(null);
      setIsOpen(false);
    }
  };

  const handleDownload = async () => {
    if (!contentType || !contentId) return;

    setLoading('story');
    try {
      const imageUrl = `/api/og/${contentType}/${contentId}?format=story`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      downloadBlob(blob, `spirithub-${contentType}.png`);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setLoading(null);
      setIsOpen(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasImageSupport = contentType && contentId;

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("gap-2 min-h-[44px]", className)}
        aria-label={label || "Distribuie"}
        aria-expanded={isOpen}
      >
        <Share2 className="h-4 w-4" />
        {label || "Distribuie"}
      </Button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 z-50 min-w-[220px] rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl p-2 space-y-1 animate-in fade-in-0 zoom-in-95">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted/50 text-muted-foreground"
            aria-label="Închide"
          >
            <X className="h-4 w-4" />
          </button>

          <p className="text-xs text-muted-foreground px-2 pt-1 pb-2">Distribuie ca link:</p>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 text-sm transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Link copiat!" : "Copiază link"}</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 text-sm transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </button>

          {hasImageSupport && (
            <>
              <div className="border-t border-border/50 my-2" />
              <p className="text-xs text-muted-foreground px-2 pb-2">Postează ca imagine:</p>

              {/* Story */}
              <button
                onClick={() => handleShareAsImage('story')}
                disabled={loading !== null}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 text-sm transition-colors disabled:opacity-50"
              >
                <Smartphone className="h-4 w-4" />
                <span>{loading === 'story' ? "Se încarcă..." : "Story (Instagram/TikTok)"}</span>
              </button>

              {/* Feed */}
              <button
                onClick={() => handleShareAsImage('feed')}
                disabled={loading !== null}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 text-sm transition-colors disabled:opacity-50"
              >
                <Image className="h-4 w-4" />
                <span>{loading === 'feed' ? "Se încarcă..." : "Feed (Instagram/Facebook)"}</span>
              </button>

              <div className="border-t border-border/50 my-2" />

              {/* Download */}
              <button
                onClick={handleDownload}
                disabled={loading !== null}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 text-sm transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>Descarcă imaginea</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
