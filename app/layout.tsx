import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { MainLayout } from "@/components/layout/main-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <MainLayout>{children}</MainLayout>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
