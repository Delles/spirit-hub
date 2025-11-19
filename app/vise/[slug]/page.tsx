import { Metadata } from "next";
import DreamSymbolClient from "./client";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Simple capitalization for title
    const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

    return {
        title: `Interpretare vis: ${title} | SpiritHub.ro`,
        description: `Descoperă semnificația visului despre ${title} și mesajele subconștientului tău pe SpiritHub.ro.`,
        openGraph: {
            title: `Ce înseamnă când visezi ${title}?`,
            description: `Citește interpretarea completă a visului despre ${title} în dicționarul nostru de vise.`,
        },
    };
}

export default async function DreamSymbolPage({ params }: Props) {
    const { slug } = await params;
    return <DreamSymbolClient slug={slug} />;
}
