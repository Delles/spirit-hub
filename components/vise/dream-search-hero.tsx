"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchItem {
    name: string;
    slug: string;
    category: string;
}

// Normalize Romanian diacritics for search (ă→a, â→a, î→i, ș→s, ț→t)
function normalizeDiacritics(str: string): string {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritical marks
        .replace(/ă/gi, "a")
        .replace(/â/gi, "a")
        .replace(/î/gi, "i")
        .replace(/ș/gi, "s")
        .replace(/ț/gi, "t")
        .toLowerCase();
}

export function DreamSearchHero({ className }: { className?: string }) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchItem[]>([]);
    const [index, setIndex] = useState<SearchItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Load the lightweight search index
    useEffect(() => {
        async function loadIndex() {
            try {
                const res = await fetch("/dreams-search-index.json");
                if (!res.ok) throw new Error("Failed to load index");
                const data = await res.json();
                setIndex(data);
            } catch (err) {
                console.error("Error loading dream index:", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadIndex();
    }, []);

    // Filter logic with diacritic normalization
    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const normalizedQuery = normalizeDiacritics(query);
        const filtered = index
            .filter((item) => normalizeDiacritics(item.name).includes(normalizedQuery))
            .slice(0, 10); // Limit to 10 results for performance

        setResults(filtered);
        setIsOpen(true);
    }, [query, index]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (slug: string) => {
        router.push(`/vise/${slug}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && results.length > 0) {
            handleSelect(results[0].slug);
        }
    };

    return (
        <div ref={wrapperRef} className={cn("relative w-full max-w-2xl mx-auto", className)}>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[#9F2BFF] transition-colors">
                    <Search className="h-5 w-5" />
                </div>
                <Input
                    type="text"
                    placeholder="Ce ai visat azi-noapte?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="h-14 pl-12 pr-4 text-lg bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#9F2BFF]/50 focus:bg-white/10 rounded-2xl shadow-xl backdrop-blur-sm transition-all"
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-[#9F2BFF]" />
                    </div>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-[#1A1A2E]/95 border border-[#9F2BFF]/20 rounded-xl shadow-2xl backdrop-blur-md z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-medium text-white/40 px-3 py-2 uppercase tracking-wider">
                        Rezultate
                    </div>
                    <div className="space-y-1">
                        {results.map((item) => (
                            <button
                                key={item.slug}
                                onClick={() => handleSelect(item.slug)}
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#9F2BFF]/10 text-gray-200 hover:text-white transition-colors flex items-center justify-between group"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium text-base group-hover:translate-x-1 transition-transform">{item.name}</span>
                                    <span className="text-xs text-white/40 capitalize">{item.category}</span>
                                </div>
                                <Info className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results State */}
            {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-[#1A1A2E]/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md z-50 text-center text-white/60">
                    Nu am găsit niciun simbol pentru "{query}".
                </div>
            )}
        </div>
    );
}
