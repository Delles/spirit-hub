export type CalendarDate = string;

export class CalendarDateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CalendarDateError";
  }
}

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
] as const;

export const ROMANIAN_MONTHS_SHORT = [
  "ian",
  "feb",
  "mar",
  "apr",
  "mai",
  "iun",
  "iul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
] as const;

export const ROMANIAN_DAYS = [
  "Duminică",
  "Luni",
  "Marți",
  "Miercuri",
  "Joi",
  "Vineri",
  "Sâmbătă",
] as const;

export const ROMANIAN_DAYS_SHORT = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"] as const;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function isCalendarDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function getBucharestCalendarDate(now: Date = new Date()): CalendarDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new CalendarDateError("Could not determine the Bucharest calendar date");
  }

  return `${year}-${month}-${day}`;
}

export function parseCalendarDate(value: string): Date {
  if (!isCalendarDate(value)) {
    throw new CalendarDateError("Calendar date must use YYYY-MM-DD format");
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new CalendarDateError("Calendar date is invalid");
  }

  return date;
}

export function dateToCalendarDate(date: Date): CalendarDate {
  if (Number.isNaN(date.getTime())) {
    throw new CalendarDateError("Date is invalid");
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addCalendarDays(date: CalendarDate, days: number): CalendarDate {
  const result = parseCalendarDate(date);

  if (!Number.isInteger(days)) {
    throw new CalendarDateError("Calendar day offset must be an integer");
  }

  result.setDate(result.getDate() + days);
  return dateToCalendarDate(result);
}

export function formatRomanianCalendarDate(date: CalendarDate): string {
  const parsed = parseCalendarDate(date);
  return `${parsed.getDate()} ${ROMANIAN_MONTHS[parsed.getMonth()]} ${parsed.getFullYear()}`;
}

export function getRomanianCalendarDateParts(date: CalendarDate): {
  formatted: string;
  dayOfWeek: string;
  short: string;
  dayNum: number;
} {
  const parsed = parseCalendarDate(date);
  return {
    formatted: formatRomanianCalendarDate(date),
    dayOfWeek: ROMANIAN_DAYS[parsed.getDay()],
    short: `${parsed.getDate()} ${ROMANIAN_MONTHS_SHORT[parsed.getMonth()]}`,
    dayNum: parsed.getDate(),
  };
}

export function getRomanianISODateParts(isoString: string) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    throw new CalendarDateError("ISO date is invalid");
  }

  const calendarDate = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
  return getRomanianCalendarDateParts(calendarDate);
}

export function formatRomanianLongCalendarDate(date: CalendarDate): string {
  const parsed = parseCalendarDate(date);
  const formatted = `${ROMANIAN_DAYS[parsed.getDay()]}, ${parsed.getDate()} ${ROMANIAN_MONTHS[parsed.getMonth()]} ${parsed.getFullYear()}`;
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatRomanianDate(date: Date): string {
  return formatRomanianCalendarDate(dateToCalendarDate(date));
}

export function formatRomanianPickerDate(date: Date): string {
  const calendarDate = dateToCalendarDate(date);
  const parsed = parseCalendarDate(calendarDate);
  return `${String(parsed.getDate()).padStart(2, "0")} ${ROMANIAN_MONTHS[parsed.getMonth()]} ${parsed.getFullYear()}`;
}

export function getRomanianDayName(date: Date): string {
  return ROMANIAN_DAYS[date.getDay()];
}

export function getRomanianShortDayName(date: Date): string {
  return ROMANIAN_DAYS_SHORT[date.getDay()];
}
