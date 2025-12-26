"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User, Hash, Moon, ArrowLeft, Activity } from "lucide-react";
import { BiorhythmForm } from "@/components/bioritm/biorhythm-form";
import { CriticalDaysList } from "@/components/bioritm/critical-days-list";
import { ShareButton } from "@/components/shared/share-button";
import { ErrorMessage } from "@/components/shared/error-message";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CriticalDaysViewProps {
    criticalDays: Array<{
        date: string;
        cycles: ("physical" | "emotional" | "intellectual")[];
    }> | null;
    birthDate: string | null;
}

export default function CriticalDaysView({
    criticalDays,
    birthDate,
}: CriticalDaysViewProps) {
    const router = useRouter();
    const pathname = usePathname();

    const hasSubmitted = !!birthDate;
    const showResults = hasSubmitted && criticalDays !== null;

    const handleSubmit = (birth: string) => {
        // Update URL - server will compute on next render
        const params = new URLSearchParams();
        params.set("date", birth);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleReset = () => {
        router.push(pathname);
    };

    // Build share URL from pathname and birthDate (SSR-safe)
    const shareUrl = birthDate ? `https://spirithub.ro${pathname}?date=${birthDate}` : "";

    return (
        <div className="py-8">
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Show form view when no results yet */}
                {!showResults && (
                    <>
                        {/* Info Section */}
                        <Card className="p-6 space-y-3">
                            <h2 className="text-xl font-semibold text-white">Ce sunt zilele critice?</h2>
                            <p className="text-sm text-[#E0E0E0] leading-relaxed">
                                Zilele critice apar când unul sau mai multe cicluri bioritmice trec prin punctul zero,
                                trecând de la o fază pozitivă la una negativă sau invers. În aceste zile, este recomandat
                                să fii mai atent și să eviți deciziile importante sau activitățile riscante în domeniile
                                afectate.
                            </p>
                        </Card>

                        {/* Form Section */}
                        <Card className="p-6 lg:p-8">
                            <BiorhythmForm
                                onSubmit={(birth) => handleSubmit(birth)}
                                isLoading={false}
                                showTargetDate={false}
                            />
                        </Card>

                        {/* Error State - only if we had a birthDate but computation failed */}
                        {criticalDays === null && hasSubmitted && (
                            <ErrorMessage
                                title="Eroare la căutare"
                                message="Nu am putut identifica zilele critice. Te rugăm să verifici data nașterii și să încerci din nou."
                            />
                        )}
                    </>
                )}

                {/* Results View - only shown after successful calculation */}
                {showResults && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <Link href="/bioritm" className="inline-block">
                            <Button
                                variant="ghost"
                                className="gap-2 pl-0 hover:pl-2 transition-all text-white/70 hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Înapoi la Bioritm
                            </Button>
                        </Link>

                        {/* Critical Days List */}
                        <CriticalDaysList criticalDays={criticalDays} />

                        {/* Share Section */}
                        <Card className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6">
                            <div className="text-center sm:text-left">
                                <h3 className="font-semibold mb-1 text-white">Distribuie rezultatul tău</h3>
                                <p className="text-sm text-[#E0E0E0]">Împărtășește zilele tale critice cu prietenii</p>
                            </div>
                            <ShareButton
                                url={shareUrl}
                                title="Zilele mele critice - SpiritHub.ro"
                                text="Descoperă zilele critice din bioritmul tău pe SpiritHub.ro"
                            />
                        </Card>

                        {/* CTA Section - Explore More */}
                        <Card className="p-6 space-y-6">
                            {/* Calculate for Different Person */}
                            <div className="text-center border-b border-white/10 pb-6">
                                <p className="text-lg font-medium text-[#9F2BFF]">
                                    ✨ Vrei să calculezi pentru altă persoană? ✨
                                </p>
                                <p className="text-sm text-[#E0E0E0] mt-2 mb-4">
                                    Descoperă zilele critice pentru oricine, folosind data nașterii.
                                </p>
                                <Button variant="secondary" onClick={handleReset} className="gap-2">
                                    <User className="w-4 h-4" />
                                    Calculează pentru altă persoană
                                </Button>
                            </div>

                            {/* Explore Other Features */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-white">Explorează Mai Mult</h3>
                                    <p className="text-sm text-[#E0E0E0] mt-1">
                                        Descoperă alte instrumente spirituale pe SpiritHub
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <Link href="/bioritm" className="group">
                                        <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                                            <div className="flex flex-col items-center text-center space-y-3">
                                                <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                                                    <Activity className="w-5 h-5 text-[#9F2BFF]" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-semibold text-white text-sm">Calculator Bioritm</h4>
                                                    <p className="text-xs text-[#E0E0E0]/70">
                                                        Vezi graficul complet al ciclurilor
                                                    </p>
                                                </div>
                                                <span className="text-xs font-medium text-[#9F2BFF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Calculează
                                                    <ArrowLeft className="w-3 h-3 rotate-180" />
                                                </span>
                                            </div>
                                        </Card>
                                    </Link>

                                    <Link href="/numerologie" className="group">
                                        <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                                            <div className="flex flex-col items-center text-center space-y-3">
                                                <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                                                    <Hash className="w-5 h-5 text-[#9F2BFF]" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-semibold text-white text-sm">Numerologie</h4>
                                                    <p className="text-xs text-[#E0E0E0]/70">
                                                        Descoperă destinul tău numeric
                                                    </p>
                                                </div>
                                                <span className="text-xs font-medium text-[#9F2BFF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Explorează
                                                    <ArrowLeft className="w-3 h-3 rotate-180" />
                                                </span>
                                            </div>
                                        </Card>
                                    </Link>

                                    <Link href="/bioritm/energia-zilei" className="group">
                                        <Card className="p-4 h-full transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                                            <div className="flex flex-col items-center text-center space-y-3">
                                                <div className="w-12 h-12 rounded-full bg-[#9F2BFF]/10 border border-[#9F2BFF]/40 flex items-center justify-center group-hover:bg-[#9F2BFF]/20 transition-colors">
                                                    <Moon className="w-5 h-5 text-[#9F2BFF]" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-semibold text-white text-sm">Energia Zilei</h4>
                                                    <p className="text-xs text-[#E0E0E0]/70">
                                                        Descoperă energia planetară
                                                    </p>
                                                </div>
                                                <span className="text-xs font-medium text-[#9F2BFF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Explorează
                                                    <ArrowLeft className="w-3 h-3 rotate-180" />
                                                </span>
                                            </div>
                                        </Card>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
