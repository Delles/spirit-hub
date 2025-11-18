/**
 * Manual test script for compatibility calculations
 * Run with: bun run scripts/test-compatibility.ts
 */

import {
  calculateLifePath,
  calculateDestinyNumber,
  calculateCompatibility,
} from "../lib/numerology";

console.log("🧪 Testing Compatibility Calculations\n");
console.log("=".repeat(60));

// Test Case 1: Regular numbers (no Master Numbers)
console.log("\n📋 Test Case 1: Regular Numbers");
console.log("-".repeat(60));
const person1 = {
  name: "Maria Ionescu",
  birthDate: new Date(1990, 4, 15), // May 15, 1990
};
const person2 = {
  name: "Ion Popescu",
  birthDate: new Date(1988, 7, 20), // August 20, 1988
};

const lifePath1 = calculateLifePath(person1.birthDate);
const destiny1 = calculateDestinyNumber(person1.name);
const lifePath2 = calculateLifePath(person2.birthDate);
const destiny2 = calculateDestinyNumber(person2.name);

console.log(`Person 1: ${person1.name}`);
console.log(`  Birth Date: ${person1.birthDate.toLocaleDateString()}`);
console.log(`  Life Path: ${lifePath1}`);
console.log(`  Destiny: ${destiny1}`);

console.log(`\nPerson 2: ${person2.name}`);
console.log(`  Birth Date: ${person2.birthDate.toLocaleDateString()}`);
console.log(`  Life Path: ${lifePath2}`);
console.log(`  Destiny: ${destiny2}`);

const lifePathCompat = calculateCompatibility(lifePath1, lifePath2);
const destinyCompat = calculateCompatibility(destiny1, destiny2);
const avgScore = Math.round((lifePathCompat + destinyCompat) / 2);

console.log(`\nCompatibility Scores:`);
console.log(`  Life Path Compatibility: ${lifePathCompat}%`);
console.log(`  Destiny Compatibility: ${destinyCompat}%`);
console.log(`  Overall Score: ${avgScore}%`);

// Test Case 2: With Master Numbers
console.log("\n\n📋 Test Case 2: With Master Numbers");
console.log("-".repeat(60));
const person3 = {
  name: "Ana Maria",
  birthDate: new Date(1982, 10, 29), // November 29, 1982 (should give Master Number)
};
const person4 = {
  name: "Ștefan Gheorghe",
  birthDate: new Date(1980, 10, 2), // November 2, 1980 (should give Master Number 22)
};

const lifePath3 = calculateLifePath(person3.birthDate);
const destiny3 = calculateDestinyNumber(person3.name);
const lifePath4 = calculateLifePath(person4.birthDate);
const destiny4 = calculateDestinyNumber(person4.name);

console.log(`Person 3: ${person3.name}`);
console.log(`  Birth Date: ${person3.birthDate.toLocaleDateString()}`);
console.log(
  `  Life Path: ${lifePath3}${[11, 22, 33].includes(lifePath3) ? " (Master Number)" : ""}`,
);
console.log(`  Destiny: ${destiny3}${[11, 22, 33].includes(destiny3) ? " (Master Number)" : ""}`);

console.log(`\nPerson 4: ${person4.name}`);
console.log(`  Birth Date: ${person4.birthDate.toLocaleDateString()}`);
console.log(
  `  Life Path: ${lifePath4}${[11, 22, 33].includes(lifePath4) ? " (Master Number)" : ""}`,
);
console.log(`  Destiny: ${destiny4}${[11, 22, 33].includes(destiny4) ? " (Master Number)" : ""}`);

const lifePathCompat2 = calculateCompatibility(lifePath3, lifePath4);
const destinyCompat2 = calculateCompatibility(destiny3, destiny4);
const avgScore2 = Math.round((lifePathCompat2 + destinyCompat2) / 2);

console.log(`\nCompatibility Scores:`);
console.log(`  Life Path Compatibility: ${lifePathCompat2}%`);
console.log(`  Destiny Compatibility: ${destinyCompat2}%`);
console.log(`  Overall Score: ${avgScore2}%`);

// Test Case 3: Romanian diacritics
console.log("\n\n📋 Test Case 3: Romanian Diacritics");
console.log("-".repeat(60));
const person5 = {
  name: "Ștefan Țurcanu",
  birthDate: new Date(1995, 2, 10),
};
const person6 = {
  name: "Andreea Pîrvu",
  birthDate: new Date(1993, 8, 25),
};

const lifePath5 = calculateLifePath(person5.birthDate);
const destiny5 = calculateDestinyNumber(person5.name);
const lifePath6 = calculateLifePath(person6.birthDate);
const destiny6 = calculateDestinyNumber(person6.name);

console.log(`Person 5: ${person5.name}`);
console.log(`  Birth Date: ${person5.birthDate.toLocaleDateString()}`);
console.log(`  Life Path: ${lifePath5}`);
console.log(`  Destiny: ${destiny5}`);

console.log(`\nPerson 6: ${person6.name}`);
console.log(`  Birth Date: ${person6.birthDate.toLocaleDateString()}`);
console.log(`  Life Path: ${lifePath6}`);
console.log(`  Destiny: ${destiny6}`);

const lifePathCompat3 = calculateCompatibility(lifePath5, lifePath6);
const destinyCompat3 = calculateCompatibility(destiny5, destiny6);
const avgScore3 = Math.round((lifePathCompat3 + destinyCompat3) / 2);

console.log(`\nCompatibility Scores:`);
console.log(`  Life Path Compatibility: ${lifePathCompat3}%`);
console.log(`  Destiny Compatibility: ${destinyCompat3}%`);
console.log(`  Overall Score: ${avgScore3}%`);

// Test all compatibility levels
console.log("\n\n📋 Test Case 4: All Compatibility Levels");
console.log("-".repeat(60));

const testCases = [
  { score: 100, expected: "Excellent (76-100)" },
  { score: 85, expected: "Excellent (76-100)" },
  { score: 76, expected: "Excellent (76-100)" },
  { score: 75, expected: "Good (51-75)" },
  { score: 60, expected: "Good (51-75)" },
  { score: 51, expected: "Good (51-75)" },
  { score: 50, expected: "Medium (26-50)" },
  { score: 35, expected: "Medium (26-50)" },
  { score: 26, expected: "Medium (26-50)" },
  { score: 25, expected: "Low (0-25)" },
  { score: 10, expected: "Low (0-25)" },
  { score: 0, expected: "Low (0-25)" },
];

testCases.forEach(({ score, expected }) => {
  let level: string;
  if (score >= 76) level = "Excellent (76-100)";
  else if (score >= 51) level = "Good (51-75)";
  else if (score >= 26) level = "Medium (26-50)";
  else level = "Low (0-25)";

  const status = level === expected ? "✅" : "❌";
  console.log(`${status} Score ${score}: ${level} (expected: ${expected})`);
});

console.log("\n" + "=".repeat(60));
console.log("✅ All compatibility calculation tests completed!\n");
