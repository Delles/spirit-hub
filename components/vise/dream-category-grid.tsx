"use client";

import {
    PawPrint,
    Leaf,
    Package,
    Heart,
    Users,
    Zap,
    MapPin
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CategoryItem {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    count?: number;
}

const CATEGORIES: CategoryItem[] = [
    {
        id: "animale",
        name: "Animale",
        icon: PawPrint,
        color: "text-red-400",
        bg: "bg-red-500/10 hover:bg-red-500/20"
    },
    {
        id: "natură",
        name: "Natură",
        icon: Leaf,
        color: "text-green-400",
        bg: "bg-green-500/10 hover:bg-green-500/20"
    },
    {
        id: "obiecte",
        name: "Obiecte",
        icon: Package,
        color: "text-blue-400",
        bg: "bg-blue-500/10 hover:bg-blue-500/20"
    },
    {
        id: "emoții",
        name: "Emoții",
        icon: Heart,
        color: "text-purple-400",
        bg: "bg-purple-500/10 hover:bg-purple-500/20"
    },
    {
        id: "persoane",
        name: "Persoane",
        icon: Users,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10 hover:bg-yellow-500/20"
    },
    {
        id: "acțiuni",
        name: "Acțiuni",
        icon: Zap,
        color: "text-orange-400",
        bg: "bg-orange-500/10 hover:bg-orange-500/20"
    },
    {
        id: "locuri",
        name: "Locuri",
        icon: MapPin,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10 hover:bg-cyan-500/20"
    },
];

export function DreamCategoryGrid() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-semibold text-white">Categorii</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/vise?category=${cat.id}`}
                        scroll={false}
                        className="block h-full"
                    >
                        <Card className={cn(
                            "h-full p-4 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 border-white/5 cursor-pointer group",
                            cat.bg
                        )}>
                            <div className={cn(
                                "p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors",
                                cat.color
                            )}>
                                <cat.icon className="w-6 h-6" />
                            </div>
                            <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                                {cat.name}
                            </span>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
