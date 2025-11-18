"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getBiorhythmHintForDay } from "@/lib/biorhythm";

/**
 * Props for the DailyWidget container component
 */
export interface DailyWidgetProps {
  className?: string;
}

/**
 * Props for the ErrorCard component
 */
interface ErrorCardProps {
  title: string;
  message: string;
  linkTo: string;
  linkText: string;
}

/**
 * DailyWidget - Container component that displays daily spiritual content
 * 
 * Features:
 * - Responsive grid layout (3 columns on desktop, 1 column on mobile)
 * - Semi-transparent background with backdrop blur
 * - Follows design.json specifications for styling
 * - Independent error handling for each card
 * - Optimized for parallel query execution
 * 
 * Performance:
 * - All three queries execute in parallel via independent useQuery hooks
 * - Caching handled by Convex dailyPicks table for daily number and dream
 * - Client-side calculation for biorhythm hint (no query needed)
 * 
 * Requirements: 3.1, 3.8, 7.4, 7.5, 3.6, 6.1, 6.2, 6.3, 6.4, 6.5
 */
export function DailyWidget({ className = "" }: DailyWidgetProps) {
  // Pre-compute today's ISO date once at component level for all cards
  // This ensures consistency and avoids redundant date calculations
  const todayISO = getTodayISO();

  return (
    <section
      className={`w-full ${className}`}
      aria-labelledby="daily-widget-title"
    >
      {/* Screen reader title */}
      <h2 id="daily-widget-title" className="sr-only">
        Conținut zilnic spiritual
      </h2>

      {/* Widget Container with design.json styling */}
      <div
        className="w-full rounded-2xl border bg-card/50 backdrop-blur-[40px] border-border shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_80px_rgba(159,43,255,0.15)]"
      >
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
          {/* Daily Number Card */}
          <DailyNumberCard date={todayISO} />

          {/* Daily Dream Card */}
          <DailyDreamCard date={todayISO} />

          {/* Biorhythm Hint Card */}
          <BiorhythmHintCard />
        </div>
      </div>
    </section>
  );
}

/**
 * Helper: Get today's date in ISO format (YYYY-MM-DD) in Europe/Bucharest timezone
 */
function getTodayISO(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";

  return `${year}-${month}-${day}`;
}

/**
 * Helper: Check if a number is a Master Number (11, 22, 33)
 */
function isMasterNumber(num: number): boolean {
  return num === 11 || num === 22 || num === 33;
}

/**
 * ErrorCard - Reusable error display component for consistent error handling
 * 
 * Features:
 * - Consistent error styling across all cards
 * - User-friendly Romanian error messages
 * - Link to full page for fallback navigation
 * - Maintains widget layout even when errors occur
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
function ErrorCard({ title, message, linkTo, linkText }: ErrorCardProps) {
  return (
    <div className="flex flex-col space-y-4 min-h-[200px]">
      <h3 className="text-white font-semibold text-[clamp(20px,3vw,24px)] tracking-[-0.2px] leading-[1.4] text-center">
        {title}
      </h3>
      <div className="flex-1 flex flex-col justify-center space-y-4">
        {/* Error Icon */}
        <div className="flex items-center justify-center">
        <div className="p-3 rounded-full bg-destructive/10 border border-destructive/20">
          <svg
            className="w-8 h-8 stroke-destructive"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <p className="text-muted-foreground text-sm text-center px-4">
          {message}
        </p>

        {/* Fallback Link */}
        <Link
          href={linkTo}
          className="text-primary hover:underline text-sm text-center transition-colors"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}

/**
 * DailyNumberCard - Displays the daily numerology number with interpretation
 * 
 * Features:
 * - Fetches daily number from Convex getDailyNumber query
 * - Large animated number display with gradient styling
 * - Master Number badge for 11, 22, 33
 * - Title and short description from interpretation
 * - Click-through link to /numerologie/numar-zilnic
 * - Loading skeleton state
 * - Error fallback with Romanian message
 * - Independent error handling with console logging
 * - Uses dailyPicks table for caching (checked first, then fallback calculation)
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 3.2, 3.5, 3.7, 7.1, 3.6, 6.1, 6.2
 */
function DailyNumberCard({ date }: { date: string }) {
  try {
    // Query executes in parallel with other card queries
    // Caching: getDailyNumber checks dailyPicks table first, then calculates if missing
    const dailyNumber = useQuery(api.numerology.getDailyNumber, { date });

    // Loading state
    if (dailyNumber === undefined) {
      return (
        <div className="flex flex-col space-y-4 min-h-[200px]">
          <h3 className="text-white font-semibold text-[clamp(20px,3vw,24px)] tracking-[-0.2px] leading-[1.4] text-center">
            Numărul Zilei
          </h3>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <Skeleton className="h-24 w-24 mx-auto rounded-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
      );
    }

    // Error state - missing or invalid data
    if (!dailyNumber || !dailyNumber.number) {
      console.error("[DailyNumberCard] Invalid data received:", dailyNumber);
      return (
        <ErrorCard
          title="Numărul Zilei"
          message="Momentan nu putem afișa numărul zilei. Te rugăm să revii mai târziu."
          linkTo="/numerologie/numar-zilnic"
          linkText="Vezi pagina completă →"
        />
      );
    }

    const number = dailyNumber.number;
    const isMaster = isMasterNumber(number);

    return (
      <Link
        href="/numerologie/numar-zilnic"
        className="flex flex-col space-y-4 group cursor-pointer transition-transform hover:scale-[1.02] min-h-[200px]"
      >
        {/* Card Title with Master Number Badge */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-white font-semibold text-[clamp(20px,3vw,24px)] tracking-[-0.2px] leading-[1.4] text-center">
            Numărul Zilei
          </h3>
          {isMaster && (
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-none"
            >
              Maestru
            </Badge>
          )}
        </div>

        {/* Card Content */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {/* Large Animated Number with Gradient */}
          <div className="flex items-center justify-center py-4">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 blur-3xl rounded-full opacity-60 bg-gradient-to-r from-primary to-secondary" />
              {/* Number */}
              <div className="relative font-bold transition-transform group-hover:scale-110 text-[clamp(48px,8vw,72px)] bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {number}
              </div>
            </div>
          </div>

          {/* Title */}
          <h4 className="text-white text-center font-semibold text-[clamp(16px,2.5vw,18px)] tracking-[-0.1px]">
            {dailyNumber.title}
          </h4>

          {/* Short Description */}
          <p className="text-muted-foreground text-center text-sm leading-relaxed line-clamp-2">
            {dailyNumber.description}
          </p>

          {/* Click-through hint */}
          <p className="text-primary text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
            Citește interpretarea completă →
          </p>
        </div>
      </Link>
    );
  } catch (error) {
    // Catch any unexpected errors (network failures, query errors, etc.)
    console.error("[DailyNumberCard] Error rendering card:", error);
    return (
      <ErrorCard
        title="Numărul Zilei"
        message="Momentan nu putem afișa numărul zilei. Te rugăm să revii mai târziu."
        linkTo="/numerologie/numar-zilnic"
        linkText="Vezi pagina completă →"
      />
    );
  }
}

/**
 * DailyDreamCard - Displays the daily dream symbol with interpretation
 * 
 * Features:
 * - Fetches daily dream from Convex getDailyDream query
 * - Displays dream symbol name with category badge
 * - Shows short meaning (1-2 sentences)
 * - Click-through link to /vise/visul-zilei
 * - Loading skeleton state
 * - Error fallback with Romanian message
 * - Independent error handling with console logging
 * - Uses dailyPicks table for caching (checked first, then fallback calculation)
 * 
 * Requirements: 2.1, 2.2, 2.3, 3.3, 3.5, 3.7, 7.2, 3.6, 6.1, 6.2
 */
function DailyDreamCard({ date }: { date: string }) {
  try {
    // Query executes in parallel with other card queries
    // Caching: getDailyDream checks dailyPicks table first, then calculates if missing
    const dailyDream = useQuery(api.dreams.getDailyDream, { date });

    // Loading state
    if (dailyDream === undefined) {
      return (
        <div className="flex flex-col space-y-4 min-h-[200px]">
          <h3 className="text-white font-semibold text-[clamp(20px,3vw,24px)] tracking-[-0.2px] leading-[1.4] text-center">
            Visul Zilei
          </h3>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <Skeleton className="h-16 w-16 mx-auto rounded-lg" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
      );
    }

    // Error state - missing or invalid data
    if (!dailyDream || !dailyDream.name) {
      console.error("[DailyDreamCard] Invalid data received:", dailyDream);
      return (
        <ErrorCard
          title="Visul Zilei"
          message="Momentan nu putem afișa visul zilei. Te rugăm să revii mai târziu."
          linkTo="/vise/visul-zilei"
          linkText="Vezi pagina completă →"
        />
      );
    }

    // Format category for display (capitalize first letter)
    const categoryDisplay = dailyDream.category.charAt(0).toUpperCase() + dailyDream.category.slice(1);

    return (
      <Link
        href="/vise/visul-zilei"
        className="flex flex-col space-y-4 group cursor-pointer transition-transform hover:scale-[1.02] min-h-[200px]"
      >
        {/* Card Title */}
        <h3 className="text-white font-semibold text-[clamp(20px,3vw,24px)] tracking-[-0.2px] leading-[1.4] text-center">
          Visul Zilei
        </h3>

        {/* Card Content */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {/* Dream Symbol Icon/Visual */}
          <div className="flex items-center justify-center py-2">
            <div className="relative p-4 rounded-xl transition-transform group-hover:scale-110 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              {/* Moon icon as dream symbol placeholder */}
              <svg
                className="w-12 h-12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  stroke: "url(#dreamGradient)",
                  strokeWidth: 2,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                }}
              >
                <defs>
                  <linearGradient id="dreamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9F2BFF" />
                    <stop offset="100%" stopColor="#4D5FFF" />
                  </linearGradient>
                </defs>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          </div>

          {/* Dream Symbol Name with Category Badge */}
          <div className="space-y-2">
            <h4 className="text-white text-center font-semibold text-[clamp(16px,2.5vw,18px)] tracking-[-0.1px]">
              {dailyDream.name}
            </h4>
            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className="text-xs bg-primary/15 text-primary border-primary/30"
              >
                {categoryDisplay}
              </Badge>
            </div>
          </div>

          {/* Short Meaning */}
          <p className="text-muted-foreground text-center text-sm leading-relaxed line-clamp-2">
            {dailyDream.shortDescription}
          </p>

          {/* Click-through hint */}
          <p className="text-primary text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
            Citește interpretarea completă →
          </p>
        </div>
      </Link>
    );
  } catch (error) {
    // Catch any unexpected errors (network failures, query errors, etc.)
    console.error("[DailyDreamCard] Error rendering card:", error);
    return (
      <ErrorCard
        title="Visul Zilei"
        message="Momentan nu putem afișa visul zilei. Te rugăm să revii mai târziu."
        linkTo="/vise/visul-zilei"
        linkText="Vezi pagina completă →"
      />
    );
  }
}

/**
 * BiorhythmHintCard - Displays a generic biorhythm hint based on day of the week
 * 
 * Features:
 * - Client-side only (no Convex query needed)
 * - Calls getBiorhythmHintForDay with current date
 * - Displays hint title and text in Romanian
 * - Click-through link to /bioritm with call-to-action
 * - Error fallback with console logging
 * - Independent error handling
 * 
 * Requirements: 4.1, 4.2, 4.4, 4.5, 3.4, 3.5, 3.7, 7.3
 */
function BiorhythmHintCard() {
  try {
    // Get current date in Europe/Bucharest timezone
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Bucharest",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);

    const year = parseInt(parts.find((p) => p.type === "year")?.value ?? "0", 10);
    const month = parseInt(parts.find((p) => p.type === "month")?.value ?? "0", 10) - 1;
    const day = parseInt(parts.find((p) => p.type === "day")?.value ?? "0", 10);

    // Validate parsed date values
    if (!year || year === 0 || month < 0 || day === 0) {
      throw new Error("Invalid date values parsed from timezone formatter");
    }

    // Create date object in Bucharest timezone
    const bucharestDate = new Date(year, month, day);

    // Get biorhythm hint for today
    const { title, hint, dayOfWeek } = getBiorhythmHintForDay(bucharestDate);

    // Validate hint data
    if (!title || !hint || !dayOfWeek) {
      throw new Error("Invalid hint data returned from getBiorhythmHintForDay");
    }

    return (
      <Link
        href="/bioritm"
        className="flex flex-col space-y-4 group cursor-pointer transition-transform hover:scale-[1.02] min-h-[200px]"
      >
        {/* Card Title */}
        <h3 className="text-white font-semibold text-[clamp(20px,3vw,24px)] tracking-[-0.2px] leading-[1.4] text-center">
          Sfat Bioritm
        </h3>

        {/* Card Content */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {/* Biorhythm Icon/Visual */}
          <div className="flex items-center justify-center py-2">
            <div className="relative p-4 rounded-xl transition-transform group-hover:scale-110 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              {/* Sine wave icon representing biorhythm cycles */}
              <svg
                className="w-12 h-12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  stroke: "url(#bioGradient)",
                  strokeWidth: 2,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                }}
              >
                <defs>
                  <linearGradient id="bioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9F2BFF" />
                    <stop offset="100%" stopColor="#4D5FFF" />
                  </linearGradient>
                </defs>
                {/* Sine wave path */}
                <path d="M2 12 Q 6 6, 10 12 T 18 12 T 22 12" />
                <circle cx="12" cy="12" r="2" fill="url(#bioGradient)" />
              </svg>
            </div>
          </div>

          {/* Day of Week Badge */}
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="text-xs bg-primary/15 text-primary border-primary/30"
            >
              {dayOfWeek}
            </Badge>
          </div>

          {/* Hint Title */}
          <h4 className="text-white text-center font-semibold text-[clamp(16px,2.5vw,18px)] tracking-[-0.1px]">
            {title}
          </h4>

          {/* Hint Text */}
          <p className="text-muted-foreground text-center text-sm leading-relaxed line-clamp-2">
            {hint}
          </p>

          {/* Call-to-Action */}
          <p className="text-primary text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
            Calculează-ți bioritmul personal →
          </p>
        </div>
      </Link>
    );
  } catch (error) {
    // Error fallback with console logging for monitoring
    console.error("[BiorhythmHintCard] Error rendering card:", error);
    return (
      <ErrorCard
        title="Sfat Bioritm"
        message="Momentan nu putem afișa sfatul zilei. Te rugăm să revii mai târziu."
        linkTo="/bioritm"
        linkText="Vezi calculatorul de bioritm →"
      />
    );
  }
}
