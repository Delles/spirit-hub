import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { DailyContentProvider } from "@/components/providers/daily-content-provider";
import { LegalFooter } from "@/components/layout/legal-footer";
import { AdsenseScript } from "@/components/monetization/adsense-script";


const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Numerologie și Ghidaj Zilnic | SpiritHub.ro",
  description:
    "Instrumente gratuite de numerologie pentru calea vieții, numărul destinului, compatibilitate și energia zilei. Interpretări în limba română, fără cont.",
  keywords: [
    "calculator numerologie",
    "numerologie gratuit",
    "cifra destinului",
    "calea vietii",
    "compatibilitate numerologica",
    "energia zilei",
    "numar destin",
    "numerologie online",
  ],
  authors: [{ name: "SpiritHub.ro" }],
  metadataBase: new URL("https://www.spirithub.ro"),
  openGraph: {
    title: "Numerologie și Ghidaj Zilnic | SpiritHub.ro",
    description:
      "Instrumente gratuite de numerologie, compatibilitate și ghidaj zilnic în limba română.",
    locale: "ro_RO",
    type: "website",
    siteName: "SpiritHub.ro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Numerologie și Ghidaj Zilnic - SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Numerologie și Ghidaj Zilnic | SpiritHub.ro",
    description:
      "Instrumente gratuite de numerologie, compatibilitate și ghidaj zilnic în limba română.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="dark" suppressHydrationWarning>
      <head>
        <AdsenseScript />
      </head>
      <body className={`${inter.variable} ${cinzel.variable} font-sans antialiased`}>
        <DailyContentProvider>
          {children}
        </DailyContentProvider>
        <LegalFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
