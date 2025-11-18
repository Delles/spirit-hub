# Implementation Plan

- [x] 1. Create constants module with shared configuration
  - Create `lib/constants.ts` file
  - Define biorhythm cycle constants (PHYSICAL_CYCLE=23, EMOTIONAL_CYCLE=28, INTELLECTUAL_CYCLE=33, CRITICAL_THRESHOLD=0.1)
  - Define numerology constants (NUMEROLOGY_MIN=1, NUMEROLOGY_MAX=9, MASTER_NUMBERS=[11,22,33])
  - Define Romanian alphabet to numerology value mapping (ROMANIAN_LETTER_VALUES)
  - Export all constants with proper TypeScript typing
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 2. Extend utilities module with Romanian language support
  - [x] 2.1 Add Romanian date formatting function
    - Implement `formatRomanianDate(date: Date): string` in `lib/utils.ts`
    - Define ROMANIAN_MONTHS array with all 12 month names
    - Format dates as "DD month_name YYYY" (e.g., "14 noiembrie 2025")
    - _Requirements: 4.1_

  - [x] 2.2 Add Romanian text normalization function
    - Implement `normalizeRomanianText(text: string): string` in `lib/utils.ts`
    - Define DIACRITIC_MAP for Romanian diacritics (ă, â, î, ș, ț)
    - Convert to lowercase and normalize diacritics
    - Trim whitespace
    - _Requirements: 4.2_

  - [x] 2.3 Verify existing cn() utility
    - Confirm `cn()` function exists and works correctly
    - Ensure it uses clsx and tailwind-merge
    - _Requirements: 4.3_

- [x] 3. Implement numerology calculation functions
  - [x] 3.1 Create numerology module file
    - Create `lib/numerology.ts` file
    - Import constants from `lib/constants.ts`
    - Define TypeScript types (NumerologyNumber, LetterValueMap)
    - _Requirements: 6.4_

  - [x] 3.2 Implement digit reduction with Master Number support
    - Write `reduceToSingleDigit(num: number): number` function
    - Check if number is Master Number (11, 22, 33) before reducing
    - Recursively sum digits until single digit or Master Number
    - Add input validation for positive integers
    - _Requirements: 1.1, 6.1, 6.3_

  - [x] 3.3 Implement letter-to-number mapping
    - Write `getLetterValue(letter: string): number` function
    - Use ROMANIAN_LETTER_VALUES from constants
    - Handle both uppercase and lowercase
    - Return 0 for non-letter characters

    - _Requirements: 1.5_

  - [x] 3.4 Implement Life Path calculation
    - Write `calculateLifePath(birthDate: Date): number` function
    - Extract day, month, year from Date object
    - Reduce each component separately (preserving Master Numbers)

    - Sum reduced components and reduce final result
    - Add date validation
    - _Requirements: 1.2, 6.1, 6.3_

  - [x] 3.5 Implement Destiny Number calculation
    - Write `calculateDestinyNumber(name: string): number` function
    - Normalize name (lowercase, trim)

    - Map each letter to numerological value
    - Sum all values and reduce to single digit or Master Number
    - Handle Romanian diacritics correctly
    - Add name validation (non-empty)
    - _Requirements: 1.3, 6.1, 6.3_

  - [x] 3.6 Implement compatibility calculation
    - Write `calculateCompatibility(num1: number, num2: number): number` function
    - Validate both numbers are valid numerology numbers (1-9, 11, 22, 33)
    - Implement compatibility algorithm (same=100%, complementary=80-90%, neutral=50-70%, challenging=20-40%)
    - Handle Master Number special cases
    - Return score between 0-100
    - _Requirements: 1.4, 6.3_

- [x] 4. Implement biorhythm calculation functions
  - [x] 4.1 Create biorhythm module file
    - Create `lib/biorhythm.ts` file
    - Import constants from `lib/constants.ts`
    - Define TypeScript interfaces (BiorhythmCycles, CriticalDay)
    - _Requirements: 6.4_

  - [x] 4.2 Implement core cycle calculation
    - Write `calculateCycle(birthDate: Date, targetDate: Date, cycleDays: number): number` function
    - Calculate days lived since birth
    - Apply sine wave formula: sin(2π × daysLived / cycleDays)
    - Return value between -1 and 1
    - Add date validation

    - _Requirements: 2.1, 6.1, 6.3_

  - [x] 4.3 Implement cycle-specific wrapper functions
    - Write `getPhysicalCycle(birthDate: Date, targetDate: Date): number` using 23-day cycle

    - Write `getEmotionalCycle(birthDate: Date, targetDate: Date): number` using 28-day cycle
    - Write `getIntellectualCycle(birthDate: Date, targetDate: Date): number` using 33-day cycle
    - _Requirements: 2.2, 2.3, 2.4_

  - [x] 4.4 Implement critical days detection
    - Write `getCriticalDays(birthDate: Date, startDate: Date, days: number): Date[]` function
    - Iterate through date range
    - Check each cycle for zero-crossing (value between -0.1 and 0.1)
    - Return array of critical dates with affected cycles
    - _Requirements: 2.5, 6.3_

  - [x] 4.5 Implement Romanian biorhythm summary
    - Write `getBiorhythmSummary(physical: number, emotional: number, intellectual: number): string` function
    - Analyze cycle values (positive/negative/near-zero)
    - Generate Romanian-language guidance text
    - Handle different combinations (all positive, mixed, all negative, etc.)
    - _Requirements: 2.6_

- [x] 5. Implement dream interpretation helper functions
  - [x] 5.1 Create dreams module file
    - Create `lib/dreams.ts` file
    - Import utilities from `lib/utils.ts`
    - Define TypeScript interface (DreamSymbol)
    - _Requirements: 6.4_

  - [x] 5.2 Implement slug generation
    - Write `generateSlug(symbolName: string): string` function
    - Normalize Romanian diacritics using DIACRITIC_MAP
    - Convert to lowercase
    - Replace spaces with hyphens
    - Remove special characters (keep only alphanumeric and hyphens)
    - _Requirements: 3.1, 6.3_

  - [x] 5.3 Implement symbol search
    - Write `searchSymbols(query: string, symbols: DreamSymbol[]): DreamSymbol[]` function
    - Normalize query and symbol names for comparison
    - Perform fuzzy matching on name and description fields
    - Sort results by relevance (exact matches first, then partial matches)
    - Return matching symbols array
    - _Requirements: 3.2, 6.3_

  - [x] 5.4 Implement interpretation combination
    - Write `combineInterpretations(symbols: DreamSymbol[]): string` function
    - Accept 2-3 dream symbols
    - Generate coherent Romanian text using templates
    - Combine individual interpretations naturally
    - Return combined interpretation string
    - _Requirements: 3.3_

- [x] 6. Add validation and error handling
  - Create ValidationError class extending Error
  - Add date validation helper function
  - Add numerology number validation helper function
  - Add name validation helper function
  - Ensure all public functions validate inputs
  - _Requirements: 6.1, 6.3_

- [x] 7. Verify code quality and architecture requirements
  - Confirm all functions are pure (no side effects)
  - Verify no React or UI framework imports exist
  - Check all functions have strict TypeScript typing
  - Verify proper file organization (numerology.ts, biorhythm.ts, dreams.ts, utils.ts, constants.ts)
  - Ensure all imports use @/ path alias
  - Write TypeScript test files using Bun to verify all functions
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
