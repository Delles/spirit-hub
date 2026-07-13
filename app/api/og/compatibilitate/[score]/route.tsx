/**
 * Dynamic OG Image for Compatibility (Compatibilitate)
 * 
 * ENHANCED: Visual score display with themed colors
 * 
 * Supports multiple formats: og, story, feed, square
 * Route: /api/og/compatibilitate/[score]?format=og|story|feed|square
 */

import { CompatibilityOGContent } from "@/components/og/og-content-adapters";
import { createOGImageResponse } from "@/components/og/og-image-frame";
import { getOGFormatContext } from "@/lib/og-composition";
import { getInterpretation, type CompatibilityInterpretation } from "@/lib/interpretations";
import { getCompatibilityBucket, OG_CACHE } from "@/lib/og-helpers";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ score: string }> }
) {
    const { score: scoreStr } = await params;
    const score = parseInt(scoreStr, 10);

    const { format, isVertical } = getOGFormatContext(request);

    if (isNaN(score) || score < 0 || score > 100) {
        return new Response("Invalid compatibility score (0-100)", { status: 400 });
    }

    const bucket = getCompatibilityBucket(score);
    const interpretation = getInterpretation<CompatibilityInterpretation>(
        "compatibility", bucket, { useFallback: false }
    );

    if (!interpretation) {
        return new Response("Interpretation not found", { status: 404 });
    }

    return createOGImageResponse({
        contentType: "compatibilitate",
        format,
        cacheControl: OG_CACHE.STATIC,
        children: <CompatibilityOGContent score={score} interpretation={interpretation} isVertical={isVertical} />,
    });
}
