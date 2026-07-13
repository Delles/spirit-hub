import type { CSSProperties } from "react";
import type {
  CompatibilityInterpretation,
  DailyInterpretation,
  LifePathInterpretation,
} from "@/lib/interpretations";
import type { EnergiaZileiData } from "@/lib/energia-zilei";
import {
  OGArchetypeTitle,
  OGKeywordBadges,
  OGPersonalFrame,
  OG_COLORS,
  OG_FONTS,
  OG_FONTS_VERTICAL,
  getScoreColor,
  getThemedStyles,
  truncateText,
} from "@/lib/og-helpers";
import { formatRomanianCalendarDate, type CalendarDate } from "@/lib/bucharest-calendar";

interface OGContentLayoutProps {
  isVertical: boolean;
}

interface NumerologyOGContentProps extends OGContentLayoutProps {
  contentType: "calea-vietii" | "destin";
  number: number;
  interpretation: LifePathInterpretation;
}

function getQuoteStyle(isVertical: boolean, marginTop?: string): CSSProperties {
  return {
    fontSize: isVertical ? OG_FONTS_VERTICAL.quote : OG_FONTS.quote,
    fontStyle: "italic",
    color: OG_COLORS.muted,
    lineHeight: 1.4,
    maxWidth: "85%",
    ...(marginTop ? { marginTop } : {}),
  };
}

function NumerologyOGContent({
  contentType,
  number,
  interpretation,
  isVertical,
}: NumerologyOGContentProps) {
  const { heroNumberStyle, theme } = getThemedStyles(contentType, isVertical);
  const quoteStyle = getQuoteStyle(isVertical, isVertical ? "16px" : "8px");

  return (
    <>
      <OGPersonalFrame text={theme.personalFrame} isVertical={isVertical} />
      <span style={heroNumberStyle}>{number}</span>
      <OGArchetypeTitle
        title={interpretation.hero.title}
        isVertical={isVertical}
        accentColor={theme.accent}
      />
      <OGKeywordBadges
        keywords={interpretation.tags || []}
        isVertical={isVertical}
        accentColor={theme.accent}
      />
      <span style={quoteStyle}>
        &ldquo;{truncateText(interpretation.mantra, isVertical ? 70 : 45)}&rdquo;
      </span>
    </>
  );
}

export function LifePathOGContent({
  number,
  interpretation,
  isVertical,
}: Omit<NumerologyOGContentProps, "contentType">) {
  return (
    <NumerologyOGContent
      contentType="calea-vietii"
      number={number}
      interpretation={interpretation}
      isVertical={isVertical}
    />
  );
}

export function DestinyOGContent({
  number,
  interpretation,
  isVertical,
}: Omit<NumerologyOGContentProps, "contentType">) {
  return (
    <NumerologyOGContent
      contentType="destin"
      number={number}
      interpretation={interpretation}
      isVertical={isVertical}
    />
  );
}

interface DailyNumberOGContentProps extends OGContentLayoutProps {
  number: number;
  interpretation: DailyInterpretation;
}

export function DailyNumberOGContent({
  number,
  interpretation,
  isVertical,
}: DailyNumberOGContentProps) {
  const { heroNumberStyle, theme } = getThemedStyles("numar-zilnic", isVertical);
  const quoteStyle = getQuoteStyle(isVertical, isVertical ? "16px" : "8px");

  return (
    <>
      <span
        style={{
          fontSize: isVertical ? 36 : 24,
          color: OG_COLORS.muted,
          fontWeight: 500,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {theme.personalFrame}
      </span>
      <span style={heroNumberStyle}>{number}</span>
      <OGArchetypeTitle
        title={interpretation.hero.title}
        isVertical={isVertical}
        accentColor={theme.accent}
      />
      <OGKeywordBadges
        keywords={interpretation.tags || []}
        isVertical={isVertical}
        accentColor={theme.accent}
      />
      <span style={quoteStyle}>
        &ldquo;{truncateText(interpretation.mantra, isVertical ? 70 : 45)}&rdquo;
      </span>
    </>
  );
}

interface CompatibilityOGContentProps extends OGContentLayoutProps {
  score: number;
  interpretation: CompatibilityInterpretation;
}

export function CompatibilityOGContent({
  score,
  interpretation,
  isVertical,
}: CompatibilityOGContentProps) {
  const { theme } = getThemedStyles("compatibilitate", isVertical);
  const scoreColor = getScoreColor(score);
  const heroScoreStyle: CSSProperties = {
    fontSize: isVertical ? 320 : 220,
    fontWeight: 800,
    color: scoreColor,
    lineHeight: 1,
    textShadow: `0 0 80px ${scoreColor}60`,
  };
  const percentStyle: CSSProperties = {
    fontSize: isVertical ? 120 : 80,
    fontWeight: 800,
    color: scoreColor,
  };
  const titleStyle: CSSProperties = {
    fontSize: isVertical ? OG_FONTS_VERTICAL.title : OG_FONTS.title,
    fontWeight: "bold",
    color: OG_COLORS.primary,
    lineHeight: 1.2,
    maxWidth: "90%",
  };
  const quoteStyle = getQuoteStyle(isVertical);

  return (
    <>
      <span
        style={{
          fontSize: isVertical ? 36 : 24,
          color: OG_COLORS.muted,
          fontWeight: 500,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {theme.personalFrame}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
        <span style={heroScoreStyle}>{score}</span>
        <span style={percentStyle}>%</span>
      </div>
      <span style={titleStyle}>{interpretation.hero.title}</span>
      <span style={quoteStyle}>
        &ldquo;{truncateText(interpretation.content.mantra, isVertical ? 70 : 45)}&rdquo;
      </span>
    </>
  );
}

interface DailyEnergyOGContentProps extends OGContentLayoutProps {
  date: CalendarDate;
  energia: EnergiaZileiData;
}

export function DailyEnergyOGContent({
  date,
  energia,
  isVertical,
}: DailyEnergyOGContentProps) {
  const { theme } = getThemedStyles("energia-zilei", isVertical);
  const energyColor = getScoreColor(energia.energyLevel);
  const quoteStyle = getQuoteStyle(isVertical);

  return (
    <>
      <span
        style={{
          fontSize: isVertical ? 28 : 20,
          color: theme.accent,
          fontWeight: 600,
          letterSpacing: "0.1em",
        }}
      >
        {formatRomanianCalendarDate(date)}
      </span>
      <span
        style={{
          fontSize: isVertical ? 200 : 140,
          lineHeight: 1,
          textShadow: `0 0 60px ${theme.glowColor}`,
        }}
      >
        {energia.hero.icon}
      </span>
      <span
        style={{
          fontSize: isVertical ? OG_FONTS_VERTICAL.subtitle : OG_FONTS.subtitle,
          color: OG_COLORS.primary,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 700,
        }}
      >
        {energia.hero.subtitle} · {energia.hero.title}
      </span>
      <span style={quoteStyle}>
        &ldquo;{truncateText(energia.mantra, isVertical ? 70 : 50)}&rdquo;
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginTop: isVertical ? "16px" : "8px",
          padding: isVertical ? "16px 32px" : "10px 24px",
          borderRadius: "100px",
          background: `${energyColor}15`,
          border: `1px solid ${energyColor}30`,
        }}
      >
        <span style={{ fontSize: isVertical ? 24 : 18, color: OG_COLORS.muted }}>
          Energie
        </span>
        <span style={{ fontSize: isVertical ? 40 : 28, fontWeight: "bold", color: energyColor }}>
          {energia.energyLevel}%
        </span>
      </div>
    </>
  );
}

type OracleOGContentProps = OGContentLayoutProps & {
  oracle: {
    mantra: string;
    title: string;
  };
};

export function OracleOGContent({ oracle, isVertical }: OracleOGContentProps) {
  const { theme } = getThemedStyles("mesaj-zilnic", isVertical);
  const oracleIconStyle: CSSProperties = {
    fontSize: isVertical ? 160 : 100,
    lineHeight: 1,
    textShadow: `0 0 60px ${theme.glowColor}`,
  };
  const quoteStyle: CSSProperties = {
    fontSize: isVertical ? OG_FONTS_VERTICAL.quote + 8 : OG_FONTS.quote + 6,
    fontStyle: "italic",
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: 1.3,
    maxWidth: "90%",
  };
  const titleStyle: CSSProperties = {
    fontSize: isVertical ? 48 : 36,
    fontWeight: "bold",
    color: theme.accent,
    letterSpacing: "0.02em",
  };

  return (
    <>
      <span
        style={{
          fontSize: isVertical ? 32 : 22,
          color: OG_COLORS.muted,
          fontWeight: 500,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {theme.personalFrame}
      </span>
      <span style={oracleIconStyle}>🔮</span>
      <span style={quoteStyle}>
        &ldquo;{truncateText(oracle.mantra, isVertical ? 80 : 55)}&rdquo;
      </span>
      <span style={titleStyle}>{oracle.title}</span>
    </>
  );
}
