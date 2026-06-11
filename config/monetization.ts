/**
 * Monetization configuration.
 *
 * Ads stay completely disabled until the public AdSense client id and slot ids
 * are configured in the deployment environment.
 */

export const adsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT ?? "";

export const adSlots = {
  resultInline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT_INLINE ?? "",
  contentFooter: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT_FOOTER ?? "",
} as const;

export const monetizationEnabled = Boolean(adsenseClientId);
