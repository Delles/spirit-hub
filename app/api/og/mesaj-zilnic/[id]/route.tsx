/**
 * Dynamic OG Image for Oracle Message (Mesaj Zilnic)
 * 
 * ENHANCED: Emerald mystical theme with "Universe says..." framing
 * 
 * Supports multiple formats: og, story, feed, square
 * Route: /api/og/mesaj-zilnic/[id]?format=og|story|feed|square
 */

import { ImageResponse } from "next/og";
import {
    IMAGE_FORMATS,
    type ImageFormat,
    getFormatDimensions,
    OG_COLORS,
    OG_FONTS,
    OG_FONTS_VERTICAL,
    getThemedStyles,
    OGThemedFooter,
    getOracleById,
    truncateText,
    OG_CACHE,
} from "@/lib/og-helpers";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);

    const { searchParams } = new URL(request.url);
    const formatParam = searchParams.get('format') || 'og';
    const format = (formatParam in IMAGE_FORMATS ? formatParam : 'og') as ImageFormat;
    const { width, height, isVertical } = getFormatDimensions(format);

    if (isNaN(id) || id < 1) {
        return new Response("Invalid oracle message ID", { status: 400 });
    }

    const oracle = getOracleById(id);
    if (!oracle) {
        return new Response("Oracle message not found", { status: 404 });
    }

    const { containerStyle, glowStyle, brandPillStyle, theme } =
        getThemedStyles('mesaj-zilnic', isVertical);

    const displayQuote = truncateText(oracle.mantra, isVertical ? 80 : 55);

    const cardStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        borderRadius: isVertical ? "32px" : "20px",
        border: `1px solid ${theme.accent}30`,
        background: "rgba(255, 255, 255, 0.03)",
        boxShadow: `0 0 ${isVertical ? 100 : 80}px ${theme.glowColor}30`,
        padding: isVertical ? "50px 40px" : "24px",
        position: "relative",
        overflow: "hidden",
    };

    const layoutStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        textAlign: "center",
        gap: isVertical ? "24px" : "16px",
        paddingBottom: isVertical ? "100px" : "70px",
    };

    const oracleIconStyle: React.CSSProperties = {
        fontSize: isVertical ? 160 : 100,
        lineHeight: 1,
        textShadow: `0 0 60px ${theme.glowColor}`,
    };

    const quoteStyle: React.CSSProperties = {
        fontSize: isVertical ? OG_FONTS_VERTICAL.quote + 8 : OG_FONTS.quote + 6,
        fontStyle: "italic",
        color: "rgba(255, 255, 255, 0.95)",
        lineHeight: 1.3,
        maxWidth: "90%",
    };

    const titleStyle: React.CSSProperties = {
        fontSize: isVertical ? 48 : 36,
        fontWeight: "bold",
        color: theme.accent,
        letterSpacing: "0.02em",
    };

    return new ImageResponse(
        (
            <div style={containerStyle}>
                <div style={glowStyle} />
                <div style={cardStyle}>
                    <div style={layoutStyle}>
                        <div style={brandPillStyle}>
                            <span>{theme.emoji} {theme.label}</span>
                        </div>

                        {/* Personal Frame */}
                        <span style={{
                            fontSize: isVertical ? 32 : 22,
                            color: OG_COLORS.muted,
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}>
                            {theme.personalFrame}
                        </span>

                        {/* Oracle Icon */}
                        <span style={oracleIconStyle}>🔮</span>

                        {/* The Message Quote - Main Hook */}
                        <span style={quoteStyle}>
                            &ldquo;{displayQuote}&rdquo;
                        </span>

                        {/* Oracle Title/Category */}
                        <span style={titleStyle}>
                            {oracle.title}
                        </span>
                    </div>

                    <OGThemedFooter contentType="mesaj-zilnic" isVertical={isVertical} />
                </div>
            </div>
        ),
        { width, height, headers: { 'Cache-Control': OG_CACHE.STATIC } }
    );
}
