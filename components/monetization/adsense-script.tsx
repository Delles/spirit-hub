import Script from "next/script";
import { adsenseClientId } from "@/config/monetization";

export function AdsenseScript() {
  if (!adsenseClientId) return null;

  return (
    <Script
      id="adsense-script"
      strategy="afterInteractive"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
      crossOrigin="anonymous"
    />
  );
}
