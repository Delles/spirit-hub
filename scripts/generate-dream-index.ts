
import fs from 'fs';
import path from 'path';

const dreamsPath = path.join(process.cwd(), 'data', 'dream-symbols.json');
const indexPath = path.join(process.cwd(), 'data', 'dreams-search-index.json');

try {
    const dreamsData = fs.readFileSync(dreamsPath, 'utf-8');
    const dreams = JSON.parse(dreamsData);

    const searchIndex = dreams.symbols.map((dream: any) => ({
        name: dream.name,
        slug: dream.slug,
        category: dream.category || 'dictionar'
    }));

    fs.writeFileSync(indexPath, JSON.stringify(searchIndex, null, 2));
    console.log(`Successfully generated search index with ${searchIndex.length} items.`);
} catch (error) {
    console.error('Error generating index:', error);
    process.exit(1);
}
