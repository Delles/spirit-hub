/**
 * Dynamic OG Image for Oracle Message (Mesaj Zilnic)
 * 
 * Supports multiple formats: og, story, feed, square
 * Route: /api/og/mesaj-zilnic/[id]?format=og|story|feed|square
 */

import { ImageResponse } from "next/og";
import {
    IMAGE_FORMATS,
    type ImageFormat,
    getFormatDimensions,
    OG_FONTS, OG_FONTS_VERTICAL,
    ogContainerStyle, ogCardStyle, ogGlowStyle, ogCenteredLayout,
    ogBrandPillMobile, ogHeroIconStyle, OGBrandFooter,
    ogVerticalContainerStyle, ogVerticalCardStyle, ogVerticalGlowStyle, ogVerticalLayout,
    ogVerticalBrandPill, ogVerticalHeroIconStyle, ogVerticalTitleStyle,
    OGVerticalBrandFooter, getOracleById, truncateText,
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

    const displayQuote = truncateText(oracle.mantra, isVertical ? 80 : 55);

    if (isVertical) {
        return new ImageResponse(
            (
                <div style={ogVerticalContainerStyle}>
                    <div style={ogVerticalGlowStyle} />
                    <div style={ogVerticalCardStyle}>
                        <div style={ogVerticalLayout}>
                            <div style={ogVerticalBrandPill}>
                                <span>🔮 MESAJUL UNIVERSULUI</span>
                            </div>
                            <span style={{ ...ogVerticalHeroIconStyle, fontSize: 180 }}>🔮</span>
                            <span style={{
                                fontSize: OG_FONTS_VERTICAL.quote + 10,
                                fontStyle: "italic",
                                color: "rgba(255, 255, 255, 0.95)",
                                lineHeight: 1.3,
                                maxWidth: "90%",
                                textAlign: "center",
                            }}>
                                &ldquo;{displayQuote}&rdquo;
                            </span>
                            <span style={{ ...ogVerticalTitleStyle, fontSize: 48, color: "rgba(255, 255, 255, 0.7)" }}>
                                {oracle.title}
                            </span>
                        </div>
                        <OGVerticalBrandFooter emoji="🔮" cta="Ce mesaj ai TU azi?" />
                    </div>
                </div>
            ),
            { width, height, headers: { 'Cache-Control': OG_CACHE.STATIC } }
        );
    }

    return new ImageResponse(
        (
            <div style={ogContainerStyle}>
                <div style={ogGlowStyle} />
                <div style={ogCardStyle}>
                    <div style={ogCenteredLayout}>
                        <div style={ogBrandPillMobile}><span>🔮 MESAJUL UNIVERSULUI</span></div>
                        <span style={{ ...ogHeroIconStyle, fontSize: 120 }}>🔮</span>
                        <span style={{
                            fontSize: OG_FONTS.quote + 8,
                            fontStyle: "italic",
                            color: "rgba(255, 255, 255, 0.95)",
                            lineHeight: 1.3,
                            maxWidth: "90%",
                            textAlign: "center",
                        }}>
                            &ldquo;{displayQuote}&rdquo;
                        </span>
                        <span style={{
                            fontSize: OG_FONTS.subtitle,
                            fontWeight: "bold",
                            color: "rgba(255, 255, 255, 0.7)",
                        }}>
                            {oracle.title}
                        </span>
                    </div>
                    <OGBrandFooter emoji="🔮" cta="Ce mesaj ai TU azi?" />
                </div>
            </div>
        ),
        { width, height, headers: { 'Cache-Control': OG_CACHE.STATIC } }
    );
}
