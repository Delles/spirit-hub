/**
 * Dynamic OG Image for Destiny Number (Destinul)
 * 
 * Supports multiple formats: og, story, feed, square
 * Route: /api/og/destin/[number]?format=og|story|feed|square
 */

import { ImageResponse } from "next/og";
import { getInterpretation, type LifePathInterpretation } from "@/lib/interpretations";
import {
    IMAGE_FORMATS,
    type ImageFormat,
    getFormatDimensions,
    ogContainerStyle, ogCardStyle, ogGlowStyle, ogCenteredLayout,
    ogBrandPillMobile, ogHeroNumberStyle, ogTitleStyle, ogQuoteStyle, OGBrandFooter,
    ogVerticalContainerStyle, ogVerticalCardStyle, ogVerticalGlowStyle, ogVerticalLayout,
    ogVerticalBrandPill, ogVerticalHeroNumberStyle, ogVerticalTitleStyle, ogVerticalQuoteStyle,
    OGVerticalBrandFooter, truncateText,
    OG_CACHE,
} from "@/lib/og-helpers";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ number: string }> }
) {
    const { number: numberStr } = await params;
    const number = parseInt(numberStr, 10);

    const { searchParams } = new URL(request.url);
    const formatParam = searchParams.get('format') || 'og';
    const format = (formatParam in IMAGE_FORMATS ? formatParam : 'og') as ImageFormat;
    const { width, height, isVertical } = getFormatDimensions(format);

    if (isNaN(number) || number < 1 || (number > 9 && ![11, 22, 33].includes(number))) {
        return new Response("Invalid destiny number", { status: 400 });
    }

    const interpretation = getInterpretation<LifePathInterpretation>(
        "destiny", number, { useFallback: true }
    );

    if (!interpretation) {
        return new Response("Interpretation not found", { status: 404 });
    }

    const displayMantra = truncateText(interpretation.mantra, isVertical ? 80 : 50);

    if (isVertical) {
        return new ImageResponse(
            (
                <div style={ogVerticalContainerStyle}>
                    <div style={ogVerticalGlowStyle} />
                    <div style={ogVerticalCardStyle}>
                        <div style={ogVerticalLayout}>
                            <div style={ogVerticalBrandPill}>
                                <span>✨ CALEA DESTINULUI</span>
                            </div>
                            <span style={ogVerticalHeroNumberStyle}>{number}</span>
                            <span style={ogVerticalTitleStyle}>{interpretation.hero.title}</span>
                            <span style={ogVerticalQuoteStyle}>&ldquo;{displayMantra}&rdquo;</span>
                        </div>
                        <OGVerticalBrandFooter emoji="✨" cta="Care e destinul TĂU?" />
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
                        <div style={ogBrandPillMobile}><span>✨ CALEA DESTINULUI</span></div>
                        <span style={ogHeroNumberStyle}>{number}</span>
                        <span style={ogTitleStyle}>{interpretation.hero.title}</span>
                        <span style={ogQuoteStyle}>&ldquo;{displayMantra}&rdquo;</span>
                    </div>
                    <OGBrandFooter emoji="✨" cta="Care e destinul TĂU?" />
                </div>
            </div>
        ),
        { width, height, headers: { 'Cache-Control': OG_CACHE.STATIC } }
    );
}
