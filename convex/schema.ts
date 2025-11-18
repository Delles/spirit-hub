import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Interpretations table: stores static numerology and dream interpretation text
  // Used for life path numbers, destiny numbers, and other numerology features
  interpretations: defineTable({
    type: v.string(), // "life-path" | "destiny" | "compatibility"
    number: v.number(), // 1-9 for numerology
    title: v.string(), // Romanian title
    description: v.string(), // Short Romanian description
    fullText: v.string(), // Complete interpretation in Romanian
    createdAt: v.number(), // Timestamp
  }).index("by_type_and_number", ["type", "number"]),

  // Dream symbols table: stores dream dictionary entries with names and meanings
  // Supports search functionality for dream interpretation feature
  dreamSymbols: defineTable({
    name: v.string(), // Romanian symbol name (e.g., "șarpe")
    normalizedName: v.optional(v.string()), // Diacritic-normalized name for search (e.g., "sarpe")
    slug: v.string(), // URL-friendly slug
    category: v.string(), // "animale" | "natură" | "obiecte" | "emoții"
    shortMeaning: v.string(), // Brief interpretation (1-2 sentences)
    fullInterpretation: v.string(), // Complete interpretation
    keywords: v.array(v.string()), // Search keywords
    createdAt: v.number(), // Timestamp
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .searchIndex("search_symbols", {
      searchField: "name",
      filterFields: ["category"],
    })
    .searchIndex("search_symbols_normalized", {
      searchField: "normalizedName",
      filterFields: ["category"],
    }),

  // Daily picks table: stores daily selected content (numărul zilei, visul zilei)
  // Used to provide consistent daily content across user sessions
  dailyPicks: defineTable({
    date: v.string(), // ISO date string (YYYY-MM-DD)
    type: v.string(), // "daily-number" | "daily-dream"
    contentId: v.string(), // Reference to interpretation or dream symbol
    createdAt: v.number(), // Timestamp
  }).index("by_date_and_type", ["date", "type"]),

  // Analytics table: optional usage tracking for understanding user behavior
  // Helps identify popular features and usage patterns
  analytics: defineTable({
    eventType: v.string(), // "pageview" | "calculator-use" | "search"
    feature: v.string(), // "numerology" | "dreams" | "biorhythm"
    // Using v.any() here intentionally to allow flexible, JSON-serializable metadata
    // for analytics events without constraining the shape upfront.
    metadata: v.optional(v.any()), // Additional event data (documented and safe)
    timestamp: v.number(), // Event timestamp
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_feature", ["feature"]),
});
