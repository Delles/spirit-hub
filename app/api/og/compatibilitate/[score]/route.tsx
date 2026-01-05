/**
 * Dynamic OG Image for Compatibility (Compatibilitate)
 * 
 * Generates personalized social share images for compatibility scores.
 * Route: /api/og/compatibilitate/[score]
 */

import { ImageResponse } from "next/og";
import { getInterpretation, type CompatibilityInterpretation } from "@/lib/interpretations";
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
    getCompatibilityBucket,
    getIconForName,
} from "@/lib/og-helpers";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ score: string }> }
) {
    const { score: scoreStr } = await params;
    const score = parseInt(scoreStr, 10);

    // Validate score
    if (isNaN(score) || score < 0 || score > 100) {
        return new Response("Invalid compatibility score (0-100)", { status: 400 });
    }

    // Map score to interpretation bucket
    const bucket = getCompatibilityBucket(score);
    const interpretation = getInterpretation<CompatibilityInterpretation>(
        "compatibility",
        bucket,
        { useFallback: false }
    );

    if (!interpretation) {
        return new Response("Interpretation not found", { status: 404 });
    }

    // Get first 2 dos and don'ts
    const dos = interpretation.content.dos.slice(0, 2);
    const donts = interpretation.content.donts.slice(0, 2);

    // Score Color
    const scoreColor = score >= 75 ? "#22C55E" : score >= 50 ? "#F59E0B" : "#EF4444";

    return new ImageResponse(
        (
            <div style={ogContainerStyle}>
                <div style={ogGlowStyle} />
                <div style={ogCardStyle}>
                    <div style={ogSplitLayout}>
                        {/* Left Column - Score */}
                        <div style={ogLeftCol}>
                            <div style={ogBrandPill}>
                                <span>💕 COMPATIBILITATE</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "baseline" }}>
                                <span style={{ fontSize: 130, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                                    {score}
                                </span>
                                <span style={{ fontSize: 60, fontWeight: 800, color: scoreColor, marginLeft: "4px" }}>
                                    %
                                </span>
                            </div>
                            <span style={{ fontSize: 100, marginTop: "20px" }}>
                                {getIconForName(interpretation.hero.icon)}
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
                                    &ldquo;{interpretation.content.mantra}&rdquo;
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
