"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { StaticDreamSymbol } from "@/lib/dream-data";

interface RelatedDreamsWidgetProps {
    dreams: StaticDreamSymbol[];
}

export function RelatedDreamsWidget({ dreams }: RelatedDreamsWidgetProps) {
    if (!dreams || dreams.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Alte vise similare</h3>
            <div className="grid gap-3">
                {dreams.map((dream) => (
                    <Link key={dream.slug} href={`/vise/${dream.slug}`}>
                        <Card className="p-3 bg-[#1A1A2E]/50 border-white/5 hover:border-[#9F2BFF]/40 hover:bg-[#1A1A2E]/80 transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                                        {dream.name}
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">{dream.category}</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-[#9F2BFF] transform group-hover:translate-x-1 transition-all" />
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
