/**
 * Dynamic OG Image for Daily Energy (Energia Zilei)
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
    OG_COLORS, OG_FONTS, OG_FONTS_VERTICAL,
    ogContainerStyle, ogCardStyle, ogGlowStyle, ogCenteredLayout,
    ogBrandPillMobile, ogQuoteStyle, OGBrandFooter,
    ogVerticalContainerStyle, ogVerticalCardStyle, ogVerticalGlowStyle, ogVerticalLayout,
    ogVerticalBrandPill, ogVerticalQuoteStyle,
    OGVerticalBrandFooter, getScoreColor, truncateText,
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

    if (isVertical) {
        return new ImageResponse(
            (
                <div style={ogVerticalContainerStyle}>
                    <div style={ogVerticalGlowStyle} />
                    <div style={ogVerticalCardStyle}>
                        <div style={ogVerticalLayout}>
                            <div style={ogVerticalBrandPill}>
                                <span>⚡ ENERGIA ZILEI</span>
                            </div>
                            {/* Hero Planetary Symbol */}
                            <span style={{
                                fontSize: 220,
                                lineHeight: 1,
                                textShadow: "0 0 60px rgba(159, 43, 255, 0.5)",
                            }}>
                                {energia.hero.icon}
                            </span>
                            <span style={{
                                fontSize: OG_FONTS_VERTICAL.subtitle,
                                color: OG_COLORS.muted,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                fontWeight: 600,
                            }}>
                                {energia.hero.subtitle} · {energia.hero.title}
                            </span>
                            <span style={ogVerticalQuoteStyle}>&ldquo;{displayMantra}&rdquo;</span>
                            {/* Energy Level */}
                            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "20px" }}>
                                <span style={{ fontSize: 24, color: OG_COLORS.muted }}>Energie</span>
                                <span style={{ fontSize: 36, fontWeight: "bold", color: energyColor }}>
                                    {energia.energyLevel}%
                                </span>
                            </div>
                        </div>
                        <OGVerticalBrandFooter emoji="☀️" cta="Cum e energia TA azi?" />
                    </div>
                </div>
            ),
            { width, height, headers: { 'Cache-Control': OG_CACHE.DAILY } }
        );
    }

    return new ImageResponse(
        (
            <div style={ogContainerStyle}>
                <div style={ogGlowStyle} />
                <div style={ogCardStyle}>
                    <div style={ogCenteredLayout}>
                        <div style={ogBrandPillMobile}><span>⚡ ENERGIA ZILEI</span></div>
                        <span style={{
                            fontSize: 160,
                            lineHeight: 1,
                            textShadow: "0 0 40px rgba(159, 43, 255, 0.4)",
                        }}>
                            {energia.hero.icon}
                        </span>
                        <span style={{
                            fontSize: OG_FONTS.subtitle,
                            color: OG_COLORS.muted,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600,
                        }}>
                            {energia.hero.subtitle} · {energia.hero.title}
                        </span>
                        <span style={ogQuoteStyle}>&ldquo;{displayMantra}&rdquo;</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: 20, color: OG_COLORS.muted }}>Energie</span>
                            <span style={{ fontSize: 28, fontWeight: "bold", color: energyColor }}>
                                {energia.energyLevel}%
                            </span>
                        </div>
                    </div>
                    <OGBrandFooter emoji="☀️" cta="Cum e energia TA azi?" />
                </div>
            </div>
        ),
        { width, height, headers: { 'Cache-Control': OG_CACHE.DAILY } }
    );
}
