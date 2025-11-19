import { Locale } from "react-day-picker";
import { ROMANIAN_MONTHS } from "./utils";

// Romanian day names (abbreviated for calendar headers)
const ROMANIAN_DAYS_SHORT = ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sâ"];

// Romanian day names (full)
const ROMANIAN_DAYS_FULL = [
  "Duminică",
  "Luni",
  "Marți",
  "Miercuri",
  "Joi",
  "Vineri",
  "Sâmbătă",
];

/**
 * Romanian locale configuration for react-day-picker v9
 * Provides Romanian month and day names for the calendar
 * Weekday headers use 2-letter abbreviations (Lu, Ma, Mi, Jo, Vi, Sâ, Du)
 */
export const roRO: Locale = {
  code: "ro",
  localize: {
    month: (n: number) => ROMANIAN_MONTHS[n] || "",
    day: (n: number) => ROMANIAN_DAYS_SHORT[n] || "", // Use 2-letter abbreviations (Lu, Ma, Mi, etc.)
    ordinalNumber: () => "",
    era: () => "",
    quarter: () => "",
    dayPeriod: () => "",
  },
  formatLong: {
    date: () => "dd.MM.yyyy",
    time: () => "HH:mm",
    dateTime: () => "dd.MM.yyyy HH:mm",
  },
  formatDistance: () => "",
  formatRelative: () => "",
  match: {
    ordinalNumber: () => null,
    era: () => null,
    quarter: () => null,
    month: () => null,
    day: () => null,
    dayPeriod: () => null,
  },
  options: {
    weekStartsOn: 1 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    firstWeekContainsDate: 1,
  },
};

