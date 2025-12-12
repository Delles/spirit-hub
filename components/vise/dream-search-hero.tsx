"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, ArrowRight, Moon } from "lucide-react";
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
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
            setSelectedIndex(-1);
            return;
        }

        const normalizedQuery = normalizeDiacritics(query);
        const filtered = index
            .filter((item) => normalizeDiacritics(item.name).includes(normalizedQuery))
            .slice(0, 8); // Limit to 8 results

        setResults(filtered);
        setIsOpen(true);
        setSelectedIndex(-1);
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

    const handleSelect = useCallback((slug: string) => {
        setIsOpen(false);
        setQuery("");
        router.push(`/vise/${slug}`);
    }, [router]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSelect(results[selectedIndex].slug);
                } else if (results.length > 0) {
                    handleSelect(results[0].slug);
                }
                break;
            case "Escape":
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    return (
        <div ref={wrapperRef} className={cn("relative w-full max-w-2xl mx-auto", className)}>
            {/* Search Input */}
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#9F2BFF] transition-colors duration-200">
                    <Search className="h-5 w-5" />
                </div>
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Caută visul tău..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="h-14 pl-12 pr-4 text-lg bg-black/20 backdrop-blur-sm border-white/10 text-white placeholder:text-white/40 focus:border-[#9F2BFF]/50 focus:bg-black/30 rounded-2xl shadow-xl transition-all duration-200"
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-[#9F2BFF]" />
                    </div>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Results Header */}
                    <div className="px-4 py-3 border-b border-white/5">
                        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                            {results.length} rezultat{results.length !== 1 ? 'e' : ''}
                        </span>
                    </div>

                    {/* Results List */}
                    <div className="py-2 max-h-80 overflow-y-auto">
                        {results.map((item, idx) => (
                            <button
                                key={item.slug}
                                onClick={() => handleSelect(item.slug)}
                                onMouseEnter={() => setSelectedIndex(idx)}
                                className={cn(
                                    "w-full text-left px-4 py-3 flex items-center gap-4 transition-all duration-150",
                                    selectedIndex === idx
                                        ? "bg-[#9F2BFF]/20"
                                        : "hover:bg-white/5"
                                )}
                            >
                                {/* Icon */}
                                <div className={cn(
                                    "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-150",
                                    selectedIndex === idx
                                        ? "bg-[#9F2BFF]/30"
                                        : "bg-white/5"
                                )}>
                                    <Moon className={cn(
                                        "h-5 w-5 transition-colors duration-150",
                                        selectedIndex === idx ? "text-[#9F2BFF]" : "text-white/50"
                                    )} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "font-semibold text-base transition-colors duration-150",
                                            selectedIndex === idx ? "text-white" : "text-white/90"
                                        )}>
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-xs text-white/40 capitalize">
                                        {item.category}
                                    </span>
                                </div>

                                {/* Arrow */}
                                <ArrowRight className={cn(
                                    "h-4 w-4 shrink-0 transition-all duration-150",
                                    selectedIndex === idx
                                        ? "text-[#9F2BFF] translate-x-0 opacity-100"
                                        : "text-white/30 -translate-x-2 opacity-0"
                                )} />
                            </button>
                        ))}
                    </div>

                    {/* Keyboard Hint */}
                    <div className="px-4 py-2 border-t border-white/5 bg-black/20">
                        <div className="flex items-center justify-center gap-4 text-xs text-white/30">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">↑↓</kbd>
                                navigare
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">Enter</kbd>
                                selectare
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">Esc</kbd>
                                închide
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* No Results State */}
            {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
                <div className="absolute top-full left-0 right-0 mt-3 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 text-center animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                        <Search className="h-5 w-5 text-white/30" />
                    </div>
                    <p className="text-white/60 text-sm">
                        Nu am găsit niciun vis pentru „<span className="text-white font-medium">{query}</span>"
                    </p>
                    <p className="text-white/40 text-xs mt-2">
                        Încearcă alt cuvânt cheie
                    </p>
                </div>
            )}
        </div>
    );
}
