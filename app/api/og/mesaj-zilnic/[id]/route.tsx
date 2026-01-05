/**
 * Dynamic OG Image for Oracle Message (Mesaj Zilnic)
 * 
 * Generates personalized social share images for daily oracle messages.
 * Route: /api/og/mesaj-zilnic/[id]
 */

import { ImageResponse } from "next/og";
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
    getOracleById,
    truncateText,
    stripMarkdown,
} from "@/lib/og-helpers";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);

    // Validate ID
    if (isNaN(id) || id < 1) {
        return new Response("Invalid oracle message ID", { status: 400 });
    }

    const oracle = getOracleById(id);

    if (!oracle) {
        return new Response("Oracle message not found", { status: 404 });
    }

    // Clean and truncate insight for display
    const cleanInsight = stripMarkdown(oracle.insight);
    const displayInsight = truncateText(cleanInsight, 140);

    return new ImageResponse(
        (
            <div style={ogContainerStyle}>
                <div style={ogGlowStyle} />
                <div style={ogCardStyle}>
                    <div style={ogSplitLayout}>
                        {/* Left Column - Icon/Category */}
                        <div style={ogLeftCol}>
                            <div style={ogBrandPill}>
                                <span>🔮 MESAJUL UNIVERSULUI</span>
                            </div>
                            <span style={{ fontSize: 100 }}>🔮</span>
                        </div>

                        {/* Right Column - Content */}
                        <div style={ogRightCol}>
                            {/* Header */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: OG_FONTS.title, fontWeight: "bold", lineHeight: 1.1 }}>
                                    {oracle.title}
                                </span>
                            </div>

                            {/* Insight body */}
                            <div style={{ display: "flex", marginTop: "20px", marginBottom: "20px" }}>
                                <span style={{ fontSize: OG_FONTS.body + 4, lineHeight: 1.6, color: OG_COLORS.primary }}>
                                    {displayInsight}
                                </span>
                            </div>

                            {/* Action Box - Highlighted */}
                            <div style={{
                                padding: "16px 24px",
                                background: "rgba(159, 43, 255, 0.1)",
                                borderRadius: "12px",
                                borderLeft: `4px solid ${OG_COLORS.accent}`,
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                <span style={{ fontSize: 12, textTransform: "uppercase", color: OG_COLORS.accent, fontWeight: "bold", marginBottom: "4px" }}>
                                    Acțiunea Zilei
                                </span>
                                <span style={{ fontSize: OG_FONTS.body, fontStyle: "italic" }}>
                                    {truncateText(oracle.action, 100)}
                                </span>
                            </div>

                            {/* Footer / Mantra */}
                            <div style={{ display: "flex", marginTop: "30px", paddingTop: "20px", borderTop: `1px solid ${OG_COLORS.border}` }}>
                                <span style={{ fontSize: OG_FONTS.body, fontStyle: "italic", color: OG_COLORS.muted }}>
                                    &ldquo;{oracle.mantra}&rdquo;
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
