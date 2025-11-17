# Requirements Document - Biorhythm Module

## Introduction

The Biorhythm Module provides Romanian users with an interactive calculator to visualize and understand their physical, emotional, and intellectual cycles based on their birth date. This module is the simplest of the three main features (Biorhythm, Numerology, Dreams) and serves as the foundation for validating the platform's shared components and calculation infrastructure.

The module consists of two main pages: a daily biorhythm calculator and a critical days viewer. All calculations are deterministic and based on established biorhythm theory (23-day physical, 28-day emotional, 33-day intellectual cycles).

## Glossary

- **Biorhythm Calculator**: The system component that computes physical, emotional, and intellectual cycle values for a given date
- **Physical Cycle**: A 23-day biorhythm cycle representing physical energy and stamina
- **Emotional Cycle**: A 28-day biorhythm cycle representing emotional stability and mood
- **Intellectual Cycle**: A 33-day biorhythm cycle representing mental clarity and cognitive performance
- **Critical Day**: A day when any biorhythm cycle crosses zero (transitions from positive to negative or vice versa)
- **Biorhythm Chart**: A visual representation showing the three cycles over time
- **Biorhythm Form**: The user input interface for entering birth date and target date
- **Biorhythm Summary**: A text-based interpretation of the current cycle states in Romanian
- **Critical Days List**: A display component showing upcoming critical days within a specified range
- **Convex Backend**: The serverless backend system that executes biorhythm queries and returns results
- **Target Date**: The date for which biorhythm values are calculated (defaults to today)

## Requirements

### Requirement 1

**User Story:** As a Romanian spiritual seeker, I want to calculate my daily biorhythm based on my birth date, so that I can understand my physical, emotional, and intellectual states for planning my day.

#### Acceptance Criteria

1. WHEN the user navigates to `/bioritm`, THE Biorhythm Calculator SHALL display a form requesting birth date input
2. WHEN the user submits a valid birth date, THE Biorhythm Calculator SHALL compute physical, emotional, and intellectual cycle values for the current date within 500 milliseconds
3. THE Biorhythm Calculator SHALL display cycle values as percentages ranging from -100% to +100%
4. THE Biorhythm Calculator SHALL use the following cycle lengths: 23 days for physical, 28 days for emotional, 33 days for intellectual
5. THE Biorhythm Calculator SHALL present all user-facing text in Romanian language

### Requirement 2

**User Story:** As a user viewing my biorhythm results, I want to see a visual chart of my three cycles, so that I can quickly understand my current state and trends.

#### Acceptance Criteria

1. WHEN biorhythm results are displayed, THE Biorhythm Chart SHALL render a visual representation of all three cycles
2. THE Biorhythm Chart SHALL use distinct colors for each cycle: red for physical, blue for emotional, green for intellectual
3. THE Biorhythm Chart SHALL display cycle values on a vertical axis ranging from -100% to +100%
4. THE Biorhythm Chart SHALL render correctly on mobile viewports with minimum width of 320 pixels
5. THE Biorhythm Chart SHALL render correctly on desktop viewports with maximum width of 1280 pixels

### Requirement 3

**User Story:** As a user viewing my biorhythm, I want to read a text summary of what my current cycles mean, so that I can understand practical implications for my day.

#### Acceptance Criteria

1. WHEN biorhythm results are displayed, THE Biorhythm Summary SHALL provide Romanian-language guidance text
2. WHEN the physical cycle value exceeds 50%, THE Biorhythm Summary SHALL indicate the day is favorable for physical effort
3. WHEN the emotional cycle value exceeds 50%, THE Biorhythm Summary SHALL indicate the day is favorable for social interactions
4. WHEN the intellectual cycle value exceeds 50%, THE Biorhythm Summary SHALL indicate the day is favorable for mental work
5. WHEN any cycle value is below -50%, THE Biorhythm Summary SHALL suggest caution in that domain

### Requirement 4

**User Story:** As a user planning ahead, I want to see my upcoming critical days, so that I can prepare for periods requiring extra caution.

#### Acceptance Criteria

1. WHEN the user navigates to `/bioritm/critice`, THE Critical Days List SHALL display upcoming critical days within 30 days
2. THE Critical Days List SHALL identify a critical day when any cycle value is within 0.1 of zero
3. THE Critical Days List SHALL indicate which cycle (physical, emotional, or intellectual) is critical for each date
4. THE Critical Days List SHALL display dates in Romanian format (DD.MM.YYYY)
5. THE Critical Days List SHALL provide Romanian-language explanation of what to watch for on critical days

### Requirement 5

**User Story:** As a user, I want to calculate biorhythm for any specific date, so that I can plan for future events or review past states.

#### Acceptance Criteria

1. THE Biorhythm Form SHALL provide an optional target date input field
2. WHEN no target date is provided, THE Biorhythm Calculator SHALL default to the current date
3. WHEN a target date is provided, THE Biorhythm Calculator SHALL compute cycles for that specific date
4. THE Biorhythm Form SHALL validate that birth date is before target date
5. WHEN birth date is after target date, THE Biorhythm Form SHALL display a Romanian-language error message

### Requirement 6

**User Story:** As a user who found interesting biorhythm results, I want to share my results, so that I can discuss them with friends or on social media.

#### Acceptance Criteria

1. WHEN biorhythm results are displayed, THE Biorhythm Calculator SHALL provide a share button
2. WHEN the share button is activated on mobile devices, THE Biorhythm Calculator SHALL invoke the Web Share API
3. WHEN the share button is activated on desktop devices, THE Biorhythm Calculator SHALL copy the result URL to clipboard
4. WHEN the URL is copied, THE Biorhythm Calculator SHALL display "Copiat!" confirmation message for 2 seconds
5. THE Biorhythm Calculator SHALL generate shareable URLs in the format `/bioritm?date=YYYY-MM-DD`

### Requirement 7

**User Story:** As a developer maintaining the platform, I want biorhythm calculations to be performed server-side via Convex, so that the system architecture remains consistent and scalable.

#### Acceptance Criteria

1. THE Convex Backend SHALL provide a query function named `getBiorhythm` accepting birthDate and targetDate parameters
2. THE Convex Backend SHALL invoke calculation functions from `lib/biorhythm.ts`
3. THE Convex Backend SHALL return an object containing physical, emotional, and intellectual cycle values
4. THE Convex Backend SHALL return a Romanian-language summary text
5. THE Convex Backend SHALL complete query execution within 500 milliseconds

### Requirement 8

**User Story:** As a mobile user, I want the biorhythm calculator to work smoothly on my phone, so that I can check my cycles on the go.

#### Acceptance Criteria

1. THE Biorhythm Form SHALL render with touch-friendly input controls with minimum tap target size of 44x44 pixels
2. THE Biorhythm Chart SHALL render without horizontal scrolling on viewports as narrow as 320 pixels
3. THE Biorhythm Calculator SHALL load and display results within 2 seconds on 3G mobile connections
4. THE Biorhythm Form SHALL use native date picker controls on mobile devices
5. THE Biorhythm Calculator SHALL maintain dark theme styling on all mobile devices

### Requirement 9

**User Story:** As a user with accessibility needs, I want the biorhythm calculator to be usable with keyboard and screen readers, so that I can access the feature independently.

#### Acceptance Criteria

1. THE Biorhythm Form SHALL support keyboard navigation through all input fields and buttons
2. THE Biorhythm Form SHALL provide visible focus indicators on all interactive elements
3. THE Biorhythm Chart SHALL include ARIA labels describing cycle values
4. THE Biorhythm Calculator SHALL use semantic HTML elements for proper screen reader interpretation
5. THE Biorhythm Calculator SHALL maintain color contrast ratios of at least 4.5:1 for all text elements

### Requirement 10

**User Story:** As a user encountering an error, I want to see clear error messages in Romanian, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN the Convex Backend query fails, THE Biorhythm Calculator SHALL display a Romanian-language error message
2. WHEN invalid date input is provided, THE Biorhythm Form SHALL display field-specific validation messages in Romanian
3. WHEN network connectivity is lost, THE Biorhythm Calculator SHALL display "Eroare de conexiune" message
4. THE Biorhythm Calculator SHALL provide a retry mechanism when errors occur
5. THE Biorhythm Calculator SHALL log errors to the browser console for debugging purposes
