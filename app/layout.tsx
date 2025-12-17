import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./convex-provider";
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
  title: "SpiritHub.ro - Numerologie, Interpretare Vise, Bioritm",
  description:
    "Platformă spirituală românească pentru numerologie, interpretare vise și calcul bioritm. Descoperă-ți numărul destinului, interpretează visele și urmărește ciclurile tale fizice, emoționale și intelectuale.",
  keywords: [
    "numerologie",
    "interpretare vise",
    "bioritm",
    "spiritualitate",
    "românia",
    "număr destin",
    "vise",
  ],
  authors: [{ name: "SpiritHub.ro" }],
  metadataBase: new URL("https://spirithub.ro"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SpiritHub.ro - Numerologie, Interpretare Vise, Bioritm",
    description:
      "Platformă spirituală românească pentru numerologie, interpretare vise și calcul bioritm.",
    locale: "ro_RO",
    type: "website",
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
        <ConvexClientProvider>
          <DailyContentProvider>
            {children}
          </DailyContentProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
