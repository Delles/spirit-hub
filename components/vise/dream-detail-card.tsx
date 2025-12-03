"use client";

import { X, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/shared/share-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DreamSymbol } from "@/lib/dreams";
import { cn } from "@/lib/utils";

export interface DreamDetailCardProps {
  symbol: DreamSymbol;
  onClose?: () => void;
  showBackButton?: boolean;
  className?: string;
}

/**
 * Category color mapping based on design system
 * Uses Tailwind classes for consistent styling across the app
 */
const CATEGORY_COLORS: Record<string, { text: string; bg: string }> = {
  animale: { text: "text-red-400", bg: "bg-red-400/10" },
  natură: { text: "text-green-400", bg: "bg-green-400/10" },
  natura: { text: "text-green-400", bg: "bg-green-400/10" }, // Fallback without diacritic
  obiecte: { text: "text-blue-400", bg: "bg-blue-400/10" },
  emoții: { text: "text-purple-400", bg: "bg-purple-400/10" },
  emotii: { text: "text-purple-400", bg: "bg-purple-400/10" }, // Fallback without diacritic
  persoane: { text: "text-yellow-400", bg: "bg-yellow-400/10" },
  acțiuni: { text: "text-orange-400", bg: "bg-orange-400/10" },
  actiuni: { text: "text-orange-400", bg: "bg-orange-400/10" }, // Fallback without diacritic
  locuri: { text: "text-cyan-400", bg: "bg-cyan-400/10" },
};

/**
 * Gets the color classes for a category badge
 * Returns default colors if category is not found
 */
function getCategoryColors(category: string): { text: string; bg: string } {
  const normalizedCategory = category.toLowerCase().trim();
  return (
    CATEGORY_COLORS[normalizedCategory] || {
      text: "text-muted-foreground",
      bg: "bg-muted/10",
    }
  );
}

/**
 * DreamDetailCard displays the full interpretation of a dream symbol
 *
 * Features:
 * - Symbol name as title
 * - Category badge with color coding
 * - Full interpretation with prose styling
 * - Share functionality
 * - Optional close/back button
 * - Mobile-responsive layout
 * - Proper ARIA labels for accessibility
 */
export function DreamDetailCard({
  symbol,
  onClose,
  showBackButton = false,
  className,
}: DreamDetailCardProps) {
  const categoryColors = getCategoryColors(symbol.category);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/vise/${symbol.slug}`;
  const shareTitle = `Interpretare vis: ${symbol.name}`;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="px-6 pt-6 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <CardTitle className="text-2xl text-white">{symbol.name}</CardTitle>
            <Badge
              className={cn("w-fit", categoryColors.text, categoryColors.bg, "border-transparent")}
            >
              {symbol.category}
            </Badge>
          </div>

          {onClose && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="shrink-0"
              aria-label={showBackButton ? "Înapoi" : "Închide"}
            >
              {showBackButton ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-6">
        <div className="max-w-none">
          <p className="text-[#E0E0E0] leading-relaxed whitespace-pre-line">
            {symbol.interpretation}
          </p>
        </div>

        <div className="pt-4 border-t border-white/10">
          <ShareButton url={shareUrl} title={shareTitle} />
        </div>
      </CardContent>
    </Card>
  );
}
