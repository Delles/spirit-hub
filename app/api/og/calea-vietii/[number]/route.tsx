/**
 * Dynamic OG Image for Life Path (Calea Vieții)
 * 
 * Supports multiple formats:
 * - og (default): 1200x630 for link previews
 * - story: 1080x1920 for Instagram/TikTok Stories
 * - feed: 1080x1350 for Instagram/Facebook Feed
 * - square: 1080x1080 for universal use
 * 
 * Route: /api/og/calea-vietii/[number]?format=og|story|feed|square
 */

import { ImageResponse } from "next/og";
import { getInterpretation, type LifePathInterpretation } from "@/lib/interpretations";
import {
    IMAGE_FORMATS,
    type ImageFormat,
    getFormatDimensions,
    // Horizontal (OG) styles
    ogContainerStyle,
    ogCardStyle,
    ogGlowStyle,
    ogCenteredLayout,
    ogBrandPillMobile,
    ogHeroNumberStyle,
    ogTitleStyle,
    ogQuoteStyle,
    OGBrandFooter,
    // Vertical (Story/Feed) styles
    ogVerticalContainerStyle,
    ogVerticalCardStyle,
    ogVerticalGlowStyle,
    ogVerticalLayout,
    ogVerticalBrandPill,
    ogVerticalHeroNumberStyle,
    ogVerticalTitleStyle,
    ogVerticalQuoteStyle,
    OGVerticalBrandFooter,
    truncateText,
    OG_CACHE,
} from "@/lib/og-helpers";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ number: string }> }
) {
    const { number: numberStr } = await params;
    const number = parseInt(numberStr, 10);

    // Get format from query string
    const { searchParams } = new URL(request.url);
    const formatParam = searchParams.get('format') || 'og';
    const format = (formatParam in IMAGE_FORMATS ? formatParam : 'og') as ImageFormat;
    const { width, height, isVertical } = getFormatDimensions(format);

    // Validate number
    if (isNaN(number) || number < 1 || (number > 9 && ![11, 22, 33].includes(number))) {
        return new Response("Invalid life path number", { status: 400 });
    }

    const interpretation = getInterpretation<LifePathInterpretation>(
        "life-path",
        number,
        { useFallback: true }
    );

    if (!interpretation) {
        return new Response("Interpretation not found", { status: 404 });
    }

    // Truncate mantra - vertical has more space
    const displayMantra = truncateText(interpretation.mantra, isVertical ? 80 : 50);

    // Render vertical layout for Story/Feed
    if (isVertical) {
        return new ImageResponse(
            (
                <div style={ogVerticalContainerStyle}>
                    <div style={ogVerticalGlowStyle} />
                    <div style={ogVerticalCardStyle}>
                        <div style={ogVerticalLayout}>
                            {/* Brand Pill */}
                            <div style={ogVerticalBrandPill}>
                                <span>✨ CALEA VIEȚII</span>
                            </div>

                            {/* Hero Number - MASSIVE */}
                            <span style={ogVerticalHeroNumberStyle}>
                                {number}
                            </span>

                            {/* Title */}
                            <span style={ogVerticalTitleStyle}>
                                {interpretation.hero.title}
                            </span>

                            {/* Mantra - The Hook */}
                            <span style={ogVerticalQuoteStyle}>
                                &ldquo;{displayMantra}&rdquo;
                            </span>
                        </div>

                        {/* Footer CTA */}
                        <OGVerticalBrandFooter
                            emoji="🌟"
                            cta="Descoperă-l pe al TĂU"
                        />
                    </div>
                </div>
            ),
            { width, height, headers: { 'Cache-Control': OG_CACHE.STATIC } }
        );
    }

    // Render horizontal layout for OG/Square
    return new ImageResponse(
        (
            <div style={ogContainerStyle}>
                <div style={ogGlowStyle} />
                <div style={ogCardStyle}>
                    <div style={ogCenteredLayout}>
                        {/* Brand Pill */}
                        <div style={ogBrandPillMobile}>
                            <span>✨ CALEA VIEȚII</span>
                        </div>

                        {/* Hero Number - GIANT */}
                        <span style={ogHeroNumberStyle}>
                            {number}
                        </span>

                        {/* Title */}
                        <span style={ogTitleStyle}>
                            {interpretation.hero.title}
                        </span>

                        {/* Mantra - The Hook (truncated) */}
                        <span style={ogQuoteStyle}>
                            &ldquo;{displayMantra}&rdquo;
                        </span>
                    </div>

                    {/* Footer CTA */}
                    <OGBrandFooter
                        emoji="🌟"
                        cta="Descoperă-l pe al TĂU"
                    />
                </div>
            </div>
        ),
        { width, height, headers: { 'Cache-Control': OG_CACHE.STATIC } }
    );
}
