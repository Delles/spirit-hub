/**
 * Dynamic OG Image for Compatibility (Compatibilitate)
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
    OG_FONTS_VERTICAL,
    ogContainerStyle, ogCardStyle, ogGlowStyle, ogCenteredLayout,
    ogBrandPillMobile, ogTitleStyle, ogQuoteStyle, OGBrandFooter,
    ogVerticalContainerStyle, ogVerticalCardStyle, ogVerticalGlowStyle, ogVerticalLayout,
    ogVerticalBrandPill, ogVerticalTitleStyle, ogVerticalQuoteStyle,
    OGVerticalBrandFooter, getCompatibilityBucket, getScoreColor, truncateText,
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

    const scoreColor = getScoreColor(score);
    const displayMantra = truncateText(interpretation.content.mantra, isVertical ? 70 : 45);

    if (isVertical) {
        return new ImageResponse(
            (
                <div style={ogVerticalContainerStyle}>
                    <div style={ogVerticalGlowStyle} />
                    <div style={ogVerticalCardStyle}>
                        <div style={ogVerticalLayout}>
                            <div style={ogVerticalBrandPill}>
                                <span>💕 COMPATIBILITATE</span>
                            </div>
                            {/* Hero Score */}
                            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                                <span style={{
                                    fontSize: 280, fontWeight: 800, color: scoreColor,
                                    lineHeight: 1, textShadow: `0 0 80px ${scoreColor}40`
                                }}>
                                    {score}
                                </span>
                                <span style={{ fontSize: 100, fontWeight: 800, color: scoreColor }}>%</span>
                            </div>
                            <span style={ogVerticalTitleStyle}>{interpretation.hero.title}</span>
                            <span style={ogVerticalQuoteStyle}>&ldquo;{displayMantra}&rdquo;</span>
                        </div>
                        <OGVerticalBrandFooter emoji="💕" cta="Verifică compatibilitatea" />
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
                        <div style={ogBrandPillMobile}><span>💕 COMPATIBILITATE</span></div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                            <span style={{
                                fontSize: 200, fontWeight: 800, color: scoreColor,
                                lineHeight: 1, textShadow: `0 0 60px ${scoreColor}40`
                            }}>
                                {score}
                            </span>
                            <span style={{ fontSize: 80, fontWeight: 800, color: scoreColor }}>%</span>
                        </div>
                        <span style={ogTitleStyle}>{interpretation.hero.title}</span>
                        <span style={ogQuoteStyle}>&ldquo;{displayMantra}&rdquo;</span>
                    </div>
                    <OGBrandFooter emoji="💕" cta="Verifică compatibilitatea" />
                </div>
            </div>
        ),
        { width, height, headers: { 'Cache-Control': OG_CACHE.STATIC } }
    );
}
