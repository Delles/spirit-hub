import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { DailyContentProvider } from "@/components/providers/daily-content-provider";


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
  title: "Calculator Numerologie și Bioritm Online Gratuit | SpiritHub.ro",
  description:
    "Calculator numerologie gratuit: descoperă cifra destinului, calea vieții și compatibilitatea numerologică. Bioritm azi - află ciclurile tale fizice, emoționale și intelectuale.",
  keywords: [
    "calculator numerologie",
    "numerologie gratuit",
    "bioritm calculator",
    "cifra destinului",
    "calea vietii",
    "compatibilitate numerologica",
    "bioritm azi",
    "numar destin",
    "numerologie online",
    "bioritm gratuit",
  ],
  authors: [{ name: "SpiritHub.ro" }],
  metadataBase: new URL("https://www.spirithub.ro"),
  openGraph: {
    title: "Calculator Numerologie și Bioritm Online Gratuit | SpiritHub.ro",
    description:
      "Calculator numerologie gratuit: descoperă cifra destinului, calea vieții și verifică-ți bioritmul zilnic.",
    locale: "ro_RO",
    type: "website",
    siteName: "SpiritHub.ro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Calculator Numerologie și Bioritm - SpiritHub.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculator Numerologie și Bioritm Gratuit | SpiritHub.ro",
    description:
      "Descoperă cifra destinului și verifică-ți bioritmul zilnic gratuit.",
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
      <body className={`${inter.variable} ${cinzel.variable} font-sans antialiased`}>
        <DailyContentProvider>
          {children}
        </DailyContentProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
