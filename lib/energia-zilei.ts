/**
 * Energia Zilei (Energy of the Day) - SpiritHub.ro
 *
 * Universal daily energy guidance based on planetary day tradition.
 * Each day of the week is associated with a celestial body that influences
 * the day's energy, themes, and optimal activities.
 *
 * This is universal content (same for all users) - no birth date required.
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Dominant energy type for the day
 */
export type DominantEnergy = "Fizic" | "Emoțional" | "Intelectual" | "Spiritual" | "Social" | "Creativ";

/**
 * Complete energy data for a single day
 */
export interface EnergiaZileiData {
  /** Day name in Romanian */
  dayName: string;
  /** Associated planet name */
  planet: string;
  /** Planet symbol/emoji */
  planetSymbol: string;
  /** Main theme for the day */
  theme: string;
  /** Primary energy type */
  dominantEnergy: DominantEnergy;
  /** Energy level percentage (0-100) */
  energyLevel: number;
  /** Accent color for UI */
  color: string;
  /** 2-3 sentence description of the day's energy */
  description: string;
  /** Short hint for widget display */
  shortHint: string;
  /** Practical tips for the day */
  tips: string[];
  /** Activities to embrace */
  toEmbrace: string[];
  /** Activities to avoid */
  toAvoid: string[];
}

// ============================================================================
// Planetary Day Content
// ============================================================================

/**
 * Complete content for all 7 days of the week
 * Based on traditional planetary day associations
 */
const PLANETARY_DAYS: Record<number, EnergiaZileiData> = {
  // Sunday (0) - Sun
  0: {
    dayName: "Duminică",
    planet: "Soarele",
    planetSymbol: "☉",
    theme: "Vitalitate & Regenerare",
    dominantEnergy: "Spiritual",
    energyLevel: 85,
    color: "#FBBF24", // warm gold
    description:
      "Duminica este guvernată de Soare, simbolul vitalității și conștiinței de sine. Este o zi pentru regenerare, reflecție și reconectare cu esența ta interioară. Energia solară favorizează claritatea mentală și bucuria simplă a existenței.",
    shortHint: "Zi perfectă pentru regenerare și reconectare cu sinele interior.",
    tips: [
      "Începe ziua cu un moment de recunoștință",
      "Petrece timp în natură sau la lumina soarelui",
      "Reflectează asupra săptămânii trecute",
      "Planifică intențiile pentru săptămâna viitoare",
    ],
    toEmbrace: [
      "Odihnă activă și relaxare",
      "Timp de calitate cu familia",
      "Activități creative și jucăușe",
      "Meditație și introspecție",
    ],
    toAvoid: [
      "Muncă intensă sau stresantă",
      "Decizii majore de afaceri",
      "Conflicte și discuții aprinse",
      "Suprasolicitare fizică",
    ],
  },

  // Monday (1) - Moon
  1: {
    dayName: "Luni",
    planet: "Luna",
    planetSymbol: "☽",
    theme: "Emoții & Intuiție",
    dominantEnergy: "Emoțional",
    energyLevel: 72,
    color: "#A5B4FC", // soft lavender
    description:
      "Lunea este guvernată de Lună, astrul emoțiilor și intuiției. Este o zi pentru introspecție, sensibilitate crescută și atenție la nevoile emoționale. Energia lunară favorizează creativitatea și conexiunea cu subconștientul.",
    shortHint: "Ascultă-ți intuiția și acordă atenție nevoilor emoționale.",
    tips: [
      "Acordă-ți timp pentru tranziția din weekend",
      "Ascultă-ți intuiția în deciziile zilei",
      "Notează-ți visele din noaptea precedentă",
      "Fii blând cu tine și cu ceilalți",
    ],
    toEmbrace: [
      "Activități creative și artistice",
      "Conversații sincere și profunde",
      "Îngrijire personală și self-care",
      "Planificare și organizare",
    ],
    toAvoid: [
      "Decizii impulsive importante",
      "Confruntări emoționale",
      "Ignorarea semnalelor corpului",
      "Supraîncărcarea programului",
    ],
  },

  // Tuesday (2) - Mars
  2: {
    dayName: "Marți",
    planet: "Marte",
    planetSymbol: "♂",
    theme: "Acțiune & Energie",
    dominantEnergy: "Fizic",
    energyLevel: 92,
    color: "#F87171", // energetic red
    description:
      "Marțea este guvernată de Marte, planeta acțiunii și curajului. Este ziua ideală pentru inițiative curajoase, efort fizic și depășirea obstacolelor. Energia marțiană oferă determinare și putere de a face lucrurile să se întâmple.",
    shortHint: "Energie maximă pentru acțiune și depășirea provocărilor.",
    tips: [
      "Abordează sarcinile dificile de dimineață",
      "Fă exerciții fizice pentru a canaliza energia",
      "Ia decizii rapide și acționează",
      "Stabilește limite clare acolo unde e nevoie",
    ],
    toEmbrace: [
      "Sport și activitate fizică intensă",
      "Proiecte care necesită curaj",
      "Negocieri și competiții",
      "Rezolvarea problemelor amânate",
    ],
    toAvoid: [
      "Agresivitate și impulsivitate",
      "Conflicte inutile",
      "Riscuri nesăbuite",
      "Decizii luate din furie",
    ],
  },

  // Wednesday (3) - Mercury
  3: {
    dayName: "Miercuri",
    planet: "Mercur",
    planetSymbol: "☿",
    theme: "Comunicare & Învățare",
    dominantEnergy: "Intelectual",
    energyLevel: 88,
    color: "#60A5FA", // clear blue
    description:
      "Miercurea este guvernată de Mercur, planeta comunicării și intelectului. Este ziua perfectă pentru studiu, scriere, negocieri și schimburi de idei. Energia mercuriană stimulează gândirea rapidă și adaptabilitatea.",
    shortHint: "Zi ideală pentru comunicare, studiu și schimb de idei.",
    tips: [
      "Programează întâlniri și apeluri importante",
      "Scrie emailuri, propuneri sau articole",
      "Învață ceva nou sau citește",
      "Fii deschis la perspective diferite",
    ],
    toEmbrace: [
      "Studiu și cercetare",
      "Scriere și documentare",
      "Networking și socializare profesională",
      "Planificare și organizare",
    ],
    toAvoid: [
      "Semnarea contractelor fără a citi cu atenție",
      "Bârfa și comunicarea superficială",
      "Supraîncărcarea cu informații",
      "Multitasking excesiv",
    ],
  },

  // Thursday (4) - Jupiter
  4: {
    dayName: "Joi",
    planet: "Jupiter",
    planetSymbol: "♃",
    theme: "Expansiune & Oportunități",
    dominantEnergy: "Spiritual",
    energyLevel: 90,
    color: "#A78BFA", // royal purple
    description:
      "Joia este guvernată de Jupiter, planeta abundenței și înțelepciunii. Este o zi favorabilă pentru viziune de ansamblu, dezvoltare personală și atragerea oportunităților. Energia jupiteriană aduce optimism și încredere în viitor.",
    shortHint: "Gândește în perspectivă și fii deschis la oportunități.",
    tips: [
      "Gândește la imaginea de ansamblu",
      "Fă planuri pe termen lung",
      "Fii generos cu timpul și resursele tale",
      "Explorează noi orizonturi și posibilități",
    ],
    toEmbrace: [
      "Planificare strategică",
      "Studii și dezvoltare personală",
      "Activități filantropice",
      "Călătorii și explorare",
    ],
    toAvoid: [
      "Excesele de orice fel",
      "Promisiuni pe care nu le poți ține",
      "Risipa de resurse",
      "Arganța și superioritatea",
    ],
  },

  // Friday (5) - Venus
  5: {
    dayName: "Vineri",
    planet: "Venus",
    planetSymbol: "♀",
    theme: "Armonie & Frumusețe",
    dominantEnergy: "Social",
    energyLevel: 85,
    color: "#F472B6", // soft pink
    description:
      "Vinerea este guvernată de Venus, planeta iubirii și armoniei. Este ziua ideală pentru relații, artă, frumusețe și plăceri rafinate. Energia venusiană favorizează diplomația, romantismul și aprecierea frumosului.",
    shortHint: "Zi perfectă pentru relații, artă și aprecierea frumosului.",
    tips: [
      "Cultivă relațiile importante din viața ta",
      "Înconjoară-te de frumusețe și armonie",
      "Exprimă-ți afecțiunea și recunoștința",
      "Răsfață-te cu ceva plăcut",
    ],
    toEmbrace: [
      "Întâlniri romantice",
      "Activități artistice și culturale",
      "Shopping și îngrijire personală",
      "Socializare și evenimente",
    ],
    toAvoid: [
      "Conflicte și confruntări",
      "Gelozia și posesivitatea",
      "Cheltuieli impulsive excesive",
      "Superficialitatea în relații",
    ],
  },

  // Saturday (6) - Saturn
  6: {
    dayName: "Sâmbătă",
    planet: "Saturn",
    planetSymbol: "♄",
    theme: "Disciplină & Structură",
    dominantEnergy: "Creativ",
    energyLevel: 75,
    color: "#818CF8", // deep indigo
    description:
      "Sâmbăta este guvernată de Saturn, planeta responsabilității și maturității. Este o zi pentru organizare, finalizarea proiectelor și reflecție asupra progresului. Energia saturniană favorizează disciplina și construirea bazelor solide.",
    shortHint: "Finalizează proiectele și organizează-ți viața.",
    tips: [
      "Finalizează sarcinile neterminate",
      "Organizează-ți spațiul și programul",
      "Reflectează asupra lecțiilor învățate",
      "Investește timp în proiecte pe termen lung",
    ],
    toEmbrace: [
      "Curățenie și organizare",
      "Muncă concentrată și disciplinată",
      "Timp petrecut cu bunicii sau mentorii",
      "Hobby-uri care necesită răbdare",
    ],
    toAvoid: [
      "Amânarea responsabilităților",
      "Pesimismul și autocritica excesivă",
      "Izolarea socială completă",
      "Rigiditatea și inflexibilitatea",
    ],
  },
};

// ============================================================================
// Main Function
// ============================================================================

/**
 * Returns the energy data for a given date
 *
 * @param date - The date to get energy for (defaults to current date)
 * @returns EnergiaZileiData with complete daily energy information
 */
export function getEnergiaZilei(date: Date = new Date()): EnergiaZileiData {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  return PLANETARY_DAYS[dayOfWeek];
}

/**
 * Returns just the essential data needed for the widget
 * Lighter weight than full getEnergiaZilei
 */
export function getEnergiaZileiWidget(date: Date = new Date()): {
  dayName: string;
  theme: string;
  shortHint: string;
  energyLevel: number;
  dominantEnergy: DominantEnergy;
  color: string;
  planetSymbol: string;
} {
  const data = getEnergiaZilei(date);
  return {
    dayName: data.dayName,
    theme: data.theme,
    shortHint: data.shortHint,
    energyLevel: data.energyLevel,
    dominantEnergy: data.dominantEnergy,
    color: data.color,
    planetSymbol: data.planetSymbol,
  };
}

