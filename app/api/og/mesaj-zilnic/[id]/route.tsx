/**
 * Dynamic OG Image for Oracle Message (Mesaj Zilnic)
 * 
 * ENHANCED: Emerald mystical theme with "Universe says..." framing
 * 
 * Supports multiple formats: og, story, feed, square
 * Route: /api/og/mesaj-zilnic/[id]?format=og|story|feed|square
 */

import { OracleOGContent } from "@/components/og/og-content-adapters";
import { createOGImageResponse } from "@/components/og/og-image-frame";
import { getOGFormatContext } from "@/lib/og-composition";
import { getOracleById, OG_CACHE } from "@/lib/og-helpers";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);

    const { format, isVertical } = getOGFormatContext(request);

    if (isNaN(id) || id < 1) {
        return new Response("Invalid oracle message ID", { status: 400 });
    }

    const oracle = getOracleById(id);
    if (!oracle) {
        return new Response("Oracle message not found", { status: 404 });
    }

    return createOGImageResponse({
        contentType: "mesaj-zilnic",
        format,
        cacheControl: OG_CACHE.STATIC,
        gap: isVertical ? "24px" : "16px",
        children: <OracleOGContent oracle={oracle} isVertical={isVertical} />,
    });
}
