import {
    getBucharestCalendarDate,
    parseCalendarDate,
    type CalendarDate,
} from "@/lib/bucharest-calendar";
import { getEnergiaZilei, type EnergiaZileiData } from "@/lib/energia-zilei";
import { getMoonGuide, type MoonGuideData } from "@/lib/moon-guide";
import { getDailyOracle, type OracleMessage } from "@/lib/oracle";

export interface DailyContent {
    /** Current date in YYYY-MM-DD format (Bucharest timezone) */
    date: CalendarDate;
    /** Daily numerology number (1-9 or master numbers) */
    dailyNumber: {
        number: number;
    };
    /** Planetary day energy data */
    energiaZilei: EnergiaZileiData;
    /** Moon phase with spiritual guidance */
    moonGuide: MoonGuideData;
    /** Daily oracle message */
    dailyOracle: OracleMessage;
}

/**
 * Calculate the numerological daily number for a given date
 * (Day + Month + Universal Year) reduced to 1-9 or Master Number 11, 22, 33
 */
export function calculateDailyNumber(dateStr: string): number {
    const date = parseCalendarDate(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Helper to reduce number
    const reduce = (n: number): number => {
        if (n === 11 || n === 22 || n === 33) return n;
        if (n < 10) return n;
        return reduce(String(n).split('').reduce((acc, digit) => acc + parseInt(digit), 0));
    };

    // Universal Year = reduced year
    const universalYear = reduce(year);

    // Universal Daily Number = Day + Month + Universal Year, then reduce
    const sum = day + month + universalYear;

    return reduce(sum);
}

/** Compose every deterministic daily edition from one explicit calendar date. */
export function getDailyContentForDate(date: CalendarDate): DailyContent {
    const calendarDate = parseCalendarDate(date);

    return {
        date,
        dailyNumber: { number: calculateDailyNumber(date) },
        energiaZilei: getEnergiaZilei(calendarDate),
        moonGuide: getMoonGuide(calendarDate),
        dailyOracle: getDailyOracle(calendarDate),
    };
}

/** Compose the daily edition for the current Bucharest date. */
export function getDailyContent(now: Date = new Date()): DailyContent {
    return getDailyContentForDate(getBucharestCalendarDate(now));
}
