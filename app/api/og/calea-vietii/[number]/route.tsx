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

import { LifePathOGContent } from "@/components/og/og-content-adapters";
import { createOGImageResponse } from "@/components/og/og-image-frame";
import { getOGFormatContext } from "@/lib/og-composition";
import { getInterpretation, type LifePathInterpretation } from "@/lib/interpretations";
import { OG_CACHE } from "@/lib/og-helpers";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ number: string }> }
) {
    const { number: numberStr } = await params;
    const number = parseInt(numberStr, 10);

    // Get format from query string
    const { format, isVertical } = getOGFormatContext(request);

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

    return createOGImageResponse({
        contentType: "calea-vietii",
        format,
        cacheControl: OG_CACHE.STATIC,
        children: <LifePathOGContent number={number} interpretation={interpretation} isVertical={isVertical} />,
    });
}
