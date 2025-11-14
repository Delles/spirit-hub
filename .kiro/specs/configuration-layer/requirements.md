# Requirements Document

## Introduction

This specification defines the requirements for implementing a centralized configuration layer for SpiritHub.ro. The configuration layer will provide typed, centralized access to site-wide settings, feature-specific parameters, and domain-specific constants. This layer is essential for maintaining consistency across the application and enabling easy modifications without touching code.

## Glossary

- **Configuration Layer**: A set of TypeScript modules in the `/config` directory that export typed constants and settings
- **Site Config**: Global application settings including branding, navigation, SEO defaults, and URLs
- **Feature Config**: Domain-specific settings for numerology, dreams, and biorhythm features
- **Romanian Alphabet**: The Romanian alphabet including diacritics (ă, â, î, ș, ț)
- **Interpretation Keys**: Identifiers used to map calculation results to their textual interpretations
- **Critical Day Threshold**: The value range where a biorhythm cycle is considered "critical" (near zero crossing)

## Requirements

### Requirement 1

**User Story:** As a developer, I want centralized site configuration, so that I can easily modify branding, navigation, and SEO settings without searching through multiple files

#### Acceptance Criteria

1. THE System SHALL provide a `config/site.ts` module that exports a typed `siteConfig` object
2. THE `siteConfig` object SHALL include site name, description, base URL, and navigation structure
3. THE `siteConfig` object SHALL include social media links and SEO default values
4. THE `siteConfig` object SHALL use TypeScript interfaces to ensure type safety
5. WHERE the site configuration is imported, THE System SHALL provide full IDE autocomplete support

### Requirement 2

**User Story:** As a developer implementing numerology features, I want centralized numerology configuration, so that I can access letter mappings and interpretation keys consistently

#### Acceptance Criteria

1. THE System SHALL provide a `config/numerology.ts` module that exports numerology-specific constants
2. THE numerology config SHALL include a complete Romanian letter-to-number mapping including all diacritics (ă, â, î, ș, ț)
3. THE numerology config SHALL define interpretation keys for all life path numbers (1-9 and Master Numbers 11, 22, 33)
4. THE numerology config SHALL define interpretation keys for destiny numbers (1-9 and Master Numbers 11, 22, 33)
5. THE numerology config SHALL define Master Numbers (11, 22, 33) as special numbers that are not reduced
6. THE numerology config SHALL define compatibility score ranges and their meanings
7. WHERE Romanian text is processed, THE System SHALL use the centralized letter mapping to ensure consistency

### Requirement 3

**User Story:** As a developer implementing dream interpretation, I want centralized dream configuration, so that I can manage symbol categories and search behavior consistently

#### Acceptance Criteria

1. THE System SHALL provide a `config/dreams.ts` module that exports dream-specific constants
2. THE dream config SHALL define all symbol categories (animale, natură, obiecte, emoții, etc.)
3. THE dream config SHALL specify search configuration parameters including minimum query length and result limits
4. THE dream config SHALL define fallback behavior for when no symbols are found
5. THE dream config SHALL specify the maximum number of symbols allowed in combined interpretations

### Requirement 4

**User Story:** As a developer implementing biorhythm features, I want centralized biorhythm configuration, so that I can access cycle parameters and thresholds consistently

#### Acceptance Criteria

1. THE System SHALL provide a `config/biorhythm.ts` module that exports biorhythm-specific constants
2. THE biorhythm config SHALL define cycle lengths for physical (23 days), emotional (28 days), and intellectual (33 days) cycles
3. THE biorhythm config SHALL define critical day thresholds (the range around zero considered "critical")
4. THE biorhythm config SHALL define interpretation ranges for cycle values (high, medium, low, critical)
5. THE biorhythm config SHALL specify the default number of days to display for critical day forecasts

### Requirement 5

**User Story:** As a developer, I want all configuration modules to follow consistent patterns, so that the codebase is maintainable and predictable

#### Acceptance Criteria

1. THE System SHALL export all configuration as typed constants (not classes or functions)
2. THE System SHALL use TypeScript interfaces to define the structure of all configuration objects
3. THE System SHALL use kebab-case for configuration file names
4. THE System SHALL use camelCase for exported constant names
5. WHERE configuration contains Romanian text, THE System SHALL use proper UTF-8 encoding and include diacritics

### Requirement 6

**User Story:** As a developer, I want configuration to be easily modifiable, so that I can adjust settings without understanding implementation details

#### Acceptance Criteria

1. THE System SHALL separate configuration from implementation logic
2. THE System SHALL include inline comments explaining the purpose of non-obvious configuration values
3. THE System SHALL use descriptive names for all configuration properties
4. WHERE configuration values have constraints, THE System SHALL document those constraints in comments
5. THE System SHALL ensure no business logic exists in configuration files (only data and constants)
