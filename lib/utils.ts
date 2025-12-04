import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Validation Error Class
// ============================================================================

/**
 * Custom error class for validation errors in domain logic
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Romanian month names for date formatting
export const ROMANIAN_MONTHS = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
];

// Romanian diacritics mapping for text normalization
export const DIACRITIC_MAP: Record<string, string> = {
  ă: "a",
  â: "a",
  î: "i",
  ș: "s",
  ț: "t",
  Ă: "A",
  Â: "A",
  Î: "I",
  Ș: "S",
  Ț: "T",
};

/**
 * Gets the current date in Europe/Bucharest timezone as a Date object.
 * This ensures consistent date handling across the application regardless
 * of the user's local timezone.
 *
 * @returns Date object representing the current date in Bucharest timezone
 */
export function getBucharestDate(): Date {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parseInt(parts.find((p) => p.type === "year")?.value ?? "0", 10);
  const month = parseInt(parts.find((p) => p.type === "month")?.value ?? "0", 10) - 1;
  const day = parseInt(parts.find((p) => p.type === "day")?.value ?? "0", 10);

  return new Date(year, month, day);
}

/**
 * Formats a Date object as a Romanian-language date string
 * @param date - The date to format
 * @returns Formatted date string (e.g., "14 noiembrie 2025")
 */
export function formatRomanianDate(date: Date): string {
  const day = date.getDate();
  const month = ROMANIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Validates that a Date object is valid
 * @param date - The date to validate
 * @param fieldName - Name of the field for error messages
 * @throws ValidationError if date is invalid
 */
export function validateDate(date: Date, fieldName: string): void {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new ValidationError(`${fieldName} must be a valid date`);
  }
}

/**
 * Validates that a number is a valid numerology number (1-9 or 11, 22, 33)
 * @param num - The number to validate
 * @throws ValidationError if number is not valid
 */
export function validateNumerologyNumber(num: number): void {
  const validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  if (!validNumbers.includes(num)) {
    throw new ValidationError("Numerology number must be 1-9 or a Master Number (11, 22, 33)");
  }
}

/**
 * Validates that a name is non-empty
 * @param name - The name to validate
 * @throws ValidationError if name is empty or only whitespace
 */
export function validateName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new ValidationError("Name cannot be empty");
  }
}
