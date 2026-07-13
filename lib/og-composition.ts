import {
  IMAGE_FORMATS,
  OG_CACHE,
  type ImageFormat,
  type OGContentType,
} from "@/lib/og-helpers";

export interface OGFormatContext {
  format: ImageFormat;
  width: number;
  height: number;
  isVertical: boolean;
}

export interface OGFrameConfigInput {
  contentType: OGContentType;
  format: ImageFormat;
  cacheControl: (typeof OG_CACHE)[keyof typeof OG_CACHE];
  gap?: string;
}

export interface OGFrameConfig {
  contentType: OGContentType;
  format: ImageFormat;
  width: number;
  height: number;
  isVertical: boolean;
  cacheControl: (typeof OG_CACHE)[keyof typeof OG_CACHE];
  gap: string;
}

export function getOGFormatContext(request: Request): OGFormatContext {
  const formatParam = new URL(request.url).searchParams.get("format") || "og";
  const isKnownFormat = Object.prototype.hasOwnProperty.call(IMAGE_FORMATS, formatParam);
  const format = (isKnownFormat ? formatParam : "og") as ImageFormat;
  const dimensions = IMAGE_FORMATS[format];

  return {
    format,
    width: dimensions.width,
    height: dimensions.height,
    isVertical: dimensions.isVertical,
  };
}

export function getOGFrameConfig({
  contentType,
  format,
  cacheControl,
  gap,
}: OGFrameConfigInput): OGFrameConfig {
  const dimensions = IMAGE_FORMATS[format];

  return {
    contentType,
    format,
    width: dimensions.width,
    height: dimensions.height,
    isVertical: dimensions.isVertical,
    cacheControl,
    gap: gap ?? (dimensions.isVertical ? "20px" : "12px"),
  };
}
