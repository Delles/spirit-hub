"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DreamSearchInput } from "@/components/vise/dream-search-input";
import { DreamResultList } from "@/components/vise/dream-result-list";
import { DreamDetailCard } from "@/components/vise/dream-detail-card";
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";
import { DreamSymbol } from "@/lib/dreams";

/**
 * Client component for the dream search page
 *
 * Features:
 * - Interactive search with debouncing
 * - Result list display
 * - Inline detail view for selected symbols
 * - Link to daily dream
 * - Error handling with Romanian messages
 * - Loading states
 */
export function ViseClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<DreamSymbol | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const prevQueryRef = useRef<string>("");

  // Query dream symbols from Convex
  const searchResults = useQuery(
    api.dreams.searchDreamSymbols,
    searchQuery.length >= 2 ? { query: searchQuery, limit: 20 } : "skip",
  );

  // Handle search query changes
  // Only clear selected symbol when query actually changes (not on re-renders)
  const handleSearch = useCallback((query: string) => {
    // Only clear selection if query is actually changing
    if (prevQueryRef.current !== query) {
      setSelectedSymbol(null);
      prevQueryRef.current = query;
    }
    setSearchQuery(query);
    setIsSearching(query.length >= 2);
  }, []);

  // Handle symbol selection
  const handleSelectSymbol = (symbol: DreamSymbol) => {
    setSelectedSymbol(symbol);
    // Scroll to detail card smoothly
    setTimeout(() => {
      document.getElementById("dream-detail")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Handle closing detail view
  const handleCloseDetail = () => {
    setSelectedSymbol(null);
  };

  // Determine loading state
  const isLoading = isSearching && searchResults === undefined;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Moon className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">Dicționar de Interpretare Vise</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Peste 100 de simboluri onirice explicate în detaliu. Caută semnificația viselor tale sau
          explorează interpretările tradiționale românești.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto">
        <DreamSearchInput
          onSearch={handleSearch}
          isLoading={isLoading}
          placeholder="Caută simboluri onirice..."
        />
      </div>

      {/* Feature Links */}
      {!searchQuery && !selectedSymbol && (
        <div className="max-w-md mx-auto">
          <Link href="/vise/visul-zilei">
            <Button
              variant="outline"
              className="w-full h-auto py-4 px-6 flex flex-col items-start gap-2 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-primary" />
                <span className="font-semibold">Visul Zilei</span>
              </div>
              <span className="text-sm text-muted-foreground text-left">
                Descoperă simbolul zilei și semnificația sa
              </span>
            </Button>
          </Link>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-6">
          <DreamResultList
            symbols={searchResults || []}
            onSelectSymbol={handleSelectSymbol}
            isLoading={isLoading}
            emptyMessage="Nu am găsit simboluri care să corespundă căutării tale. Încearcă alt termen sau verifică ortografia."
          />
        </div>
      )}

      {/* Detail View */}
      {selectedSymbol && (
        <div id="dream-detail" className="max-w-3xl mx-auto">
          <DreamDetailCard
            symbol={selectedSymbol}
            onClose={handleCloseDetail}
            showBackButton={false}
          />
        </div>
      )}

      {/* Educational Content */}
      {!searchQuery && !selectedSymbol && (
        <div className="max-w-2xl mx-auto mt-12 space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Cum să folosești dicționarul</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">1. Caută simboluri:</strong> Introdu un cuvânt
                cheie din visul tău (de exemplu: &quot;șarpe&quot;, &quot;apă&quot;,
                &quot;casă&quot;).
              </p>
              <p>
                <strong className="text-foreground">2. Explorează interpretări:</strong> Citește
                semnificațiile bazate pe folclorul și tradițiile românești.
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Categorii de simboluri</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-muted-foreground">Animale</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-muted-foreground">Natură</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-muted-foreground">Obiecte</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                <span className="text-muted-foreground">Emoții</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-400" />
                <span className="text-muted-foreground">Persoane</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                <span className="text-muted-foreground">Acțiuni</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-muted-foreground">Locuri</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
