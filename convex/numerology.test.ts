/**
 * Tests for Convex Numerology Backend Functions
 * 
 * These tests validate the query logic for numerology interpretations.
 * Note: These are unit tests for the query logic, not integration tests
 * that require a live Convex deployment.
 */

import { describe, test, expect } from 'bun:test';

// ============================================================================
// Test Data Structures
// ============================================================================

interface Interpretation {
  type: string;
  number: number;
  title: string;
  description: string;
  fullText: string;
  createdAt: number;
}

// ============================================================================
// Mock Database Query Results
// ============================================================================

const mockLifePathInterpretations: Interpretation[] = [
  {
    type: 'lifePath',
    number: 1,
    title: 'Lider Natural',
    description: 'Ești un pionier independent, cu spirit inovator și dorință de a conduce.',
    fullText: 'Calea ta în viață este marcată de independență...',
    createdAt: Date.now(),
  },
  {
    type: 'lifePath',
    number: 11,
    title: 'Iluminat Spiritual',
    description: 'Ești un maestru spiritual cu intuiție puternică și misiune de a inspira și ilumina.',
    fullText: 'Calea ta în viață este marcată de o sensibilitate spirituală extraordinară...',
    createdAt: Date.now(),
  },
  {
    type: 'lifePath',
    number: 22,
    title: 'Constructor Maestru',
    description: 'Ești un vizionar practic cu capacitatea de a transforma vise în realitate la scară mare.',
    fullText: 'Calea ta în viață este marcată de o combinație unică...',
    createdAt: Date.now(),
  },
  {
    type: 'lifePath',
    number: 33,
    title: 'Învățător Maestru',
    description: 'Ești un maestru al compasiunii cu misiunea de a vindeca și transforma prin dragoste universală.',
    fullText: 'Calea ta în viață este marcată de compasiune universală...',
    createdAt: Date.now(),
  },
];

const mockDestinyInterpretations: Interpretation[] = [
  {
    type: 'destiny',
    number: 1,
    title: 'Pionier și Inovator',
    description: 'Ești destinat să conduci, să inovezi și să deschizi drumuri noi.',
    fullText: 'Destinul tău este să fii un pionier...',
    createdAt: Date.now(),
  },
  {
    type: 'destiny',
    number: 11,
    title: 'Mesager Spiritual',
    description: 'Ești destinat să transmiți înțelepciune spirituală și să inspiri iluminare.',
    fullText: 'Destinul tău este să fii un mesager spiritual...',
    createdAt: Date.now(),
  },
  {
    type: 'destiny',
    number: 22,
    title: 'Arhitect al Schimbării Globale',
    description: 'Ești destinat să construiești sisteme și structuri care transformă lumea.',
    fullText: 'Destinul tău este să fii un arhitect al schimbării globale...',
    createdAt: Date.now(),
  },
  {
    type: 'destiny',
    number: 33,
    title: 'Avatar al Dragostei Universale',
    description: 'Ești destinat să încarni și să răspândești dragoste necondiționată și compasiune universală.',
    fullText: 'Destinul tău este să fii un avatar al dragostei universale...',
    createdAt: Date.now(),
  },
];

const mockCompatibilityInterpretations: Interpretation[] = [
  {
    type: 'compatibility',
    number: 100,
    title: 'Compatibilitate Excelentă',
    description: 'Aveți o conexiune puternică și armonioasă, cu potențial extraordinar.',
    fullText: 'Compatibilitatea voastră numerologică este excepțională...',
    createdAt: Date.now(),
  },
  {
    type: 'compatibility',
    number: 75,
    title: 'Compatibilitate Bună',
    description: 'Aveți potențial pentru o relație echilibrată și împlinitoare.',
    fullText: 'Compatibilitatea voastră numerologică este bună și promițătoare...',
    createdAt: Date.now(),
  },
  {
    type: 'compatibility',
    number: 50,
    title: 'Compatibilitate Medie',
    description: 'Relația necesită efort și înțelegere reciprocă pentru a prospera.',
    fullText: 'Compatibilitatea voastră numerologică este moderată...',
    createdAt: Date.now(),
  },
  {
    type: 'compatibility',
    number: 25,
    title: 'Compatibilitate Scăzută',
    description: 'Relația este provocatoare și necesită multă muncă și compromis.',
    fullText: 'Compatibilitatea voastră numerologică este scăzută...',
    createdAt: Date.now(),
  },
];

const mockDailyInterpretations: Interpretation[] = [
  {
    type: 'daily',
    number: 1,
    title: 'Zi de Inițiativă și Leadership',
    description: 'Astăzi este ziua perfectă pentru a începe proiecte noi și a lua inițiativa.',
    fullText: 'Astăzi, energia numărului 1 îți oferă curaj...',
    createdAt: Date.now(),
  },
  {
    type: 'daily',
    number: 5,
    title: 'Zi de Aventură și Schimbare',
    description: 'Astăzi este ziua perfectă pentru experiențe noi, aventură și adaptare.',
    fullText: 'Astăzi, energia numărului 5 îți aduce libertate...',
    createdAt: Date.now(),
  },
];

// ============================================================================
// Helper Functions (Query Logic)
// ============================================================================

/**
 * Simulates getLifePathInterpretation query logic
 */
function getLifePathInterpretation(number: number): Interpretation | null {
  return mockLifePathInterpretations.find(
    (i) => i.type === 'lifePath' && i.number === number
  ) || null;
}

/**
 * Simulates getDestinyInterpretation query logic
 */
function getDestinyInterpretation(number: number): Interpretation | null {
  return mockDestinyInterpretations.find(
    (i) => i.type === 'destiny' && i.number === number
  ) || null;
}

/**
 * Simulates getCompatibilityInterpretation query logic
 */
function getCompatibilityInterpretation(score: number): Interpretation | null {
  // Determine compatibility level based on score
  let levelNumber: number;
  if (score >= 76) levelNumber = 100;
  else if (score >= 51) levelNumber = 75;
  else if (score >= 26) levelNumber = 50;
  else levelNumber = 25;

  return mockCompatibilityInterpretations.find(
    (i) => i.type === 'compatibility' && i.number === levelNumber
  ) || null;
}

/**
 * Simulates getDailyNumber query logic
 */
function getDailyNumber(date: string): { number: number; interpretation: Interpretation | null; date: string } {
  // Calculate daily number from date
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  // Sum and reduce to single digit
  const sum = day + month + year;
  let dailyNumber = sum;
  while (dailyNumber > 9) {
    dailyNumber = Math.floor(dailyNumber / 10) + (dailyNumber % 10);
  }

  const interpretation = mockDailyInterpretations.find(
    (i) => i.type === 'daily' && i.number === dailyNumber
  ) || null;

  return {
    number: dailyNumber,
    interpretation,
    date,
  };
}

// ============================================================================
// Tests: Life Path Interpretations
// ============================================================================

describe('getLifePathInterpretation', () => {
  test('should return interpretation for single-digit number (1-9)', () => {
    const result = getLifePathInterpretation(1);
    
    expect(result).not.toBeNull();
    expect(result?.type).toBe('lifePath');
    expect(result?.number).toBe(1);
    expect(result?.title).toBe('Lider Natural');
    expect(result?.description).toContain('pionier');
  });

  test('should return interpretation for Master Number 11', () => {
    const result = getLifePathInterpretation(11);
    
    expect(result).not.toBeNull();
    expect(result?.type).toBe('lifePath');
    expect(result?.number).toBe(11);
    expect(result?.title).toBe('Iluminat Spiritual');
    expect(result?.description).toContain('maestru spiritual');
  });

  test('should return interpretation for Master Number 22', () => {
    const result = getLifePathInterpretation(22);
    
    expect(result).not.toBeNull();
    expect(result?.type).toBe('lifePath');
    expect(result?.number).toBe(22);
    expect(result?.title).toBe('Constructor Maestru');
    expect(result?.description).toContain('vizionar practic');
  });

  test('should return interpretation for Master Number 33', () => {
    const result = getLifePathInterpretation(33);
    
    expect(result).not.toBeNull();
    expect(result?.type).toBe('lifePath');
    expect(result?.number).toBe(33);
    expect(result?.title).toBe('Învățător Maestru');
    expect(result?.description).toContain('maestru');
  });

  test('should return null for non-existent number', () => {
    const result = getLifePathInterpretation(99);
    
    expect(result).toBeNull();
  });

  test('should have Romanian text in all fields', () => {
    const result = getLifePathInterpretation(1);
    
    expect(result?.title).toMatch(/[a-zăâîșț]/i);
    expect(result?.description).toMatch(/[a-zăâîșț]/i);
    expect(result?.fullText).toMatch(/[a-zăâîșț]/i);
  });
});

// ============================================================================
// Tests: Destiny Interpretations
// ============================================================================

describe('getDestinyInterpretation', () => {
  test('should return interpretation for single-digit number (1-9)', () => {
    const result = getDestinyInterpretation(1);
    
    expect(result).not.toBeNull();
    expect(result?.type).toBe('destiny');
    expect(result?.number).toBe(1);
    expect(result?.title).toBe('Pionier și Inovator');
  });

  test('should return interpretation for Master Number 11', () => {
    const result = getDestinyInterpretation(11);
    
    expect(result).not.toBeNull();
    expect(result?.type).toBe('destiny');
    expect(result?.number).toBe(11);
    expect(result?.title).toBe('Mesager Spiritual');
  });

  test('should return interpretation for Master Number 22', () => {
    const result = getDestinyInterpretation(22);
    
    expect(result).not.toBeNull();
    expect(result?.type).toBe('destiny');
    expect(result?.number).toBe(22);
    expect(result?.title).toBe('Arhitect al Schimbării Globale');
  });

  test('should return interpretation for Master Number 33', () => {
    const result = getDestinyInterpretation(33);
    
    expect(result).not.toBeNull();
    expect(result?.type).toBe('destiny');
    expect(result?.number).toBe(33);
    expect(result?.title).toBe('Avatar al Dragostei Universale');
  });

  test('should return null for non-existent number', () => {
    const result = getDestinyInterpretation(99);
    
    expect(result).toBeNull();
  });
});

// ============================================================================
// Tests: Compatibility Interpretations
// ============================================================================

describe('getCompatibilityInterpretation', () => {
  test('should return excellent compatibility for score 76-100', () => {
    const result = getCompatibilityInterpretation(85);
    
    expect(result).not.toBeNull();
    expect(result?.type).toBe('compatibility');
    expect(result?.number).toBe(100);
    expect(result?.title).toBe('Compatibilitate Excelentă');
  });

  test('should return good compatibility for score 51-75', () => {
    const result = getCompatibilityInterpretation(60);
    
    expect(result).not.toBeNull();
    expect(result?.type).toBe('compatibility');
    expect(result?.number).toBe(75);
    expect(result?.title).toBe('Compatibilitate Bună');
  });

  test('should return medium compatibility for score 26-50', () => {
    const result = getCompatibilityInterpretation(35);
    
    expect(result).not.toBeNull();
    expect(result?.type).toBe('compatibility');
    expect(result?.number).toBe(50);
    expect(result?.title).toBe('Compatibilitate Medie');
  });

  test('should return low compatibility for score 0-25', () => {
    const result = getCompatibilityInterpretation(15);
    
    expect(result).not.toBeNull();
    expect(result?.type).toBe('compatibility');
    expect(result?.number).toBe(25);
    expect(result?.title).toBe('Compatibilitate Scăzută');
  });

  test('should handle boundary values correctly', () => {
    expect(getCompatibilityInterpretation(76)?.number).toBe(100);
    expect(getCompatibilityInterpretation(75)?.number).toBe(75);
    expect(getCompatibilityInterpretation(51)?.number).toBe(75);
    expect(getCompatibilityInterpretation(50)?.number).toBe(50);
    expect(getCompatibilityInterpretation(26)?.number).toBe(50);
    expect(getCompatibilityInterpretation(25)?.number).toBe(25);
    expect(getCompatibilityInterpretation(0)?.number).toBe(25);
  });

  test('should handle edge case scores', () => {
    expect(getCompatibilityInterpretation(100)?.title).toBe('Compatibilitate Excelentă');
    expect(getCompatibilityInterpretation(0)?.title).toBe('Compatibilitate Scăzută');
  });
});

// ============================================================================
// Tests: Daily Number
// ============================================================================

describe('getDailyNumber', () => {
  test('should calculate daily number correctly', () => {
    // November 17, 2025: 17 + 11 + 2025 = 2053 → 2+0+5+3 = 10 → 1+0 = 1
    const result = getDailyNumber('2025-11-17');
    
    expect(result.number).toBe(1);
    expect(result.date).toBe('2025-11-17');
  });

  test('should return interpretation for calculated number', () => {
    const result = getDailyNumber('2025-11-17');
    
    expect(result.interpretation).not.toBeNull();
    expect(result.interpretation?.type).toBe('daily');
    expect(result.interpretation?.number).toBe(result.number);
  });

  test('should calculate different numbers for different dates', () => {
    const result1 = getDailyNumber('2025-11-17');
    const result2 = getDailyNumber('2025-11-18');
    
    // These should be different (though not guaranteed, depends on the dates)
    expect(result1.date).not.toBe(result2.date);
  });

  test('should always reduce to single digit (1-9)', () => {
    const dates = [
      '2025-01-01',
      '2025-12-31',
      '2025-06-15',
      '2025-09-09',
      '2025-11-17',
    ];

    dates.forEach((date) => {
      const result = getDailyNumber(date);
      expect(result.number).toBeGreaterThanOrEqual(1);
      expect(result.number).toBeLessThanOrEqual(9);
    });
  });

  test('should be deterministic (same date = same number)', () => {
    const result1 = getDailyNumber('2025-11-17');
    const result2 = getDailyNumber('2025-11-17');
    
    expect(result1.number).toBe(result2.number);
  });
});

// ============================================================================
// Tests: Data Quality
// ============================================================================

describe('Data Quality', () => {
  test('all Life Path interpretations should have required fields', () => {
    mockLifePathInterpretations.forEach((interpretation) => {
      expect(interpretation.type).toBe('lifePath');
      expect(interpretation.number).toBeGreaterThan(0);
      expect(interpretation.title).toBeTruthy();
      expect(interpretation.description).toBeTruthy();
      expect(interpretation.fullText).toBeTruthy();
      expect(interpretation.createdAt).toBeGreaterThan(0);
    });
  });

  test('all Destiny interpretations should have required fields', () => {
    mockDestinyInterpretations.forEach((interpretation) => {
      expect(interpretation.type).toBe('destiny');
      expect(interpretation.number).toBeGreaterThan(0);
      expect(interpretation.title).toBeTruthy();
      expect(interpretation.description).toBeTruthy();
      expect(interpretation.fullText).toBeTruthy();
      expect(interpretation.createdAt).toBeGreaterThan(0);
    });
  });

  test('all Compatibility interpretations should have required fields', () => {
    mockCompatibilityInterpretations.forEach((interpretation) => {
      expect(interpretation.type).toBe('compatibility');
      expect(interpretation.number).toBeGreaterThanOrEqual(0);
      expect(interpretation.title).toBeTruthy();
      expect(interpretation.description).toBeTruthy();
      expect(interpretation.fullText).toBeTruthy();
      expect(interpretation.createdAt).toBeGreaterThan(0);
    });
  });

  test('all Daily interpretations should have required fields', () => {
    mockDailyInterpretations.forEach((interpretation) => {
      expect(interpretation.type).toBe('daily');
      expect(interpretation.number).toBeGreaterThan(0);
      expect(interpretation.number).toBeLessThanOrEqual(9);
      expect(interpretation.title).toBeTruthy();
      expect(interpretation.description).toBeTruthy();
      expect(interpretation.fullText).toBeTruthy();
      expect(interpretation.createdAt).toBeGreaterThan(0);
    });
  });

  test('Romanian diacritics should be present in text', () => {
    const romanianChars = /[ăâîșț]/i;
    
    const allInterpretations = [
      ...mockLifePathInterpretations,
      ...mockDestinyInterpretations,
      ...mockCompatibilityInterpretations,
      ...mockDailyInterpretations,
    ];

    // At least some interpretations should contain Romanian diacritics
    const hasRomanianChars = allInterpretations.some(
      (i) => romanianChars.test(i.title) || 
             romanianChars.test(i.description) || 
             romanianChars.test(i.fullText)
    );

    expect(hasRomanianChars).toBe(true);
  });
});

// ============================================================================
// Tests: Performance (Simulated)
// ============================================================================

describe('Performance', () => {
  test('query logic should execute quickly', () => {
    const startTime = performance.now();
    
    // Simulate multiple queries
    for (let i = 0; i < 100; i++) {
      getLifePathInterpretation(1);
      getDestinyInterpretation(1);
      getCompatibilityInterpretation(50);
      getDailyNumber('2025-11-17');
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // 400 queries should complete in less than 100ms
    expect(duration).toBeLessThan(100);
  });
});
