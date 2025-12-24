/**
 * Shared icon map for planetary/energy components
 * 
 * Maps icon string names from JSON data to Lucide React components.
 * Used by EnergiaZileiCard and BiorhythmWidget.
 */

import type { LucideIcon } from "lucide-react";
import {
    Sun,
    Moon,
    Swords,
    MessageCircle,
    Crown,
    Heart,
    Hourglass,
} from "lucide-react";

export const planetaryIconMap: Record<string, LucideIcon> = {
    Sun,
    Moon,
    Swords,
    MessageCircle,
    Crown,
    Heart,
    Hourglass,
};

/**
 * Get an icon component by name, with a fallback to Sun
 */
export function getPlanetaryIcon(iconName: string): LucideIcon {
    return planetaryIconMap[iconName] || Sun;
}
