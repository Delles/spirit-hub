# Requirements Document - Daily Features & Automation

## Introduction

This feature implements automated daily content selection and a homepage widget that displays the daily number, daily dream, and biorhythm hint. The goal is to create engaging daily content that encourages users to return to SpiritHub.ro regularly, while maintaining 99% autonomy through deterministic selection and automated updates.

## Glossary

- **Daily Widget**: A component displayed on the homepage showing three daily features (number, dream, biorhythm hint)
- **Daily Number (Numărul Zilei)**: A numerology number (1-9, 11, 22, or 33) calculated deterministically for each day
- **Master Number**: A special numerology number (11, 22, or 33) with heightened spiritual significance that is not reduced to a single digit
- **Daily Dream (Visul Zilei)**: A dream symbol selected deterministically for each day
- **Biorhythm Hint**: A brief suggestion based on typical biorhythm patterns for the current day
- **Convex Cron Job**: A scheduled task that runs automatically at specified intervals
- **Deterministic Selection**: A selection algorithm that produces the same result for all users on the same date
- **Daily Picks Table**: A Convex database table storing persisted daily selections

## Requirements

### Requirement 1: Daily Number Automation

**User Story:** As a returning user, I want to see a new numerology number each day with its interpretation, so that I can receive daily spiritual guidance.

#### Acceptance Criteria

1. WHEN the current date changes, THE System SHALL calculate a new daily number (1-9, 11, 22, or 33) deterministically based on the date
2. THE System SHALL detect Master Numbers (11, 22, 33) during calculation and preserve them without reduction
3. THE System SHALL ensure all users see the same daily number for the same date
4. THE System SHALL provide a Romanian interpretation for each daily number including Master Numbers
5. THE System SHALL persist the daily number selection in the dailyPicks table to avoid repeated calculations
6. THE System SHALL update the daily number automatically at midnight UTC via Convex cron job
7. WHEN a Master Number (11, 22, 33) is the daily number, THE System SHALL display a special badge or indicator in the widget

### Requirement 2: Daily Dream Automation

**User Story:** As a returning user, I want to see a new dream symbol each day with its interpretation, so that I can explore different dream meanings regularly.

#### Acceptance Criteria

1. WHEN the current date changes, THE System SHALL select a new dream symbol deterministically based on the date
2. THE System SHALL ensure all users see the same dream symbol for the same date
3. THE System SHALL provide the full Romanian interpretation for the selected dream symbol
4. THE System SHALL persist the daily dream selection in the dailyPicks table to avoid repeated calculations
5. THE System SHALL update the daily dream automatically via hourly Convex cron job (already implemented)

### Requirement 3: Homepage Daily Widget

**User Story:** As a visitor to the homepage, I want to see today's daily number, dream, and biorhythm hint in one place, so that I can quickly access daily spiritual guidance without navigating to separate pages.

#### Acceptance Criteria

1. THE System SHALL display a daily widget component on the homepage above the tool cards
2. THE System SHALL show the daily number with its title and short description in the widget
3. THE System SHALL show the daily dream symbol with its name and short meaning in the widget
4. THE System SHALL show a biorhythm hint with a brief suggestion for the day in the widget
5. THE System SHALL provide clickable links from each widget section to the corresponding full page
6. THE System SHALL load the widget content in less than 500ms
7. THE System SHALL display the widget in Romanian language
8. THE System SHALL make the widget responsive for mobile and desktop viewports

### Requirement 4: Biorhythm Daily Hint

**User Story:** As a homepage visitor, I want to see a brief biorhythm-based suggestion for today, so that I can get quick guidance without entering my birth date.

#### Acceptance Criteria

1. THE System SHALL generate a generic biorhythm hint based on the day of the week
2. THE System SHALL provide Romanian text for each daily hint
3. THE System SHALL rotate through different hints to provide variety
4. THE System SHALL include a call-to-action link to the full biorhythm calculator
5. THE System SHALL display the hint without requiring user input

### Requirement 5: Cron Job Management

**User Story:** As a system administrator, I want daily content to update automatically without manual intervention, so that the platform maintains 99% autonomy.

#### Acceptance Criteria

1. THE System SHALL run a Convex cron job hourly to ensure daily dream persistence
2. THE System SHALL run a Convex cron job daily at 00:00 UTC to ensure daily number persistence
3. THE System SHALL handle timezone differences correctly (Europe/Bucharest for Romanian users)
4. THE System SHALL log cron job execution for monitoring purposes
5. IF a cron job fails, THEN THE System SHALL continue to serve cached content from the dailyPicks table

### Requirement 6: Performance and Caching

**User Story:** As a user, I want the daily widget to load quickly, so that I can access daily content without delays.

#### Acceptance Criteria

1. THE System SHALL cache daily selections in the dailyPicks table
2. THE System SHALL serve daily content from cache when available
3. THE System SHALL load the daily widget in less than 500ms on typical connections
4. THE System SHALL minimize database queries by using persisted daily picks
5. THE System SHALL invalidate cache only when the date changes

### Requirement 7: Error Handling and Fallbacks

**User Story:** As a user, I want to see daily content even if there are temporary system issues, so that my experience is not disrupted.

#### Acceptance Criteria

1. IF the daily number query fails, THEN THE System SHALL display a fallback message in Romanian
2. IF the daily dream query fails, THEN THE System SHALL display a fallback message in Romanian
3. IF the biorhythm hint is unavailable, THEN THE System SHALL display a generic motivational message
4. THE System SHALL log errors for monitoring without exposing technical details to users
5. THE System SHALL continue to display other widget sections even if one section fails
