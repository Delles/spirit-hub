# Design Document

## Overview

The core domain logic layer provides pure, framework-agnostic calculation functions for SpiritHub.ro's three main features: Numerology, Biorhythm, and Dream Interpretation. This layer sits between the Convex backend and the React UI, ensuring business logic is reusable, testable, and maintainable. All functions are deterministic and handle Romanian language specifics.

## Architecture

### Layer Separation

```
┌─────────────────────────────────────┐
│   React Components (UI Layer)      │
├─────────────────────────────────────┤
│   Convex Functions (Data Layer)    │
├─────────────────────────────────────┤
│   Domain Logic (/lib) ← THIS LAYER │
├─────────────────────────────────────┤
│   TypeScript Runtime                │
└─────────────────────────────────────┘
```

### Design Principles

1. **Pure Functions**: No side effects, same input always produces same output
2. **Framework Agnostic**: No React, Next.js, or Convex imports
3. **Type Safety**: Strict TypeScript with explicit interfaces
4. **Single Responsibility**: Each file handles one domain
5. **Romanian Language Support**: Proper handling of diacritics (ă, â, î, ș, ț)


## Components and Interfaces

### 1. Numerology Module (`lib/numerology.ts`)

#### Core Functions

**reduceToSingleDigit(num: number): number**
- Recursively sums digits until a single digit (1-9) or Master Number (11, 22, 33) remains
- Preserves Master Numbers during reduction
- Example: 1985 → 1+9+8+5 = 23 → 2+3 = 5
- Example with Master: 29 → 2+9 = 11 (preserved as Master Number)

**calculateLifePath(birthDate: Date): number**
- Extracts day, month, year from date
- Reduces each component separately, then sums and reduces final result
- Preserves Master Numbers (11, 22, 33) when encountered
- Example: 14/11/1985 → (1+4) + (1+1) + (1+9+8+5) → 5 + 2 + 5 = 12 → 3
- Example with Master: 29/11/1982 → (2+9=11) + (1+1=2) + (1+9+8+2=20→2) → 11 + 2 + 2 = 15 → 6

**calculateDestinyNumber(name: string): number**
- Normalizes name (lowercase, trim)
- Maps each letter to numerological value using Romanian alphabet
- Sums all values and reduces to single digit or Master Number (11, 22, 33)
- Handles diacritics: ă, â, î, ș, ț

**calculateCompatibility(num1: number, num2: number): number**
- Compares two numerology numbers (1-9, 11, 22, 33)
- Returns compatibility score 0-100
- Algorithm: Based on numerological harmony principles
  - Same number: 100%
  - Master Numbers have special compatibility rules
  - Complementary numbers (e.g., 1-2, 3-6): 80-90%
  - Neutral: 50-70%
  - Challenging: 20-40%

**getLetterValue(letter: string): number**
- Maps Romanian letters to values 1-9
- Handles both uppercase and lowercase
- Supports diacritics

#### Type Definitions

```typescript
export type NumerologyNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33;

export interface LetterValueMap {
  [key: string]: number;
}

export const MASTER_NUMBERS = [11, 22, 33] as const;
```


### 2. Biorhythm Module (`lib/biorhythm.ts`)

#### Core Functions

**calculateCycle(birthDate: Date, targetDate: Date, cycleDays: number): number**
- Calculates days lived since birth
- Applies sine wave formula: sin(2π × daysLived / cycleDays)
- Returns value between -1 (low) and 1 (high)

**getPhysicalCycle(birthDate: Date, targetDate: Date): number**
- Wrapper for calculateCycle with 23-day period
- Represents physical energy and strength

**getEmotionalCycle(birthDate: Date, targetDate: Date): number**
- Wrapper for calculateCycle with 28-day period
- Represents mood and emotional stability

**getIntellectualCycle(birthDate: Date, targetDate: Date): number**
- Wrapper for calculateCycle with 33-day period
- Represents mental clarity and analytical ability

**getCriticalDays(birthDate: Date, startDate: Date, days: number): Date[]**
- Iterates through date range
- Identifies days where any cycle crosses zero (value between -0.1 and 0.1)
- Returns array of critical dates

**getBiorhythmSummary(physical: number, emotional: number, intellectual: number): string**
- Analyzes cycle values
- Returns Romanian-language guidance
- Examples:
  - All positive: "Zi excelentă pentru activități complexe"
  - Physical high: "Zi bună pentru efort fizic"
  - Emotional low: "Evitați decizii emoționale importante"

#### Type Definitions

```typescript
export interface BiorhythmCycles {
  physical: number;
  emotional: number;
  intellectual: number;
}

export interface CriticalDay {
  date: Date;
  cycles: ('physical' | 'emotional' | 'intellectual')[];
}
```


### 3. Dream Interpretation Module (`lib/dreams.ts`)

#### Core Functions

**generateSlug(symbolName: string): string**
- Converts Romanian text to URL-safe slug
- Normalizes diacritics: ă→a, â→a, î→i, ș→s, ț→t
- Converts to lowercase
- Replaces spaces with hyphens
- Removes special characters
- Example: "Șarpe veninos" → "sarpe-veninos"

**searchSymbols(query: string, symbols: DreamSymbol[]): DreamSymbol[]**
- Normalizes query and symbol names
- Performs fuzzy matching on name and description
- Returns sorted results (best matches first)
- Case-insensitive, diacritic-insensitive

**combineInterpretations(symbols: DreamSymbol[]): string**
- Takes 2-3 dream symbols
- Generates coherent Romanian text combining meanings
- Uses templates to create natural-sounding interpretation
- Example: "Visul tău combină [symbol1] care simbolizează [meaning1], cu [symbol2]..."

#### Type Definitions

```typescript
export interface DreamSymbol {
  id: string;
  name: string;
  slug: string;
  category: string;
  interpretation: string;
  shortDescription?: string;
}
```


### 4. Utilities Module (`lib/utils.ts`)

#### Core Functions

**formatRomanianDate(date: Date): string**
- Formats date in Romanian style
- Example: "14 noiembrie 2025"
- Uses Romanian month names: ianuarie, februarie, martie, etc.

**normalizeRomanianText(text: string): string**
- Converts to lowercase
- Normalizes diacritics for comparison
- Trims whitespace
- Used for search and matching

**cn(...inputs: ClassValue[]): string**
- Already exists from shadcn/ui
- Merges Tailwind CSS classes conditionally
- Uses clsx and tailwind-merge

#### Extended Functionality

```typescript
export const ROMANIAN_MONTHS = [
  'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
  'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'
];

export const DIACRITIC_MAP: Record<string, string> = {
  'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't',
  'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T'
};
```


### 5. Constants Module (`lib/constants.ts`)

#### Biorhythm Constants

```typescript
export const PHYSICAL_CYCLE = 23;
export const EMOTIONAL_CYCLE = 28;
export const INTELLECTUAL_CYCLE = 33;
export const CRITICAL_THRESHOLD = 0.1; // Cycle value near zero
```

#### Numerology Constants

```typescript
export const NUMEROLOGY_MIN = 1;
export const NUMEROLOGY_MAX = 9;
export const MASTER_NUMBERS = [11, 22, 33] as const;

// Romanian alphabet to numerology mapping (Pythagorean system adapted)
export const ROMANIAN_LETTER_VALUES: Record<string, number> = {
  'a': 1, 'ă': 1, 'â': 1,
  'b': 2,
  'c': 3,
  'd': 4,
  'e': 5,
  'f': 6,
  'g': 7,
  'h': 8,
  'i': 9, 'î': 9,
  'j': 1,
  'k': 2,
  'l': 3,
  'm': 4,
  'n': 5,
  'o': 6,
  'p': 7,
  'q': 8,
  'r': 9,
  's': 1, 'ș': 1,
  't': 2, 'ț': 2,
  'u': 3,
  'v': 4,
  'w': 5,
  'x': 6,
  'y': 7,
  'z': 8
};
```


## Data Models

### Input Types

```typescript
// Numerology inputs
export interface LifePathInput {
  birthDate: Date;
}

export interface DestinyNumberInput {
  fullName: string;
}

export interface CompatibilityInput {
  name1: string;
  birthDate1: Date;
  name2: string;
  birthDate2: Date;
}

// Biorhythm inputs
export interface BiorhythmInput {
  birthDate: Date;
  targetDate: Date;
}

export interface CriticalDaysInput {
  birthDate: Date;
  startDate: Date;
  daysAhead: number;
}

// Dream inputs
export interface DreamSearchInput {
  query: string;
  limit?: number;
}

export interface DreamCombinationInput {
  symbolIds: string[];
}
```

### Output Types

```typescript
// Numerology outputs
export interface NumerologyResult {
  number: NumerologyNumber;
  calculation?: string; // Optional step-by-step breakdown
}

export interface CompatibilityResult {
  score: number; // 0-100
  description: string;
}

// Biorhythm outputs
export interface BiorhythmResult {
  date: Date;
  physical: number;
  emotional: number;
  intellectual: number;
  summary: string;
}

export interface CriticalDaysResult {
  criticalDays: CriticalDay[];
  nextCriticalDay: Date | null;
}

// Dream outputs
export interface DreamSearchResult {
  symbols: DreamSymbol[];
  count: number;
}

export interface DreamCombinationResult {
  interpretation: string;
  symbols: DreamSymbol[];
}
```


## Error Handling

### Validation Strategy

All functions should validate inputs and throw descriptive errors:

```typescript
// Example validation patterns
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Date validation
function validateDate(date: Date, fieldName: string): void {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new ValidationError(`${fieldName} must be a valid date`);
  }
}

// Number range validation
function validateNumerologyNumber(num: number): void {
  const validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  if (!validNumbers.includes(num)) {
    throw new ValidationError('Numerology number must be 1-9 or a Master Number (11, 22, 33)');
  }
}

// String validation
function validateName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new ValidationError('Name cannot be empty');
  }
}
```

### Error Handling Principles

1. **Fail Fast**: Validate inputs at function entry
2. **Descriptive Messages**: Clear error messages for debugging
3. **Type Safety**: Use TypeScript to prevent many errors at compile time
4. **No Silent Failures**: Always throw or return error indicators
5. **Caller Responsibility**: Let calling code (Convex/React) handle user-facing errors


## Testing Strategy

### Unit Testing Approach

While unit tests are optional for MVP, the design supports easy testing:

**Test Structure**
```typescript
// Example test cases for numerology.ts
describe('reduceToSingleDigit', () => {
  it('reduces multi-digit numbers correctly', () => {
    expect(reduceToSingleDigit(23)).toBe(5); // 2+3=5
    expect(reduceToSingleDigit(1985)).toBe(5); // 1+9+8+5=23, 2+3=5
  });
  
  it('returns single digits unchanged', () => {
    expect(reduceToSingleDigit(7)).toBe(7);
  });
});

describe('calculateLifePath', () => {
  it('calculates correct life path for known dates', () => {
    const date = new Date(1985, 10, 14); // Nov 14, 1985
    expect(calculateLifePath(date)).toBe(3);
  });
});
```

**Test Coverage Goals** (if implemented)
- Numerology: All calculation functions with edge cases
- Biorhythm: Cycle calculations, critical day detection
- Dreams: Slug generation, search matching
- Utils: Date formatting, text normalization

### Manual Testing

For MVP, manual testing checklist:

1. **Numerology**
   - Test with various birth dates
   - Test Romanian names with all diacritics
   - Verify compatibility scores make sense

2. **Biorhythm**
   - Test with different birth dates and target dates
   - Verify cycles oscillate correctly
   - Check critical days are identified

3. **Dreams**
   - Test slug generation with special characters
   - Test search with Romanian queries
   - Verify combined interpretations read naturally

