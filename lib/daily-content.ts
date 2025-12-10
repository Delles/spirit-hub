import { getAllSymbols, StaticDreamSymbol } from '@/lib/dream-data';

/**
 * Get today's date in Bucharest time (ISO format YYYY-MM-DD)
 * reliable regardless of server location/timezone
 */
export function getTodayISOBucharest(): string {
    // en-CA format is YYYY-MM-DD
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Bucharest' });
}

/**
 * Calculate the numerological daily number for a given date
 * (Day + Month + Universal Year) reduced to 1-9 or Master Number 11, 22, 33
 */
export function calculateDailyNumber(dateStr: string): number {
    // Parse YYYY-MM-DD manually to avoid timezone shifts
    // new Date("YYYY-MM-DD") is parsed as UTC, but getDate()/getMonth() return local time
    // which can shift the day on servers outside the expected timezone
    const [yearStr, monthStr, dayStr] = dateStr.split("-");
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

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

/**
 * Deterministically pick a dream symbol for the day
 * Uses a string hash of the date and total symbols count
 */
export function getDailyDream(dateStr: string): StaticDreamSymbol {
    const symbols = getAllSymbols();
    if (symbols.length === 0) {
        throw new Error("No dream symbols available");
    }

    // Simple string hash function (djb2 variant)
    let hash = 5381;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) + hash) + dateStr.charCodeAt(i); /* hash * 33 + c */
    }

    // Important: Use Math.abs to handle negative hash values from overflow
    const index = Math.abs(hash) % symbols.length;

    return symbols[index];
}


/**
 * Get all daily widget data for today (or specific date)
 * Used by Homepage and Daily pages
 */
export function getDailyWidgetData(dateStr: string = getTodayISOBucharest()) {
    const dailyNumber = calculateDailyNumber(dateStr);
    const dailyDream = getDailyDream(dateStr);

    return {
        date: dateStr,
        dailyNumber,
        dailyDream
    };
}
