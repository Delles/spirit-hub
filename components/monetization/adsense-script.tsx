import { adsenseClientId } from "@/config/monetization";

export function AdsenseScript() {
  if (!adsenseClientId) return null;

  return (
    <script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
      crossOrigin="anonymous"
    />
  );
}
