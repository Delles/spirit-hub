/**
 * Dynamic OG Image for Destiny Number (Destinul)
 * 
 * ENHANCED: Identity-first design with archetype names and keyword badges
 * 
 * Supports multiple formats: og, story, feed, square
 * Route: /api/og/destin/[number]?format=og|story|feed|square
 */

import { DestinyOGContent } from "@/components/og/og-content-adapters";
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

    const { format, isVertical } = getOGFormatContext(request);

    if (isNaN(number) || number < 1 || (number > 9 && ![11, 22, 33].includes(number))) {
        return new Response("Invalid destiny number", { status: 400 });
    }

    const interpretation = getInterpretation<LifePathInterpretation>(
        "destiny", number, { useFallback: true }
    );

    if (!interpretation) {
        return new Response("Interpretation not found", { status: 404 });
    }

    return createOGImageResponse({
        contentType: "destin",
        format,
        cacheControl: OG_CACHE.STATIC,
        children: <DestinyOGContent number={number} interpretation={interpretation} isVertical={isVertical} />,
    });
}
