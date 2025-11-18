/**
 * Dream Result List Component
 *
 * Displays search results for dream symbols in a responsive grid layout.
 * Supports loading states, empty states, and interactive selection.
 *
 * @example
 * ```tsx
 * <DreamResultList
 *   symbols={searchResults}
 *   onSelectSymbol={(symbol) => showDetail(symbol)}
 *   isLoading={isSearching}
 *   emptyMessage="Nu am găsit simboluri"
 * />
 * ```
 */
"use client";

import { DreamSymbol } from "@/lib/dreams";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface DreamResultListProps {
  symbols: DreamSymbol[];
  onSelectSymbol: (symbol: DreamSymbol) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

/**
 * Category color mapping for dream symbol badges
 * Based on design.json color palette
 */
const categoryColors: Record<string, string> = {
  animale: "text-red-400 bg-red-400/10 border-red-400/20",
  natura: "text-green-400 bg-green-400/10 border-green-400/20",
  obiecte: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  emotii: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  persoane: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  actiuni: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  locuri: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
};

/**
 * Get category display name with proper capitalization
 */
function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    animale: "Animale",
    natura: "Natură",
    obiecte: "Obiecte",
    emotii: "Emoții",
    persoane: "Persoane",
    actiuni: "Acțiuni",
    locuri: "Locuri",
  };
  return names[category] || category;
}

/**
 * Dream result list component displaying search results in a grid layout
 *
 * Features:
 * - Grid layout (1 column mobile, 2 columns tablet+)
 * - Category badges with color coding
 * - Short description preview (2 lines max with ellipsis)
 * - Hover/focus states for accessibility
 * - Click and keyboard navigation support
 * - Loading skeleton states
 * - Empty state with Romanian message
 */
export function DreamResultList({
  symbols,
  onSelectSymbol,
  isLoading = false,
  emptyMessage = "Nu am găsit simboluri care să corespundă căutării tale.",
}: DreamResultListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (symbols.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <svg
            className="size-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-muted-foreground text-base max-w-md">{emptyMessage}</p>
      </div>
    );
  }

  // Results grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {symbols.map((symbol) => (
        <DreamResultCard key={symbol.id} symbol={symbol} onSelect={onSelectSymbol} />
      ))}
    </div>
  );
}

/**
 * Individual dream result card component
 */
interface DreamResultCardProps {
  symbol: DreamSymbol;
  onSelect: (symbol: DreamSymbol) => void;
}

function DreamResultCard({ symbol, onSelect }: DreamResultCardProps) {
  const categoryColor = categoryColors[symbol.category] || categoryColors.obiecte;
  const categoryName = getCategoryDisplayName(symbol.category);

  const handleClick = () => {
    onSelect(symbol);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(symbol);
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-0.5",
        "focus-within:ring-2 focus-within:ring-primary/50",
        "active:scale-[0.98]",
        "min-h-[44px]",
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Simbol: ${symbol.name}, Categorie: ${categoryName}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{symbol.name}</CardTitle>
          <Badge variant="outline" className={cn("shrink-0", categoryColor)}>
            {categoryName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
          {symbol.shortDescription || symbol.interpretation}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton for result cards
 */
function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}
