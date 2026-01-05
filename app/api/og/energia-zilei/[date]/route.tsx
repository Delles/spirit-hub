/**
 * Dynamic OG Image for Daily Energy (Energia Zilei)
 * 
 * Generates personalized social share images for daily planetary energy.
 * Route: /api/og/energia-zilei/[date]
 */

import { ImageResponse } from "next/og";
import { getEnergiaZilei } from "@/lib/energia-zilei";
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
    { params }: { params: Promise<{ date: string }> }
) {
    const { date: dateStr } = await params;

    // Parse date (format: YYYY-MM-DD)
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

    // Get first 2 dos and don'ts
    const dos = energia.content.dos.slice(0, 2);
    const donts = energia.content.donts.slice(0, 2);

    // Energy level color
    const energyColor = energia.energyLevel >= 85 ? "#22C55E" :
        energia.energyLevel >= 70 ? "#F59E0B" : "#EF4444";

    return new ImageResponse(
        (
            <div style={ogContainerStyle}>
                <div style={ogGlowStyle} />
                <div style={ogCardStyle}>
                    <div style={ogSplitLayout}>
                        {/* Left Column - Planet/Energy */}
                        <div style={ogLeftCol}>
                            <div style={ogBrandPill}>
                                <span>⚡ ENERGIA ZILEI</span>
                            </div>
                            <span style={{ fontSize: 100, marginBottom: "10px" }}>
                                {getIconForName(energia.hero.icon)}
                            </span>
                            <span style={{ fontSize: 24, fontWeight: "bold", color: OG_COLORS.primary, marginTop: "10px", textAlign: "center", textTransform: "uppercase" }}>
                                {energia.hero.subtitle} • {energia.hero.title}
                            </span>

                            {/* Energy Level Bar */}
                            <div style={{ marginTop: "30px", width: "100%", paddingLeft: "20px", paddingRight: "20px", display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <span style={{ fontSize: 12, color: OG_COLORS.muted }}>Nivel Energie</span>
                                    <span style={{ fontSize: 12, fontWeight: "bold", color: energyColor }}>{energia.energyLevel}%</span>
                                </div>
                                <div style={{
                                    width: "100%",
                                    height: "8px",
                                    borderRadius: "4px",
                                    background: "rgba(255, 255, 255, 0.1)",
                                    position: "relative",
                                    overflow: "hidden",
                                    display: "flex"
                                }}>
                                    <div style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        height: "100%",
                                        width: `${energia.energyLevel}%`,
                                        background: energyColor,
                                        borderRadius: "4px",
                                    }} />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Content */}
                        <div style={ogRightCol}>
                            {/* Header */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: 16, textTransform: "uppercase", color: OG_COLORS.accent, marginBottom: "8px", letterSpacing: "0.1em", fontWeight: 600 }}>
                                    GUVERNATORUL ZILEI
                                </span>
                                <span style={{ fontSize: OG_FONTS.title, fontWeight: "bold", lineHeight: 1.1 }}>
                                    {energia.hero.title}
                                </span>
                                <span style={{ fontSize: OG_FONTS.body, color: OG_COLORS.muted, marginTop: "8px" }}>
                                    {energia.hero.headline}
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
                            <div style={{ display: "flex", flexDirection: "column", marginTop: "30px", paddingTop: "20px", borderTop: `1px solid ${OG_COLORS.border}` }}>
                                <span style={{ fontSize: OG_FONTS.body, fontStyle: "italic", color: OG_COLORS.muted, marginBottom: "20px" }}>
                                    &ldquo;{energia.mantra}&rdquo;
                                </span>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 20, fontWeight: 700, color: OG_COLORS.primary }}>SpiritHub.ro</span>
                                    <span style={{ fontSize: 16, color: OG_COLORS.accent, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                                        DESCOPERĂ MAI MULTE ➜
                                    </span>
                                </div>
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
