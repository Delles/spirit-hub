import oracleData from "@/data/interpretations/oracle.json";

export interface OracleMessage {
    id: number;
    slug: string;
    title: string;
    category: string;
    theme: {
        primary: string;
        accent: string;
        icon: string;
    };
    insight: string;
    action: string;
    mantra: string;
}

/**
 * Get today's oracle message (deterministic by date)
 */
export function getDailyOracle(date: Date = new Date()): OracleMessage {
    const messages = oracleData.messages as unknown as OracleMessage[];
    const dayOfYear = getDayOfYear(date);
    const year = date.getFullYear();

    // Deterministic seed ensures same message all day
    // Using a prime multiplier to distribute selections better
    const seed = (dayOfYear * 31 + year) % messages.length;

    return messages[seed];
}

function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
