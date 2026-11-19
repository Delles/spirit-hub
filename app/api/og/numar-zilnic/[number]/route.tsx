/**
 * Dynamic OG Image for Daily Number (Număr Zilnic)
 * 
 * ENHANCED: Violet themed design with daily number display
 * 
 * Supports multiple formats: og, story, feed, square
 * Route: /api/og/numar-zilnic/[number]?format=og|story|feed|square
 */

import { DailyNumberOGContent } from "@/components/og/og-content-adapters";
import { createOGImageResponse } from "@/components/og/og-image-frame";
import { getOGFormatContext } from "@/lib/og-composition";
import { getInterpretation, type DailyInterpretation } from "@/lib/interpretations";
import { OG_CACHE } from "@/lib/og-helpers";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ number: string }> }
) {
    const { number: numberStr } = await params;
    const number = parseInt(numberStr, 10);

    const { format, isVertical } = getOGFormatContext(request);

    if (isNaN(number) || number < 1 || (number > 9 && ![11, 22, 33].includes(number))) {
        return new Response("Invalid daily number", { status: 400 });
    }

    const interpretation = getInterpretation<DailyInterpretation>(
        "daily", number, { useFallback: true }
    );

    if (!interpretation) {
        return new Response("Interpretation not found", { status: 404 });
    }

    return createOGImageResponse({
        contentType: "numar-zilnic",
        format,
        cacheControl: OG_CACHE.DAILY,
        children: <DailyNumberOGContent number={number} interpretation={interpretation} isVertical={isVertical} />,
    });
}
