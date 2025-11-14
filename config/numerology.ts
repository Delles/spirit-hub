/**
 * Numerology Configuration
 * 
 * This module provides centralized configuration for numerology calculations,
 * including Romanian letter-to-number mappings, interpretation keys, and
 * compatibility ranges.
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface LetterMapping {
  [key: string]: number;
}

export interface NumberInterpretation {
  number: number;
  key: string;
  shortDescription: string;
  isMasterNumber?: boolean;
}

export interface CompatibilityRange {
  min: number;
  max: number;
  level: 'scăzută' | 'medie' | 'bună' | 'excelentă';
  key: string;
}

export interface NumerologyConfig {
  letterToNumber: LetterMapping;
  lifePathNumbers: NumberInterpretation[];
  destinyNumbers: NumberInterpretation[];
  masterNumbers: NumberInterpretation[];
  compatibilityRanges: CompatibilityRange[];
  validNumbers: number[];
  allValidNumbers: number[];
}

// ============================================================================
// Letter to Number Mapping (Pythagorean System)
// ============================================================================

/**
 * Romanian alphabet letter-to-number mapping using the Pythagorean system.
 * 
 * Standard mapping cycles through 1-9:
 * A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9,
 * J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9,
 * S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8
 * 
 * Romanian diacritics are mapped based on their base letter equivalents:
 * Ă, Â → A (1)
 * Î → I (9)
 * Ș → S (1)
 * Ț → T (2)
 */
const letterToNumber: LetterMapping = {
  // Standard alphabet (uppercase)
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
  'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
  
  // Standard alphabet (lowercase)
  'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
  'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
  's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8,
  
  // Romanian diacritics (uppercase)
  'Ă': 1, 'Â': 1, 'Î': 9, 'Ș': 1, 'Ț': 2,
  
  // Romanian diacritics (lowercase)
  'ă': 1, 'â': 1, 'î': 9, 'ș': 1, 'ț': 2,
};

// ============================================================================
// Life Path Number Interpretations
// ============================================================================

const lifePathNumbers: NumberInterpretation[] = [
  {
    number: 1,
    key: 'lider',
    shortDescription: 'Lider natural, independent și inovator'
  },
  {
    number: 2,
    key: 'diplomat',
    shortDescription: 'Diplomat, cooperant și sensibil'
  },
  {
    number: 3,
    key: 'creator',
    shortDescription: 'Creator, expresiv și optimist'
  },
  {
    number: 4,
    key: 'constructor',
    shortDescription: 'Constructor, practic și disciplinat'
  },
  {
    number: 5,
    key: 'aventurier',
    shortDescription: 'Aventurier, liber și adaptabil'
  },
  {
    number: 6,
    key: 'protector',
    shortDescription: 'Protector, responsabil și armonios'
  },
  {
    number: 7,
    key: 'cautator',
    shortDescription: 'Căutător spiritual, analitic și înțelept'
  },
  {
    number: 8,
    key: 'realizator',
    shortDescription: 'Realizator, ambițios și puternic'
  },
  {
    number: 9,
    key: 'umanitar',
    shortDescription: 'Umanitar, generos și vizionar'
  }
];

// ============================================================================
// Destiny Number Interpretations
// ============================================================================

const destinyNumbers: NumberInterpretation[] = [
  {
    number: 1,
    key: 'pionier',
    shortDescription: 'Destinat să conducă și să inoveze'
  },
  {
    number: 2,
    key: 'mediator',
    shortDescription: 'Destinat să aducă pace și echilibru'
  },
  {
    number: 3,
    key: 'artist',
    shortDescription: 'Destinat să creeze și să inspire'
  },
  {
    number: 4,
    key: 'organizator',
    shortDescription: 'Destinat să construiască și să stabilizeze'
  },
  {
    number: 5,
    key: 'explorator',
    shortDescription: 'Destinat să exploreze și să schimbe'
  },
  {
    number: 6,
    key: 'ingrijitor',
    shortDescription: 'Destinat să îngrijească și să armonizeze'
  },
  {
    number: 7,
    key: 'intelept',
    shortDescription: 'Destinat să înțeleagă și să învețe'
  },
  {
    number: 8,
    key: 'magnat',
    shortDescription: 'Destinat să realizeze și să prospere'
  },
  {
    number: 9,
    key: 'filantrop',
    shortDescription: 'Destinat să servească și să transforme'
  }
];

// ============================================================================
// Master Number Interpretations
// ============================================================================

const masterNumberInterpretations: NumberInterpretation[] = [
  {
    number: 11,
    key: 'iluminat',
    shortDescription: 'Iluminat spiritual, intuitiv și inspirațional',
    isMasterNumber: true
  },
  {
    number: 22,
    key: 'constructor-maestru',
    shortDescription: 'Constructor maestru, vizionar și realizator de mari proiecte',
    isMasterNumber: true
  },
  {
    number: 33,
    key: 'invatator-maestru',
    shortDescription: 'Învățător maestru, compasiune universală și vindecare',
    isMasterNumber: true
  }
];

// ============================================================================
// Compatibility Ranges
// ============================================================================

/**
 * Compatibility score ranges mapping numerical scores (0-100) to
 * qualitative compatibility levels in Romanian.
 */
const compatibilityRanges: CompatibilityRange[] = [
  {
    min: 0,
    max: 25,
    level: 'scăzută',
    key: 'low'
  },
  {
    min: 26,
    max: 50,
    level: 'medie',
    key: 'medium'
  },
  {
    min: 51,
    max: 75,
    level: 'bună',
    key: 'good'
  },
  {
    min: 76,
    max: 100,
    level: 'excelentă',
    key: 'excellent'
  }
];

// ============================================================================
// Valid Numbers
// ============================================================================

/**
 * Array of valid single-digit numerology numbers (1-9).
 * Used for validation and iteration in numerology calculations.
 */
export const validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/**
 * Master Numbers in numerology.
 * These numbers are NOT reduced to single digits during calculations
 * as they carry special spiritual significance.
 */
export const masterNumbers = [11, 22, 33] as const;

/**
 * All valid numerology numbers including master numbers.
 * Used for validation when master numbers are allowed.
 */
export const allValidNumbers = [...validNumbers, ...masterNumbers] as const;

// ============================================================================
// Main Configuration Export
// ============================================================================

export const numerologyConfig: NumerologyConfig = {
  letterToNumber,
  lifePathNumbers,
  destinyNumbers,
  masterNumbers: masterNumberInterpretations,
  compatibilityRanges,
  validNumbers: [...validNumbers],
  allValidNumbers: [...allValidNumbers]
} as const;
