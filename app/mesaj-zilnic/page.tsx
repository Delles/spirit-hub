import type { Metadata } from "next";
import { getDailyOracle } from "@/lib/oracle";
import { getBucharestDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OracleCard } from "@/components/oracle/oracle-card";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Mesajul Universului | SpiritHub.ro",
    description: "Descoperă mesajul tău zilnic de la Univers. Ghidare, inspirație și claritate pentru ziua ta.",
    openGraph: {
        title: "Mesajul Universului | SpiritHub.ro",
        description: "Descoperă mesajul tău zilnic de la Univers. Ghidare, inspirație și claritate pentru ziua ta.",
        type: "website",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Mesajul Universului - SpiritHub.ro",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mesajul Universului | SpiritHub.ro",
        description: "Descoperă mesajul tău zilnic de la Univers. Ghidare, inspirație și claritate pentru ziua ta.",
        images: ["/og-image.jpg"],
    },
    alternates: {
        canonical: "https://www.spirithub.ro/mesaj-zilnic",
    },
};

export default function OraclePage() {
    const date = getBucharestDate();
    const oracle = getDailyOracle(date);

    // Parse date for display
    const dateStr = date.toLocaleDateString("ro-RO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    return (
        <>
            <BreadcrumbSchema items={[
                { name: "Acasă", url: "https://www.spirithub.ro" },
                { name: "Mesajul Universului" }
            ]} />
            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-4xl space-y-8">
                    {/* Navigation - Matching Energia Zilei */}
                    <div className="flex justify-start">
                        <Link href="/" className="inline-block">
                            <Button
                                variant="ghost"
                                className="gap-2 pl-0 hover:pl-2 transition-all text-white/70 hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Înapoi la Dashboard
                            </Button>
                        </Link>
                    </div>

                    {/* Page Introduction - Matching Energia Zilei */}
                    <div className="space-y-4 text-center">
                        <h1 className="text-3xl font-bold text-white">Mesajul Universului</h1>
                        <p className="text-lg text-[#E0E0E0] leading-relaxed">
                            Ghidare subtilă pentru ziua de {formattedDate}.
                        </p>
                    </div>

                    {/* Main Card */}
                    <OracleCard oracle={oracle} />

                    {/* Return Tomorrow - Matching Energia Zilei */}
                    <div className="text-center py-4">
                        <p className="text-sm text-[#E0E0E0]/60">
                            ✨ Revino mâine pentru un nou mesaj ✨
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}
