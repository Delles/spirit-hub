"use client";

import * as React from "react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { roRO } from "@/lib/date-locale";

interface DatePickerProps {
  value?: string | Date;
  onChange?: (date: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  maxDate?: Date;
  minDate?: Date;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

/**
 * Formats a Date object to Romanian locale string (e.g., "19 noiembrie 2025")
 */
function formatRomanianDate(date: Date | undefined): string {
  if (!date) return "";
  return format(date, "dd MMMM yyyy", { locale: ro });
}

/**
 * Converts Date to ISO string (YYYY-MM-DD format)
 * Uses local timezone to avoid date shifting issues
 */
function dateToISOString(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selectează data",
  disabled = false,
  className,
  error = false,
  maxDate,
  minDate,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Convert string value to Date for calendar
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    // Try parsing ISO format (YYYY-MM-DD)
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  }, [value]);

  // Month state for calendar navigation
  const [month, setMonth] = React.useState<Date | undefined>(dateValue || new Date());

  // Update month when dateValue changes
  React.useEffect(() => {
    if (dateValue) {
      setMonth(dateValue);
    }
  }, [dateValue]);

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      // Validate date constraints
      let isValid = true;
      if (maxDate && date > maxDate) isValid = false;
      if (minDate && date < minDate) isValid = false;

      if (isValid) {
        const isoString = dateToISOString(date);
        onChange?.(isoString);
        setOpen(false);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "h-11 w-full justify-between font-normal",
            "bg-[oklch(1_0_0_/_0.12)] border-[oklch(1_0_0_/_0.08)] text-white",
            "hover:bg-[oklch(1_0_0_/_0.16)] hover:border-[oklch(1_0_0_/_0.12)]",
            "focus-visible:border-[oklch(0.6_0.28_300)] focus-visible:ring-[oklch(0.6_0.28_300_/_0.5)]",
            !dateValue && "text-muted-foreground",
            error && "border-destructive ring-destructive/20",
            className
          )}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
        >
          <span>{dateValue ? formatRomanianDate(dateValue) : placeholder}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0 bg-[oklch(0.18_0.03_280_/_0.95)] border-[oklch(1_0_0_/_0.08)] backdrop-blur-xl"
        align="start"
      >
        <Calendar
          mode="single"
          selected={dateValue}
          captionLayout="dropdown"
          month={month}
          onMonthChange={setMonth}
          onSelect={handleCalendarSelect}
          locale={roRO}
          disabled={(date) => {
            if (disabled) return true;
            if (maxDate && date > maxDate) return true;
            if (minDate && date < minDate) return true;
            return false;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

