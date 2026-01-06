/**
 * OG Image Helper Functions
 * 
 * Mobile-first design system for viral social share images.
 * Strategy: Identity-first, curiosity gaps, scroll-stopping visuals.
 */

import oracleData from "@/data/interpretations/oracle.json";
import type { OracleMessage } from "./oracle";

// ============================================================================
// Constants
// ============================================================================

/**
 * Standard OG image dimensions (for link previews)
 */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/**
 * Multi-format image dimensions
 * - og: Facebook/WhatsApp link previews (1.91:1)
 * - story: Instagram/TikTok/FB Stories (9:16)
 * - feed: Instagram/FB Feed posts (4:5)
 * - square: Universal square format (1:1)
 */
export const IMAGE_FORMATS = {
    og: { width: 1200, height: 630, label: 'Link Preview', isVertical: false },
    story: { width: 1080, height: 1920, label: 'Story (9:16)', isVertical: true },
    feed: { width: 1080, height: 1350, label: 'Feed (4:5)', isVertical: true },
    square: { width: 1080, height: 1080, label: 'Pătrat (1:1)', isVertical: false },
} as const;

export type ImageFormat = keyof typeof IMAGE_FORMATS;

/**
 * Brand colors for OG images
 */
export const OG_COLORS = {
    bgGradientStart: "#1a0533",
    bgGradientEnd: "#0d0015",
    primary: "#FFFFFF",
    accent: "#9F2BFF",
    muted: "rgba(255, 255, 255, 0.7)",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    border: "rgba(159, 43, 255, 0.3)",
    cardBg: "rgba(255, 255, 255, 0.05)",
} as const;

/**
 * Mobile-optimized font sizes - AGGRESSIVE for mobile feeds
 * When image shrinks to ~500px, these should still be readable
 */
export const OG_FONTS = {
    brandPill: 22,
    heroNumber: 280,
    title: 72,
    subtitle: 36,
    quote: 40,
    body: 32,
    footer: 28,
    // Legacy (deprecated - kept for backwards compatibility)
    header: 20,
    number: 160,
    small: 16,
} as const;

/**
 * Vertical format font sizes (for Story/Feed - more space = bigger fonts)
 */
export const OG_FONTS_VERTICAL = {
    brandPill: 28,
    heroNumber: 380,
    title: 96,
    subtitle: 44,
    quote: 52,
    body: 40,
    footer: 32,
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
 * Premium glassmorphic container - MINIMAL padding for max content
 */
export const ogContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    background: `linear-gradient(135deg, ${OG_COLORS.bgGradientStart} 0%, ${OG_COLORS.bgGradientEnd} 100%)`,
    color: OG_COLORS.primary,
    fontFamily: "Inter, sans-serif",
    padding: "20px",
    position: "relative",
};

/**
 * Inner card content border/glow - MINIMAL padding
 */
export const ogCardStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    height: "100%",
    borderRadius: "20px",
    border: `1px solid ${OG_COLORS.border}`,
    background: "rgba(255, 255, 255, 0.03)",
    boxShadow: "0 0 80px rgba(159, 43, 255, 0.15)",
    padding: "24px",
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
 * Section Label (Recommended/Avoid) - LEGACY
 * @deprecated Use centered layout instead
 */
export const ogSectionLabel: React.CSSProperties = {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "8px",
    fontWeight: 600,
};

// ============================================================================
// Mobile-First Centered Layout (NEW)
// ============================================================================

/**
 * Centered layout container - leaves room for footer
 */
export const ogCenteredLayout: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    gap: "8px",
    paddingBottom: "70px", // Space for footer
};

/**
 * Hero number/icon - GIANT for mobile visibility
 */
export const ogHeroNumberStyle: React.CSSProperties = {
    fontSize: OG_FONTS.heroNumber,
    fontWeight: 800,
    color: OG_COLORS.primary,
    lineHeight: 1,
    textShadow: "0 0 60px rgba(159, 43, 255, 0.5)",
};

/**
 * Hero icon (for planets, oracle) - large centered symbol
 */
export const ogHeroIconStyle: React.CSSProperties = {
    fontSize: 140,
    lineHeight: 1,
    textShadow: "0 0 40px rgba(159, 43, 255, 0.4)",
};

/**
 * Title - prominent but secondary to number
 */
export const ogTitleStyle: React.CSSProperties = {
    fontSize: OG_FONTS.title,
    fontWeight: "bold",
    color: OG_COLORS.primary,
    lineHeight: 1.2,
    maxWidth: "90%",
};

/**
 * Quote/Mantra - the shareable hook
 */
export const ogQuoteStyle: React.CSSProperties = {
    fontSize: OG_FONTS.quote,
    fontStyle: "italic",
    color: OG_COLORS.muted,
    lineHeight: 1.4,
    maxWidth: "85%",
};

/**
 * Mobile-optimized brand pill
 */
export const ogBrandPillMobile: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    fontSize: OG_FONTS.brandPill,
    color: OG_COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontWeight: 600,
};

/**
 * Footer container with CTA - positioned at bottom of card
 */
export const ogFooterStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "20px",
    left: "0",
    right: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    paddingTop: "16px",
    borderTop: `1px solid ${OG_COLORS.border}`,
    marginLeft: "30px",
    marginRight: "30px",
};

/**
 * Footer CTA text
 */
export const ogFooterTextStyle: React.CSSProperties = {
    fontSize: OG_FONTS.footer,
    color: OG_COLORS.primary,
    fontWeight: 700,
};

/**
 * Footer CTA accent
 */
export const ogFooterCtaStyle: React.CSSProperties = {
    fontSize: OG_FONTS.footer,
    color: OG_COLORS.accent,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
};

// ============================================================================
// Brand Footer Component
// ============================================================================

interface OGBrandFooterProps {
    emoji: string;
    cta: string;
}

/**
 * Reusable brand footer with personalized CTA
 */
export function OGBrandFooter({ emoji, cta }: OGBrandFooterProps) {
    return (
        <div style={ogFooterStyle}>
            <span style={{ fontSize: 20 }}>{emoji}</span>
            <span style={ogFooterTextStyle}>SpiritHub.ro</span>
            <span style={{ color: OG_COLORS.muted, fontSize: OG_FONTS.footer }}>·</span>
            <span style={ogFooterCtaStyle}>{cta} →</span>
        </div>
    );
}

// ============================================================================
// Helper: Score Color
// ============================================================================

/**
 * Get color based on score/energy level
 */
export function getScoreColor(score: number): string {
    if (score >= 85) return OG_COLORS.success;
    if (score >= 65) return OG_COLORS.warning;
    return OG_COLORS.danger;
}

// ============================================================================
// Vertical Layout Styles (Story/Feed Formats)
// ============================================================================

/**
 * Container for vertical formats (Story 9:16, Feed 4:5)
 */
export const ogVerticalContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    background: `linear-gradient(180deg, ${OG_COLORS.bgGradientStart} 0%, ${OG_COLORS.bgGradientEnd} 100%)`,
    color: OG_COLORS.primary,
    fontFamily: "Inter, sans-serif",
    padding: "40px",
    position: "relative",
};

/**
 * Card for vertical formats
 */
export const ogVerticalCardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    borderRadius: "32px",
    border: `1px solid ${OG_COLORS.border}`,
    background: "rgba(255, 255, 255, 0.03)",
    boxShadow: "0 0 100px rgba(159, 43, 255, 0.2)",
    padding: "50px 40px",
    position: "relative",
    overflow: "hidden",
};

/**
 * Centered layout for vertical formats
 */
export const ogVerticalLayout: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 1,
    textAlign: "center",
    gap: "24px",
    paddingBottom: "100px", // Space for footer
};

/**
 * Hero number for vertical formats (MASSIVE)
 */
export const ogVerticalHeroNumberStyle: React.CSSProperties = {
    fontSize: OG_FONTS_VERTICAL.heroNumber,
    fontWeight: 800,
    color: OG_COLORS.primary,
    lineHeight: 1,
    textShadow: "0 0 80px rgba(159, 43, 255, 0.6)",
};

/**
 * Hero icon for vertical (larger)
 */
export const ogVerticalHeroIconStyle: React.CSSProperties = {
    fontSize: 200,
    lineHeight: 1,
    textShadow: "0 0 60px rgba(159, 43, 255, 0.5)",
};

/**
 * Title for vertical
 */
export const ogVerticalTitleStyle: React.CSSProperties = {
    fontSize: OG_FONTS_VERTICAL.title,
    fontWeight: "bold",
    color: OG_COLORS.primary,
    lineHeight: 1.2,
    maxWidth: "90%",
};

/**
 * Quote for vertical (more space for longer text)
 */
export const ogVerticalQuoteStyle: React.CSSProperties = {
    fontSize: OG_FONTS_VERTICAL.quote,
    fontStyle: "italic",
    color: OG_COLORS.muted,
    lineHeight: 1.4,
    maxWidth: "90%",
    marginTop: "20px",
};

/**
 * Brand pill for vertical
 */
export const ogVerticalBrandPill: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 28px",
    borderRadius: "30px",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    fontSize: OG_FONTS_VERTICAL.brandPill,
    color: OG_COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontWeight: 600,
};

/**
 * Footer for vertical formats
 */
export const ogVerticalFooterStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "50px",
    left: "0",
    right: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    paddingTop: "24px",
    borderTop: `1px solid ${OG_COLORS.border}`,
    marginLeft: "50px",
    marginRight: "50px",
};

/**
 * Brand footer for vertical formats
 */
export function OGVerticalBrandFooter({ emoji, cta }: OGBrandFooterProps) {
    return (
        <div style={ogVerticalFooterStyle}>
            <span style={{ fontSize: 28 }}>{emoji}</span>
            <span style={{ fontSize: OG_FONTS_VERTICAL.footer, fontWeight: 700, color: OG_COLORS.primary }}>
                SpiritHub.ro
            </span>
            <span style={{ color: OG_COLORS.muted, fontSize: OG_FONTS_VERTICAL.footer }}>·</span>
            <span style={{
                fontSize: OG_FONTS_VERTICAL.footer,
                color: OG_COLORS.accent,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
            }}>
                {cta} →
            </span>
        </div>
    );
}

/**
 * Glow effect for vertical formats
 */
export const ogVerticalGlowStyle: React.CSSProperties = {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "800px",
    height: "800px",
    background: "radial-gradient(circle, rgba(159, 43, 255, 0.25) 0%, transparent 70%)",
    filter: "blur(80px)",
    display: "flex",
};

/**
 * Helper to get format dimensions
 */
export function getFormatDimensions(format: ImageFormat = 'og') {
    return IMAGE_FORMATS[format] || IMAGE_FORMATS.og;
}

// ============================================================================
// Cache Configuration for OG Images
// ============================================================================

/**
 * Cache durations for different content types
 * - STATIC: Content that rarely changes (life path, destiny, oracle messages)
 * - DAILY: Content that changes daily (energia zilei, daily number)
 */
export const OG_CACHE = {
    /** 30 days for static content */
    STATIC: 'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400',
    /** 24 hours for daily content */
    DAILY: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
} as const;

export type OGCacheType = keyof typeof OG_CACHE;

/**
 * Default format for social sharing (Story format for Instagram/TikTok)
 */
export const SHARE_IMAGE_FORMAT: ImageFormat = 'story';
