/**
 * Dream interpretation helper functions for SpiritHub.ro
 * Provides utilities for slug generation and symbol search
 */

import { DIACRITIC_MAP, ValidationError } from "@/lib/utils";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Represents a dream symbol with its interpretation
 */
export interface DreamSymbol {
  id: string;
  name: string;
  slug: string;
  category: string;
  interpretation: string;
  shortDescription?: string;
}

// ============================================================================
// Slug Generation
// ============================================================================

/**
 * Generates a URL-safe slug from a Romanian dream symbol name
 * Normalizes diacritics, converts to lowercase, and creates kebab-case format
 *
 * @param symbolName - The dream symbol name (e.g., "Șarpe veninos")
 * @returns URL-safe slug (e.g., "sarpe-veninos")
 * @throws ValidationError if symbolName is empty
 *
 * @example
 * generateSlug("Șarpe veninos") // returns "sarpe-veninos"
 * generateSlug("Apă curată") // returns "apa-curata"
 */
export function generateSlug(symbolName: string): string {
  // Validate input
  if (!symbolName || symbolName.trim().length === 0) {
    throw new ValidationError("Symbol name cannot be empty");
  }

  // Normalize Romanian diacritics
  let normalized = symbolName;
  for (const [diacritic, replacement] of Object.entries(DIACRITIC_MAP)) {
    normalized = normalized.replace(new RegExp(diacritic, "g"), replacement);
  }

  // Convert to lowercase
  normalized = normalized.toLowerCase();

  // Replace spaces with hyphens
  normalized = normalized.replace(/\s+/g, "-");

  // Remove special characters (keep only alphanumeric and hyphens)
  normalized = normalized.replace(/[^a-z0-9-]/g, "");

  // Remove consecutive hyphens
  normalized = normalized.replace(/-+/g, "-");

  // Remove leading/trailing hyphens
  normalized = normalized.replace(/^-+|-+$/g, "");

  return normalized;
}
