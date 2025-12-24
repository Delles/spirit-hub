/**
 * Script to clean up Life Path interpretations data.
 * Originally removed "Bună, suflet drag! " greeting from fullText fields.
 * Now works with the updated schema using content.main_text.
 * Uses Bun-native I/O for file operations.
 * 
 * Run with: bun scripts/clean-life-path-greetings.ts
 */

const DATA_PATH = new URL("../data/interpretations/life-path.json", import.meta.url);
const GREETING_TO_REMOVE = "Bună, suflet drag! ";

interface InterpretationContent {
    main_text: string;
    dos: string[];
    donts: string[];
    master_note?: string;
}

interface Interpretation {
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
    content: InterpretationContent;
    mantra: string;
}

type InterpretationsData = Record<string, Interpretation>;

async function main() {
    console.log("📖 Reading life-path.json...");
    const rawData = await Bun.file(DATA_PATH).text();
    const data: InterpretationsData = JSON.parse(rawData);

    let modifiedCount = 0;

    for (const [key, interpretation] of Object.entries(data)) {
        if (interpretation.content.main_text.startsWith(GREETING_TO_REMOVE)) {
            interpretation.content.main_text = interpretation.content.main_text.slice(GREETING_TO_REMOVE.length);
            modifiedCount++;
            console.log(`  ✅ Cleaned entry "${key}": ${interpretation.hero.title}`);
        } else {
            console.log(`  ⏭️  Skipped entry "${key}": greeting not found`);
        }
    }

    if (modifiedCount > 0) {
        console.log(`\n📝 Writing updated data...`);
        await Bun.write(DATA_PATH, JSON.stringify(data, null, 4));
    }

    console.log(`\n✨ Done! Modified ${modifiedCount} entries.`);
}

await main();
