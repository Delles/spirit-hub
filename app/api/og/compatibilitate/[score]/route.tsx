/**
 * Dynamic OG Image for Compatibility (Compatibilitate)
 * 
 * ENHANCED: Visual score display with themed colors
 * 
 * Supports multiple formats: og, story, feed, square
 * Route: /api/og/compatibilitate/[score]?format=og|story|feed|square
 */

import { ImageResponse } from "next/og";
import { getInterpretation, type CompatibilityInterpretation } from "@/lib/interpretations";
import {
    IMAGE_FORMATS,
    type ImageFormat,
    getFormatDimensions,
    OG_COLORS,
    OG_FONTS,
    OG_FONTS_VERTICAL,
    getThemedStyles,
    OGThemedFooter,
    getCompatibilityBucket,
    getScoreColor,
    truncateText,
    OG_CACHE,
} from "@/lib/og-helpers";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ score: string }> }
) {
    const { score: scoreStr } = await params;
    const score = parseInt(scoreStr, 10);

    const { searchParams } = new URL(request.url);
    const formatParam = searchParams.get('format') || 'og';
    const format = (formatParam in IMAGE_FORMATS ? formatParam : 'og') as ImageFormat;
    const { width, height, isVertical } = getFormatDimensions(format);

    if (isNaN(score) || score < 0 || score > 100) {
        return new Response("Invalid compatibility score (0-100)", { status: 400 });
    }

    const bucket = getCompatibilityBucket(score);
    const interpretation = getInterpretation<CompatibilityInterpretation>(
        "compatibility", bucket, { useFallback: false }
    );

    if (!interpretation) {
        return new Response("Interpretation not found", { status: 404 });
    }

    const { containerStyle, glowStyle, brandPillStyle, theme } =
        getThemedStyles('compatibilitate', isVertical);

    const scoreColor = getScoreColor(score);
    const displayMantra = truncateText(interpretation.content.mantra, isVertical ? 70 : 45);

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
        gap: isVertical ? "20px" : "12px",
        paddingBottom: isVertical ? "100px" : "70px",
    };

    const heroScoreStyle: React.CSSProperties = {
        fontSize: isVertical ? 320 : 220,
        fontWeight: 800,
        color: scoreColor,
        lineHeight: 1,
        textShadow: `0 0 80px ${scoreColor}60`,
    };

    const percentStyle: React.CSSProperties = {
        fontSize: isVertical ? 120 : 80,
        fontWeight: 800,
        color: scoreColor,
    };

    const titleStyle: React.CSSProperties = {
        fontSize: isVertical ? OG_FONTS_VERTICAL.title : OG_FONTS.title,
        fontWeight: "bold",
        color: OG_COLORS.primary,
        lineHeight: 1.2,
        maxWidth: "90%",
    };

    const quoteStyle: React.CSSProperties = {
        fontSize: isVertical ? OG_FONTS_VERTICAL.quote : OG_FONTS.quote,
        fontStyle: "italic",
        color: OG_COLORS.muted,
        lineHeight: 1.4,
        maxWidth: "85%",
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

                        {/* Personal frame */}
                        <span style={{
                            fontSize: isVertical ? 36 : 24,
                            color: OG_COLORS.muted,
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}>
                            {theme.personalFrame}
                        </span>

                        {/* Hero Score with % */}
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                            <span style={heroScoreStyle}>{score}</span>
                            <span style={percentStyle}>%</span>
                        </div>

                        <span style={titleStyle}>{interpretation.hero.title}</span>
                        <span style={quoteStyle}>&ldquo;{displayMantra}&rdquo;</span>
                    </div>

                    <OGThemedFooter contentType="compatibilitate" isVertical={isVertical} />
                </div>
            </div>
        ),
        { width, height, headers: { 'Cache-Control': OG_CACHE.STATIC } }
    );
}
