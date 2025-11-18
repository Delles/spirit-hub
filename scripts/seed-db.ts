/**
 * Database Seeding Script
 *
 * This script seeds the Convex database with dream symbols.
 *
 * Usage:
 * 1. Ensure Convex dev server is running: bun run dev
 * 2. In another terminal, run: bun run scripts/seed-db.ts
 */

import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dreamSymbolsData from "../data/dream-symbols.json";

const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

async function seedDatabase() {
  console.log("🌙 Starting database seeding...\n");

  try {
    const symbols = dreamSymbolsData.symbols;
    console.log(`📊 Seeding ${symbols.length} dream symbols...\n`);

    // Call the seedDreamSymbols mutation
    const result = await client.mutation(api.dreams.seedDreamSymbols, {
      symbols: symbols,
    });

    console.log("✅ Seeding completed!");
    console.log(`   Inserted: ${result.inserted}`);
    console.log(`   Skipped: ${result.skipped}`);
    console.log(`   Total: ${result.total}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
