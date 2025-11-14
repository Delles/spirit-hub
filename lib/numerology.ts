/**
 * Numerology calculation functions for SpiritHub.ro
 * Pure functions for Life Path, Destiny Number, and compatibility calculations
 * Handles Romanian alphabet with diacritics (ă, â, î, ș, ț)
 */

import { numerologyConfig, masterNumbers } from '@/config/numerology';
import {
  ValidationError,
  validateDate,
  validateNumerologyNumber,
  validateName,
} from '@/lib/utils';

/**
 * Reduces a number to a single digit (1-9) or Master Number (11, 22, 33)
 * 
 * Recursively sums digits until reaching a single digit or Master Number.
 * Master Numbers are preserved and not reduced further.
 * 
 * @param num - The number to reduce (must be a positive integer)
 * @returns Single digit (1-9) or Master Number (11, 22, 33)
 * @throws ValidationError if input is not a positive integer
 * 
 * @example
 * reduceToSingleDigit(23) // returns 5 (2+3=5)
 * reduceToSingleDigit(1985) // returns 5 (1+9+8+5=23, 2+3=5)
 * reduceToSingleDigit(29) // returns 11 (2+9=11, preserved as Master Number)
 */
export function reduceToSingleDigit(num: number): number {
  // Validate input
  if (!Number.isInteger(num) || num <= 0) {
    throw new ValidationError('Input must be a positive integer');
  }

  // Base case: single digit (1-9)
  if (num >= 1 && num <= 9) {
    return num;
  }

  // Check if it's a Master Number before reducing
  if (masterNumbers.includes(num as any)) {
    return num;
  }

  // Sum the digits
  let sum = 0;
  let temp = num;
  while (temp > 0) {
    sum += temp % 10;
    temp = Math.floor(temp / 10);
  }

  // Recursively reduce
  return reduceToSingleDigit(sum);
}

/**
 * Maps a Romanian letter to its numerological value (1-9)
 * 
 * Uses the Pythagorean system adapted for Romanian alphabet.
 * Handles both uppercase and lowercase letters, including diacritics (ă, â, î, ș, ț).
 * 
 * @param letter - A single character to map
 * @returns Numerological value (1-9), or 0 for non-letter characters
 * 
 * @example
 * getLetterValue('a') // returns 1
 * getLetterValue('ș') // returns 1
 * getLetterValue('A') // returns 1
 * getLetterValue('5') // returns 0 (not a letter)
 */
export function getLetterValue(letter: string): number {
  // Return the value from the mapping, or 0 if not found
  return numerologyConfig.letterToNumber[letter] || 0;
}

/**
 * Calculates the Life Path number from a birth date
 * 
 * The Life Path number is derived by reducing the day, month, and year components
 * separately (preserving Master Numbers), then summing and reducing the final result.
 * 
 * @param birthDate - The birth date to calculate from
 * @returns Life Path number (1-9 or Master Number 11, 22, 33)
 * @throws ValidationError if birthDate is invalid
 * 
 * @example
 * calculateLifePath(new Date(1985, 10, 14)) // Nov 14, 1985
 * // Day: 14 → 1+4 = 5
 * // Month: 11 → 11 (Master Number, preserved)
 * // Year: 1985 → 1+9+8+5 = 23 → 2+3 = 5
 * // Sum: 5 + 11 + 5 = 21 → 2+1 = 3
 * // returns 3
 * 
 * @example
 * calculateLifePath(new Date(1982, 10, 29)) // Nov 29, 1982
 * // Day: 29 → 2+9 = 11 (Master Number)
 * // Month: 11 → 11 (Master Number)
 * // Year: 1982 → 1+9+8+2 = 20 → 2+0 = 2
 * // Sum: 11 + 11 + 2 = 24 → 2+4 = 6
 * // returns 6
 */
export function calculateLifePath(birthDate: Date): number {
  // Validate input
  validateDate(birthDate, 'birthDate');

  // Extract day, month, year
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1; // JavaScript months are 0-indexed
  const year = birthDate.getFullYear();

  // Reduce each component separately (preserving Master Numbers)
  const reducedDay = reduceToSingleDigit(day);
  const reducedMonth = reduceToSingleDigit(month);
  const reducedYear = reduceToSingleDigit(year);

  // Sum the reduced components and reduce the final result
  const sum = reducedDay + reducedMonth + reducedYear;
  return reduceToSingleDigit(sum);
}

/**
 * Calculates the Destiny Number from a person's full name
 * 
 * Maps each letter in the name to its numerological value using the Romanian alphabet,
 * sums all values, and reduces to a single digit or Master Number.
 * Handles Romanian diacritics (ă, â, î, ș, ț) correctly.
 * 
 * @param name - The full name to calculate from
 * @returns Destiny number (1-9 or Master Number 11, 22, 33)
 * @throws ValidationError if name is empty
 * 
 * @example
 * calculateDestinyNumber('Ion Popescu')
 * // I=9, o=6, n=5, P=7, o=6, p=7, e=5, s=1, c=3, u=3
 * // Sum: 9+6+5+7+6+7+5+1+3+3 = 52 → 5+2 = 7
 * // returns 7
 * 
 * @example
 * calculateDestinyNumber('Ștefan')
 * // Ș=1, t=2, e=5, f=6, a=1, n=5
 * // Sum: 1+2+5+6+1+5 = 20 → 2+0 = 2
 * // returns 2
 */
export function calculateDestinyNumber(name: string): number {
  // Validate input
  validateName(name);

  // Normalize: trim whitespace (keep original case for letter mapping)
  const normalizedName = name.trim();

  // Map each letter to its numerological value and sum
  let sum = 0;
  for (const char of normalizedName) {
    const value = getLetterValue(char);
    sum += value;
  }

  // Reduce to single digit or Master Number
  return reduceToSingleDigit(sum);
}

/**
 * Calculates compatibility score between two numerology numbers
 * 
 * Uses numerological harmony principles to determine compatibility:
 * - Same number: 100% (perfect harmony)
 * - Master Numbers have special compatibility rules
 * - Complementary numbers: 80-90%
 * - Neutral combinations: 50-70%
 * - Challenging combinations: 20-40%
 * 
 * @param num1 - First numerology number (1-9 or 11, 22, 33)
 * @param num2 - Second numerology number (1-9 or 11, 22, 33)
 * @returns Compatibility score between 0 and 100
 * @throws ValidationError if either number is invalid
 * 
 * @example
 * calculateCompatibility(1, 1) // returns 100 (same number)
 * calculateCompatibility(1, 2) // returns 85 (complementary)
 * calculateCompatibility(11, 22) // returns 90 (Master Numbers harmony)
 */
export function calculateCompatibility(num1: number, num2: number): number {
  // Validate inputs
  validateNumerologyNumber(num1);
  validateNumerologyNumber(num2);

  // Same number: perfect harmony
  if (num1 === num2) {
    return 100;
  }

  // Master Numbers compatibility
  const isMaster1 = masterNumbers.includes(num1 as any);
  const isMaster2 = masterNumbers.includes(num2 as any);

  // Both are Master Numbers: high compatibility
  if (isMaster1 && isMaster2) {
    return 90;
  }

  // One Master Number with its root number (11→2, 22→4, 33→6)
  // Helper to get root number of Master Numbers
  const getRootNumber = (n: number): number => {
    if (n === 11) return 2;
    if (n === 22) return 4;
    if (n === 33) return 6;
    return n;
  };

  if (isMaster1 && num2 === getRootNumber(num1)) {
    return 95;
  }
  if (isMaster2 && num1 === getRootNumber(num2)) {
    return 95;
  }

  // Complementary pairs (high compatibility)
  const complementaryPairs = [
    [1, 2], [1, 5], [1, 7],
    [2, 4], [2, 6], [2, 8],
    [3, 6], [3, 9],
    [4, 8],
    [5, 7],
  ];

  for (const [a, b] of complementaryPairs) {
    if ((num1 === a && num2 === b) || (num1 === b && num2 === a)) {
      return 85;
    }
  }

  // Neutral pairs (moderate compatibility)
  const neutralPairs = [
    [1, 3], [1, 4], [1, 6], [1, 9],
    [2, 3], [2, 5], [2, 7], [2, 9],
    [3, 4], [3, 5], [3, 7], [3, 8],
    [4, 5], [4, 6], [4, 7], [4, 9],
    [5, 6], [5, 8], [5, 9],
    [6, 7], [6, 8], [6, 9],
    [7, 8], [7, 9],
    [8, 9],
  ];

  for (const [a, b] of neutralPairs) {
    if ((num1 === a && num2 === b) || (num1 === b && num2 === a)) {
      return 60;
    }
  }

  // Challenging pairs (lower compatibility)
  const challengingPairs = [
    [1, 8],
    [4, 3],
  ];

  for (const [a, b] of challengingPairs) {
    if ((num1 === a && num2 === b) || (num1 === b && num2 === a)) {
      return 30;
    }
  }

  // Default: moderate compatibility
  return 55;
}
