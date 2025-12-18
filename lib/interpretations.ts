import lifePathData from '@/data/interpretations/life-path.json';
import destinyData from '@/data/interpretations/destiny.json';
import compatibilityData from '@/data/interpretations/compatibility.json';
import dailyData from '@/data/interpretations/daily.json';

export type InterpretationType = 'life-path' | 'destiny' | 'compatibility' | 'daily';

export interface BaseInterpretation {
    title: string;
    description: string;
    fullText: string;
}

export interface LifePathInterpretation {
    theme: {
        primary: string;
        accent: string;
        bg_soft: string;
    };
    hero: {
        icon: string;
        title: string;
        subtitle: string;
        headline: string;
    };
    tags: string[];
    content: {
        main_text: string;
        dos: string[];
        donts: string[];
        master_note?: string;
    };
    mantra: string;
}

// Union type for all interpretations
export type Interpretation = BaseInterpretation | LifePathInterpretation;

const dataMap: Record<InterpretationType, Record<string, Interpretation>> = {
    'life-path': lifePathData as unknown as Record<string, LifePathInterpretation>,
    'destiny': destinyData as unknown as Record<string, BaseInterpretation>,
    'compatibility': compatibilityData as unknown as Record<string, BaseInterpretation>,
    'daily': dailyData as unknown as Record<string, BaseInterpretation>,
};

export function getInterpretation<T = Interpretation>(type: InterpretationType, number: number | string): T | null {
    const dataset = dataMap[type];
    if (!dataset) return null;

    // Convert number to string for lookup key
    const key = String(number);

    return (dataset[key] as T) || null;
}

export function getAllInterpretations(type: InterpretationType): Record<string, Interpretation> {
    return dataMap[type] || {};
}
