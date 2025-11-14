# Design Document

## Overview

The configuration layer provides a centralized, type-safe approach to managing application-wide and feature-specific settings for SpiritHub.ro. This design establishes four configuration modules (`site.ts`, `numerology.ts`, `dreams.ts`, `biorhythm.ts`) that export typed constants, ensuring consistency and maintainability across the codebase.

## Architecture

### Directory Structure

```
config/
├── site.ts           # Global site configuration
├── numerology.ts     # Numerology-specific constants
├── dreams.ts         # Dream interpretation constants
└── biorhythm.ts      # Biorhythm calculation constants
```

### Design Principles

1. **Type Safety First**: All configuration uses TypeScript interfaces and types
2. **Immutability**: Export constants using `as const` where appropriate
3. **Single Source of Truth**: Each setting exists in exactly one place
4. **No Logic**: Configuration files contain only data, no functions or calculations
5. **Documentation**: Inline comments explain non-obvious values

## Components and Interfaces

### 1. Site Configuration (`config/site.ts`)

**Purpose**: Global application settings including branding, navigation, SEO, and social media.

**Type Definitions**:

```typescript
export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  mainNav: NavItem[];
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    keywords: string[];
  };
}
```

**Key Data**:
- Site name: "SpiritHub.ro"
- Main navigation items for Numerologie, Vise, Bioritm
- SEO defaults in Romanian
- Social media links (placeholders for future use)

### 2. Numerology Configuration (`config/numerology.ts`)

**Purpose**: Romanian letter mappings, number interpretations, and compatibility ranges.

**Type Definitions**:

```typescript
export interface LetterMapping {
  [key: string]: number;
}

export interface NumberInterpretation {
  number: number;
  key: string;
  shortDescription: string;
  isMasterNumber?: boolean;
}

export interface CompatibilityRange {
  min: number;
  max: number;
  level: 'scăzută' | 'medie' | 'bună' | 'excelentă';
  key: string;
}

export interface NumerologyConfig {
  letterToNumber: LetterMapping;
  masterNumbers: readonly number[];
  lifePathNumbers: NumberInterpretation[];
  destinyNumbers: NumberInterpretation[];
  compatibilityRanges: CompatibilityRange[];
  validNumbers: number[];
}
```

**Key Data**:
- Complete Romanian alphabet mapping (A-Z plus ă, â, î, ș, ț)
- Master Numbers: [11, 22, 33] (preserved during reduction)
- Interpretation keys for numbers 1-9 and Master Numbers 11, 22, 33
- Compatibility score ranges (0-100 mapped to quality levels)
- Valid number range: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]

**Romanian Letter Mapping**:
```
A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9,
J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9,
S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8,
Ă=1, Â=1, Î=9, Ș=1, Ț=2
```

### 3. Dreams Configuration (`config/dreams.ts`)

**Purpose**: Symbol categories, search parameters, and interpretation limits.

**Type Definitions**:

```typescript
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
```

**Key Data**:
- **Categories** (7 main categories for organizing dream symbols):
  - `animale` - Animals (șarpe, pisică, câine, etc.)
  - `natura` - Nature (apă, foc, pădure, munte, etc.)
  - `obiecte` - Objects (casă, mașină, cheie, etc.)
  - `emotii` - Emotions (frică, bucurie, tristețe, etc.)
  - `persoane` - People (mamă, tată, străin, etc.)
  - `actiuni` - Actions (zbor, cădere, fugă, etc.)
  - `locuri` - Places (școală, biserică, cimitir, etc.)
- Search: min 2 characters, max 20 results, 300ms debounce
- Max 3 symbols for combined interpretation
- Fallback message in Romanian when no results found

### 4. Biorhythm Configuration (`config/biorhythm.ts`)

**Purpose**: Cycle parameters, thresholds, and interpretation ranges.

**Type Definitions**:

```typescript
export interface CycleConfig {
  name: string;
  days: number;
  color: string;
  description: string;
}

export interface InterpretationRange {
  min: number;
  max: number;
  level: 'critic' | 'scăzut' | 'mediu' | 'ridicat';
  key: string;
}

export interface BiorhythmConfig {
  cycles: {
    physical: CycleConfig;
    emotional: CycleConfig;
    intellectual: CycleConfig;
  };
  criticalThreshold: number;
  interpretationRanges: InterpretationRange[];
  defaultForecastDays: number;
}
```

**Key Data**:
- Physical cycle: 23 days (red)
- Emotional cycle: 28 days (blue)
- Intellectual cycle: 33 days (green)
- Critical threshold: ±0.1 (values near zero)
- Interpretation ranges: critical (-0.1 to 0.1), low (0.1 to 0.4), medium (0.4 to 0.7), high (0.7 to 1.0)
- Default forecast: 30 days

## Data Models

### Configuration Export Pattern

All configuration modules follow this pattern:

```typescript
// 1. Define TypeScript interfaces
export interface ConfigType {
  // ...properties
}

// 2. Define the configuration object
export const configName: ConfigType = {
  // ...data
} as const;

// 3. Export individual constants if needed
export const SPECIFIC_CONSTANT = configName.someValue;
```

### Usage Pattern

Components and utilities import configuration like this:

```typescript
import { siteConfig } from '@/config/site';
import { numerologyConfig } from '@/config/numerology';

// Use with full type safety
const siteName = siteConfig.name;
const letterValue = numerologyConfig.letterToNumber['A'];
```

## Error Handling

Configuration modules are static and don't perform runtime operations, so error handling is minimal:

1. **Type Safety**: TypeScript compiler catches type mismatches at build time
2. **Validation**: No runtime validation needed since values are constants
3. **Missing Keys**: Accessing undefined keys will be caught by TypeScript strict mode

## Testing Strategy

### Unit Tests

Configuration modules should have minimal testing since they're static data:

1. **Structure Tests**: Verify exported objects match their TypeScript interfaces
2. **Completeness Tests**: Ensure all expected keys exist (e.g., all Romanian letters mapped)
3. **Value Tests**: Verify critical values (e.g., cycle lengths are correct)

**Example Test Cases**:
```typescript
describe('numerologyConfig', () => {
  it('should map all Romanian letters', () => {
    expect(numerologyConfig.letterToNumber['Ă']).toBe(1);
    expect(numerologyConfig.letterToNumber['Ș']).toBe(1);
  });

  it('should have 9 life path numbers', () => {
    expect(numerologyConfig.lifePathNumbers).toHaveLength(9);
  });
});

describe('biorhythmConfig', () => {
  it('should have correct cycle lengths', () => {
    expect(biorhythmConfig.cycles.physical.days).toBe(23);
    expect(biorhythmConfig.cycles.emotional.days).toBe(28);
    expect(biorhythmConfig.cycles.intellectual.days).toBe(33);
  });
});
```

### Integration Tests

Test that configuration is correctly consumed by other modules:

1. **Numerology Integration**: Verify `lib/numerology.ts` uses letter mappings correctly
2. **Dreams Integration**: Verify search components respect search config limits
3. **Biorhythm Integration**: Verify calculations use correct cycle lengths

## Performance Considerations

1. **Static Imports**: All configuration is imported at build time, no runtime overhead
2. **Tree Shaking**: Unused configuration can be eliminated by bundler
3. **No Computation**: Pure data exports, no functions or calculations
4. **Memory Efficient**: Configuration loaded once and shared across all imports

## Security Considerations

1. **No Secrets**: Configuration files contain no API keys or sensitive data
2. **Public Data**: All configuration is safe to expose in client-side bundles
3. **Type Safety**: TypeScript prevents accidental misuse of configuration values

## Accessibility Considerations

Configuration supports accessibility through:

1. **Romanian Language**: All user-facing text properly encoded with diacritics
2. **Semantic Structure**: Navigation items include descriptions for screen readers
3. **Color Choices**: Biorhythm cycle colors have sufficient contrast

## Future Extensibility

The configuration layer is designed to grow:

1. **New Features**: Add new config files (e.g., `config/blog.ts`)
2. **Environment-Specific**: Can add environment overrides if needed (dev vs. prod)
3. **Localization**: Structure supports future multi-language expansion
4. **Feature Flags**: Can add feature toggle configuration

## Dependencies

- **TypeScript**: For type definitions and compile-time checking
- **No Runtime Dependencies**: Pure TypeScript/JavaScript, no external packages

## Migration Path

Since this is new infrastructure, no migration is needed. Future changes:

1. **Adding Values**: Simply extend the configuration objects
2. **Changing Values**: Update in one place, changes propagate automatically
3. **Deprecating Values**: Mark as deprecated in TypeScript, remove after refactoring consumers
