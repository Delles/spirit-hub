import { Metadata } from "next";
import DreamSymbolClient from "./client";

type Props = {
    params: Promise<{ slug: string }>;
};

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const dream = await convex.query(api.dreams.getDreamSymbolBySlug, { slug });

    if (!dream) {
        return {
            title: "Pagina nu a fost găsită - SpiritHub.ro",
            description: "Interpretarea visului căutat nu a fost găsită.",
            robots: { index: false },
        };
    }

    return {
        title: `Interpretare vis: ${dream.name} | SpiritHub.ro`,
        description: dream.shortDescription || `Descoperă semnificația visului despre ${dream.name} și mesajele subconștientului tău pe SpiritHub.ro.`,
        alternates: {
            canonical: `https://spirithub.ro/vise/${slug}`,
        },
        openGraph: {
            title: `Ce înseamnă când visezi ${dream.name}?`,
            description: dream.shortDescription || `Citește interpretarea completă a visului despre ${dream.name} în dicționarul nostru de vise.`,
        },
    };
}

export default async function DreamSymbolPage({ params }: Props) {
    const { slug } = await params;
    return <DreamSymbolClient slug={slug} />;
}
