import { query } from "./_generated/server";

/**
 * Daily Content Query
 * 
 * Returns all daily content for the homepage and daily pages:
 * - Daily number (numerology)
 * - Daily dream index (picks from static JSON)
 * - Energia Zilei (planetary day energy)
 * - Moon phase
 * 
 * All calculations use Europe/Bucharest timezone for consistency.
 */

// ============================================================================
// Date Utilities
// ============================================================================

/**
 * Get today's date in Bucharest timezone (YYYY-MM-DD)
 */
function getTodayBucharest(): string {
    return new Date().toLocaleDateString("en-CA", {
        timeZone: "Europe/Bucharest",
    });
}

/**
 * Parse Bucharest date string to Date object
 */
function parseBucharestDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
}

// ============================================================================
// Numerology
// ============================================================================

/**
 * Calculate numerological daily number
 * Day + Month + Universal Year, reduced to 1-9 or master numbers (11, 22, 33)
 */
function calculateDailyNumber(dateStr: string): number {
    const [yearStr, monthStr, dayStr] = dateStr.split("-");
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    const reduce = (n: number): number => {
        if (n === 11 || n === 22 || n === 33) return n;
        if (n < 10) return n;
        return reduce(
            String(n)
                .split("")
                .reduce((acc, digit) => acc + parseInt(digit), 0)
        );
    };

    const universalYear = reduce(year);
    return reduce(day + month + universalYear);
}

// ============================================================================
// Dreams
// ============================================================================

/**
 * Deterministic hash for selecting daily dream
 * Same date always returns same index (djb2 algorithm)
 */
function getDailyDreamIndex(dateStr: string, totalSymbols: number): number {
    let hash = 5381;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) + hash) + dateStr.charCodeAt(i);
    }
    return Math.abs(hash) % totalSymbols;
}

// ============================================================================
// Moon Phase
// ============================================================================

/**
 * Calculate moon phase using synodic month
 */
function getMoonPhase(date: Date) {
    const LUNAR_CYCLE = 29.53059;
    const KNOWN_NEW_MOON = new Date("2000-01-06T18:14:00Z");
    const diffMs = date.getTime() - KNOWN_NEW_MOON.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const age = ((diffDays % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;

    const phases = [
        { phase: "new", labelRo: "Lună Nouă", emoji: "🌑" },
        { phase: "waxing_crescent", labelRo: "Semilună Crescătoare", emoji: "🌒" },
        { phase: "first_quarter", labelRo: "Primul Pătrar", emoji: "🌓" },
        { phase: "waxing_gibbous", labelRo: "Giboasă Crescătoare", emoji: "🌔" },
        { phase: "full", labelRo: "Lună Plină", emoji: "🌕" },
        { phase: "waning_gibbous", labelRo: "Giboasă Descrescătoare", emoji: "🌖" },
        { phase: "last_quarter", labelRo: "Ultimul Pătrar", emoji: "🌗" },
        { phase: "waning_crescent", labelRo: "Semilună Descrescătoare", emoji: "🌘" },
    ];

    const phaseIndex = Math.floor((age / LUNAR_CYCLE) * 8) % 8;
    return { ...phases[phaseIndex], ageInDays: Math.round(age * 10) / 10 };
}

// ============================================================================
// Energia Zilei (Planetary Days)
// ============================================================================

/**
 * Complete Energia Zilei data for all 7 days
 * Based on traditional planetary day associations
 */
const ENERGIA_ZILEI_DATA = {
    0: {
        // Sunday - Sun
        dayName: "Duminică",
        planet: "Soarele",
        planetSymbol: "☉",
        theme: "Vitalitate & Regenerare",
        dominantEnergy: "Spiritual",
        energyLevel: 85,
        color: "#FBBF24",
        shortHint: "Zi de odihnă și reîncărcare spirituală",
        description:
            "Duminica este guvernată de Soare, sursa vieții și a vitalității. Este o zi ideală pentru regenerare, reflecție și reconectare cu sinele interior. Energia solară favorizează activitățile creative și timpul petrecut cu familia.",
        tips: [
            "Practică recunoștința",
            "Petrece timp în natură",
            "Conectează-te cu cei dragi",
            "Meditează la reușitele săptămânii",
        ],
        toEmbrace: [
            "Meditație și introspecție",
            "Activități creative",
            "Odihnă activă",
            "Timp de calitate cu familia",
        ],
        toAvoid: [
            "Muncă intensă sau stresantă",
            "Decizii majore de afaceri",
            "Conflicte și discuții aprinse",
            "Suprasolicitare fizică",
        ],
    },
    1: {
        // Monday - Moon
        dayName: "Luni",
        planet: "Luna",
        planetSymbol: "☽",
        theme: "Emoții & Intuiție",
        dominantEnergy: "Emoțional",
        energyLevel: 72,
        color: "#A5B4FC",
        shortHint: "Ascultă-ți intuiția și emoțiile",
        description:
            "Lunea este guvernată de Lună, simbolul intuiției și al emoțiilor. Este o zi excelentă pentru introspecție, planificare și pentru a-ți asculta vocea interioară. Energia lunară favorizează conexiunile emoționale profunde.",
        tips: [
            "Ține un jurnal de vise",
            "Practică autocompasiunea",
            "Ascultă-ți intuiția",
            "Planifică săptămâna cu grijă",
        ],
        toEmbrace: [
            "Conversații de la inimă la inimă",
            "Activități relaxante",
            "Planificare și organizare",
            "Îngrijire personală",
        ],
        toAvoid: [
            "Decizii impulsive importante",
            "Confruntări emoționale",
            "Ignorarea semnalelor corpului",
            "Supraîncărcarea programului",
        ],
    },
    2: {
        // Tuesday - Mars
        dayName: "Marți",
        planet: "Marte",
        planetSymbol: "♂",
        theme: "Acțiune & Energie",
        dominantEnergy: "Fizic",
        energyLevel: 92,
        color: "#F87171",
        shortHint: "Canalizează energia în provocări constructive",
        description:
            "Marțea este guvernată de Marte, planeta acțiunii și a curajului. Este ziua ideală pentru a aborda provocările, a lua inițiativa și a-ți demonstra forța. Energia marțiană favorizează competiția sănătoasă și sportul.",
        tips: [
            "Exerciții fizice intense",
            "Abordează sarcinile dificile",
            "Fii direct și curajos",
            "Ia inițiativa în proiecte",
        ],
        toEmbrace: [
            "Sport și mișcare",
            "Proiecte noi și ambițioase",
            "Rezolvarea problemelor amânate",
            "Competiție sănătoasă",
        ],
        toAvoid: [
            "Agresivitate și impulsivitate",
            "Conflicte inutile",
            "Riscuri nesăbuite",
            "Decizii luate din furie",
        ],
    },
    3: {
        // Wednesday - Mercury
        dayName: "Miercuri",
        planet: "Mercur",
        planetSymbol: "☿",
        theme: "Comunicare & Învățare",
        dominantEnergy: "Intelectual",
        energyLevel: 88,
        color: "#60A5FA",
        shortHint: "Excelent pentru conversații și studiu",
        description:
            "Miercurea este guvernată de Mercur, planeta comunicării și a intelectului. Ziua perfectă pentru învățare, negocieri, scris și orice activitate ce implică schimbul de idei. Energia mercuriană stimulează gândirea rapidă și adaptabilitatea.",
        tips: [
            "Scrie și comunică",
            "Învață ceva nou",
            "Fă networking",
            "Citește și cercetează",
        ],
        toEmbrace: [
            "Studiu și cercetare",
            "Negocieri și întâlniri",
            "Scris creativ",
            "Cursuri și workshop-uri",
        ],
        toAvoid: [
            "Semnarea contractelor fără a citi cu atenție",
            "Bârfa și comunicarea superficială",
            "Supraîncărcarea cu informații",
            "Multitasking excesiv",
        ],
    },
    4: {
        // Thursday - Jupiter
        dayName: "Joi",
        planet: "Jupiter",
        planetSymbol: "♃",
        theme: "Expansiune & Oportunități",
        dominantEnergy: "Spiritual",
        energyLevel: 90,
        color: "#A78BFA",
        shortHint: "Deschide-te la noi posibilități",
        description:
            "Joia este guvernată de Jupiter, planeta norocului, abundenței și a expansiunii. Este ziua ideală pentru a visa mare, a explora noi orizonturi și a-ți extinde perspectivele. Energia jupiteriană favorizează optimismul și generozitatea.",
        tips: [
            "Gândește la scară mare",
            "Fii generos cu ceilalți",
            "Explorează filosofii noi",
            "Planifică călătorii",
        ],
        toEmbrace: [
            "Planuri de viitor ambițioase",
            "Educație și dezvoltare personală",
            "Călătorii și explorare",
            "Activități filantropice",
        ],
        toAvoid: [
            "Excesele de orice fel",
            "Promisiuni pe care nu le poți ține",
            "Risipa de resurse",
            "Aroganța și superioritatea",
        ],
    },
    5: {
        // Friday - Venus
        dayName: "Vineri",
        planet: "Venus",
        planetSymbol: "♀",
        theme: "Armonie & Frumusețe",
        dominantEnergy: "Social",
        energyLevel: 85,
        color: "#F472B6",
        shortHint: "Cultivă relațiile și frumusețea",
        description:
            "Vinerea este guvernată de Venus, planeta iubirii, frumuseții și a armoniei. Ziua perfectă pentru romantism, artă, plăceri estetice și socializare. Energia venusiană favorizează conexiunile afective și aprecierea frumosului.",
        tips: [
            "Răsfață-te puțin",
            "Petrece timp cu cei dragi",
            "Apreciază arta și frumosul",
            "Îngrijește-ți aspectul",
        ],
        toEmbrace: [
            "Întâlniri romantice",
            "Shopping inteligent",
            "Evenimente sociale",
            "Artă și muzică",
        ],
        toAvoid: [
            "Conflicte și confruntări",
            "Gelozia și posesivitatea",
            "Cheltuieli impulsive excesive",
            "Superficialitatea în relații",
        ],
    },
    6: {
        // Saturday - Saturn
        dayName: "Sâmbătă",
        planet: "Saturn",
        planetSymbol: "♄",
        theme: "Disciplină & Structură",
        dominantEnergy: "Creativ",
        energyLevel: 75,
        color: "#818CF8",
        shortHint: "Focus pe proiecte personale și organizare",
        description:
            "Sâmbăta este guvernată de Saturn, planeta disciplinei, structurii și a responsabilității. Este ziua ideală pentru a pune ordine, a lucra la proiecte pe termen lung și a reflecta asupra lecțiilor vieții. Energia saturniană favorizează răbdarea și perseverența.",
        tips: [
            "Organizează-ți spațiul și viața",
            "Lucrează la hobby-uri",
            "Reflectează asupra progresului",
            "Finalizează proiecte restante",
        ],
        toEmbrace: [
            "Treburi casnice și organizare",
            "Proiecte personale pe termen lung",
            "Meditație și reflecție",
            "Hobby-uri care necesită răbdare",
        ],
        toAvoid: [
            "Amânarea responsabilităților",
            "Pesimismul și autocritica excesivă",
            "Izolarea socială completă",
            "Rigiditatea și inflexibilitatea",
        ],
    },
} as const;

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ============================================================================
// Main Query
// ============================================================================

/**
 * Get all daily content
 * Used by homepage widgets and individual daily pages
 */
export const getDailyContent = query({
    args: {},
    handler: async () => {
        const todayISO = getTodayBucharest();
        const date = parseBucharestDate(todayISO);
        const dayOfWeek = date.getDay() as DayOfWeek;

        return {
            date: todayISO,
            dailyNumber: {
                number: calculateDailyNumber(todayISO),
            },
            // Index into dream-symbols.json (client picks the actual symbol)
            dailyDreamIndex: getDailyDreamIndex(todayISO, 98),
            energiaZilei: ENERGIA_ZILEI_DATA[dayOfWeek],
            moonPhase: getMoonPhase(date),
        };
    },
});
