/**
 * Dynamic OG Image for Daily Energy (Energia Zilei)
 * 
 * ENHANCED: Gold/amber themed "Cosmic Forecast" design
 * 
 * Supports multiple formats: og, story, feed, square
 * Route: /api/og/energia-zilei/[date]?format=og|story|feed|square
 */

import { ImageResponse } from "next/og";
import { getEnergiaZilei } from "@/lib/energia-zilei";
import {
    IMAGE_FORMATS,
    type ImageFormat,
    getFormatDimensions,
    OG_COLORS,
    OG_FONTS,
    OG_FONTS_VERTICAL,
    getThemedStyles,
    OGThemedFooter,
    getScoreColor,
    truncateText,
    OG_CACHE,
} from "@/lib/og-helpers";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ date: string }> }
) {
    const { date: dateStr } = await params;

    const { searchParams } = new URL(request.url);
    const formatParam = searchParams.get('format') || 'og';
    const format = (formatParam in IMAGE_FORMATS ? formatParam : 'og') as ImageFormat;
    const { width, height, isVertical } = getFormatDimensions(format);

    let targetDate: Date;
    if (dateStr === "today" || dateStr === "azi") {
        targetDate = new Date();
    } else {
        targetDate = new Date(dateStr);
        if (isNaN(targetDate.getTime())) {
            return new Response("Invalid date format. Use YYYY-MM-DD or 'today'", { status: 400 });
        }
    }

    const energia = getEnergiaZilei(targetDate);
    const energyColor = getScoreColor(energia.energyLevel);
    const displayMantra = truncateText(energia.mantra, isVertical ? 70 : 50);

    const { containerStyle, glowStyle, brandPillStyle, theme } =
        getThemedStyles('energia-zilei', isVertical);

    // Format date for display
    const dateDisplay = targetDate.toLocaleDateString('ro-RO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

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
        gap: isVertical ? "16px" : "10px",
        paddingBottom: isVertical ? "100px" : "70px",
    };

    const planetSymbolStyle: React.CSSProperties = {
        fontSize: isVertical ? 200 : 140,
        lineHeight: 1,
        textShadow: `0 0 60px ${theme.glowColor}`,
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

                        {/* Date stamp - urgency trigger */}
                        <span style={{
                            fontSize: isVertical ? 28 : 20,
                            color: theme.accent,
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                        }}>
                            {dateDisplay}
                        </span>

                        {/* Hero Planetary Symbol */}
                        <span style={planetSymbolStyle}>
                            {energia.hero.icon}
                        </span>

                        {/* Planet name and day */}
                        <span style={{
                            fontSize: isVertical ? OG_FONTS_VERTICAL.subtitle : OG_FONTS.subtitle,
                            color: OG_COLORS.primary,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 700,
                        }}>
                            {energia.hero.subtitle} · {energia.hero.title}
                        </span>

                        {/* Mantra */}
                        <span style={quoteStyle}>&ldquo;{displayMantra}&rdquo;</span>

                        {/* Energy Level */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            marginTop: isVertical ? "16px" : "8px",
                            padding: isVertical ? "16px 32px" : "10px 24px",
                            borderRadius: "100px",
                            background: `${energyColor}15`,
                            border: `1px solid ${energyColor}30`,
                        }}>
                            <span style={{ fontSize: isVertical ? 24 : 18, color: OG_COLORS.muted }}>Energie</span>
                            <span style={{ fontSize: isVertical ? 40 : 28, fontWeight: "bold", color: energyColor }}>
                                {energia.energyLevel}%
                            </span>
                        </div>
                    </div>

                    <OGThemedFooter contentType="energia-zilei" isVertical={isVertical} />
                </div>
            </div>
        ),
        { width, height, headers: { 'Cache-Control': OG_CACHE.DAILY } }
    );
}
