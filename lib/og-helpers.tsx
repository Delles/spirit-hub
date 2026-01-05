/**
 * OG Image Helper Functions
 * 
 * Shared utilities for dynamic OG image generation.
 */

import oracleData from "@/data/interpretations/oracle.json";
import type { OracleMessage } from "./oracle";

// ============================================================================
// Constants
// ============================================================================

/**
 * Standard OG image dimensions
 */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/**
 * Brand colors for OG images
 */
export const OG_COLORS = {
    bgGradientStart: "#1a0533",
    bgGradientEnd: "#0d0015",
    primary: "#FFFFFF",
    accent: "#9F2BFF",
    muted: "rgba(255, 255, 255, 0.7)",
    success: "#4ADE80",
    danger: "#F87171",
    border: "rgba(159, 43, 255, 0.3)",
    cardBg: "rgba(255, 255, 255, 0.05)",
} as const;

/**
 * Font sizes for OG images
 */
export const OG_FONTS = {
    header: 20,
    title: 48,
    subtitle: 28,
    number: 160,
    body: 18,
    small: 16,
    footer: 16,
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get oracle message by ID
 */
export function getOracleById(id: number): OracleMessage | null {
    const messages = oracleData.messages as unknown as OracleMessage[];
    return messages.find((m) => m.id === id) ?? null;
}

/**
 * Map compatibility score to interpretation bucket key
 * Scores are bucketed: 100 (90-100), 75 (65-89), 50 (40-64), 25 (0-39)
 */
export function getCompatibilityBucket(score: number): string {
    if (score >= 90) return "100";
    if (score >= 65) return "75";
    if (score >= 40) return "50";
    return "25";
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 1).trim() + "…";
}

/**
 * Strip markdown formatting from text for OG images
 */
export function stripMarkdown(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
        .replace(/\*(.*?)\*/g, "$1")     // Italic
        .replace(/`(.*?)`/g, "$1")       // Code
        .replace(/\[(.*?)\]\(.*?\)/g, "$1"); // Links
}

/**
 * Map Lucide icon names to Emojis for OG images
 */
export const ICON_TO_EMOJI: Record<string, string> = {
    "Flame": "🔥",
    "Sparkles": "✨",
    "ShieldCheck": "🛡️",
    "Wind": "🌬️",
    "Heart": "❤️",
    "Search": "🔍",
    "Gem": "💎",
    "Globe": "🌍",
    "HeartHandshake": "🤝",
    "Zap": "⚡",
    "Pyramid": "🔺",
    "Sun": "☀️",
    "Moon": "🌙",
    "Star": "⭐",
    // Planets (Energia Zilei)
    "☉": "☀️",
    "☽": "🌙",
    "♂": "♂",
    "☿": "☿",
    "♃": "♃",
    "♀": "♀",
    "♄": "♄",
};

export function getIconForName(name: string): string {
    return ICON_TO_EMOJI[name] || "✨";
}

// ============================================================================
// Components
// ============================================================================

export function CheckIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={OG_COLORS.success}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}

export function XIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={OG_COLORS.danger}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6L6 18M6 6l12 12" />
        </svg>
    );
}

// ============================================================================
// Shared Styles
// ============================================================================

/**
 * Premium glassmorphic container
 */
export const ogContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    background: `linear-gradient(135deg, ${OG_COLORS.bgGradientStart} 0%, ${OG_COLORS.bgGradientEnd} 100%)`,
    color: OG_COLORS.primary,
    fontFamily: "Inter, sans-serif",
    padding: "40px",
    position: "relative",
};

/**
 * Inner card content border/glow
 */
export const ogCardStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    height: "100%",
    borderRadius: "24px",
    border: `1px solid ${OG_COLORS.border}`,
    background: "rgba(255, 255, 255, 0.03)",
    boxShadow: "0 0 80px rgba(159, 43, 255, 0.15)",
    padding: "40px",
    position: "relative",
    overflow: "hidden",
};

/**
 * Background glow effect (orb)
 */
export const ogGlowStyle: React.CSSProperties = {
    position: "absolute",
    top: "-20%",
    right: "-10%",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(159, 43, 255, 0.2) 0%, transparent 70%)",
    filter: "blur(60px)",
    display: "flex", // Satori safety
};

/**
 * Split layout container
 */
export const ogSplitLayout: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
    position: "relative",
    zIndex: 1,
};

/**
 * Left column (Number/Icon)
 */
export const ogLeftCol: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "35%",
    borderRight: `1px solid ${OG_COLORS.border}`,
    paddingRight: "40px",
};

/**
 * Right column (Content)
 */
export const ogRightCol: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "65%",
    paddingLeft: "40px",
    paddingTop: "10px",
    paddingBottom: "10px",
};

/**
 * Brand header pill
 */
export const ogBrandPill: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    fontSize: 14,
    color: OG_COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    alignSelf: "center",
    marginBottom: "20px",
};

/**
 * List item row (Dos/Donts)
 */
export const ogListItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255, 255, 255, 0.03)",
    padding: "10px 16px",
    borderRadius: "12px",
    marginBottom: "8px",
    width: "100%",
};

/**
 * Section Label (Recommended/Avoid)
 */
export const ogSectionLabel: React.CSSProperties = {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "8px",
    fontWeight: 600,
};
