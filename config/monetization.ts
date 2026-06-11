/**
 * Monetization configuration.
 *
 * The public AdSense publisher id is safe to ship in client code and is needed
 * for Google site ownership review. Slot ids still stay disabled until they are
 * configured in the deployment environment.
 */

export const adsenseClientId =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT ?? "ca-pub-8681888147711861";

export const adSlots = {
  resultInline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT_INLINE ?? "",
  contentFooter: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT_FOOTER ?? "",
} as const;

export const monetizationEnabled = Boolean(adsenseClientId);
