import lifePathData from '@/data/interpretations/life-path.json';
import destinyData from '@/data/interpretations/destiny.json';
import compatibilityData from '@/data/interpretations/compatibility.json';
import dailyData from '@/data/interpretations/daily.json';
import personalYearData from '@/data/interpretations/personal-year.json';

export type InterpretationType = 'life-path' | 'destiny' | 'compatibility' | 'daily' | 'personal-year';

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
// DailyInterpretation shares the same structure as LifePathInterpretation
// If these ever diverge, this type alias should be replaced with a separate interface
export type DailyInterpretation = LifePathInterpretation;

export interface CompatibilityInterpretation {
    theme: {
        primary: string;
        accent: string;
        bg_soft: string;
    };
    hero: {
        icon: string;
        title: string;
        headline: string;
    };
    tags: string[];
    content: {
        main_text: string;
        dos: string[];
        donts: string[];
        mantra: string;
    };
}

export interface PersonalYearInterpretation extends LifePathInterpretation {
    content: LifePathInterpretation['content'] & {
        reflection_questions: string[];
    };
}

// Union type for all interpretations
export type Interpretation = BaseInterpretation | LifePathInterpretation | DailyInterpretation | CompatibilityInterpretation | PersonalYearInterpretation;

const dataMap: Record<InterpretationType, Record<string, Interpretation>> = {
    'life-path': lifePathData as unknown as Record<string, LifePathInterpretation>,
    'destiny': destinyData as unknown as Record<string, LifePathInterpretation>,
    'compatibility': compatibilityData as unknown as Record<string, CompatibilityInterpretation>,
    'daily': dailyData as unknown as Record<string, DailyInterpretation>,
    'personal-year': personalYearData as unknown as Record<string, PersonalYearInterpretation>,
};

/**
 * Generic fallback interpretations for when data is missing.
 * Provides meaningful guidance instead of an error state.
 */
const fallbackInterpretations: Partial<Record<InterpretationType, Interpretation>> = {
    'life-path': {
        theme: { primary: '#9F2BFF', accent: '#E0E0E0', bg_soft: 'rgba(159,43,255,0.1)' },
        hero: {
            icon: '✨',
            title: 'Calea Ta',
            subtitle: 'Descoperă-ți drumul',
            headline: 'Fiecare suflet are o cale unică de urmat.'
        },
        tags: ['Introspecție', 'Creștere personală'],
        content: {
            main_text: 'Interpretarea detaliată pentru acest număr este în curs de pregătire. Până atunci, ia-ți un moment să reflectezi asupra călătoriei tale personale. Fiecare experiență, fie ea un succes sau o provocare, te aduce mai aproape de înțelegerea misiunii tale interioare.',
            dos: ['Reflectează asupra valorilor tale fundamentale', 'Fii deschis la lecțiile vieții', 'Urmează-ți intuiția'],
            donts: ['Nu te compara cu alții', 'Nu te grăbi în decizii importante', 'Nu ignora semnalele interioare']
        },
        mantra: 'Fiecare pas al meu este ghidat de înțelepciune interioară.'
    } as LifePathInterpretation,
    'daily': {
        theme: { primary: '#9F2BFF', accent: '#E0E0E0', bg_soft: 'rgba(159,43,255,0.1)' },
        hero: {
            icon: '🌟',
            title: 'Energia Zilei',
            subtitle: 'Ghidul tău pentru astăzi',
            headline: 'Fiecare zi aduce oportunități noi.'
        },
        tags: ['Prezent', 'Oportunități'],
        content: {
            main_text: 'Astăzi este o zi pentru a fi prezent și conștient. Indiferent de ce îți rezervă ziua, abordează fiecare moment cu deschidere și curiozitate. Energia universală te susține în tot ce faci.',
            dos: ['Fii prezent în fiecare moment', 'Arată recunoștință pentru micile bucurii', 'Conectează-te cu cei dragi'],
            donts: ['Nu te lăsa copleșit de griji', 'Nu amâna bucuria pentru mâine', 'Nu ignora nevoile tale']
        },
        mantra: 'Astăzi aleg să fiu prezent și recunoscător.'
    } as DailyInterpretation,
};

export function getInterpretation<T = Interpretation>(
    type: InterpretationType,
    number: number | string,
    options?: { useFallback?: boolean }
): T | null {
    const dataset = dataMap[type];
    if (!dataset) return null;

    // Convert number to string for lookup key
    const key = String(number);
    const result = dataset[key] as T;

    if (result) return result;

    // Return fallback if enabled and available
    if (options?.useFallback) {
        const fallback = fallbackInterpretations[type];
        if (fallback) return fallback as T;
    }

    return null;
}

export function getAllInterpretations(type: InterpretationType): Record<string, Interpretation> {
    return dataMap[type] || {};
}

