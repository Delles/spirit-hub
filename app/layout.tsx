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
  title: "SpiritHub.ro - Numerologie și Bioritm",
  description:
    "Platformă spirituală românească pentru numerologie și bioritm. Descoperă-ți numărul destinului și urmărește ciclurile tale fizice, emoționale și intelectuale.",
  keywords: [
    "numerologie",
    "bioritm",
    "spiritualitate",
    "românia",
    "număr destin",
    "calea vietii",
    "compatibilitate numerologica",
  ],
  authors: [{ name: "SpiritHub.ro" }],
  metadataBase: new URL("https://www.spirithub.ro"),
  openGraph: {
    title: "SpiritHub.ro - Numerologie și Bioritm",
    description:
      "Platformă spirituală românească pentru numerologie și bioritm. Descoperă-ți numărul destinului.",
    locale: "ro_RO",
    type: "website",
    siteName: "SpiritHub.ro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SpiritHub.ro - Numerologie și Bioritm",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpiritHub.ro - Numerologie și Bioritm",
    description:
      "Platformă spirituală românească pentru numerologie și bioritm.",
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
