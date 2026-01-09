"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Share2, Check, Link, Image, Download, X, Loader2 } from "lucide-react";
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
  /** Pre-fetched image blob (from usePrefetchShareImage hook) */
  prefetchedImage?: Blob | null;
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

/** Single image format for all social sharing */
const SHARE_IMAGE_FORMAT = 'story';

export function ShareButton({
  contentType,
  contentId,
  prefetchedImage,
  url,
  title,
  text,
  label,
  className
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [linkShared, setLinkShared] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [canShareLinks, setCanShareLinks] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const hasImageSupport = Boolean(contentType && contentId);

  // Check browser capabilities
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      // Only enable native share on touch devices (mobile/tablet)
      // Desktop browsers may have Web Share API but it often fails silently
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setCanShareLinks(isTouchDevice && "share" in navigator);

      // Check file sharing
      if ("canShare" in navigator) {
        try {
          const testFile = new File(["test"], "test.png", { type: "image/png" });
          setCanShareFiles(navigator.canShare({ files: [testFile] }));
        } catch {
          setCanShareFiles(false);
        }
      }
    }
  }, []);

  // Pre-fetch image when modal opens (only if not already prefetched)
  const prefetchImage = useCallback(async () => {
    // Use prefetched image if available
    if (prefetchedImage) {
      setImageBlob(prefetchedImage);
      return;
    }

    if (!contentType || !contentId || imageBlob) return;

    setImageLoading(true);
    try {
      const imageUrl = `/api/og/${contentType}/${contentId}?format=${SHARE_IMAGE_FORMAT}`;
      const response = await fetch(imageUrl);
      if (response.ok) {
        const blob = await response.blob();
        setImageBlob(blob);
      }
    } catch (err) {
      console.error("Failed to prefetch image:", err);
    } finally {
      setImageLoading(false);
    }
  }, [contentType, contentId, imageBlob, prefetchedImage]);

  // Use prefetched image immediately if available
  useEffect(() => {
    if (prefetchedImage && !imageBlob) {
      setImageBlob(prefetchedImage);
    }
  }, [prefetchedImage, imageBlob]);

  useEffect(() => {
    if (isOpen && hasImageSupport && !imageBlob) {
      prefetchImage();
    }
  }, [isOpen, hasImageSupport, prefetchImage, imageBlob]);

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

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLinkShared(false);
    }
  }, [isOpen]);

  const handleShareLink = async () => {
    const shareData = {
      title,
      text: text || title,
      url,
    };

    // Try native share first (primarily mobile)
    if (canShareLinks && navigator.share) {
      try {
        await navigator.share(shareData);
        setIsOpen(false);
        return;
      } catch (err) {
        // User cancelled - don't fall through to clipboard
        if ((err as Error).name === "AbortError") {
          return;
        }
        // Other errors (e.g., NotAllowedError on desktop) - fall through to clipboard
        console.log("Native share not available, falling back to clipboard");
      }
    }

    // Fallback: copy to clipboard (works on desktop and mobile)
    try {
      await navigator.clipboard.writeText(url);
      setLinkShared(true);
      setTimeout(() => {
        setLinkShared(false);
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareImage = async () => {
    if (!imageBlob) {
      // If image not ready, wait for it
      if (!imageLoading) {
        await prefetchImage();
      }
      return;
    }

    const file = new File([imageBlob], `spirithub-${contentType}.png`, { type: "image/png" });

    try {
      // Try native share with file (mobile)
      if (canShareFiles && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title,
        });
        setIsOpen(false);
        return;
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        return;
      }
      console.error("Native share failed:", err);
    }

    // Fallback: download the image
    downloadBlob(imageBlob, `spirithub-${contentType}.png`);
    setIsOpen(false);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

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
        <div className="absolute bottom-full left-0 mb-2 z-50 min-w-[200px] rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl p-3 space-y-2 animate-in fade-in-0 zoom-in-95">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground"
            aria-label="Închide"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Share Link */}
          <button
            onClick={handleShareLink}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 text-sm transition-colors min-h-[48px]"
          >
            {linkShared ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Link className="h-5 w-5" />
            )}
            <span className="font-medium">
              {linkShared ? "Link copiat!" : "Distribuie link"}
            </span>
          </button>

          {/* Share Image */}
          {hasImageSupport && (
            <button
              onClick={handleShareImage}
              disabled={imageLoading && !imageBlob}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 text-sm transition-colors min-h-[48px] disabled:opacity-50"
            >
              {imageLoading && !imageBlob ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : canShareFiles ? (
                <Image className="h-5 w-5" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              <span className="font-medium">
                {imageLoading && !imageBlob
                  ? "Se pregătește..."
                  : canShareFiles
                    ? "Distribuie imagine"
                    : "Descarcă imagine"}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
