import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { MainLayout } from "@/components/layout/main-layout";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SpiritHub.ro - Numerologie, Interpretare Vise, Bioritm",
  description: "Platformă spirituală românească pentru numerologie, interpretare vise și calcul bioritm. Descoperă-ți numărul destinului, interpretează visele și urmărește ciclurile tale fizice, emoționale și intelectuale.",
  keywords: ["numerologie", "interpretare vise", "bioritm", "spiritualitate", "românia", "număr destin", "vise"],
  authors: [{ name: "SpiritHub.ro" }],
  openGraph: {
    title: "SpiritHub.ro - Numerologie, Interpretare Vise, Bioritm",
    description: "Platformă spirituală românească pentru numerologie, interpretare vise și calcul bioritm.",
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
    <html lang="ro" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
