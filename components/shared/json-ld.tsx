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

// Union type for all supported JSON-LD schemas
export type JsonLdData = WebSiteJsonLd | OrganizationJsonLd | ArticleJsonLd | FAQJsonLd | Record<string, unknown>;

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
