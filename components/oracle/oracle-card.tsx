import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OracleMessage } from "@/lib/oracle";
import { Quote, Zap } from "lucide-react";
import { Markdown } from "@/components/shared/markdown";
import { ShareButton } from "@/components/shared/share-button";
// Import icon map from widget or duplicate/move common utility later
// For now, fast iteration: reimplement icon logic or pass from parent
// Actually, let's keep it simple and just use the icon name passed in theme or a generic one if not needed
// The previous page.tsx used simple logic, let's replicate the structure of EnergiaZileiCard

interface OracleCardProps {
    oracle: OracleMessage;
    className?: string;
}

export function OracleCard({ oracle, className }: OracleCardProps) {
    return (
        <div className={cn("w-full space-y-6", className)} role="article" aria-label="Mesajul Universului">
            {/* Main Container with Glassmorphism */}
            <Card className="w-full overflow-hidden bg-black/40 backdrop-blur-xl ring-1 ring-white/5 shadow-2xl">

                {/* 1. HERO SECTION */}
                <div className="relative overflow-hidden p-8 pt-10 text-white">
                    {/* Subtle gradient overlay */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-20",
                        oracle.theme.primary
                    )} />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-4">
                            Mesajul Universului
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80">
                            {oracle.title}
                        </h1>

                        {/* Insight */}
                        <div className="prose prose-invert prose-p:text-lg prose-p:leading-relaxed text-white/90 max-w-md mx-auto">
                            <Markdown>{oracle.insight}</Markdown>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-8 relative z-20 space-y-8">

                    {/* 2. ACTION CARD */}
                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-6 backdrop-blur-sm relative overflow-hidden group hover:bg-emerald-500/10 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap className="w-24 h-24 text-emerald-500" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3 text-emerald-400">
                                <Zap className="w-5 h-5" />
                                <span className="font-bold uppercase tracking-wider text-sm">Acțiunea Zilei</span>
                            </div>
                            <p className="text-lg text-emerald-100/90 font-medium">
                                {oracle.action}
                            </p>
                        </div>
                    </div>

                    {/* 3. MANTRA (with Share) */}
                    <div className="mt-8 mb-4 text-center">
                        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden">
                            {/* Top accent line */}
                            <div className={cn(
                                "absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50",
                                oracle.theme.primary
                            )} />

                            <Quote className="w-8 h-8 text-white/10 mx-auto mb-4" />
                            <p className="font-serif text-2xl italic text-white/95 mb-6 relative z-10 leading-relaxed">
                                &ldquo;{oracle.mantra}&rdquo;
                            </p>

                            <div className="relative z-10 flex justify-center">
                                <ShareButton
                                    contentType="mesaj-zilnic"
                                    contentId={oracle.id}
                                    url={typeof window !== "undefined" ? window.location.href : ""}
                                    title="Mesajul Universului pentru mine"
                                    text={`"${oracle.mantra}" - Mesajul meu de azi pe SpiritHub`}
                                    label="Deschide inima și dă mai departe"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </Card>
        </div>
    );
}
