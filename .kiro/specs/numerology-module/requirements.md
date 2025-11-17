# Requirements Document - Numerology Module

## Introduction

The Numerology Module provides Romanian-language numerology calculators that enable users to discover their Life Path number, Destiny number, compatibility scores, and daily numerology guidance. The module consists of four distinct calculators that use deterministic mathematical algorithms to generate personalized interpretations based on birth dates and names. All calculations support Romanian diacritics (ă, â, î, ș, ț) and provide culturally relevant interpretations in Romanian.

## Glossary

- **Numerology System**: The web application that provides numerology calculation and interpretation services
- **Life Path Calculator**: A web page that calculates a user's Life Path number from their birth date
- **Destiny Calculator**: A web page that calculates a user's Destiny number from their full name
- **Compatibility Calculator**: A web page that calculates relationship compatibility between two people using their names and birth dates
- **Daily Number Generator**: A web page that provides a daily numerology number and forecast based on the current date
- **Romanian Diacritics**: Special characters in the Romanian alphabet (ă, â, î, ș, ț) that must be properly mapped to numerology values
- **Interpretation Data**: Pre-written Romanian text stored in the database that explains the meaning of each numerology number (1-9, 11, 22, 33)
- **Master Number**: A special numerology number (11, 22, or 33) that carries heightened spiritual significance and is not reduced to a single digit
- **Single-Digit Number**: A numerology number from 1 through 9 that represents the final reduced value
- **Convex Backend**: The serverless backend system that stores and retrieves interpretation data
- **Result Card**: A UI component that displays calculation results with number, interpretation, and sharing functionality
- **User**: A person accessing the Numerology System through a web browser
- **Valid Birth Date**: A date in the past that follows the format YYYY-MM-DD
- **Valid Name**: A text string containing at least 2 characters, consisting of Romanian letters and spaces
- **Web Share API**: The browser API that enables native sharing functionality on supported devices

## Requirements

### Requirement 1

**User Story:** As a curious visitor, I want to calculate my Life Path number from my birth date, so that I can understand my life's purpose and direction.

#### Acceptance Criteria

1. WHEN the User navigates to `/numerologie/calea-vietii`, THE Life Path Calculator SHALL display a form containing one birth date input field
2. WHEN the User enters a Valid Birth Date and submits the form, THE Life Path Calculator SHALL calculate the Life Path number using date reduction algorithm within 100 milliseconds
3. WHEN the calculation encounters a Master Number (11, 22, or 33) during reduction, THE Life Path Calculator SHALL preserve the Master Number without further reduction
4. WHEN the calculation completes successfully, THE Life Path Calculator SHALL display the Life Path number (1-9, 11, 22, or 33) with the corresponding Romanian interpretation text
5. WHEN the result is displayed, THE Life Path Calculator SHALL provide a share button that triggers sharing functionality
6. IF the User enters a date that is not a Valid Birth Date, THEN THE Life Path Calculator SHALL display a validation error message in Romanian below the input field

### Requirement 2

**User Story:** As a spiritual seeker, I want to calculate my Destiny number from my full name, so that I can discover my life's mission and potential.

#### Acceptance Criteria

1. WHEN the User navigates to `/numerologie/nume-destin`, THE Destiny Calculator SHALL display a form containing one full name input field
2. WHEN the User enters a Valid Name containing Romanian Diacritics (ă, â, î, ș, ț), THE Destiny Calculator SHALL map each letter to its corresponding numerology value according to the Romanian alphabet mapping
3. WHEN the User submits a Valid Name, THE Destiny Calculator SHALL calculate the Destiny number using letter-to-number reduction within 100 milliseconds
4. WHEN the calculation encounters a Master Number (11, 22, or 33) during reduction, THE Destiny Calculator SHALL preserve the Master Number without further reduction
5. WHEN the calculation completes successfully, THE Destiny Calculator SHALL display the Destiny number (1-9, 11, 22, or 33) with the corresponding Romanian interpretation text
6. IF the User enters a name that is not a Valid Name, THEN THE Destiny Calculator SHALL display a validation error message in Romanian below the input field

### Requirement 3

**User Story:** As someone in a relationship, I want to check compatibility between two people using their names and birth dates, so that I can understand our relationship dynamics.

#### Acceptance Criteria

1. WHEN the User navigates to `/numerologie/compatibilitate`, THE Compatibility Calculator SHALL display a form containing two name input fields and two birth date input fields
2. WHEN the User enters two Valid Names and two Valid Birth Dates, THE Compatibility Calculator SHALL calculate both Life Path numbers and both Destiny numbers within 100 milliseconds
3. WHEN the calculations complete successfully, THE Compatibility Calculator SHALL compute a compatibility score (0-100) by averaging the Life Path compatibility and Destiny compatibility
4. WHEN the compatibility score is calculated, THE Compatibility Calculator SHALL display the score with the corresponding relationship guidance text in Romanian
5. IF any input field contains data that is not valid, THEN THE Compatibility Calculator SHALL display a validation error message in Romanian below the specific input field

### Requirement 4

**User Story:** As a returning user, I want to see a daily numerology number and forecast, so that I can receive daily spiritual guidance.

#### Acceptance Criteria

1. WHEN the User navigates to `/numerologie/numar-zilnic`, THE Daily Number Generator SHALL display the daily number for the current date within 500 milliseconds
2. THE Daily Number Generator SHALL calculate the daily number deterministically using the current date as input
3. WHEN the daily number is displayed, THE Daily Number Generator SHALL display the corresponding daily forecast text in Romanian
4. WHEN two Users access the Daily Number Generator on the same date, THE Daily Number Generator SHALL display the same daily number to both Users
5. WHEN the current date changes to the next calendar day, THE Daily Number Generator SHALL calculate and display the daily number for the new date

### Requirement 5

**User Story:** As a mobile user, I want all numerology calculators to work smoothly on my phone, so that I can access spiritual guidance anywhere.

#### Acceptance Criteria

1. WHEN the User accesses any calculator page on a device with viewport width less than 768 pixels, THE Numerology System SHALL display a mobile-optimized layout
2. WHEN the User interacts with form inputs on a mobile device, THE Numerology System SHALL display the appropriate keyboard type for each input field
3. WHEN calculation results are displayed on a device with viewport width less than 768 pixels, THE Numerology System SHALL render all text without requiring horizontal scrolling
4. WHERE the User's device supports the Web Share API, WHEN the User taps the share button, THE Numerology System SHALL trigger the native Web Share API
5. THE Numerology System SHALL render all interactive elements with minimum dimensions of 44 pixels by 44 pixels

### Requirement 6

**User Story:** As a developer maintaining the system, I want interpretation data stored in Convex, so that content can be updated without code changes.

#### Acceptance Criteria

1. THE Convex Backend SHALL store Interpretation Data in the `interpretations` table with fields: type, number, title, description, interpretation
2. WHEN a calculator page requests Interpretation Data, THE Convex Backend SHALL return the matching interpretation within 200 milliseconds
3. THE Convex Backend SHALL provide a query function `getLifePathInterpretation(number)` that returns Life Path Interpretation Data for numbers 1 through 9, 11, 22, and 33
4. THE Convex Backend SHALL provide a query function `getDestinyInterpretation(number)` that returns Destiny Interpretation Data for numbers 1 through 9, 11, 22, and 33
5. THE Convex Backend SHALL provide a query function `getCompatibilityInterpretation(score)` that returns compatibility Interpretation Data based on the score value (0-100)

### Requirement 7

**User Story:** As a content editor, I want to seed the database with Romanian interpretations, so that users receive culturally relevant guidance.

#### Acceptance Criteria

1. THE Convex Backend SHALL provide a mutation function `seedInterpretations()` to populate Interpretation Data
2. WHEN the seeding mutation executes, THE Convex Backend SHALL insert Interpretation Data for all Life Path numbers (1 through 9, 11, 22, and 33)
3. WHEN the seeding mutation executes, THE Convex Backend SHALL insert Interpretation Data for all Destiny numbers (1 through 9, 11, 22, and 33)
4. WHEN the seeding mutation executes, THE Convex Backend SHALL insert Interpretation Data for compatibility score ranges (low, medium, good, excellent)
5. WHEN the seeding mutation executes, THE Convex Backend SHALL store all interpretation text in Romanian with proper Romanian Diacritics

### Requirement 8

**User Story:** As a user, I want consistent visual design across all numerology calculators, so that the experience feels cohesive.

#### Acceptance Criteria

1. THE Numerology System SHALL use the shared Result Card component for displaying all calculation results
2. WHEN displaying a numerology number, THE Numerology System SHALL render the number with a gradient animation effect
3. THE Numerology System SHALL apply consistent form styling to all four calculator pages
4. THE Numerology System SHALL apply the dark theme with mystical aesthetic to all calculator pages
5. THE Numerology System SHALL use the typography, spacing, and color scheme values defined in `docs/design.json`

### Requirement 9

**User Story:** As a user, I want fast calculations without page reloads, so that I can quickly explore different numbers.

#### Acceptance Criteria

1. WHEN the User submits a calculation form, THE Numerology System SHALL perform the calculation client-side without triggering a page reload
2. THE Numerology System SHALL display calculation results within 100 milliseconds of form submission
3. WHILE fetching Interpretation Data from the Convex Backend, THE Numerology System SHALL display a loading spinner
4. IF the Convex Backend query fails, THEN THE Numerology System SHALL display an error message in Romanian with a retry button
5. THE Numerology System SHALL cache Interpretation Data to reduce repeated queries to the Convex Backend

### Requirement 10

**User Story:** As a spiritual seeker, I want to understand Master Numbers when they appear in my calculations, so that I can appreciate their special significance.

#### Acceptance Criteria

1. WHEN a calculation results in a Master Number (11, 22, or 33), THE Numerology System SHALL display a visual indicator that distinguishes Master Numbers from Single-Digit Numbers
2. WHEN displaying a Master Number result, THE Numerology System SHALL include additional Romanian text explaining the heightened spiritual significance of Master Numbers
3. THE Numerology System SHALL apply special styling to Master Number results to emphasize their importance
4. WHEN the User views a Master Number interpretation, THE Numerology System SHALL display both the Master Number meaning and the reduced single-digit meaning
5. THE Numerology System SHALL ensure Master Number interpretations are more detailed than Single-Digit Number interpretations

### Requirement 11

**User Story:** As a user sharing my results, I want to share my numerology number on social media, so that I can discuss it with friends.

#### Acceptance Criteria

1. WHEN the User clicks the share button, THE Numerology System SHALL generate a shareable URL containing the calculation result
2. WHERE the User's device supports the Web Share API, THE Numerology System SHALL trigger the native sharing interface
3. WHERE the User's device does not support the Web Share API, THE Numerology System SHALL copy the shareable URL to the clipboard
4. WHEN the share action completes successfully, THE Numerology System SHALL display a confirmation message in Romanian
5. WHEN sharing a Master Number result, THE Numerology System SHALL include the Master Number designation in the share text content
6. THE Numerology System SHALL include the numerology number and a brief description in the share text content
