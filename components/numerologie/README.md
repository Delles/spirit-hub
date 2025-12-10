# Numerology Components

This directory contains reusable components for the Numerology module.

## NumerologyForm

A reusable form component that supports three variants: Life Path, Destiny, and Compatibility calculators.

### Features

- **Three form variants**: `lifePath`, `destiny`, `compatibility`
- **Client-side validation** with Romanian error messages
- **Accessibility compliant**: ARIA attributes, keyboard navigation, 44x44px touch targets
- **Loading states**: Disabled inputs and loading spinner during submission
- **Romanian diacritics support**: Validates names with ă, â, î, ș, ț
- **Responsive design**: Mobile-first with Tailwind CSS
- **Design system compliant**: Follows `docs/design.json` specifications

### Usage

#### Life Path Calculator

```tsx
import { NumerologyForm } from "@/components/numerologie/numerology-form";
import { calculateLifePath } from "@/lib/numerology";

function LifePathPage() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data) => {
    if (data.type === "lifePath") {
      setIsLoading(true);
      const date = new Date(data.birthDate);
      const lifePathNumber = calculateLifePath(date);
      // Fetch interpretation from static data...
      setIsLoading(false);
    }
  };

  return <NumerologyForm type="lifePath" onSubmit={handleSubmit} isLoading={isLoading} />;
}
```

#### Destiny Calculator

```tsx
import { NumerologyForm } from "@/components/numerologie/numerology-form";
import { calculateDestinyNumber } from "@/lib/numerology";

function DestinyPage() {
  const handleSubmit = (data) => {
    if (data.type === "destiny") {
      const destinyNumber = calculateDestinyNumber(data.name);
      // Fetch interpretation from static data...
    }
  };

  return <NumerologyForm type="destiny" onSubmit={handleSubmit} />;
}
```

#### Compatibility Calculator

```tsx
import { NumerologyForm } from "@/components/numerologie/numerology-form";
import {
  calculateLifePath,
  calculateDestinyNumber,
  calculateCompatibility,
} from "@/lib/numerology";

function CompatibilityPage() {
  const handleSubmit = (data) => {
    if (data.type === "compatibility") {
      // Calculate both Life Path and Destiny numbers
      const lifePath1 = calculateLifePath(new Date(data.birthDate1));
      const destiny1 = calculateDestinyNumber(data.name1);
      const lifePath2 = calculateLifePath(new Date(data.birthDate2));
      const destiny2 = calculateDestinyNumber(data.name2);

      // Calculate compatibility scores
      const lifePathCompat = calculateCompatibility(lifePath1, lifePath2);
      const destinyCompat = calculateCompatibility(destiny1, destiny2);
      const avgScore = Math.round((lifePathCompat + destinyCompat) / 2);

      // Fetch interpretation from static data...
    }
  };

  return <NumerologyForm type="compatibility" onSubmit={handleSubmit} />;
}
```

### Props

```typescript
interface NumerologyFormProps {
  type: "lifePath" | "destiny" | "compatibility";
  onSubmit: (data: NumerologyFormData) => void;
  isLoading?: boolean;
}
```

### Form Data Types

```typescript
type LifePathFormData = {
  type: "lifePath";
  birthDate: string; // ISO format: "YYYY-MM-DD"
};

type DestinyFormData = {
  type: "destiny";
  name: string;
};

type CompatibilityFormData = {
  type: "compatibility";
  name1: string;
  birthDate1: string;
  name2: string;
  birthDate2: string;
};
```

### Validation Rules

#### Birth Date

- Required field
- Must be a valid date
- Must be in the past
- Error messages in Romanian

#### Name

- Required field
- Minimum 2 characters
- Romanian letters only (a-z, A-Z, ă, â, î, ș, ț)
- Spaces allowed for full names
- Error messages in Romanian

### Accessibility

- All inputs have proper `<label>` elements
- ARIA attributes: `aria-required`, `aria-invalid`, `aria-describedby`
- Error messages associated with inputs via `aria-describedby`
- Minimum 44x44px touch targets for mobile
- Keyboard navigation support (Tab, Enter)
- Focus indicators visible (3px purple ring)

### Styling

- Uses shadcn/ui components (Input, Label, Button, Card)
- Tailwind CSS for styling
- Primary gradient button: `#9F2BFF` to `#4D5FFF`
- Dark theme with mystical aesthetic
- Mobile-responsive with proper spacing
- Follows design system from `docs/design.json`
