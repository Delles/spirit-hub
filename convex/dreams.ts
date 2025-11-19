/**
 * Dream Symbols Convex Functions
 *
 * Provides mutations and queries for managing dream symbols in the database.
 * Includes seeding functionality and search capabilities.
 *
 * SETUP INSTRUCTIONS:
 * 1. Deploy this file to Convex: `bun run dev` (Convex dev server)
 * 2. Open Convex Dashboard: https://dashboard.convex.dev
 * 3. Navigate to your project
 * 4. Go to "Functions" tab
 * 5. Find and run the `dreams:seedDreamSymbols` mutation
 * 6. Verify success message and check the "Data" tab to see dream symbols
 *
 * The seeding mutation will insert 98+ dream symbols across 7 categories:
 * - animale (20 symbols)
 * - natură (19 symbols)
 * - obiecte (14 symbols)
 * - emoții (15 symbols)
 * - persoane (10 symbols)
 * - acțiuni (10 symbols)
 * - locuri (10 symbols)
 */

import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import dreamSymbolsData from "@/data/dream-symbols.json";
import { DIACRITIC_MAP } from "@/lib/utils";
import { generateSlug } from "@/lib/dreams";

// ============================================================================
// Module-level cache for sorted dream symbols
// Since dream symbols change infrequently, we cache the sorted list
// to avoid re-sorting on every query call.
// Cache persists indefinitely and only invalidates when symbol count changes
// ============================================================================

interface CachedSymbols {
  symbols: Array<Doc<"dreamSymbols">>;
  count: number;
}

// Cache persists indefinitely - only invalidated when symbol count changes
let sortedSymbolsCache: CachedSymbols | null = null;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Maps a Convex dream symbol document to DreamSymbol interface
 * Reduces code duplication across multiple queries
 * Uses Convex's generated Doc type for type safety
 */
function mapToDreamSymbol(doc: Doc<"dreamSymbols">): {
  id: string;
  name: string;
  slug: string;
  category: string;
  interpretation: string;
  shortDescription: string;
} {
  return {
    id: doc._id,
    name: doc.name,
    slug: doc.slug,
    category: doc.category,
    interpretation: doc.fullInterpretation,
    shortDescription: doc.shortMeaning,
  };
}

/**
 * Invalidates the sorted symbols cache
 * Should be called when symbols are added, deleted, or modified
 */
function invalidateCache(): void {
  sortedSymbolsCache = null;
}

/**
 * Normalizes Romanian diacritics in a string
 * Converts ș→s, ț→t, ă→a, â→a, î→i (and uppercase variants)
 * Used for diacritic-insensitive search
 */
function normalizeDiacritics(text: string): string {
  if (!text || text.trim().length === 0) {
    return text;
  }

  // Normalize Romanian diacritics
  let normalized = text;
  for (const [diacritic, replacement] of Object.entries(DIACRITIC_MAP)) {
    normalized = normalized.replace(new RegExp(diacritic, "g"), replacement);
  }

  return normalized;
}

/**
 * Extracts keywords from name and interpretation text for search
 * Returns array of unique, normalized (diacritic-insensitive) lowercase keywords
 * Keywords are normalized to ensure consistent matching
 */
function extractKeywords(name: string, interpretation: string): string[] {
  // Combine and normalize diacritics for consistent keyword extraction
  const text = normalizeDiacritics(`${name} ${interpretation}`).toLowerCase();

  // Split by spaces and punctuation
  const words = text.split(/[\s,.;:!?()]+/);

  // Use Set for efficient deduplication
  const keywordSet = new Set<string>();

  for (const word of words) {
    // Filter out short words (less than 3 characters) and empty strings
    if (word.length >= 3) {
      keywordSet.add(word);
    }
  }

  // Convert Set to array and sort for consistency
  return Array.from(keywordSet).sort();
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Seeds the database with dream symbols from data/dream-symbols.json
 * Idempotent: checks for existing slugs to prevent duplicates
 * Should be run once during initial setup from Convex dashboard
 *
 * @returns Object with count of inserted and skipped symbols
 */
export const seedDreamSymbols = internalMutation({
  args: {
    symbols: v.optional(
      v.array(
        v.object({
          name: v.string(),
          category: v.string(),
          shortMeaning: v.string(),
          fullInterpretation: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const data = args.symbols ?? dreamSymbolsData.symbols;

    // Build a set of existing slugs for idempotent top-up
    const existingDocs = await ctx.db.query("dreamSymbols").collect();
    const existingSlugs = new Set(existingDocs.map((d) => d.slug));

    let insertedCount = 0;
    let skippedCount = 0;

    for (const symbol of data) {
      // Validate required fields
      if (!symbol.name || !symbol.category || !symbol.shortMeaning || !symbol.fullInterpretation) {
        skippedCount++;
        continue;
      }

      // Generate slug
      const slug = generateSlug(symbol.name);

      // Skip if already exists
      if (existingSlugs.has(slug)) {
        skippedCount++;
        continue;
      }

      // Extract keywords for search
      const keywords = extractKeywords(symbol.name, symbol.fullInterpretation);

      // Normalize name for diacritic-insensitive search
      const normalizedName = normalizeDiacritics(symbol.name).toLowerCase();

      // Insert the symbol
      await ctx.db.insert("dreamSymbols", {
        name: symbol.name,
        normalizedName,
        slug,
        category: symbol.category,
        shortMeaning: symbol.shortMeaning,
        fullInterpretation: symbol.fullInterpretation,
        keywords,
        createdAt: Date.now(),
      });

      existingSlugs.add(slug);
      insertedCount++;
    }

    if (insertedCount > 0) {
      invalidateCache();
    }

    return {
      success: true,
      message: `Seeding completed. Inserted ${insertedCount}, skipped ${skippedCount}.`,
      inserted: insertedCount,
      skipped: skippedCount,
      total: data.length,
    };
  },
});

// ============================================================================
// Queries
// ============================================================================

/**
 * Searches dream symbols by name with optional category filter
 * Supports diacritic-insensitive search (e.g., "sarpe" matches "șarpe")
 * Returns empty array for queries < 2 characters
 * Maps Convex documents to DreamSymbol interface
 *
 * @param query - Search query string (minimum 2 characters)
 * @param category - Optional category filter
 * @param limit - Maximum results to return (default: 20, max: 50)
 * @returns Array of dream symbols matching the query
 */
export const searchDreamSymbols = query({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Return empty array for queries < 2 characters
    if (!args.query || args.query.trim().length < 2) {
      return [];
    }

    // Validate and set limit (default: 20, max: 50)
    const limit = Math.min(args.limit || 20, 50);

    // Normalize query for diacritic-insensitive search
    const normalizedQuery = normalizeDiacritics(args.query).toLowerCase();
    const originalQuery = args.query.toLowerCase();

    // Use Set to track seen document IDs for deduplication
    const seenIds = new Set<string>();
    const results: Array<Doc<"dreamSymbols">> = [];

    // Search on normalized name (diacritic-insensitive) - primary search
    const normalizedResults = await ctx.db
      .query("dreamSymbols")
      .withSearchIndex("search_symbols_normalized", (q) => {
        let search = q.search("normalizedName", normalizedQuery);
        // Filter by category if provided
        if (args.category) {
          search = search.eq("category", args.category);
        }
        return search;
      })
      .take(limit);

    // Add normalized results (deduplicate by ID)
    for (const doc of normalizedResults) {
      if (!seenIds.has(doc._id)) {
        seenIds.add(doc._id);
        results.push(doc);
      }
    }

    // Also search on original name for:
    // 1. Exact matches with diacritics (if query has diacritics)
    // 2. Backward compatibility with records that don't have normalizedName
    if (results.length < limit) {
      const originalResults = await ctx.db
        .query("dreamSymbols")
        .withSearchIndex("search_symbols", (q) => {
          let search = q.search("name", originalQuery);
          // Filter by category if provided
          if (args.category) {
            search = search.eq("category", args.category);
          }
          return search;
        })
        .take(limit - results.length);

      // Add original results (deduplicate by ID)
      for (const doc of originalResults) {
        if (!seenIds.has(doc._id)) {
          seenIds.add(doc._id);
          results.push(doc);
          if (results.length >= limit) break;
        }
      }
    }

    // Map Convex documents to DreamSymbol interface
    return results.map((doc) => mapToDreamSymbol(doc));
  },
});

/**
 * Gets a single dream symbol by its slug
 * Used for direct links and sharing
 *
 * @param slug - The slug of the dream symbol
 * @returns The dream symbol or null if not found
 */
export const getDreamSymbolBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("dreamSymbols")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!doc) {
      return null;
    }

    return mapToDreamSymbol(doc);
  },
});

/**
 * Gets the daily dream symbol deterministically based on date
 * Uses hash of date string to select consistent symbol for all users
 *
 * @param date - ISO date string (YYYY-MM-DD)
 * @returns Dream symbol for the specified date
 */
export const getDailyDream = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    // First, check persisted daily picks to avoid repeated computation across processes
    const existingPick = await ctx.db
      .query("dailyPicks")
      .withIndex("by_date_and_type", (q) => q.eq("date", args.date).eq("type", "daily-dream"))
      .first();

    if (existingPick) {
      // Resolve symbol by slug stored in contentId
      const picked = await ctx.db
        .query("dreamSymbols")
        .withIndex("by_slug", (q) => q.eq("slug", existingPick.contentId))
        .first();

      return picked ? mapToDreamSymbol(picked) : null;
    }

    // Hash date string to generate deterministic number
    const hash = simpleHash(args.date);

    // Check if we have a valid cache - if yes, use it without any DB query
    if (sortedSymbolsCache !== null) {
      const totalCount = sortedSymbolsCache.count;

      // Calculate index using modulo: hash(date) % totalCount
      const index = hash % totalCount;

      // Fetch symbol at calculated index from cached sorted array
      const doc = sortedSymbolsCache.symbols[index];

      // Map to DreamSymbol interface
      return mapToDreamSymbol(doc);
    }

    // Cache is missing - fetch all symbols from database
    const allSymbols = await ctx.db.query("dreamSymbols").collect();
    const totalCount = allSymbols.length;

    // Handle edge case: no symbols in database
    if (totalCount === 0) {
      return null;
    }

    // Sort symbols by slug to ensure deterministic ordering
    // This is critical: without sorting, the order is non-deterministic
    // and the same date might return different symbols
    const sortedSymbols = allSymbols.sort((a, b) => {
      return a.slug.localeCompare(b.slug);
    });

    // Update cache - persists indefinitely until count changes
    sortedSymbolsCache = {
      symbols: sortedSymbols,
      count: totalCount,
    };

    // Calculate index using modulo: hash(date) % totalCount
    const index = hash % totalCount;

    // Fetch symbol at calculated index from sorted array
    const doc = sortedSymbols[index];

    // Map to DreamSymbol interface
    const mapped = mapToDreamSymbol(doc);
    // Note: Queries are read-only; persistence should be handled by a scheduler/action.
    return mapped;
  },
});

/**
 * Simple hash function for deterministic daily selection
 * Converts string to numeric hash value
 *
 * @param str - String to hash (typically ISO date)
 * @returns Positive integer hash value
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Returns ISO date (YYYY-MM-DD) in Europe/Bucharest timezone for given Date.
 */
function isoDateInBucharest(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  return `${year}-${month}-${day}`;
}

/**
 * Internal mutation to ensure the daily dream is persisted in `dailyPicks`.
 * If a pick for the target date already exists, it is left unchanged.
 * The target date defaults to today's date in Europe/Bucharest timezone.
 */
export const ensureDailyDream = internalMutation({
  args: {
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Resolve target ISO date in RO timezone
    const targetDate = args.date ?? isoDateInBucharest(new Date());

    // If already persisted, nothing to do
    const existing = await ctx.db
      .query("dailyPicks")
      .withIndex("by_date_and_type", (q) => q.eq("date", targetDate).eq("type", "daily-dream"))
      .first();
    if (existing) {
      return { date: targetDate, persisted: false, slug: existing.contentId };
    }

    // Compute deterministic pick for the date
    // Use the same hashing and sorted-by-slug strategy
    const allSymbols = await ctx.db.query("dreamSymbols").collect();
    if (allSymbols.length === 0) {
      return { date: targetDate, persisted: false, slug: null };
    }
    const sortedSymbols = allSymbols.sort((a, b) => a.slug.localeCompare(b.slug));
    const index = simpleHash(targetDate) % sortedSymbols.length;
    const chosen = sortedSymbols[index];

    // Persist the daily pick (slug as contentId)
    await ctx.db.insert("dailyPicks", {
      date: targetDate,
      type: "daily-dream",
      contentId: chosen.slug,
      createdAt: Date.now(),
    });

    return { date: targetDate, persisted: true, slug: chosen.slug };
  },
});
