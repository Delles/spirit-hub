import Link from "next/link";
import { LucideIcon, Calculator, Hash, Activity, Moon, MessageCircle, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RelatedTool {
    href: string;
    icon: LucideIcon;
    title: string;
    description: string;
}

interface RelatedToolsProps {
    title?: string;
    tools: RelatedTool[];
    className?: string;
    columns?: 2 | 3;
}

/**
 * Related Tools section for internal linking between pages
 * Improves SEO by creating strong internal link structure
 */
export function RelatedTools({
    title = "Explorează mai mult",
    tools,
    className,
    columns = 3,
}: RelatedToolsProps) {
    return (
        <section className={cn("w-full", className)}>
            <h2 className="text-xl font-semibold text-white mb-4 text-center">{title}</h2>
            <div className={cn(
                "grid gap-4",
                columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
            )}>
                {tools.map((tool) => (
                    <Link key={tool.href} href={tool.href} className="group">
                        <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                                    <tool.icon className="w-5 h-5 text-[#9F2BFF]" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-white text-sm">{tool.title}</h3>
                                    <p className="text-xs text-[#E0E0E0]/70">{tool.description}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}

// Pre-defined tool configurations for common internal linking scenarios
export const NUMEROLOGIE_TOOLS: RelatedTool[] = [
    {
        href: "/numerologie/calea-vietii",
        icon: Calculator,
        title: "Calea Vieții",
        description: "Descoperă-ți numărul din data nașterii",
    },
    {
        href: "/numerologie/nume-destin",
        icon: Hash,
        title: "Numărul Destinului",
        description: "Calculează din numele complet",
    },
    {
        href: "/numerologie/compatibilitate",
        icon: Heart,
        title: "Compatibilitate",
        description: "Verifică armonia între două persoane",
    },
];

export const BIORITM_TOOLS: RelatedTool[] = [
    {
        href: "/bioritm",
        icon: Activity,
        title: "Calculator Bioritm",
        description: "Ciclurile tale energetice",
    },
    {
        href: "/bioritm/energia-zilei",
        icon: Moon,
        title: "Energia Zilei",
        description: "Ghidul cosmic al zilei",
    },
    {
        href: "/mesaj-zilnic",
        icon: MessageCircle,
        title: "Mesajul Universului",
        description: "Inspirație zilnică",
    },
];

export const ALL_TOOLS: RelatedTool[] = [...NUMEROLOGIE_TOOLS, ...BIORITM_TOOLS];
