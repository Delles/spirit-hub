"use client";

import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

export interface DreamSearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Dream search input component with debouncing, validation, and accessibility.
 *
 * Features:
 * - 300ms debounce delay to prevent excessive queries
 * - Minimum 2 characters validation
 * - Loading spinner during search
 * - Clear button when query has content
 * - Touch-friendly (44x44px minimum targets)
 * - Full ARIA labels for accessibility
 * - Romanian placeholder and validation messages
 */
export function DreamSearchInput({
  onSearch,
  isLoading = false,
  placeholder = "Caută simboluri onirice...",
  className,
}: DreamSearchInputProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  // Derive validation state from current query (not debounced) for immediate feedback
  const showValidation = query.length === 1;

  // Trigger search when debounced query changes and meets validation
  useEffect(() => {
    if (debouncedQuery.length === 0) {
      onSearch("");
    } else if (debouncedQuery.length >= 2) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>

        {/* Input Field */}
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-20 h-11 text-base"
          aria-label="Caută simboluri onirice"
          aria-describedby={showValidation ? "search-validation" : undefined}
          aria-invalid={showValidation}
        />

        {/* Loading Spinner and Clear Button */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <div className="flex items-center justify-center size-9">
              <Loader2 className="size-4 animate-spin text-primary" aria-label="Se caută..." />
            </div>
          )}

          {query && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleClear}
              className="size-9 hover:bg-accent/50"
              aria-label="Șterge căutarea"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Validation Message */}
      {showValidation && (
        <p id="search-validation" className="text-sm text-muted-foreground px-1" role="alert">
          Introdu cel puțin 2 caractere pentru a căuta
        </p>
      )}
    </div>
  );
}
