import { JsonLd, generateBreadcrumbJsonLd } from "./json-ld";

interface BreadcrumbItem {
    name: string;
    url?: string;
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[];
}

/**
 * Breadcrumb Schema Component
 * Generates BreadcrumbList JSON-LD for SEO
 * 
 * @example
 * <BreadcrumbSchema items={[
 *   { name: "Acasă", url: "https://www.spirithub.ro" },
 *   { name: "Numerologie", url: "https://www.spirithub.ro/numerologie" },
 *   { name: "Calea Vieții" } // last item has no URL
 * ]} />
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    return <JsonLd data={generateBreadcrumbJsonLd(items)} />;
}
