import fs from 'fs';
import path from 'path';
import { generateSlug } from '../lib/dreams';

const dreamsPath = path.join(process.cwd(), 'data', 'dream-symbols.json');
const indexPath = path.join(process.cwd(), 'public', 'dreams-search-index.json');

type DreamSymbolsJson = {
    symbols: Array<{
        name: string;
        category?: string;
    }>;
};

try {
    const dreamsData = fs.readFileSync(dreamsPath, 'utf-8');
    const dreams = JSON.parse(dreamsData) as DreamSymbolsJson;

    const searchIndex = dreams.symbols.map((dream) => ({
        name: dream.name,
        slug: generateSlug(dream.name),
        category: dream.category || 'dictionar'
    }));

    fs.writeFileSync(indexPath, JSON.stringify(searchIndex, null, 2));
    console.log(`Successfully generated search index with ${searchIndex.length} items.`);
} catch (error) {
    console.error('Error generating index:', error);
    process.exit(1);
}
