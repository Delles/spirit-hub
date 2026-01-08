/**
 * Common JSON-LD structured data types for SEO
 * See: https://schema.org
 */

export interface WebSiteJsonLd {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description?: string;
  inLanguage?: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

export interface OrganizationJsonLd {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

export interface ArticleJsonLd {
  "@context": "https://schema.org";
  "@type": "Article" | "BlogPosting";
  headline: string;
  description?: string;
  author?: {
    "@type": "Person" | "Organization";
    name: string;
  };
  datePublished?: string;
  dateModified?: string;
}

export interface FAQJsonLd {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export interface BreadcrumbJsonLd {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

// Union type for all supported JSON-LD schemas
export type JsonLdData = WebSiteJsonLd | OrganizationJsonLd | ArticleJsonLd | FAQJsonLd | BreadcrumbJsonLd | Record<string, unknown>;

/**
 * Helper to generate BreadcrumbList JSON-LD from an array of breadcrumb items
 * @param items - Array of { name, url } objects representing the breadcrumb trail
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url?: string }>
): BreadcrumbJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * Pre-configured Organization schema for SpiritHub
 */
export const SPIRITHUB_ORGANIZATION: OrganizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SpiritHub.ro",
  url: "https://spirithub.ro",
  logo: "https://spirithub.ro/icon-512.png",
  description: "Platformă spirituală românească pentru numerologie și bioritm.",
};

/**
 * Component to inject JSON-LD structured data into the page head
 * @param data - The structured data object conforming to schema.org specifications
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
