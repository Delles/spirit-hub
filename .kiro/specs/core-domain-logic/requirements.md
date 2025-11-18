# Requirements Document

## Introduction

This specification defines the core domain logic layer for SpiritHub.ro, a Romanian spiritual platform. The domain logic consists of pure calculation functions for three main features: Numerology, Biorhythm, and Dream Interpretation. These functions must be deterministic, framework-agnostic, and handle Romanian language specifics (diacritics). All functions will reside in the `/lib` directory and serve as the foundation for the Convex backend and React components.

## Glossary

- **Calculation System**: The collection of pure TypeScript functions that perform numerology, biorhythm, and dream interpretation calculations
- **Life Path Number**: A single-digit number (1-9) or Master Number (11, 22, 33) derived from a person's birth date in numerology
- **Destiny Number**: A single-digit number (1-9) or Master Number (11, 22, 33) derived from a person's full name in numerology
- **Biorhythm Cycle**: A sinusoidal wave representing physical, emotional, or intellectual states over time
- **Critical Day**: A day when a biorhythm cycle crosses zero, indicating potential instability
- **Dream Symbol**: A searchable element from Romanian dream interpretation tradition
- **Romanian Diacritics**: Special characters (ă, â, î, ș, ț) used in the Romanian alphabet
- **Pure Function**: A function with no side effects that always returns the same output for the same input

## Requirements

### Requirement 1: Numerology Calculation Functions

**User Story:** As a developer, I want pure numerology calculation functions, so that I can compute Life Path numbers, Destiny numbers, and compatibility scores consistently across the application

#### Acceptance Criteria

1. WHEN a valid number is provided to the digit reduction function, THE Calculation System SHALL return a single digit between 1 and 9, or preserve Master Numbers (11, 22, 33) when encountered during reduction
2. WHEN a valid birth date is provided, THE Calculation System SHALL calculate the Life Path number by reducing the sum of day, month, and year components to a single digit or Master Number (11, 22, 33)
3. WHEN a valid Romanian name with diacritics is provided, THE Calculation System SHALL calculate the Destiny number by mapping each letter to its numerological value and reducing the sum to a single digit or Master Number (11, 22, 33)
4. WHEN two numerology numbers are provided, THE Calculation System SHALL calculate a compatibility score between 0 and 100 based on numerological principles
5. THE Calculation System SHALL provide a mapping function that converts Romanian letters (including ă, â, î, ș, ț) to their corresponding numerological values (1-9)

### Requirement 2: Biorhythm Calculation Functions

**User Story:** As a developer, I want pure biorhythm calculation functions, so that I can compute physical, emotional, and intellectual cycles for any given date

#### Acceptance Criteria

1. WHEN a birth date, target date, and cycle length are provided, THE Calculation System SHALL calculate the cycle value as a sine wave between -1 and 1
2. WHEN a birth date and target date are provided, THE Calculation System SHALL calculate the physical cycle using a 23-day period
3. WHEN a birth date and target date are provided, THE Calculation System SHALL calculate the emotional cycle using a 28-day period
4. WHEN a birth date and target date are provided, THE Calculation System SHALL calculate the intellectual cycle using a 33-day period
5. WHEN a birth date, start date, and number of days are provided, THE Calculation System SHALL identify all critical days (when any cycle crosses zero) within the specified range
6. WHEN physical, emotional, and intellectual cycle values are provided, THE Calculation System SHALL generate a Romanian-language summary describing the current state

### Requirement 3: Dream Interpretation Helper Functions

**User Story:** As a developer, I want dream interpretation helper functions, so that I can generate slugs, search symbols, and combine interpretations consistently

#### Acceptance Criteria

1. WHEN a Romanian dream symbol name is provided, THE Calculation System SHALL generate a URL-safe slug by normalizing diacritics and converting to lowercase kebab-case
2. WHEN a search query and list of dream symbols are provided, THE Calculation System SHALL return matching symbols based on fuzzy text matching of names and descriptions
3. WHEN multiple dream symbols are provided, THE Calculation System SHALL combine their interpretations into a coherent Romanian-language text

### Requirement 4: Utility Functions

**User Story:** As a developer, I want common utility functions, so that I can format dates and normalize text consistently throughout the application

#### Acceptance Criteria

1. WHEN a JavaScript Date object is provided, THE Calculation System SHALL format it as a Romanian-language date string (e.g., "14 noiembrie 2025")
2. WHEN Romanian text with diacritics is provided, THE Calculation System SHALL normalize it by converting to lowercase and handling special characters consistently
3. THE Calculation System SHALL provide the existing cn() utility function for conditional CSS class merging

### Requirement 5: Constants and Configuration

**User Story:** As a developer, I want centralized constants, so that biorhythm cycle lengths, numerology ranges, and alphabet mappings are defined in one place

#### Acceptance Criteria

1. THE Calculation System SHALL define biorhythm cycle lengths as constants: PHYSICAL_CYCLE = 23, EMOTIONAL_CYCLE = 28, INTELLECTUAL_CYCLE = 33
2. THE Calculation System SHALL define the valid numerology number range as 1 through 9
3. THE Calculation System SHALL define the complete Romanian alphabet mapping with diacritics for numerology calculations

### Requirement 6: Code Quality and Architecture

**User Story:** As a developer, I want all domain logic functions to be pure and framework-agnostic, so that they are testable, reusable, and maintainable

#### Acceptance Criteria

1. THE Calculation System SHALL implement all functions as pure functions with no side effects
2. THE Calculation System SHALL NOT import React or any UI framework dependencies
3. THE Calculation System SHALL use strict TypeScript typing for all function parameters and return values
4. THE Calculation System SHALL organize functions into separate files: numerology.ts, biorhythm.ts, dreams.ts, utils.ts, and constants.ts
5. THE Calculation System SHALL use the @/ path alias for any internal imports
