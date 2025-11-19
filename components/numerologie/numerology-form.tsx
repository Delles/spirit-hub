"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Type Definitions
// ============================================================================

export type NumerologyFormType = "lifePath" | "destiny" | "compatibility";

export interface LifePathFormData {
  type: "lifePath";
  birthDate: string;
}

export interface DestinyFormData {
  type: "destiny";
  name: string;
}

export interface CompatibilityFormData {
  type: "compatibility";
  name1: string;
  birthDate1: string;
  name2: string;
  birthDate2: string;
}

export type NumerologyFormData = LifePathFormData | DestinyFormData | CompatibilityFormData;

export interface NumerologyFormProps {
  type: NumerologyFormType;
  onSubmit: (data: NumerologyFormData) => void;
  isLoading?: boolean;
}

interface FormErrors {
  birthDate?: string;
  name?: string;
  birthDate1?: string;
  name1?: string;
  birthDate2?: string;
  name2?: string;
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validates a birth date field
 * Returns error message in Romanian or undefined if valid
 */
function validateBirthDate(value: string): string | undefined {
  if (!value) {
    return "Data nașterii este obligatorie";
  }

  const date = new Date(value);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return "Data nașterii este invalidă";
  }

  if (date > now) {
    return "Data nașterii trebuie să fie în trecut";
  }

  return undefined;
}

/**
 * Validates a name field
 * Returns error message in Romanian or undefined if valid
 */
function validateNameField(value: string): string | undefined {
  if (!value || value.trim().length === 0) {
    return "Numele este obligatoriu";
  }

  if (value.trim().length < 2) {
    return "Numele trebuie să conțină cel puțin 2 caractere";
  }

  // Romanian letters pattern: a-z, A-Z, and Romanian diacritics (ă, â, î, ș, ț)
  // Also allow spaces for full names
  const romanianLettersPattern = /^[a-zA-ZăâîșțĂÂÎȘȚ\s]+$/;

  if (!romanianLettersPattern.test(value)) {
    return "Numele poate conține doar litere și spații";
  }

  return undefined;
}

// ============================================================================
// NumerologyForm Component
// ============================================================================

export function NumerologyForm({ type, onSubmit, isLoading = false }: NumerologyFormProps) {
  // Form state
  const [birthDate, setBirthDate] = useState("");
  const [name, setName] = useState("");
  const [name1, setName1] = useState("");
  const [birthDate1, setBirthDate1] = useState("");
  const [name2, setName2] = useState("");
  const [birthDate2, setBirthDate2] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // ============================================================================
  // Validation Logic
  // ============================================================================

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (type === "lifePath") {
      const birthDateError = validateBirthDate(birthDate);
      if (birthDateError) {
        newErrors.birthDate = birthDateError;
      }
    } else if (type === "destiny") {
      const nameError = validateNameField(name);
      if (nameError) {
        newErrors.name = nameError;
      }
    } else if (type === "compatibility") {
      const name1Error = validateNameField(name1);
      if (name1Error) {
        newErrors.name1 = name1Error;
      }

      const birthDate1Error = validateBirthDate(birthDate1);
      if (birthDate1Error) {
        newErrors.birthDate1 = birthDate1Error;
      }

      const name2Error = validateNameField(name2);
      if (name2Error) {
        newErrors.name2 = name2Error;
      }

      const birthDate2Error = validateBirthDate(birthDate2);
      if (birthDate2Error) {
        newErrors.birthDate2 = birthDate2Error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // Form Submission
  // ============================================================================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Build form data based on type
    if (type === "lifePath") {
      onSubmit({ type: "lifePath", birthDate });
    } else if (type === "destiny") {
      onSubmit({ type: "destiny", name });
    } else if (type === "compatibility") {
      onSubmit({
        type: "compatibility",
        name1,
        birthDate1,
        name2,
        birthDate2,
      });
    }
  };

  // ============================================================================
  // Field Change Handlers (with error clearing)
  // ============================================================================

  const handleBirthDateChange = (value: string) => {
    setBirthDate(value);
    if (errors.birthDate) {
      setErrors((prev) => ({ ...prev, birthDate: undefined }));
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleName1Change = (value: string) => {
    setName1(value);
    if (errors.name1) {
      setErrors((prev) => ({ ...prev, name1: undefined }));
    }
  };

  const handleBirthDate1Change = (value: string) => {
    setBirthDate1(value);
    if (errors.birthDate1) {
      setErrors((prev) => ({ ...prev, birthDate1: undefined }));
    }
  };

  const handleName2Change = (value: string) => {
    setName2(value);
    if (errors.name2) {
      setErrors((prev) => ({ ...prev, name2: undefined }));
    }
  };

  const handleBirthDate2Change = (value: string) => {
    setBirthDate2(value);
    if (errors.birthDate2) {
      setErrors((prev) => ({ ...prev, birthDate2: undefined }));
    }
  };

  // ============================================================================
  // Render Helpers
  // ============================================================================

  const renderErrorMessage = (error: string | undefined, id: string) => {
    if (!error) return null;

    return (
      <div id={id} className="flex items-center gap-2 text-sm text-destructive" role="alert">
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{error}</span>
      </div>
    );
  };

  // ============================================================================
  // Form Variants
  // ============================================================================

  const renderLifePathForm = () => (
    <div className="space-y-2">
      <Label htmlFor="birthDate" className="text-white">
        Data nașterii *
      </Label>
      <DatePicker
        id="birthDate"
        value={birthDate}
        onChange={(date) => handleBirthDateChange(date || "")}
        placeholder="dd.mm.yyyy"
        disabled={isLoading}
        error={!!errors.birthDate}
        maxDate={new Date()}
        aria-invalid={!!errors.birthDate}
        aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
      />
      {renderErrorMessage(errors.birthDate, "birthDate-error")}
    </div>
  );

  const renderDestinyForm = () => (
    <div className="space-y-2">
      <Label htmlFor="name" className="text-white">
        Numele complet *
      </Label>
      <Input
        id="name"
        type="text"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Ex: Ion Popescu"
        className={cn("h-11 text-base min-h-[44px]", errors.name && "border-destructive")}
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : undefined}
        aria-required="true"
        disabled={isLoading}
      />
      {renderErrorMessage(errors.name, "name-error")}
    </div>
  );

  const renderCompatibilityForm = () => (
    <>
      {/* Person 1 Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Prima persoană</h3>

        <div className="space-y-2">
          <Label htmlFor="name1" className="text-white">
            Primul nume *
          </Label>
          <Input
            id="name1"
            type="text"
            value={name1}
            onChange={(e) => handleName1Change(e.target.value)}
            placeholder="Ex: Maria Ionescu"
            className={cn("h-11 text-base min-h-[44px]", errors.name1 && "border-destructive")}
            aria-invalid={!!errors.name1}
            aria-describedby={errors.name1 ? "name1-error" : undefined}
            aria-required="true"
            disabled={isLoading}
          />
          {renderErrorMessage(errors.name1, "name1-error")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate1" className="text-white">
            Prima dată de naștere *
          </Label>
          <DatePicker
            id="birthDate1"
            value={birthDate1}
            onChange={(date) => handleBirthDate1Change(date || "")}
            placeholder="dd.mm.yyyy"
            disabled={isLoading}
            error={!!errors.birthDate1}
            maxDate={new Date()}
            aria-invalid={!!errors.birthDate1}
            aria-describedby={errors.birthDate1 ? "birthDate1-error" : undefined}
          />
          {renderErrorMessage(errors.birthDate1, "birthDate1-error")}
        </div>
      </div>

      {/* Person 2 Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">A doua persoană</h3>

        <div className="space-y-2">
          <Label htmlFor="name2" className="text-white">
            Al doilea nume *
          </Label>
          <Input
            id="name2"
            type="text"
            value={name2}
            onChange={(e) => handleName2Change(e.target.value)}
            placeholder="Ex: Ion Popescu"
            className={cn("h-11 text-base min-h-[44px]", errors.name2 && "border-destructive")}
            aria-invalid={!!errors.name2}
            aria-describedby={errors.name2 ? "name2-error" : undefined}
            aria-required="true"
            disabled={isLoading}
          />
          {renderErrorMessage(errors.name2, "name2-error")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate2" className="text-white">
            A doua dată de naștere *
          </Label>
          <DatePicker
            id="birthDate2"
            value={birthDate2}
            onChange={(date) => handleBirthDate2Change(date || "")}
            placeholder="dd.mm.yyyy"
            disabled={isLoading}
            error={!!errors.birthDate2}
            maxDate={new Date()}
            aria-invalid={!!errors.birthDate2}
            aria-describedby={errors.birthDate2 ? "birthDate2-error" : undefined}
          />
          {renderErrorMessage(errors.birthDate2, "birthDate2-error")}
        </div>
      </div>
    </>
  );

  // ============================================================================
  // Button Text
  // ============================================================================

  const getButtonText = () => {
    if (isLoading) {
      return "Se calculează...";
    }

    switch (type) {
      case "lifePath":
        return "Calculează Calea Vieții";
      case "destiny":
        return "Calculează Numărul Destinului";
      case "compatibility":
        return "Calculează Compatibilitatea";
      default:
        return "Calculează";
    }
  };

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8">
        {/* Dynamic form fields based on type */}
        {type === "lifePath" && renderLifePathForm()}
        {type === "destiny" && renderDestinyForm()}
        {type === "compatibility" && renderCompatibilityForm()}

        {/* Submit Button with gradient background */}
        <Button
          type="submit"
          className={cn(
            "w-full h-11 min-h-[44px] text-base font-medium",
          )}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          {getButtonText()}
        </Button>
      </form>
    </Card>
  );
}
