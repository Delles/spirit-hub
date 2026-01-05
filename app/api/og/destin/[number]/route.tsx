/**
 * Dynamic OG Image for Destiny Number (Destinul)
 * 
 * Generates personalized social share images for destiny numbers.
 * Route: /api/og/destin/[number]
 */

import { ImageResponse } from "next/og";
import { getInterpretation, type LifePathInterpretation } from "@/lib/interpretations";
import {
    OG_WIDTH,
    OG_HEIGHT,
    OG_COLORS,
    OG_FONTS,
    ogContainerStyle,
    ogCardStyle,
    ogGlowStyle,
    ogSplitLayout,
    ogLeftCol,
    ogRightCol,
    ogBrandPill,
    ogSectionLabel,
    ogListItemStyle,
    CheckIcon,
    XIcon,
    getIconForName,
} from "@/lib/og-helpers";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ number: string }> }
) {
    const { number: numberStr } = await params;
    const number = parseInt(numberStr, 10);

    // Validate number
    if (isNaN(number) || number < 1 || (number > 9 && ![11, 22, 33].includes(number))) {
        return new Response("Invalid destiny number", { status: 400 });
    }

    const interpretation = getInterpretation<LifePathInterpretation>(
        "destiny",
        number,
        { useFallback: true }
    );

    if (!interpretation) {
        return new Response("Interpretation not found", { status: 404 });
    }

    // Get first 2 dos and don'ts
    const dos = interpretation.content.dos.slice(0, 2);
    const donts = interpretation.content.donts.slice(0, 2);

    return new ImageResponse(
        (
            <div style={ogContainerStyle}>
                <div style={ogGlowStyle} />
                <div style={ogCardStyle}>
                    <div style={ogSplitLayout}>
                        {/* Left Column - Number */}
                        <div style={ogLeftCol}>
                            <div style={ogBrandPill}>
                                <span>✨ CALEA DESTINULUI</span>
                            </div>
                            <span style={{ fontSize: OG_FONTS.number, fontWeight: 800, color: OG_COLORS.primary, textShadow: "0 0 40px rgba(159, 43, 255, 0.4)" }}>
                                {number}
                            </span>
                        </div>

                        {/* Right Column - Content */}
                        <div style={ogRightCol}>
                            {/* Header */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: OG_FONTS.title, fontWeight: "bold", lineHeight: 1.1 }}>
                                    {interpretation.hero.title}
                                </span>
                                <span style={{ fontSize: OG_FONTS.body, color: OG_COLORS.muted, marginTop: "8px" }}>
                                    {interpretation.hero.headline}
                                </span>
                            </div>

                            {/* Dos and Don'ts Grid */}
                            <div style={{ display: "flex", flexDirection: 'column', gap: "16px", marginTop: "30px" }}>
                                {/* Header Row */}
                                <div style={{ display: "flex", width: '100%' }}>
                                    <div style={{ display: "flex", flex: 1 }}><span style={{ ...ogSectionLabel, color: OG_COLORS.success }}>Recomandări</span></div>
                                    <div style={{ display: "flex", width: '20px' }}></div>
                                    <div style={{ display: "flex", flex: 1 }}><span style={{ ...ogSectionLabel, color: OG_COLORS.danger }}>De Evitat</span></div>
                                </div>

                                {/* Row 1 */}
                                <div style={{ display: "flex", width: '100%', alignItems: 'stretch' }}>
                                    <div style={{ flex: 1, display: 'flex' }}>
                                        <div style={{ ...ogListItemStyle, marginBottom: 0, height: '100%' }}>
                                            <CheckIcon />
                                            <span style={{ fontSize: OG_FONTS.small }}>{dos[0]}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", width: '20px' }}></div>
                                    <div style={{ flex: 1, display: 'flex' }}>
                                        <div style={{ ...ogListItemStyle, marginBottom: 0, height: '100%' }}>
                                            <XIcon />
                                            <span style={{ fontSize: OG_FONTS.small }}>{donts[0]}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div style={{ display: "flex", width: '100%', alignItems: 'stretch' }}>
                                    <div style={{ flex: 1, display: 'flex' }}>
                                        <div style={{ ...ogListItemStyle, marginBottom: 0, height: '100%' }}>
                                            <CheckIcon />
                                            <span style={{ fontSize: OG_FONTS.small }}>{dos[1]}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", width: '20px' }}></div>
                                    <div style={{ flex: 1, display: 'flex' }}>
                                        <div style={{ ...ogListItemStyle, marginBottom: 0, height: '100%' }}>
                                            <XIcon />
                                            <span style={{ fontSize: OG_FONTS.small }}>{donts[1]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer / Mantra */}
                            <div style={{ display: "flex", marginTop: "30px", paddingTop: "20px", borderTop: `1px solid ${OG_COLORS.border}` }}>
                                <span style={{ fontSize: OG_FONTS.body, fontStyle: "italic", color: OG_COLORS.muted }}>
                                    &ldquo;{interpretation.mantra}&rdquo;
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            width: OG_WIDTH,
            height: OG_HEIGHT,
        }
    );
}
