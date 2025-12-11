"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function DreamAZIndex() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-semibold text-white">Index Alfabetic</h3>
            </div>

            <div className="flex flex-wrap gap-1 justify-center bg-white/5 p-4 rounded-xl border border-white/10">
                {LETTERS.map((letter) => (
                    <Link
                        key={letter}
                        href={`/vise?letter=${letter}`}
                        scroll={false}
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 md:w-10 md:h-10 p-0 text-gray-400 hover:text-white hover:bg-[#9F2BFF]/20 hover:text-[#9F2BFF] font-medium transition-all"
                        >
                            {letter}
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
