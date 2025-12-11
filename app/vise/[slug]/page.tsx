import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSymbols, getSymbolBySlug, getRelatedSymbols } from "@/lib/dream-data";
import { DreamSymbolContent } from "./client";

type Props = {
    params: Promise<{ slug: string }>;
};

/**
 * Generate static params for all dream symbols
 * This enables SSG for all 98 symbol pages at build time
 */
export async function generateStaticParams() {
    const symbols = getAllSymbols();
    return symbols.map((symbol) => ({
        slug: symbol.slug,
    }));
}

/**
 * Generate metadata for SEO
 * Uses static data, no external backend dependency
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const dream = getSymbolBySlug(slug);

    if (!dream) {
        return {
            title: "Pagina nu a fost găsită - SpiritHub.ro",
            description: "Interpretarea visului căutat nu a fost găsită.",
            robots: { index: false },
        };
    }

    return {
        title: `Interpretare vis: ${dream.name} | SpiritHub.ro`,
        description:
            dream.shortMeaning ||
            `Descoperă semnificația visului despre ${dream.name} și mesajele subconștientului tău pe SpiritHub.ro.`,
        alternates: {
            canonical: `https://spirithub.ro/vise/${slug}`,
        },
        openGraph: {
            title: `Ce înseamnă când visezi ${dream.name}?`,
            description:
                dream.shortMeaning ||
                `Citește interpretarea completă a visului despre ${dream.name} în dicționarul nostru de vise.`,
        },
    };
}

/**
 * Dream Symbol Page
 * Statically generated at build time from JSON data
 */
export default async function DreamSymbolPage({ params }: Props) {
    const { slug } = await params;
    const dream = getSymbolBySlug(slug);

    // Fetch related symbols (random mix of same category + others)
    const relatedDreams = dream ? getRelatedSymbols(dream.slug, 5) : [];

    if (!dream) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `Ce înseamnă când visezi ${dream.name}?`,
        "description": dream.shortMeaning,
        "author": {
            "@type": "Organization",
            "name": "SpiritHub"
        },
        "publisher": {
            "@type": "Organization",
            "name": "SpiritHub",
            "logo": {
                "@type": "ImageObject",
                "url": "https://spirithub.ro/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://spirithub.ro/vise/${slug}`
        },
        "datePublished": "2024-01-01T00:00:00+02:00",
        "dateModified": "2024-12-01T00:00:00+02:00" // Static date for SSG consistency
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <DreamSymbolContent dream={dream} relatedDreams={relatedDreams} />
        </>
    );
}
