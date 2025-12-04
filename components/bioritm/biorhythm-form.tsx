"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { AlertCircle } from "lucide-react";

export interface BiorhythmFormProps {
  onSubmit: (birthDate: string, targetDate: string) => void;
  isLoading?: boolean;
  showTargetDate?: boolean;
}

interface FormErrors {
  birthDate?: string;
  targetDate?: string;
}

export function BiorhythmForm({
  onSubmit,
  isLoading = false,
  showTargetDate = true,
}: BiorhythmFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(today);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate birth date
    if (!birthDate) {
      newErrors.birthDate = "Data nașterii este obligatorie";
    } else {
      const birth = new Date(birthDate);
      const now = new Date();

      if (isNaN(birth.getTime())) {
        newErrors.birthDate = "Data nașterii este invalidă";
      } else if (birth > now) {
        newErrors.birthDate = "Data nașterii trebuie să fie în trecut";
      }
    }

    // Validate target date if shown
    if (showTargetDate && targetDate) {
      const target = new Date(targetDate);
      const birth = new Date(birthDate);

      if (isNaN(target.getTime())) {
        newErrors.targetDate = "Data țintă este invalidă";
      } else if (birthDate && target < birth) {
        newErrors.targetDate = "Data țintă trebuie să fie după data nașterii";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(birthDate, showTargetDate ? targetDate : today);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Birth Date Input */}
      <div className="space-y-2">
        <Label htmlFor="birthDate" className="text-white">
          Data nașterii *
        </Label>
        <DatePicker
          id="birthDate"
          value={birthDate}
          onChange={(date) => {
            setBirthDate(date || "");
            if (errors.birthDate) {
              setErrors((prev) => ({ ...prev, birthDate: undefined }));
            }
          }}
          placeholder="dd.mm.yyyy"
          disabled={isLoading}
          error={!!errors.birthDate}
          maxDate={new Date()}
          aria-invalid={!!errors.birthDate}
          aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
        />
        {errors.birthDate && (
          <div id="birthDate-error" className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.birthDate}</span>
          </div>
        )}
      </div>

      {/* Target Date Input (Optional) */}
      {showTargetDate && (
        <div className="space-y-2">
          <Label htmlFor="targetDate" className="text-white">
            Data pentru calcul (opțional)
          </Label>
          <DatePicker
            id="targetDate"
            value={targetDate}
            onChange={(date) => {
              setTargetDate(date || today);
              if (errors.targetDate) {
                setErrors((prev) => ({ ...prev, targetDate: undefined }));
              }
            }}
            placeholder="dd.mm.yyyy"
            disabled={isLoading}
            error={!!errors.targetDate}
            minDate={birthDate ? new Date(birthDate) : undefined}
            aria-invalid={!!errors.targetDate}
            aria-describedby={errors.targetDate ? "targetDate-error" : undefined}
          />
          {errors.targetDate && (
            <div
              id="targetDate-error"
              className="flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{errors.targetDate}</span>
            </div>
          )}
          <p className="text-sm text-muted-foreground">Lasă necompletat pentru data de astăzi</p>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
        {isLoading ? "Se calculează..." : "Calculează Bioritmul"}
      </Button>
    </form>
  );
}
