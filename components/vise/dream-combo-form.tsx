/**
 * Dream Combo Form Component
 *
 * Multi-symbol selector for combining 2-3 dream symbols into a comprehensive interpretation.
 * Features validation, visual feedback, and accessible keyboard navigation.
 *
 * @example
 * ```tsx
 * <DreamComboForm
 *   availableSymbols={allSymbols}
 *   onCombine={(symbols) => showCombinedInterpretation(symbols)}
 *   maxSymbols={3}
 * />
 * ```
 */
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { X, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DreamSymbol } from "@/lib/dreams";
import { DreamSearchInput } from "./dream-search-input";
import { cn, DIACRITIC_MAP } from "@/lib/utils";
import { api } from "@/convex/_generated/api";

export interface DreamComboFormProps {
  availableSymbols?: DreamSymbol[];
  onCombine: (symbols: DreamSymbol[]) => void;
  maxSymbols?: number;
}

/**
 * Category color mapping for dream symbol badges
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
 * Normalizes text for search comparison
 * Converts to lowercase and normalizes Romanian diacritics
 * Same logic as normalizeForSearch in lib/dreams.ts
 *
 * @param text - Text to normalize
 * @returns Normalized text
 */
function normalizeForSearch(text: string): string {
  let normalized = text.toLowerCase().trim();

  // Normalize Romanian diacritics
  for (const [diacritic, replacement] of Object.entries(DIACRITIC_MAP)) {
    normalized = normalized.replace(new RegExp(diacritic, "g"), replacement.toLowerCase());
  }

  return normalized;
}

/**
 * Dream combo form component for selecting and combining multiple symbols
 *
 * Features:
 * - Search/autocomplete for symbol selection
 * - Selected symbols display with remove buttons
 * - Visual counter (e.g., "2/3 simboluri selectate")
 * - Combine button (disabled if < 2 symbols)
 * - Validation messages in Romanian
 * - Clear all button
 * - Accessible labels and keyboard navigation
 */
export function DreamComboForm({
  availableSymbols,
  onCombine,
  maxSymbols = 3,
}: DreamComboFormProps) {
  const [selectedSymbols, setSelectedSymbols] = useState<DreamSymbol[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Server-side suggestions via Convex search (debounced by child input)
  const serverSuggestions = useQuery(
    api.dreams.searchDreamSymbols,
    searchQuery.length >= 2 ? { query: searchQuery, limit: 10 } : "skip",
  );

  // Merge logic: prefer server suggestions; fall back to provided list (if any)
  const filteredSymbols = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) {
      return [];
    }

    const selectedIds = new Set(selectedSymbols.map((s) => s.id));

    // Start with server suggestions when available
    const base: DreamSymbol[] = Array.isArray(serverSuggestions) ? serverSuggestions : [];

    // If a local list is provided (e.g., tests), merge in matching items to improve coverage
    if (availableSymbols && availableSymbols.length > 0) {
      const normalizedQuery = normalizeForSearch(searchQuery);
      const fromLocal = availableSymbols.filter((s) => {
        const normalizedName = normalizeForSearch(s.name);
        return normalizedName.includes(normalizedQuery);
      });
      // Deduplicate by id
      const seen = new Set(base.map((s) => s.id));
      for (const s of fromLocal) {
        if (!seen.has(s.id)) {
          base.push(s);
          seen.add(s.id);
        }
      }
    }

    // Exclude already selected and cap to 10
    return base.filter((s) => !selectedIds.has(s.id)).slice(0, 10);
  }, [searchQuery, selectedSymbols, serverSuggestions, availableSymbols]);

  // Validation states
  const canAddMore = selectedSymbols.length < maxSymbols;
  const canCombine = selectedSymbols.length >= 2;
  const isAtLimit = selectedSymbols.length >= maxSymbols;

  // Handle symbol selection from suggestions
  const handleSelectSymbol = (symbol: DreamSymbol) => {
    if (canAddMore) {
      setSelectedSymbols((prev) => [...prev, symbol]);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  // Handle symbol removal
  const handleRemoveSymbol = (symbolId: string) => {
    setSelectedSymbols((prev) => prev.filter((s) => s.id !== symbolId));
  };

  // Handle clear all
  const handleClearAll = () => {
    setSelectedSymbols([]);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Handle combine
  const handleCombine = () => {
    if (canCombine) {
      onCombine(selectedSymbols);
    }
  };

  // Handle search input change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(query.length >= 2);
  };

  return (
    <div className="space-y-6">
      {/* Search Input Section */}
      <div className="space-y-2">
        <label htmlFor="symbol-search" className="text-sm font-medium text-foreground">
          Caută și selectează simboluri
        </label>

        <div className="relative">
          <DreamSearchInput
            onSearch={handleSearchChange}
            placeholder="Caută simboluri din vis..."
            className="w-full"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSymbols.length > 0 && (
            <Card className="absolute z-10 w-full mt-2 max-h-64 overflow-y-auto">
              <CardContent className="p-2">
                <div className="space-y-1">
                  {filteredSymbols.map((symbol) => (
                    <button
                      key={symbol.id}
                      type="button"
                      onClick={() => handleSelectSymbol(symbol)}
                      disabled={!canAddMore}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md",
                        "hover:bg-accent transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-primary/50",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                      )}
                      aria-label={`Selectează ${symbol.name}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{symbol.name}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            categoryColors[symbol.category] || categoryColors.obiecte,
                          )}
                        >
                          {symbol.category}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Validation message when at limit */}
        {isAtLimit && (
          <p className="text-sm text-amber-400" role="alert">
            Ai atins limita de {maxSymbols} simboluri
          </p>
        )}
      </div>

      {/* Selected Symbols Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            Simboluri selectate ({selectedSymbols.length}/{maxSymbols})
          </h3>

          {selectedSymbols.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8 text-xs"
              aria-label="Șterge toate simbolurile"
            >
              Șterge toate
            </Button>
          )}
        </div>

        {/* Selected symbols display */}
        {selectedSymbols.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {selectedSymbols.map((symbol, index) => (
              <Card key={symbol.id} className="transition-all duration-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-medium text-muted-foreground shrink-0">
                        {index + 1}.
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{symbol.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {symbol.shortDescription ||
                            symbol.interpretation.substring(0, 60) + "..."}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs shrink-0",
                          categoryColors[symbol.category] || categoryColors.obiecte,
                        )}
                      >
                        {symbol.category}
                      </Badge>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemoveSymbol(symbol.id)}
                      className="size-8 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Elimină ${symbol.name}`}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center">
                  <Plus className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Caută și selectează 2-3 simboluri din visul tău
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validation message when < 2 symbols */}
        {selectedSymbols.length === 1 && (
          <p className="text-sm text-muted-foreground" role="status">
            Selectează cel puțin încă un simbol pentru a combina interpretările
          </p>
        )}
      </div>

      {/* Combine Button */}
      <Button
        type="button"
        onClick={handleCombine}
        disabled={!canCombine}
        className="w-full h-12 text-base"
        aria-label="Combină interpretările simbolurilor selectate"
        aria-disabled={!canCombine}
      >
        <Sparkles className="size-5 mr-2" />
        Combină Interpretările
        {selectedSymbols.length >= 2 && ` (${selectedSymbols.length} simboluri)`}
      </Button>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center">
        Selectează între 2 și {maxSymbols} simboluri pentru o interpretare complexă
      </p>
    </div>
  );
}
