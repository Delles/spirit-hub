/**
 * Static Dream Data Utilities
 *
 * Provides functions for loading and querying dream symbols from static JSON.
 * Used for SSG pages and teaser grid on the hub page.
 */

import dreamSymbolsData from "@/data/dream-symbols.json";
import { generateSlug } from "@/lib/dreams";

// ============================================================================
// Types
// ============================================================================

/**
 * Raw symbol from JSON file
 */
interface RawDreamSymbol {
    name: string;
    category: string;
    shortMeaning: string;
    fullInterpretation: string;
}

/**
 * Processed symbol with generated slug
 */
export interface StaticDreamSymbol {
    name: string;
    slug: string;
    category: string;
    shortMeaning: string;
    fullInterpretation: string;
}

// ============================================================================
// Data Processing (cached at module level)
// ============================================================================

/**
 * Process raw JSON symbols into StaticDreamSymbol with slugs
 * Slugs are generated from names using our diacritic-aware slug function
 */
function processSymbols(): StaticDreamSymbol[] {
    return (dreamSymbolsData.symbols as RawDreamSymbol[]).map((symbol) => ({
        name: symbol.name,
        slug: generateSlug(symbol.name),
        category: symbol.category,
        shortMeaning: symbol.shortMeaning,
        fullInterpretation: symbol.fullInterpretation,
    }));
}

// Cache processed symbols at module level (computed once at build time)
const allSymbols: StaticDreamSymbol[] = processSymbols();

// Create slug lookup map for O(1) access
const symbolsBySlug = new Map<string, StaticDreamSymbol>(
    allSymbols.map((s) => [s.slug, s])
);

/**
 * Fisher–Yates shuffle to provide unbiased random order
 */
function shuffle<T>(items: T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Get all dream symbols
 * @returns Array of all processed symbols
 */
export function getAllSymbols(): StaticDreamSymbol[] {
    return allSymbols;
}

/**
 * Get a single dream symbol by slug
 * @param slug - URL-safe slug (e.g., "sarpe")
 * @returns Symbol or null if not found
 */
export function getSymbolBySlug(slug: string): StaticDreamSymbol | null {
    return symbolsBySlug.get(slug) ?? null;
}

/**
 * Get 7 featured symbols for the teaser grid
 * Curated selection across categories for visual diversity
 *
 * Selected symbols (mystic number 7):
 * 1. Șarpe (animale) - transformation, popular search
 * 2. Apă (natură) - emotions, universal symbol
 * 3. Casă (obiecte) - self/psyche, relatable
 * 4. A zbura (acțiuni) - freedom, aspirational
 * 5. Iubire (emoții) - love, emotional appeal
 * 6. Mamă (persoane) - maternal, deep connection
 * 7. Biserică (locuri) - spiritual, Romanian tradition
 */
export function getFeaturedSymbols(): StaticDreamSymbol[] {
    const featuredSlugs = [
        "sarpe",
        "apa",
        "casa",
        "a-zbura",
        "iubire",
        "mama",
        "biserica",
    ];

    return featuredSlugs
        .map((slug) => symbolsBySlug.get(slug))
        .filter((s): s is StaticDreamSymbol => s !== null);
}

/**
 * Get all slugs for SSG generateStaticParams
 * @returns Array of slugs
 */
export function getAllSlugs(): string[] {
    return allSymbols.map((s) => s.slug);
}

/**
 * Get all unique categories
 * @returns Array of category names
 */
export function getAllCategories(): string[] {
    const categories = new Set(allSymbols.map((s) => s.category));
    return Array.from(categories).sort();
}

/**
 * Get symbols by category
 * @param category - Category name (e.g., "animale")
 * @returns Array of symbols in that category
 */
export function getSymbolsByCategory(category: string): StaticDreamSymbol[] {
    return allSymbols.filter((s) => s.category === category);
}

/**
 * Get related symbols for a specific symbol
 * Returns random fallback symbols from same category or random
 */
export function getRelatedSymbols(currentSlug: string, count = 5): StaticDreamSymbol[] {
    const current = getSymbolBySlug(currentSlug);
    if (!current) return [];

    // Filter by same category, excluding current
    const sameCategory = allSymbols.filter(
        (s) => s.category === current.category && s.slug !== currentSlug
    );

    // If we have enough, return random subset
    if (sameCategory.length >= count) {
        return shuffle(sameCategory).slice(0, count);
    }

    // If not enough, fill with others
    const others = allSymbols.filter(
        (s) => s.category !== current.category && s.slug !== currentSlug
    );

    const pool = [...sameCategory, ...others];
    return shuffle(pool).slice(0, count);
}
