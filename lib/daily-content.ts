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
