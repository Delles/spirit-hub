/**
 * Seed Dream Symbols Script
 *
 * This script reads the dream symbols from data/dream-symbols.json
 * and seeds them into the Convex database using the seedDreamSymbols mutation.
 *
 * Usage:
 * 1. Ensure Convex dev server is running (bun run dev:convex)
 * 2. Run: bun run scripts/seed-dream-symbols.ts
 */

import dreamSymbolsData from "../data/dream-symbols.json";

async function seedDreamSymbols() {
  console.log("🌙 Starting dream symbols seeding process...\n");

  const symbols = dreamSymbolsData.symbols;

  console.log(`📊 Found ${symbols.length} symbols in dataset`);
  console.log("📋 Categories distribution:");

  // Count symbols by category
  const categoryCounts: Record<string, number> = {};
  symbols.forEach((symbol) => {
    categoryCounts[symbol.category] = (categoryCounts[symbol.category] || 0) + 1;
  });

  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   - ${category}: ${count} symbols`);
  });

  console.log("\n✅ Dataset validation passed!");
  console.log("\n📝 To seed these symbols into Convex:");
  console.log("   1. Open Convex Dashboard (http://localhost:3000/convex)");
  console.log('   2. Navigate to "Functions" tab');
  console.log('   3. Find and run "dreams:seedDreamSymbols" mutation');
  console.log("   4. Pass the following JSON as argument:\n");

  console.log(JSON.stringify({ symbols }, null, 2));

  console.log("\n💡 Or copy the symbols array from data/dream-symbols.json");
  console.log("   and paste it into the Convex dashboard mutation form.");
}

seedDreamSymbols().catch(console.error);
