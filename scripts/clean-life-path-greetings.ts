/**
 * Script to clean up Life Path interpretations data.
 * Removes the "Bună, suflet drag! " greeting from all fullText fields.
 * 
 * Run with: bun scripts/clean-life-path-greetings.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(import.meta.dir, "../data/interpretations/life-path.json");
const GREETING_TO_REMOVE = "Bună, suflet drag! ";

interface Interpretation {
    title: string;
    description: string;
    fullText: string;
}

type InterpretationsData = Record<string, Interpretation>;

function main() {
    console.log("📖 Reading life-path.json...");
    const rawData = readFileSync(DATA_PATH, "utf-8");
    const data: InterpretationsData = JSON.parse(rawData);

    let modifiedCount = 0;

    for (const [key, interpretation] of Object.entries(data)) {
        if (interpretation.fullText.startsWith(GREETING_TO_REMOVE)) {
            interpretation.fullText = interpretation.fullText.slice(GREETING_TO_REMOVE.length);
            modifiedCount++;
            console.log(`  ✅ Cleaned entry "${key}": ${interpretation.title}`);
        } else {
            console.log(`  ⏭️  Skipped entry "${key}": greeting not found`);
        }
    }

    console.log(`\n📝 Writing updated data...`);
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 4), "utf-8");

    console.log(`\n✨ Done! Modified ${modifiedCount} entries.`);
}

main();
