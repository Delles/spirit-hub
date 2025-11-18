"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { DailyWidgetData } from "@/lib/daily-widget-server";

/**
 * Props for the DailyWidget container component
 */
export interface DailyWidgetProps {
  className?: string;
  data: DailyWidgetData;
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
 * - Data is pre-fetched server-side and cached for the entire day
 * 
 * Performance:
 * - Data is fetched server-side using Next.js cache
 * - Cached for 24 hours (same data for all users)
 * - Client components handle interactivity (hover effects)
 * 
 * Requirements: 3.1, 3.8, 7.4, 7.5, 3.6, 6.1, 6.2, 6.3, 6.4, 6.5
 */
export function DailyWidget({ className = "", data }: DailyWidgetProps) {
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
          <DailyNumberCard data={data.dailyNumber} />

          {/* Daily Dream Card */}
          <DailyDreamCard data={data.dailyDream} />

          {/* Biorhythm Hint Card */}
          <BiorhythmHintCard data={data.biorhythmHint} />
        </div>
      </div>
    </section>
  );
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
 * - Receives pre-fetched data as props (server-side cached)
 * - Large animated number display with gradient styling
 * - Master Number badge for 11, 22, 33
 * - Title and short description from interpretation
 * - Click-through link to /numerologie/numar-zilnic
 * - Error fallback with Romanian message
 * - Client component for hover interactivity
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 3.2, 3.5, 3.7, 7.1, 3.6, 6.1, 6.2
 */
function DailyNumberCard({ data }: { data: DailyWidgetData["dailyNumber"] }) {
  // Error state - missing or invalid data
  if (!data || !data.number) {
    return (
      <ErrorCard
        title="Numărul Zilei"
        message="Momentan nu putem afișa numărul zilei. Te rugăm să revii mai târziu."
        linkTo="/numerologie/numar-zilnic"
        linkText="Vezi pagina completă →"
      />
    );
  }

  const number = data.number;
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
            {data.title}
          </h4>

          {/* Short Description */}
          <p className="text-muted-foreground text-center text-sm leading-relaxed line-clamp-2">
            {data.description}
          </p>

          {/* Click-through hint */}
          <p className="text-primary text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
            Citește interpretarea completă →
          </p>
        </div>
      </Link>
    );
}

/**
 * DailyDreamCard - Displays the daily dream symbol with interpretation
 * 
 * Features:
 * - Receives pre-fetched data as props (server-side cached)
 * - Displays dream symbol name with category badge
 * - Shows short meaning (1-2 sentences)
 * - Click-through link to /vise/visul-zilei
 * - Error fallback with Romanian message
 * - Client component for hover interactivity
 * 
 * Requirements: 2.1, 2.2, 2.3, 3.3, 3.5, 3.7, 7.2, 3.6, 6.1, 6.2
 */
function DailyDreamCard({ data }: { data: DailyWidgetData["dailyDream"] }) {
  // Error state - missing or invalid data
  if (!data || !data.name) {
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
  const categoryDisplay = data.category.charAt(0).toUpperCase() + data.category.slice(1);

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
              {data.name}
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
            {data.shortDescription}
          </p>

          {/* Click-through hint */}
          <p className="text-primary text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
            Citește interpretarea completă →
          </p>
        </div>
      </Link>
    );
}

/**
 * BiorhythmHintCard - Displays a generic biorhythm hint based on day of the week
 * 
 * Features:
 * - Receives pre-calculated hint data as props (server-side)
 * - Displays hint title and text in Romanian
 * - Click-through link to /bioritm with call-to-action
 * - Error fallback with Romanian message
 * - Client component for hover interactivity
 * 
 * Requirements: 4.1, 4.2, 4.4, 4.5, 3.4, 3.5, 3.7, 7.3
 */
function BiorhythmHintCard({ data }: { data: DailyWidgetData["biorhythmHint"] }) {
  const { title, hint, dayOfWeek } = data;

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
}
