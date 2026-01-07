/**
 * Dynamic OG Image for Life Path (Calea Vieții)
 * 
 * ENHANCED: Identity-first design with archetype names and keyword badges
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
    OG_COLORS,
    OG_FONTS,
    OG_FONTS_VERTICAL,
    getThemedStyles,
    OGKeywordBadges,
    OGArchetypeTitle,
    OGPersonalFrame,
    OGThemedFooter,
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

    // Get themed styles for this content type
    const { containerStyle, glowStyle, heroNumberStyle, brandPillStyle, theme } =
        getThemedStyles('calea-vietii', isVertical);

    // Extract archetype (hero.title) and keywords (tags) from interpretation
    const archetype = interpretation.hero.title;
    const keywords = interpretation.tags || [];
    const displayMantra = truncateText(interpretation.mantra, isVertical ? 70 : 45);

    // Card style
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

    // Centered layout
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

    // Quote style
    const quoteStyle: React.CSSProperties = {
        fontSize: isVertical ? OG_FONTS_VERTICAL.quote : OG_FONTS.quote,
        fontStyle: "italic",
        color: OG_COLORS.muted,
        lineHeight: 1.4,
        maxWidth: "85%",
        marginTop: isVertical ? "16px" : "8px",
    };

    return new ImageResponse(
        (
            <div style={containerStyle}>
                <div style={glowStyle} />
                <div style={cardStyle}>
                    <div style={layoutStyle}>
                        {/* Brand Pill */}
                        <div style={brandPillStyle}>
                            <span>{theme.emoji} {theme.label}</span>
                        </div>

                        {/* Personal Frame - "Calea mea este..." */}
                        <OGPersonalFrame
                            text={theme.personalFrame}
                            isVertical={isVertical}
                        />

                        {/* Hero Number - GIANT */}
                        <span style={heroNumberStyle}>
                            {number}
                        </span>

                        {/* Archetype Title - The Identity Hook */}
                        <OGArchetypeTitle
                            title={archetype}
                            isVertical={isVertical}
                            accentColor={theme.accent}
                        />

                        {/* Keyword Badges - Snackable Traits */}
                        <OGKeywordBadges
                            keywords={keywords}
                            isVertical={isVertical}
                            accentColor={theme.accent}
                        />

                        {/* Mantra - The Hook Quote */}
                        <span style={quoteStyle}>
                            &ldquo;{displayMantra}&rdquo;
                        </span>
                    </div>

                    {/* Footer CTA */}
                    <OGThemedFooter
                        contentType="calea-vietii"
                        isVertical={isVertical}
                    />
                </div>
            </div>
        ),
        { width, height, headers: { 'Cache-Control': OG_CACHE.STATIC } }
    );
}
