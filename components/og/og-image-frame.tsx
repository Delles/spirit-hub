import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import {
  OG_CACHE,
  OGThemedFooter,
  getThemedStyles,
  type OGContentType,
} from "@/lib/og-helpers";
import { getOGFrameConfig } from "@/lib/og-composition";
import type { ImageFormat } from "@/lib/og-helpers";

export interface OGImageFrameOptions {
  contentType: OGContentType;
  format: ImageFormat;
  cacheControl: (typeof OG_CACHE)[keyof typeof OG_CACHE];
  children: ReactNode;
  gap?: string;
}

export function createOGImageResponse({
  contentType,
  format,
  cacheControl,
  children,
  gap,
}: OGImageFrameOptions): ImageResponse {
  const frame = getOGFrameConfig({ contentType, format, cacheControl, gap });
  const { containerStyle, glowStyle, brandPillStyle, theme } = getThemedStyles(
    contentType,
    frame.isVertical,
  );

  const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    borderRadius: frame.isVertical ? "32px" : "20px",
    border: `1px solid ${theme.accent}30`,
    background: "rgba(255, 255, 255, 0.03)",
    boxShadow: `0 0 ${frame.isVertical ? 100 : 80}px ${theme.glowColor}30`,
    padding: frame.isVertical ? "50px 40px" : "24px",
    position: "relative",
    overflow: "hidden",
  };

  const layoutStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    textAlign: "center",
    gap: frame.gap,
    paddingBottom: frame.isVertical ? "100px" : "70px",
  };

  return new ImageResponse(
    <div style={containerStyle}>
      <div style={glowStyle} />
      <div style={cardStyle}>
        <div style={layoutStyle}>
          <div style={brandPillStyle}>
            <span>{theme.emoji} {theme.label}</span>
          </div>
          {children}
        </div>
        <OGThemedFooter contentType={contentType} isVertical={frame.isVertical} />
      </div>
    </div>,
    {
      width: frame.width,
      height: frame.height,
      headers: { "Cache-Control": frame.cacheControl },
    },
  );
}
