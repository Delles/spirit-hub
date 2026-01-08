import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight, Hourglass, Flame, Moon, Heart, Sparkles, Eye,
    Wind, Palette, Scale, Users, Coins, Feather, Target,
    Leaf, ShieldOff, Sun, Circle, BookOpen, Smile, Star,
    Clock, Zap, Lightbulb, UserCheck, Brain, Waves, HeartHandshake,
    Compass, Rocket, Activity, Wallet, Eraser, Wand2, Shrink,
    Gem, Sprout, Telescope, PartyPopper, HeartPulse, Ear, Shuffle,
    Mountain, Coffee, Fingerprint, Anchor, Bird, GraduationCap,
    Lamp, Cloud, BatteryCharging, Gift, Timer, Infinity, Droplets,
    Shield, Clover, Flag, Key
} from "lucide-react";
import type { OracleMessage } from "@/lib/oracle";

// Map icon strings to Lucide components with correct typing
const iconMap: Record<string, LucideIcon> = {
    Hourglass, Flame, Moon, Heart, Sparkles, Eye, Wind, Palette, Scale,
    Butterfly: Sparkles, // Fallback for missing icon
    Users, Coins, Feather, Target, Leaf, ShieldOff, Sun, Circle, BookOpen, Smile,
    Clock, Zap, Lightbulb, UserCheck, Brain, Waves, HeartHandshake,
    Compass, Rocket, Activity, Wallet, Eraser, Wand2, Shrink,
    Gem, Sprout, Telescope, PartyPopper, HeartPulse, Ear, Shuffle,
    Mountain, Coffee, Fingerprint, Anchor, Bird, GraduationCap,
    Lamp, Cloud, BatteryCharging, Gift, Timer, Infinity, Droplets,
    Shield, Clover, Flag, Key
};

const FALLBACK_ICON: LucideIcon = Star;

interface OracleWidgetProps {
    data: OracleMessage | null;
    className?: string;
}

export function OracleWidget({ data, className }: OracleWidgetProps) {
    if (!data) return null;

    const Icon = iconMap[data.theme.icon] ?? FALLBACK_ICON;

    return (
        <Link
            href="/mesaj-zilnic"
            className={cn(
                "group relative flex flex-col h-full overflow-hidden rounded-[20px] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(255,165,0,0.2)]",
                // Glassmorphism with subtle blur
                "bg-black/5 backdrop-blur-sm",
                "bg-[linear-gradient(180deg,rgba(255,255,255,0.01)_0%,rgba(159,43,255,0.02)_100%)]",
                // Visible border for card definition
                "border border-white/10 hover:border-white/20",
                // Minimal shadow
                "shadow-[0_2px_16px_rgba(0,0,0,0.15)]",
                className
            )}
        >
            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full p-8 justify-between">

                {/* Header: Title Left, Icon Right */}
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                        <h3 className="text-white font-bold text-xl">Mesajul Universului</h3>
                        <p className="text-sm text-white/60 font-medium uppercase tracking-wider">
                            {data.title}
                        </p>
                    </div>

                    {/* Icon - Top Right */}
                    <div className={cn(
                        "w-10 h-10 flex-shrink-0 rounded-full border flex items-center justify-center transition-colors",
                        "border-white/10 bg-white/5", // Base glass style
                        data.theme.accent // Apply theme color to Icon
                    )}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>

                {/* Main Content - Insight (Centered) */}
                <div className="relative z-10 flex-1 flex flex-col justify-center mb-6">
                    <p className="text-[#E0E0E0] text-sm leading-relaxed line-clamp-3">
                        {data.insight.replace(/\*\*/g, '')}
                    </p>
                </div>

                {/* Footer / CTA */}
                <div className="mt-auto flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                    <span>Vezi mesajul complet</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
