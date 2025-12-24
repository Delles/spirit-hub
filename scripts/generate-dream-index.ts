/**
 * Script to generate a search index for dream symbols.
 * Uses Bun-native I/O for file operations.
 * 
 * Run with: bun scripts/generate-dream-index.ts
 */

import { generateSlug } from '../lib/dreams';

const dreamsPath = new URL("../data/dream-symbols.json", import.meta.url);
const indexPath = new URL("../public/dreams-search-index.json", import.meta.url);

type DreamSymbolsJson = {
    symbols: Array<{
        name: string;
        category?: string;
    }>;
};

try {
    const dreamsData = await Bun.file(dreamsPath).text();
    const dreams = JSON.parse(dreamsData) as DreamSymbolsJson;

    const searchIndex = dreams.symbols.map((dream) => ({
        name: dream.name,
        slug: generateSlug(dream.name),
        category: dream.category || 'dictionar'
    }));

    await Bun.write(indexPath, JSON.stringify(searchIndex, null, 2));
    console.log(`Successfully generated search index with ${searchIndex.length} items.`);
} catch (error) {
    console.error('Error generating index:', error);
    process.exit(1);
}
