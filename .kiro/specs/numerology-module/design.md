# Design Document - Numerology Module

## Overview

The Numerology Module is the second feature implementation in Phase 2 of SpiritHub.ro, building on the foundation established by the Biorhythm Module. It provides four distinct numerology calculators that enable users to discover their Life Path number, Destiny number, relationship compatibility, and daily numerology guidance.

The module consists of four main pages:
1. **Life Path Calculator** (`/numerologie/calea-vietii`) - Calculate Life Path number from birth date
2. **Destiny Name Calculator** (`/numerologie/nume-destin`) - Calculate Destiny number from full name
3. **Compatibility Calculator** (`/numerologie/compatibilitate`) - Calculate relationship compatibility
4. **Daily Number** (`/numerologie/numar-zilnic`) - Display daily numerology number and forecast

All calculations leverage the existing `lib/numerology.ts` utilities and are exposed through Convex queries. Interpretation data is stored in the Convex `interpretations` table and seeded during initial setup.

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                         │
├─────────────────────────────────────────────────────────────────────┤
│  /numerologie/calea-vietii/    │  /numerologie/nume-destin/         │
│  - NumerologyForm              │  - NumerologyForm                  │
│  - LifePathCard                │  - DestinyCard                     │
│  - ShareButton                 │  - ShareButton                     │
├────────────────────────────────┼────────────────────────────────────┤
│  /numerologie/compatibilitate/ │  /numerologie/numar-zilnic/        │
│  - NumerologyForm              │  - DailyNumberDisplay              │
│  - CompatibilityCard           │  - ShareButton                     │
│  - ShareButton                 │                                    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Convex Backend Layer                          │
├─────────────────────────────────────────────────────────────────────┤
│  convex/numerology.ts                                               │
│  - getLifePathInterpretation(number)                                │
│  - getDestinyInterpretation(number)                                 │
│  - getCompatibilityInterpretation(score)                            │
│  - getDailyNumber(date)                                             │
│  - seedInterpretations() [one-time setup]                           │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Domain Logic Layer                            │
├─────────────────────────────────────────────────────────────────────┤
│  lib/numerology.ts                                                  │
│  - calculateLifePath(birthDate)                                     │
│  - calculateDestinyNumber(name)                                     │
│  - calculateCompatibility(num1, num2)                               │
│  - reduceToSingleDigit(num)                                         │
│  - getLetterValue(letter)                                           │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       Configuration Layer                            │
├─────────────────────────────────────────────────────────────────────┤
│  config/numerology.ts                                               │
│  - Letter-to-number mappings (Romanian alphabet)                    │
│  - Interpretation keys and descriptions                             │
│  - Compatibility ranges                                             │
│  - Master numbers (11, 22, 33)                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

**Life Path Calculator:**
1. User enters birth date → Form validation
2. Client calculates Life Path number using `lib/numerology.ts`
3. Convex query fetches interpretation from database
4. Display result card with number and interpretation

**Destiny Calculator:**
1. User enters full name → Form validation
2. Client calculates Destiny number (handles Romanian diacritics)
3. Convex query fetches interpretation
4. Display result card

**Compatibility Calculator:**
1. User enters two names + two birth dates → Form validation
2. Client calculates both Life Path and Destiny numbers
3. Client calculates compatibility score
4. Convex query fetches compatibility interpretation
5. Display compatibility card with score and guidance

**Daily Number:**
1. Page loads with current date
2. Client calculates daily number deterministically
3. Convex query fetches daily interpretation
4. Display daily number and forecast

---


## Components and Interfaces

### 1. Convex Backend Functions

**File:** `convex/numerology.ts`

```typescript
import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Query: getLifePathInterpretation
 * Fetches Life Path interpretation for a given number (1-9, 11, 22, 33)
 */
export const getLifePathInterpretation = query({
  args: { number: v.number() },
  handler: async (ctx, args) => {
    const interpretation = await ctx.db
      .query('interpretations')
      .withIndex('by_type_and_number', (q) =>
        q.eq('type', 'lifePath').eq('number', args.number)
      )
      .first();
    
    if (!interpretation) {
      throw new Error(`No interpretation found for Life Path ${args.number}`);
    }
    
    return interpretation;
  },
});

/**
 * Query: getDestinyInterpretation
 * Fetches Destiny number interpretation for a given number (1-9, 11, 22, 33)
 */
export const getDestinyInterpretation = query({
  args: { number: v.number() },
  handler: async (ctx, args) => {
    const interpretation = await ctx.db
      .query('interpretations')
      .withIndex('by_type_and_number', (q) =>
        q.eq('type', 'destiny').eq('number', args.number)
      )
      .first();
    
    if (!interpretation) {
      throw new Error(`No interpretation found for Destiny ${args.number}`);
    }
    
    return interpretation;
  },
});

/**
 * Query: getCompatibilityInterpretation
 * Fetches compatibility interpretation based on score range
 */
export const getCompatibilityInterpretation = query({
  args: { score: v.number() },
  handler: async (ctx, args) => {
    // Determine compatibility level based on score
    let level: string;
    if (args.score >= 76) level = 'excellent';
    else if (args.score >= 51) level = 'good';
    else if (args.score >= 26) level = 'medium';
    else level = 'low';
    
    const interpretation = await ctx.db
      .query('interpretations')
      .withIndex('by_type_and_key', (q) =>
        q.eq('type', 'compatibility').eq('key', level)
      )
      .first();
    
    if (!interpretation) {
      throw new Error(`No compatibility interpretation found for level ${level}`);
    }
    
    return interpretation;
  },
});

/**
 * Query: getDailyNumber
 * Calculates and returns daily number with interpretation
 */
export const getDailyNumber = query({
  args: { date: v.string() }, // ISO format: "YYYY-MM-DD"
  handler: async (ctx, args) => {
    // Calculate daily number from date
    const date = new Date(args.date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Sum and reduce to single digit
    const sum = day + month + year;
    let dailyNumber = sum;
    while (dailyNumber > 9) {
      dailyNumber = Math.floor(dailyNumber / 10) + (dailyNumber % 10);
    }
    
    // Fetch interpretation
    const interpretation = await ctx.db
      .query('interpretations')
      .withIndex('by_type_and_number', (q) =>
        q.eq('type', 'daily').eq('number', dailyNumber)
      )
      .first();
    
    if (!interpretation) {
      throw new Error(`No daily interpretation found for number ${dailyNumber}`);
    }
    
    return {
      number: dailyNumber,
      date: args.date,
      ...interpretation,
    };
  },
});

/**
 * Mutation: seedInterpretations
 * Seeds the database with Romanian numerology interpretations
 * Should be run once during initial setup
 */
export const seedInterpretations = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query('interpretations').first();
    if (existing) {
      return { message: 'Interpretations already seeded' };
    }
    
    // Seed Life Path interpretations (1-9, 11, 22, 33)
    const lifePathData = [
      // Data will be added in implementation
      // Includes: 1-9 (single digits) + 11, 22, 33 (Master Numbers)
    ];
    
    // Seed Destiny interpretations (1-9, 11, 22, 33)
    const destinyData = [
      // Data will be added in implementation
      // Includes: 1-9 (single digits) + 11, 22, 33 (Master Numbers)
    ];
    
    // Seed Compatibility interpretations
    const compatibilityData = [
      // Data will be added in implementation
    ];
    
    // Seed Daily interpretations (1-9)
    const dailyData = [
      // Data will be added in implementation
    ];
    
    // Insert all interpretations
    for (const data of [...lifePathData, ...destinyData, ...compatibilityData, ...dailyData]) {
      await ctx.db.insert('interpretations', data);
    }
    
    return { message: 'Interpretations seeded successfully' };
  },
});
```

---

### 2. NumerologyForm Component

**File:** `components/numerologie/numerology-form.tsx`

**Purpose:** Reusable form component for all numerology calculators.

**Props Interface:**
```typescript
export interface NumerologyFormProps {
  type: 'lifePath' | 'destiny' | 'compatibility';
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

type FormData = 
  | { type: 'lifePath'; birthDate: string }
  | { type: 'destiny'; name: string }
  | { type: 'compatibility'; name1: string; birthDate1: string; name2: string; birthDate2: string };
```

**Features:**
- Dynamic form fields based on `type` prop
- Client-side validation with Romanian error messages
- Support for Romanian diacritics in name inputs
- Date validation (birth dates must be in past)
- Touch-friendly inputs (44x44px minimum)
- Loading state during submission

**Form Variants:**

**Life Path Form:**
- Single date input: "Data nașterii"
- Validation: Must be valid date in past

**Destiny Form:**
- Single text input: "Numele complet"
- Validation: Must not be empty, accepts Romanian letters

**Compatibility Form:**
- Two name inputs: "Primul nume", "Al doilea nume"
- Two date inputs: "Prima dată de naștere", "A doua dată de naștere"
- Validation: All fields required, dates in past

---

### 3. Result Card Components

#### LifePathCard

**File:** `components/numerologie/life-path-card.tsx`

**Props Interface:**
```typescript
export interface LifePathCardProps {
  number: number;
  interpretation: {
    title: string;
    description: string;
    interpretation: string;
  };
  birthDate: string;
}
```

**Layout:**
- Uses shared `ResultCard` component as base
- Large animated number display (1-9)
- Title: "Calea Vieții"
- Subtitle: Interpretation title (e.g., "Lider natural")
- Description paragraph
- Full interpretation text in prose format
- Share button at bottom

#### DestinyCard

**File:** `components/numerologie/destiny-card.tsx`

**Props Interface:**
```typescript
export interface DestinyCardProps {
  number: number;
  interpretation: {
    title: string;
    description: string;
    interpretation: string;
  };
  name: string;
}
```

**Layout:**
- Similar to LifePathCard
- Title: "Numărul Destinului"
- Shows calculated name above number
- Interpretation specific to destiny

#### CompatibilityCard

**File:** `components/numerologie/compatibility-card.tsx`

**Props Interface:**
```typescript
export interface CompatibilityCardProps {
  score: number;
  interpretation: {
    title: string;
    description: string;
    interpretation: string;
  };
  person1: { name: string; lifePath: number; destiny: number };
  person2: { name: string; lifePath: number; destiny: number };
}
```

**Layout:**
- Large compatibility score (0-100) with percentage
- Color-coded based on score:
  - 76-100: Green (excellent)
  - 51-75: Blue (good)
  - 26-50: Yellow (medium)
  - 0-25: Red (low)
- Two-column layout showing both people's numbers
- Compatibility level badge
- Relationship guidance text
- Share button

---

### 4. Page Implementations

#### Life Path Calculator Page

**File:** `app/numerologie/calea-vietii/page.tsx`

**Structure:**
```typescript
'use client';

export default function CaleaVietiiPage() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [lifePathNumber, setLifePathNumber] = useState<number | null>(null);
  
  const interpretation = useQuery(
    api.numerology.getLifePathInterpretation,
    lifePathNumber ? { number: lifePathNumber } : 'skip'
  );
  
  const handleSubmit = (data: { birthDate: string }) => {
    const date = new Date(data.birthDate);
    const number = calculateLifePath(date);
    setLifePathNumber(number);
    setBirthDate(data.birthDate);
  };
  
  // Render form, then results when available
}
```

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: 'Calea Vieții - Calculator Numerologie | SpiritHub.ro',
  description: 'Descoperă-ți numărul Căii Vieții și înțelege-ți scopul și direcția în viață.',
};
```

#### Destiny Name Calculator Page

**File:** `app/numerologie/nume-destin/page.tsx`

**Structure:**
```typescript
'use client';

export default function NumeDestinPage() {
  const [name, setName] = useState<string>('');
  const [destinyNumber, setDestinyNumber] = useState<number | null>(null);
  
  const interpretation = useQuery(
    api.numerology.getDestinyInterpretation,
    destinyNumber ? { number: destinyNumber } : 'skip'
  );
  
  const handleSubmit = (data: { name: string }) => {
    const number = calculateDestinyNumber(data.name);
    setDestinyNumber(number);
    setName(data.name);
  };
  
  // Render form, then results
}
```

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: 'Numărul Destinului - Calculator Numerologie | SpiritHub.ro',
  description: 'Calculează-ți numărul destinului din numele complet și descoperă-ți misiunea în viață.',
};
```

#### Compatibility Calculator Page

**File:** `app/numerologie/compatibilitate/page.tsx`

**Structure:**
```typescript
'use client';

export default function CompatibilitatePage() {
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [person1Data, setPerson1Data] = useState<any>(null);
  const [person2Data, setPerson2Data] = useState<any>(null);
  
  const interpretation = useQuery(
    api.numerology.getCompatibilityInterpretation,
    compatibilityScore !== null ? { score: compatibilityScore } : 'skip'
  );
  
  const handleSubmit = (data: {
    name1: string;
    birthDate1: string;
    name2: string;
    birthDate2: string;
  }) => {
    // Calculate both Life Path and Destiny numbers
    const lifePath1 = calculateLifePath(new Date(data.birthDate1));
    const destiny1 = calculateDestinyNumber(data.name1);
    const lifePath2 = calculateLifePath(new Date(data.birthDate2));
    const destiny2 = calculateDestinyNumber(data.name2);
    
    // Calculate compatibility (average of Life Path and Destiny compatibility)
    const lifePathCompat = calculateCompatibility(lifePath1, lifePath2);
    const destinyCompat = calculateCompatibility(destiny1, destiny2);
    const avgScore = Math.round((lifePathCompat + destinyCompat) / 2);
    
    setCompatibilityScore(avgScore);
    setPerson1Data({ name: data.name1, lifePath: lifePath1, destiny: destiny1 });
    setPerson2Data({ name: data.name2, lifePath: lifePath2, destiny: destiny2 });
  };
  
  // Render form, then results
}
```

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: 'Compatibilitate Numerologică | SpiritHub.ro',
  description: 'Verifică compatibilitatea numerologică între două persoane folosind numele și datele de naștere.',
};
```

#### Daily Number Page

**File:** `app/numerologie/numar-zilnic/page.tsx`

**Structure:**
```typescript
'use client';

export default function NumarZilnicPage() {
  const today = new Date().toISOString().split('T')[0];
  
  const dailyData = useQuery(api.numerology.getDailyNumber, { date: today });
  
  // Display daily number and forecast immediately (no form)
}
```

**Layout:**
- No form required (uses current date)
- Large daily number display
- Romanian date: "17 noiembrie 2025"
- Daily forecast text
- "Revino mâine pentru un nou număr!" message
- Share button

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: 'Numărul Zilei - Numerologie Zilnică | SpiritHub.ro',
  description: 'Descoperă numărul zilei de astăzi și primește îndrumări numerologice pentru ziua curentă.',
};
```

---


## Data Models

### Interpretation Database Schema

```typescript
interface Interpretation {
  _id: Id<"interpretations">;
  _creationTime: number;
  type: 'lifePath' | 'destiny' | 'compatibility' | 'daily';
  number?: number;        // For lifePath, destiny, daily (1-9, 11, 22, 33)
  key?: string;           // For compatibility ('low', 'medium', 'good', 'excellent')
  title: string;          // Romanian title (e.g., "Lider Natural", "Maestru Spiritual")
  description: string;    // Short description (1-2 sentences)
  interpretation: string; // Full interpretation text (3-5 paragraphs)
  isMasterNumber?: boolean; // True for Master Numbers (11, 22, 33)
  reducedNumber?: number;   // The single-digit reduction (e.g., 11 → 2, 22 → 4, 33 → 6)
}
```

### Form State Models

```typescript
// Life Path Form
interface LifePathFormState {
  birthDate: string;
  errors: { birthDate?: string };
}

// Destiny Form
interface DestinyFormState {
  name: string;
  errors: { name?: string };
}

// Compatibility Form
interface CompatibilityFormState {
  name1: string;
  birthDate1: string;
  name2: string;
  birthDate2: string;
  errors: {
    name1?: string;
    birthDate1?: string;
    name2?: string;
    birthDate2?: string;
  };
}
```

### Result Data Models

```typescript
// Life Path Result
interface LifePathResult {
  number: number; // 1-9, 11, 22, or 33
  birthDate: string;
  interpretation: Interpretation;
  isMasterNumber: boolean;
}

// Destiny Result
interface DestinyResult {
  number: number; // 1-9, 11, 22, or 33
  name: string;
  interpretation: Interpretation;
  isMasterNumber: boolean;
}

// Compatibility Result
interface CompatibilityResult {
  score: number;
  person1: {
    name: string;
    lifePath: number;
    destiny: number;
  };
  person2: {
    name: string;
    lifePath: number;
    destiny: number;
  };
  interpretation: Interpretation;
}

// Daily Number Result
interface DailyNumberResult {
  number: number;
  date: string;
  interpretation: Interpretation;
}
```

---

## Calculation Algorithms

### Master Number Detection

Master Numbers (11, 22, 33) are special numbers that should NOT be reduced to single digits. The calculation logic must check for these numbers during the reduction process.

**Algorithm:**
```typescript
function reduceToSingleDigit(num: number): number {
  // Check for Master Numbers first
  if (num === 11 || num === 22 || num === 33) {
    return num; // Preserve Master Numbers
  }
  
  // Reduce to single digit
  while (num > 9) {
    num = Math.floor(num / 10) + (num % 10);
    
    // Check again after each reduction step
    if (num === 11 || num === 22 || num === 33) {
      return num;
    }
  }
  
  return num;
}
```

### Life Path Calculation with Master Numbers

**Steps:**
1. Extract day, month, year from birth date
2. Reduce each component separately (checking for Master Numbers)
3. Sum the reduced components
4. Reduce the sum (checking for Master Numbers)

**Example 1 - Master Number 11:**
- Birth date: November 29, 1975
- Month: 11 (Master Number - do not reduce)
- Day: 29 → 2 + 9 = 11 (Master Number - do not reduce)
- Year: 1975 → 1 + 9 + 7 + 5 = 22 (Master Number - do not reduce)
- Sum: 11 + 11 + 22 = 44 → 4 + 4 = 8
- Result: Life Path 8

**Example 2 - Master Number 22:**
- Birth date: April 4, 1988
- Month: 4
- Day: 4
- Year: 1988 → 1 + 9 + 8 + 8 = 26 → 2 + 6 = 8
- Sum: 4 + 4 + 8 = 16 → 1 + 6 = 7
- Result: Life Path 7 (not a Master Number in this case)

**Example 3 - Direct Master Number:**
- Birth date: November 2, 1980
- Month: 11 (Master Number)
- Day: 2
- Year: 1980 → 1 + 9 + 8 + 0 = 18 → 1 + 8 = 9
- Sum: 11 + 2 + 9 = 22 (Master Number - do not reduce)
- Result: Life Path 22

### Destiny Number Calculation with Master Numbers

**Steps:**
1. Convert each letter to its numerology value (A=1, B=2, etc.)
2. Sum all letter values
3. Reduce the sum (checking for Master Numbers at each step)

**Example - Master Number 33:**
- Name: "Maria Elena"
- M(4) + A(1) + R(9) + I(9) + A(1) + E(5) + L(3) + E(5) + N(5) + A(1) = 43
- 43 → 4 + 3 = 7
- Result: Destiny 7 (not a Master Number)

**Example - Master Number 11:**
- Name: "Ana Maria"
- A(1) + N(5) + A(1) + M(4) + A(1) + R(9) + I(9) + A(1) = 31
- 31 → 3 + 1 = 4
- Result: Destiny 4 (not a Master Number)

### Compatibility Calculation with Master Numbers

When calculating compatibility, Master Numbers are treated as their full value (not reduced) for comparison purposes.

**Algorithm:**
```typescript
function calculateCompatibility(num1: number, num2: number): number {
  // Calculate difference
  const diff = Math.abs(num1 - num2);
  
  // Convert difference to compatibility score (0-100)
  // Identical numbers = 100
  // Maximum difference (33 - 1 = 32) = 0
  const score = Math.max(0, 100 - (diff * 3));
  
  return score;
}
```

**Example:**
- Person 1: Life Path 11, Destiny 5
- Person 2: Life Path 2, Destiny 7
- Life Path Compatibility: |11 - 2| = 9 → 100 - (9 * 3) = 73
- Destiny Compatibility: |5 - 7| = 2 → 100 - (2 * 3) = 94
- Overall: (73 + 94) / 2 = 83.5 → 84 (Excellent)

---

## Error Handling

### Client-Side Validation Errors

**Birth Date Errors:**
- Empty: "Data nașterii este obligatorie"
- Future date: "Data nașterii trebuie să fie în trecut"
- Invalid format: "Data nașterii este invalidă"

**Name Errors:**
- Empty: "Numele este obligatoriu"
- Too short: "Numele trebuie să conțină cel puțin 2 caractere"
- Invalid characters: "Numele poate conține doar litere și spații"

**Display:**
- Show below respective input field
- Red text color (`hsl(var(--destructive))`)
- Small font size (14px)
- Icon: AlertCircle from lucide-react

### Server-Side Errors

**Convex Query Failures:**
- Network error: "Eroare de conexiune. Verifică conexiunea la internet."
- Missing interpretation: "Interpretare indisponibilă. Contactează suportul."
- Invalid number: "Număr invalid. Încearcă din nou."

**Display:**
- ErrorMessage component (shared)
- Positioned above results area
- Retry button included
- Error logged to console for debugging

### Loading States

**During Query Execution:**
- LoadingSpinner component
- Romanian text: "Se încarcă interpretarea..."
- Centered in results area
- Prevents multiple submissions

---

## Romanian Interpretation Data

### Master Numbers (11, 22, 33)

Master Numbers are special numerology numbers that carry heightened spiritual significance and are not reduced to single digits during calculation. They represent higher spiritual potential and greater challenges.

**Master Number 11 - Iluminatorul:**
- Title: "Iluminator Spiritual"
- Description: "Ești un maestru spiritual cu intuiție puternică și capacitatea de a inspira pe alții."
- Interpretation: Full 4-6 paragraph text about spiritual illumination, intuition, and inspiration. Includes both the Master Number 11 meaning and the reduced number 2 (diplomat) qualities.
- Reduced Number: 2
- Special Characteristics: Heightened intuition, spiritual awareness, visionary abilities

**Master Number 22 - Constructorul Maestru:**
- Title: "Constructor Maestru"
- Description: "Ești un vizionar practic cu capacitatea de a transforma visele în realitate la scară mare."
- Interpretation: Full 4-6 paragraph text about master building, manifesting dreams into reality, and practical vision. Includes both Master Number 22 meaning and the reduced number 4 (constructor) qualities.
- Reduced Number: 4
- Special Characteristics: Master builder, practical visionary, large-scale manifestation

**Master Number 33 - Maestrul Profesor:**
- Title: "Maestru Profesor"
- Description: "Ești un maestru al compasiunii cu capacitatea de a vindeca și înălța umanitatea."
- Interpretation: Full 4-6 paragraph text about master teaching, healing, and selfless service. Includes both Master Number 33 meaning and the reduced number 6 (protector) qualities.
- Reduced Number: 6
- Special Characteristics: Master teacher, healer, compassionate service to humanity

**Visual Treatment for Master Numbers:**
- Display with special golden/mystical gradient
- Add sparkle/star icon next to the number
- Include badge or label: "Număr Maestru"
- Show both the Master Number and its reduced meaning
- Use larger font size and special animation

### Life Path Interpretations (1-9)

**Number 1 - Liderul:**
- Title: "Lider Natural"
- Description: "Ești un pionier independent, cu spirit inovator și dorință de a conduce."
- Interpretation: Full 3-5 paragraph text about leadership qualities, challenges, and life purpose.

**Number 2 - Diplomatul:**
- Title: "Diplomat și Cooperant"
- Description: "Ești sensibil, intuitiv și ai un talent natural pentru mediere și colaborare."
- Interpretation: Full text about partnership, sensitivity, and peacemaking.

**Number 3 - Creatorul:**
- Title: "Creator Expresiv"
- Description: "Ești artistic, optimist și ai un talent natural pentru comunicare și exprimare."
- Interpretation: Full text about creativity, self-expression, and joy.

**Number 4 - Constructorul:**
- Title: "Constructor Practic"
- Description: "Ești disciplinat, organizat și ai un talent pentru a construi fundații solide."
- Interpretation: Full text about stability, hard work, and structure.

**Number 5 - Aventurierul:**
- Title: "Aventurier Liber"
- Description: "Ești adaptabil, curios și ai o dorință puternică de libertate și experiențe noi."
- Interpretation: Full text about freedom, change, and adventure.

**Number 6 - Protectorul:**
- Title: "Protector Responsabil"
- Description: "Ești armonios, responsabil și ai un talent natural pentru îngrijire și protecție."
- Interpretation: Full text about family, service, and harmony.

**Number 7 - Căutătorul:**
- Title: "Căutător Spiritual"
- Description: "Ești analitic, înțelept și ai o dorință profundă de cunoaștere și înțelegere."
- Interpretation: Full text about spirituality, analysis, and wisdom.

**Number 8 - Realizatorul:**
- Title: "Realizator Ambițios"
- Description: "Ești puternic, ambițios și ai un talent natural pentru afaceri și realizări materiale."
- Interpretation: Full text about power, success, and material achievement.

**Number 9 - Umanitarul:**
- Title: "Umanitar Generos"
- Description: "Ești generos, vizionar și ai o dorință puternică de a servi umanitatea."
- Interpretation: Full text about compassion, service, and universal love.

### Destiny Interpretations (1-9)

Similar structure to Life Path, but focused on life mission and purpose rather than personality traits.

### Compatibility Interpretations

**Excellent (76-100):**
- Title: "Compatibilitate Excelentă"
- Description: "Aveți o conexiune puternică și armonioasă."
- Interpretation: Guidance for maintaining and nurturing the relationship.

**Good (51-75):**
- Title: "Compatibilitate Bună"
- Description: "Aveți potențial pentru o relație echilibrată."
- Interpretation: Guidance for building on strengths and managing differences.

**Medium (26-50):**
- Title: "Compatibilitate Medie"
- Description: "Relația necesită efort și înțelegere reciprocă."
- Interpretation: Guidance for overcoming challenges and finding common ground.

**Low (0-25):**
- Title: "Compatibilitate Scăzută"
- Description: "Relația poate fi provocatoare și necesită multă muncă."
- Interpretation: Guidance for understanding differences and deciding if relationship is worth pursuing.

### Daily Interpretations (1-9)

Each number has a daily forecast focused on:
- What the day is good for
- What to focus on
- What to avoid
- General guidance

---

## Testing Strategy

### Manual Testing Checklist

**Functional Testing:**
- [ ] Life Path calculator accepts valid birth dates
- [ ] Destiny calculator handles Romanian diacritics correctly
- [ ] Compatibility calculator processes two people's data
- [ ] Daily number displays current date's number
- [ ] All calculations match `lib/numerology.ts` results
- [ ] Convex queries return interpretations within 500ms
- [ ] Share button works on mobile and desktop
- [ ] Form validation prevents invalid submissions

**Visual Testing:**
- [ ] Result cards display correctly on desktop (1920×1080)
- [ ] Result cards display correctly on tablet (768×1024)
- [ ] Result cards display correctly on mobile (375×667)
- [ ] Number animations are smooth
- [ ] All text is readable with sufficient contrast
- [ ] Colors match design system
- [ ] Dark theme looks polished
- [ ] Loading spinner is centered and visible
- [ ] Error messages are clearly visible

**Data Testing:**
- [ ] Romanian diacritics (ă, â, î, ș, ț) calculate correctly
- [ ] Master Numbers (11, 22, 33) are preserved when appropriate
- [ ] Compatibility scores are accurate
- [ ] Daily number changes each day
- [ ] All interpretations are in Romanian
- [ ] Interpretation text is culturally appropriate

**Accessibility Testing:**
- [ ] Form inputs are keyboard navigable
- [ ] Focus indicators are visible
- [ ] Result cards have proper heading hierarchy
- [ ] Screen reader announces results correctly
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Touch targets are at least 44×44px

**Performance Testing:**
- [ ] Pages load in <2 seconds on 3G
- [ ] Calculations are instant (<100ms)
- [ ] Convex queries complete in <500ms
- [ ] No console errors or warnings

**Cross-Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Design Decisions and Rationales

### 1. Client-Side Calculation + Server-Side Interpretation

**Decision:** Calculate numbers on client, fetch interpretations from Convex

**Rationale:**
- Calculations are deterministic and fast (<10ms)
- Instant feedback for users (no network delay for calculation)
- Interpretations are static content (benefit from Convex caching)
- Reduces server load (only interpretation queries, not calculations)
- Enables offline calculation in future (PWA)

**Trade-offs:**
- Slightly larger client bundle (numerology functions)
- Could do everything server-side for consistency
- Acceptable because calculations are simple and well-tested

### 2. Separate Pages for Each Calculator

**Decision:** Four distinct pages instead of single page with tabs

**Rationale:**
- Better SEO (unique URLs for each calculator)
- Simpler navigation and sharing
- Clearer user intent (direct links)
- Easier to track analytics per calculator
- Follows established pattern from biorhythm module

**Trade-offs:**
- More pages to maintain
- Could use tabs or accordion for single-page experience
- Acceptable because each calculator is distinct enough

### 3. Seeding Interpretations via Mutation

**Decision:** Use Convex mutation to seed interpretation data

**Rationale:**
- One-time setup process
- Data stored in database (easy to update later)
- Can be triggered from Convex dashboard
- Prevents accidental re-seeding
- Follows Convex best practices

**Trade-offs:**
- Could use JSON file and import
- Could hardcode in queries
- Acceptable because database storage enables future content management

### 4. Compatibility Score Averaging

**Decision:** Average Life Path and Destiny compatibility scores

**Rationale:**
- Provides holistic compatibility view
- Both numbers contribute equally
- Simple and understandable calculation
- Aligns with numerology principles

**Trade-offs:**
- Could weight one number more heavily
- Could use more complex formula
- Acceptable for MVP and general guidance

### 5. Daily Number Deterministic Calculation

**Decision:** Calculate daily number from current date (no randomness)

**Rationale:**
- All users see same number on same day
- Deterministic and reproducible
- No need for daily content updates
- Aligns with numerology principles (date has meaning)

**Trade-offs:**
- Could use random selection from pool
- Could manually curate daily numbers
- Acceptable because deterministic approach is authentic to numerology

---

## Performance Considerations

### Bundle Size Optimization

**Strategies:**
- Reuse NumerologyForm component across pages
- Share result card components
- Use existing shared components (LoadingSpinner, ErrorMessage)
- Tree-shake unused numerology functions

**Target:** <30KB additional JavaScript for numerology module

### Rendering Performance

**Strategies:**
- Memoize calculation results with `useMemo`
- Cache Convex queries automatically
- Lazy load interpretation text
- Use CSS transforms for number animations

**Target:** <100ms calculation time, <500ms total query time

### Network Performance

**Strategies:**
- Convex queries are automatically cached
- Prefetch interpretations on form focus
- Static page generation where possible
- Compress interpretation text

**Target:** <500ms interpretation fetch, <2s page load on 3G

---

## Accessibility Compliance

### WCAG 2.1 Level AA Requirements

**Perceivable:**
- ✅ Text contrast ratio ≥4.5:1
- ✅ Large numbers are readable
- ✅ Alternative text for all visual elements
- ✅ Responsive text sizing (16px minimum)

**Operable:**
- ✅ Keyboard navigation for all forms
- ✅ Visible focus indicators (3px purple ring)
- ✅ Touch targets ≥44×44px
- ✅ No time limits on interactions

**Understandable:**
- ✅ Clear Romanian labels and instructions
- ✅ Consistent form patterns
- ✅ Specific error messages
- ✅ Predictable behavior

**Robust:**
- ✅ Semantic HTML (form, label, button)
- ✅ ARIA labels where needed
- ✅ Screen reader compatible
- ✅ Valid HTML5 markup

---

## Dependencies

### External Libraries

**Required:**
- `convex` - Backend queries and mutations
- `lucide-react` - Icons (Calculator, Heart, Calendar, Sparkles)
- `date-fns` - Date formatting

**Not Required:**
- No form library (simple controlled inputs)
- No animation library (CSS transitions sufficient)

### Internal Dependencies

**Foundation Layer:**
- `lib/numerology.ts` - Calculation functions
- `config/numerology.ts` - Configuration and mappings
- `components/shared/result-card.tsx` - Result display
- `components/shared/share-button.tsx` - Sharing functionality
- `components/shared/loading-spinner.tsx` - Loading state
- `components/shared/error-message.tsx` - Error display
- `components/layout/main-layout.tsx` - Page layout

---

## Implementation Notes

### Development Order

1. **Seed Interpretation Data**
   - Create Romanian interpretation texts
   - Implement `seedInterpretations` mutation
   - Run seeding from Convex dashboard
   - Verify data in database

2. **Convex Queries** (`convex/numerology.ts`)
   - Implement `getLifePathInterpretation`
   - Implement `getDestinyInterpretation`
   - Implement `getCompatibilityInterpretation`
   - Implement `getDailyNumber`
   - Test with Convex dashboard

3. **NumerologyForm Component**
   - Build reusable form with variants
   - Add validation logic
   - Test with various inputs

4. **Result Card Components**
   - LifePathCard
   - DestinyCard
   - CompatibilityCard
   - Test rendering with sample data

5. **Life Path Page** (`app/numerologie/calea-vietii/page.tsx`)
   - Wire up form and results
   - Add loading and error states
   - Test full flow

6. **Destiny Page** (`app/numerologie/nume-destin/page.tsx`)
   - Implement name calculator
   - Test Romanian diacritics
   - Test full flow

7. **Compatibility Page** (`app/numerologie/compatibilitate/page.tsx`)
   - Implement two-person form
   - Calculate and display compatibility
   - Test full flow

8. **Daily Number Page** (`app/numerologie/numar-zilnic/page.tsx`)
   - Display daily number
   - Test date changes
   - Test full flow

9. **Update Numerology Landing Page** (`app/numerologie/page.tsx`)
   - Replace "În curând" with working links
   - Add brief descriptions
   - Test navigation

10. **Polish & Testing**
    - Mobile responsiveness
    - Accessibility audit
    - Performance optimization
    - Cross-browser testing

### Code Style Guidelines

- Use TypeScript strict mode
- Follow kebab-case for file names
- Use `@/` path aliases for imports
- All UI text in Romanian
- Add JSDoc comments for complex functions
- Use Tailwind CSS for styling
- Prefer functional components with hooks
- Keep components small and focused (<200 lines)

---

## Success Criteria

**Functional:**
- ✅ All four calculators work correctly
- ✅ Romanian diacritics handled properly
- ✅ Interpretations display in Romanian
- ✅ Compatibility scores are accurate
- ✅ Daily number changes each day
- ✅ Share button works on all devices

**Performance:**
- ✅ Calculations are instant (<100ms)
- ✅ Convex queries complete in <500ms
- ✅ Pages load in <2 seconds on 3G
- ✅ No console errors or warnings

**Quality:**
- ✅ Zero TypeScript errors
- ✅ Lighthouse score >90 (all categories)
- ✅ WCAG AA accessibility compliance
- ✅ Works on Chrome, Firefox, Safari, Edge
- ✅ Mobile-responsive (320px to 1920px)

**User Experience:**
- ✅ Forms are intuitive and easy to use
- ✅ Results are visually appealing
- ✅ Romanian text is natural and accurate
- ✅ Error messages are helpful
- ✅ Loading states prevent confusion

---

## Future Enhancements (Post-MVP)

**Potential Features:**
1. **Personal Year Calculator:** Calculate personal year number
2. **Master Number Interpretations:** Detailed interpretations for 11, 22, 33
3. **Name Analysis:** Break down each letter's contribution
4. **Compatibility Details:** Show individual number comparisons
5. **Historical Calculations:** Save and view past calculations
6. **PDF Reports:** Download detailed numerology reports
7. **Advanced Compatibility:** Include more factors (birth time, etc.)
8. **Numerology Chart:** Visual representation of all numbers

**Not Planned:**
- User accounts (unless needed for other features)
- Paid premium features (platform is free with ads)
- Social features (comments, sharing results publicly)

