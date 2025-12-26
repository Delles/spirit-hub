/**
 * Site Configuration
 *
 * Centralized configuration for SpiritHub.ro including branding,
 * navigation, SEO defaults, and social media links.
 */

export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  mainNav: NavItem[];
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    keywords: string[];
  };
}

export const siteConfig: SiteConfig = {
  name: "SpiritHub.ro",
  description: "Platformă spirituală românească pentru numerologie, interpretare vise și bioritm",
  url: "https://spirithub.ro",
  ogImage: "https://spirithub.ro/og-image.jpg",

  links: {
    facebook: undefined,
    instagram: undefined,
    twitter: undefined,
  },

  mainNav: [
    {
      title: "Numerologie",
      href: "/numerologie",
      description: "Descoperă-ți calea vieții, numărul destinului și compatibilitatea",
    },
    {
      title: "Bioritm",
      href: "/bioritm",
      description: "Calculează ciclurile tale fizice, emoționale și intelectuale",
    },
  ],

  seo: {
    defaultTitle: "SpiritHub.ro - Numerologie și Bioritm",
    titleTemplate: "%s | SpiritHub.ro",
    defaultDescription:
      "Descoperă-ți calea spirituală cu instrumente moderne de numerologie și calcul bioritm. Ghidaj zilnic gratuit în limba română.",
    keywords: [
      "numerologie",
      "bioritm",
      "calea vieții",
      "număr destin",
      "compatibilitate numerologică",
      "energia zilei",
      "zile critice",
      "spiritualitate",
      "ghidaj spiritual",
      "România",
    ],
  },
} as const;
