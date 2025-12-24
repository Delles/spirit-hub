import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/shared/share-button";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import {
    Flame,
    HeartHandshake,
    Sparkles,
    ShieldCheck,
    Wind,
    Heart,
    Search,
    Gem,
    Globe,
    Zap,
    Pyramid,
    Sun,
    CheckCircle2,
    AlertTriangle,
    Quote,
    LucideIcon,
    Crown,
    Handshake,
    Hammer,
    Moon
} from "lucide-react";
import type { DailyInterpretation } from "@/lib/interpretations";

export interface DailyCardProps {
    number: number;
    interpretation: DailyInterpretation;
    date: string;
}

const iconMap: Record<string, LucideIcon> = {
    Flame,
    HeartHandshake,
    Sparkles,
    ShieldCheck,
    Wind,
    Heart,
    Search,
    Gem,
    Globe,
    Zap,
    Pyramid,
    Sun,
    Crown,
    Handshake,
    Hammer,
    Moon
};

// Memoized markdown components - defined outside component to avoid re-creation
const MARKDOWN_COMPONENTS: Components = {
    p: ({ children }) => (
        <p className="text-slate-300 leading-relaxed mb-4 last:mb-0">{children}</p>
    ),
    strong: ({ children }) => (
        <strong className="text-white font-semibold">{children}</strong>
    ),
    em: ({ children }) => (
        <em className="italic">{children}</em>
    ),
};

export function DailyCard({ number, interpretation, date }: DailyCardProps) {
    const IconComponent = iconMap[interpretation.hero.icon] || Sparkles;

    return (
        <div className="w-full space-y-6">
            {/* Main Container with Glassmorphism */}
            <Card className="w-full overflow-hidden border-0 bg-black/40 backdrop-blur-xl border-white/10 ring-1 ring-white/5 shadow-2xl">

                {/* 1. HERO SECTION - Toned Down & Glassy */}
                <div className="relative overflow-hidden p-8 pt-10 text-white">
                    {/* Subtle gradient background instead of solid block */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${interpretation.theme.primary} opacity-20`} />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        {/* Icon Box - Smaller & Glassy */}
                        <div className={`p-3 rounded-2xl mb-5 shadow-lg ring-1 ring-white/20 bg-gradient-to-br ${interpretation.theme.primary} bg-opacity-20 backdrop-blur-md`}>
                            <IconComponent size={32} className="text-white drop-shadow-md" />
                        </div>

                        {/* Subtitle - More subtle */}
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase opacity-70 mb-2">
                            {interpretation.hero.subtitle}
                        </h2>

                        {/* Title - Clean & Elegant */}
                        <h1 className="text-4xl font-bold mb-3 font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 drop-shadow-sm">
                            {interpretation.hero.title}
                        </h1>

                        {/* Date Display */}
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 backdrop-blur-sm">
                                pentru <span className="font-semibold text-white">{date}</span>
                            </span>
                        </div>

                        {/* Headline - Lighter touch */}
                        <p className="text-base font-medium text-white/80 italic max-w-lg mx-auto leading-relaxed opacity-90">
                            &ldquo;{interpretation.hero.headline}&rdquo;
                        </p>
                    </div>
                </div>

                <div className="px-6 pb-8 relative z-20 space-y-8">
                    {/* 2. TAGS - Minimalist Pills */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {interpretation.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-white/5 hover:bg-white/10 text-white/80 border-white/10 px-3 py-1 text-xs backdrop-blur-sm transition-all"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* 3. MAIN INSIGHT */}
                    <div className="space-y-4">
                        <div className="prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white prose-strong:font-semibold max-w-none text-center sm:text-left">
                            <ReactMarkdown components={MARKDOWN_COMPONENTS}>
                                {interpretation.content.main_text}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* 4. TACTICAL GRID - Glass Cards */}
                    <div className="grid gap-4 sm:gap-6">
                        {/* Power Up Card */}
                        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-5 backdrop-blur-sm">
                            <h3 className="font-semibold text-emerald-400 flex items-center gap-2 mb-4 text-base">
                                <CheckCircle2 className="w-4 h-4" /> Activează-ți Puterea
                            </h3>
                            <ul className="space-y-3">
                                {interpretation.content.dos.map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-slate-300 items-start">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500/60 mt-2 shrink-0" />
                                        <span className="leading-relaxed opacity-90">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Warning Card */}
                        <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-5 backdrop-blur-sm">
                            <h3 className="font-semibold text-amber-400 flex items-center gap-2 mb-4 text-base">
                                <AlertTriangle className="w-4 h-4" /> Capcane de Evitat
                            </h3>
                            <ul className="space-y-3">
                                {interpretation.content.donts.map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-slate-300 items-start">
                                        <div className="w-1 h-1 rounded-full bg-amber-500/60 mt-2 shrink-0" />
                                        <span className="leading-relaxed opacity-90">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Master Note */}
                        {interpretation.content.master_note && (
                            <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-5 backdrop-blur-sm">
                                <p className="text-sm text-indigo-300 leading-relaxed italic">
                                    <span className="font-bold not-italic mr-1">🌌 Notă Maestru:</span>
                                    {interpretation.content.master_note}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 5. MANTRA - The "Shareable" */}
                    <div className="mt-8 mb-4 text-center">
                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 ring-1 ring-white/5 overflow-hidden group">
                            <Quote className="w-6 h-6 text-white/20 mx-auto mb-4" />

                            <p className="relative z-10 font-serif text-lg italic leading-relaxed text-white/90 drop-shadow-md">
                                &ldquo;{interpretation.mantra}&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Footer Share Button */}
                    <div className="pt-4 border-t border-white/5 flex justify-center">
                        <ShareButton
                            url={typeof window !== "undefined" ? window.location.href : ""}
                            title={`Numărul Zilei ${date} este ${number} - ${interpretation.hero.title}`}
                            text={`Azi este o zi ${number}: ${interpretation.hero.title}. "${interpretation.hero.headline}" Descoperă numărul zilei tale pe SpiritHub.ro`}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
