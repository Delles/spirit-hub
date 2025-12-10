import lifePathData from '@/data/interpretations/life-path.json';
import destinyData from '@/data/interpretations/destiny.json';
import compatibilityData from '@/data/interpretations/compatibility.json';
import dailyData from '@/data/interpretations/daily.json';

export type InterpretationType = 'life-path' | 'destiny' | 'compatibility' | 'daily';

export interface Interpretation {
    title: string;
    description: string;
    fullText: string;
}

const dataMap: Record<InterpretationType, Record<string, Interpretation>> = {
    'life-path': lifePathData as unknown as Record<string, Interpretation>,
    'destiny': destinyData as unknown as Record<string, Interpretation>,
    'compatibility': compatibilityData as unknown as Record<string, Interpretation>,
    'daily': dailyData as unknown as Record<string, Interpretation>,
};

export function getInterpretation(type: InterpretationType, number: number | string): Interpretation | null {
    const dataset = dataMap[type];
    if (!dataset) return null;

    // Convert number to string for lookup key
    const key = String(number);

    return dataset[key] || null;
}

export function getAllInterpretations(type: InterpretationType): Record<string, Interpretation> {
    return dataMap[type] || {};
}
