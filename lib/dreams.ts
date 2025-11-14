/**
 * Dream interpretation helper functions for SpiritHub.ro
 * Provides utilities for slug generation, symbol search, and interpretation combination
 */

import { DIACRITIC_MAP, ValidationError } from '@/lib/utils';

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
    throw new ValidationError('Symbol name cannot be empty');
  }
  
  // Normalize Romanian diacritics
  let normalized = symbolName;
  for (const [diacritic, replacement] of Object.entries(DIACRITIC_MAP)) {
    normalized = normalized.replace(new RegExp(diacritic, 'g'), replacement);
  }
  
  // Convert to lowercase
  normalized = normalized.toLowerCase();
  
  // Replace spaces with hyphens
  normalized = normalized.replace(/\s+/g, '-');
  
  // Remove special characters (keep only alphanumeric and hyphens)
  normalized = normalized.replace(/[^a-z0-9-]/g, '');
  
  // Remove consecutive hyphens
  normalized = normalized.replace(/-+/g, '-');
  
  // Remove leading/trailing hyphens
  normalized = normalized.replace(/^-+|-+$/g, '');
  
  return normalized;
}

// ============================================================================
// Symbol Search
// ============================================================================

/**
 * Searches dream symbols using fuzzy matching on name and description
 * Returns results sorted by relevance (exact matches first, then partial matches)
 * 
 * @param query - The search query string
 * @param symbols - Array of dream symbols to search through
 * @returns Array of matching symbols sorted by relevance
 * @throws ValidationError if symbols array is null or undefined
 * 
 * @example
 * searchSymbols("șarpe", allSymbols) // returns symbols matching "șarpe"
 */
export function searchSymbols(query: string, symbols: DreamSymbol[]): DreamSymbol[] {
  // Validate input
  if (!symbols || !Array.isArray(symbols)) {
    throw new ValidationError('Symbols must be a valid array');
  }
  
  if (!query || query.trim().length === 0) {
    return symbols;
  }
  
  // Normalize query for comparison
  const normalizedQuery = normalizeForSearch(query);
  
  // Score each symbol based on match quality
  const scoredSymbols = symbols.map(symbol => {
    const normalizedName = normalizeForSearch(symbol.name);
    const normalizedDescription = normalizeForSearch(symbol.shortDescription || symbol.interpretation);
    
    let score = 0;
    
    // Exact name match (highest priority)
    if (normalizedName === normalizedQuery) {
      score = 1000;
    }
    // Name starts with query
    else if (normalizedName.startsWith(normalizedQuery)) {
      score = 500;
    }
    // Name contains query
    else if (normalizedName.includes(normalizedQuery)) {
      score = 250;
    }
    // Description contains query
    else if (normalizedDescription.includes(normalizedQuery)) {
      score = 100;
    }
    
    return { symbol, score };
  });
  
  // Filter out non-matches and sort by score (descending)
  return scoredSymbols
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.symbol);
}

/**
 * Normalizes text for search comparison
 * Converts to lowercase and normalizes Romanian diacritics
 * 
 * @param text - Text to normalize
 * @returns Normalized text
 */
function normalizeForSearch(text: string): string {
  let normalized = text.toLowerCase().trim();
  
  // Normalize Romanian diacritics
  for (const [diacritic, replacement] of Object.entries(DIACRITIC_MAP)) {
    normalized = normalized.replace(new RegExp(diacritic, 'g'), replacement.toLowerCase());
  }
  
  return normalized;
}

// ============================================================================
// Interpretation Combination
// ============================================================================

/**
 * Combines interpretations from multiple dream symbols into coherent Romanian text
 * Accepts 2-3 symbols and generates a natural-sounding combined interpretation
 * 
 * @param symbols - Array of 2-3 dream symbols to combine
 * @returns Combined interpretation text in Romanian
 * @throws ValidationError if symbols array is invalid or contains more than 3 symbols
 * 
 * @example
 * combineInterpretations([snakeSymbol, waterSymbol]) 
 * // returns "Visul tău combină șarpele, care simbolizează..."
 */
export function combineInterpretations(symbols: DreamSymbol[]): string {
  // Validate input
  if (!symbols || !Array.isArray(symbols)) {
    throw new ValidationError('Symbols must be a valid array');
  }
  
  if (symbols.length > 3) {
    throw new ValidationError('Cannot combine more than 3 symbols');
  }
  
  if (symbols.length === 0) {
    return "Nu au fost selectate simboluri pentru interpretare.";
  }
  
  if (symbols.length === 1) {
    return symbols[0].interpretation;
  }
  
  // Build combined interpretation for 2-3 symbols
  const symbolNames = symbols.map(s => s.name.toLowerCase());
  
  let combined = "Visul tău combină ";
  
  if (symbols.length === 2) {
    combined += `${symbolNames[0]} și ${symbolNames[1]}. `;
  } else {
    // 3 or more symbols
    const lastSymbol = symbolNames[symbolNames.length - 1];
    const otherSymbols = symbolNames.slice(0, -1).join(", ");
    combined += `${otherSymbols} și ${lastSymbol}. `;
  }
  
  // Add individual interpretations
  combined += "\n\n";
  
  symbols.forEach((symbol, index) => {
    const prefix = index === 0 ? "Primul simbol" : 
                   index === 1 ? "Al doilea simbol" : 
                   "Al treilea simbol";
    
    combined += `${prefix}, ${symbol.name.toLowerCase()}, ${getInterpretationSnippet(symbol.interpretation)} `;
    
    if (index < symbols.length - 1) {
      combined += "\n\n";
    }
  });
  
  // Add closing guidance
  combined += "\n\nÎmpreună, aceste simboluri sugerează o perioadă de transformare și reflecție. ";
  combined += "Acordă atenție modului în care aceste teme se manifestă în viața ta de zi cu zi.";
  
  return combined;
}

/**
 * Extracts a snippet from an interpretation for combination
 * Converts first sentence to a form that flows naturally in combined text
 * 
 * @param interpretation - Full interpretation text
 * @returns Snippet suitable for combination
 */
function getInterpretationSnippet(interpretation: string): string {
  // Get first sentence or first 150 characters
  const firstSentence = interpretation.split('.')[0];
  let snippet = firstSentence.length > 150 
    ? firstSentence.substring(0, 150) + "..." 
    : firstSentence;
  
  // Convert to lowercase and adjust for natural flow
  snippet = snippet.trim();
  
  // If it starts with a capital letter phrase, convert to lowercase
  if (snippet.length > 0) {
    snippet = snippet.charAt(0).toLowerCase() + snippet.slice(1);
  }
  
  // Add period if missing
  if (!snippet.endsWith('.') && !snippet.endsWith('...')) {
    snippet += '.';
  }
  
  return snippet;
}
