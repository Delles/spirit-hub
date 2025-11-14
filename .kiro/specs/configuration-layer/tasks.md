# Implementation Plan

- [x] 1. Create site configuration module





  - Create `config/site.ts` with TypeScript interfaces for SiteConfig, NavItem, and SEO settings
  - Define siteConfig object with name "SpiritHub.ro", description, and base URL
  - Add main navigation items for Numerologie, Vise, and Bioritm with Romanian titles
  - Include SEO defaults (title template, description, keywords in Romanian)
  - Add social media link placeholders (Facebook, Instagram, Twitter)
  - Export typed constant with `as const` assertion
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Create numerology configuration module
  - Create `config/numerology.ts` with TypeScript interfaces for LetterMapping, NumberInterpretation, CompatibilityRange, and NumerologyConfig
  - Define complete Romanian letter-to-number mapping including all diacritics (Ă=1, Â=1, Î=9, Ș=1, Ț=2)
  - Map standard alphabet A-Z to numbers 1-9 using Pythagorean system
  - Define masterNumbers array [11, 22, 33] as readonly constant
  - Define interpretation keys for life path numbers 1-9 and Master Numbers 11, 22, 33 with short Romanian descriptions
  - Define interpretation keys for destiny numbers 1-9 and Master Numbers 11, 22, 33 with short Romanian descriptions
  - Mark Master Number interpretations with isMasterNumber: true flag
  - Create compatibility ranges mapping scores 0-100 to levels (scăzută, medie, bună, excelentă)
  - Export validNumbers array [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]
  - Add inline comments explaining the letter mapping system and Master Numbers
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 5.1, 5.2, 5.3, 5.4, 5.5, 6.2, 6.3_

- [x] 3. Create dreams configuration module





  - Create `config/dreams.ts` with TypeScript interfaces for DreamCategory, SearchConfig, and DreamsConfig
  - Define dream categories: animale, natură, obiecte, emoții, persoane, acțiuni, locuri with Romanian names and descriptions
  - Configure search parameters: minQueryLength=2, maxResults=20, debounceMs=300
  - Set maxCombinedSymbols to 3 for interpretation combinations
  - Define fallback message in Romanian for when no symbols are found
  - Export typed constant with proper UTF-8 encoding for Romanian text
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 4. Create biorhythm configuration module





  - Create `config/biorhythm.ts` with TypeScript interfaces for CycleConfig, InterpretationRange, and BiorhythmConfig
  - Define physical cycle: 23 days, red color (#ef4444), Romanian description
  - Define emotional cycle: 28 days, blue color (#3b82f6), Romanian description
  - Define intellectual cycle: 33 days, green color (#10b981), Romanian description
  - Set criticalThreshold to 0.1 (±0.1 range around zero)
  - Define interpretation ranges: critic (-0.1 to 0.1), scăzut (0.1 to 0.4), mediu (0.4 to 0.7), ridicat (0.7 to 1.0)
  - Set defaultForecastDays to 30
  - Add comments explaining critical threshold and interpretation ranges
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 6.2, 6.4_

- [x] 5. Verify configuration integration with existing code






  - Check that `lib/numerology.ts` can import and use numerologyConfig.letterToNumber
  - Verify that configuration exports are compatible with existing function signatures
  - Ensure no circular dependencies between `/lib` and `/config`
  - Test that TypeScript autocomplete works when importing configuration
  - _Requirements: 1.5, 5.1, 5.2, 6.1_

- [x] 6. Write configuration tests






  - Create `config/__tests__/site.test.ts` to verify site config structure
  - Create `config/__tests__/numerology.test.ts` to verify all Romanian letters are mapped, all numbers 1-9 have interpretations, and Master Numbers 11, 22, 33 are defined
  - Create `config/__tests__/dreams.test.ts` to verify all categories exist and search config has valid values
  - Create `config/__tests__/biorhythm.test.ts` to verify cycle lengths (23, 28, 33) and critical threshold
  - Test that all exported objects match their TypeScript interfaces
  - _Requirements: 5.1, 5.2_

- [x] 7. Add integration tests





  - Test that `lib/numerology.ts` correctly uses letter mappings from config
  - Test that biorhythm calculations use correct cycle lengths from config
  - Verify that configuration values are properly typed and prevent invalid usage
  - _Requirements: 6.1_

- [x] 8. Update existing code to use configuration





  - Update `lib/numerology.ts` to import and use `numerologyConfig.letterToNumber` instead of inline mapping
  - Update any hardcoded cycle lengths in `lib/biorhythm.ts` to use `biorhythmConfig.cycles`
  - Ensure all imports use `@/config/` path alias
  - Remove any duplicate constants that now exist in configuration
  - _Requirements: 2.6, 6.1_

- [x] 9. Documentation and cleanup





  - Verify all configuration files use kebab-case naming
  - Ensure all Romanian text uses proper UTF-8 encoding with diacritics
  - Check that inline comments explain non-obvious values
  - Confirm no business logic exists in configuration files (data only)
  - Run TypeScript compiler to verify no type errors
  - Clean up any test or bloat reamained
  - _Requirements: 5.3, 5.4, 5.5, 6.2, 6.3, 6.4, 6.5_
