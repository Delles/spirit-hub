/**
 * Dreams Configuration
 *
 * Centralized configuration for dream interpretation features including
 * symbol categories, search behavior, and interpretation limits.
 */

export interface DreamCategory {
  id: string;
  name: string;
  description: string;
}

export interface SearchConfig {
  minQueryLength: number;
  maxResults: number;
  debounceMs: number;
}

export interface DreamsConfig {
  categories: DreamCategory[];
  search: SearchConfig;
  maxCombinedSymbols: number;
  fallbackMessage: string;
}

export const dreamsConfig: DreamsConfig = {
  // Dream symbol categories with Romanian names and descriptions
  categories: [
    {
      id: "animale",
      name: "Animale",
      description: "Simboluri legate de animale: șarpe, pisică, câine, pasăre, etc.",
    },
    {
      id: "natura",
      name: "Natură",
      description: "Elemente naturale: apă, foc, pădure, munte, mare, etc.",
    },
    {
      id: "obiecte",
      name: "Obiecte",
      description: "Obiecte comune: casă, mașină, cheie, carte, telefon, etc.",
    },
    {
      id: "emotii",
      name: "Emoții",
      description: "Stări emoționale: frică, bucurie, tristețe, furie, iubire, etc.",
    },
    {
      id: "persoane",
      name: "Persoane",
      description: "Figuri umane: mamă, tată, străin, copil, prieten, etc.",
    },
    {
      id: "actiuni",
      name: "Acțiuni",
      description: "Acțiuni și activități: zbor, cădere, fugă, dans, vorbire, etc.",
    },
    {
      id: "locuri",
      name: "Locuri",
      description: "Locații și spații: școală, biserică, cimitir, piață, drum, etc.",
    },
  ],

  // Search configuration parameters
  search: {
    minQueryLength: 2, // Minimum characters required to trigger search
    maxResults: 20, // Maximum number of results to display
    debounceMs: 300, // Debounce delay in milliseconds for search input
  },

  // Maximum number of symbols that can be combined for interpretation
  maxCombinedSymbols: 3,

  // Fallback message when no dream symbols are found
  fallbackMessage:
    "Nu am găsit simboluri care să corespundă căutării tale. Încearcă cu alte cuvinte sau verifică ortografia.",
} as const;

// Export individual constants for convenience
export const dreamCategories = dreamsConfig.categories;
export const searchConfig = dreamsConfig.search;
export const MAX_COMBINED_SYMBOLS = dreamsConfig.maxCombinedSymbols;
