/**
 * Dynamic OG Image for Daily Energy (Energia Zilei)
 * 
 * ENHANCED: Gold/amber themed "Cosmic Forecast" design
 * 
 * Supports multiple formats: og, story, feed, square
 * Route: /api/og/energia-zilei/[date]?format=og|story|feed|square
 */

import { DailyEnergyOGContent } from "@/components/og/og-content-adapters";
import { createOGImageResponse } from "@/components/og/og-image-frame";
import { getOGFormatContext } from "@/lib/og-composition";
import {
    getBucharestCalendarDate,
    parseCalendarDate,
    type CalendarDate,
} from "@/lib/bucharest-calendar";
import { getEnergiaZilei } from "@/lib/energia-zilei";
import { OG_CACHE } from "@/lib/og-helpers";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ date: string }> }
) {
    const { date: dateStr } = await params;

    const { format, isVertical } = getOGFormatContext(request);

    let targetCalendarDate: CalendarDate;
    try {
        if (dateStr === "today" || dateStr === "azi") {
            targetCalendarDate = getBucharestCalendarDate();
        } else {
            parseCalendarDate(dateStr);
            targetCalendarDate = dateStr;
        }
    } catch {
        return new Response("Invalid date format. Use YYYY-MM-DD or 'today'", { status: 400 });
    }

    return createOGImageResponse({
        contentType: "energia-zilei",
        format,
        cacheControl: OG_CACHE.DAILY,
        gap: isVertical ? "16px" : "10px",
        children: (
            <DailyEnergyOGContent
                date={targetCalendarDate}
                energia={getEnergiaZilei(parseCalendarDate(targetCalendarDate))}
                isVertical={isVertical}
            />
        ),
    });
}
