import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FAQSection } from "@/components/shared/faq-section";
import { JsonLd } from "@/components/shared/json-ld";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";
import { generateFAQJsonLd } from "@/lib/faq-schema";
import { getGuideBySlug, guides } from "@/data/guides";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  const canonical = `https://www.spirithub.ro/ghiduri/${guide.slug}`;

  return {
    title: `${guide.title} | SpiritHub.ro`,
    description: guide.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${guide.title} | SpiritHub.ro`,
      description: guide.description,
      type: "article",
      locale: "ro_RO",
      url: canonical,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.title} | SpiritHub.ro`,
      description: guide.description,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const url = `https://www.spirithub.ro/ghiduri/${guide.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.updatedAt,
    dateModified: guide.updatedAt,
    inLanguage: "ro-RO",
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: "SpiritHub.ro",
      url: "https://www.spirithub.ro",
    },
    publisher: {
      "@type": "Organization",
      name: "SpiritHub.ro",
      url: "https://www.spirithub.ro",
    },
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Acasă", url: "https://www.spirithub.ro" },
          { name: "Ghiduri", url: "https://www.spirithub.ro/ghiduri" },
          { name: guide.title },
        ]}
      />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={generateFAQJsonLd(guide.faqs)} />

      <article className="mx-auto max-w-4xl px-4 py-10">
        <Link
          href="/ghiduri"
          className="mb-6 inline-flex items-center text-sm font-medium text-[#A5B4FC] hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Toate ghidurile
        </Link>

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[#A5B4FC]">
            <span className="rounded-full border border-[#9F2BFF]/30 bg-[#9F2BFF]/10 px-3 py-1">
              {guide.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {guide.readMinutes} min de citit
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl">
            {guide.title}
          </h1>
          <p className="text-lg leading-relaxed text-[#E0E0E0]">{guide.intro}</p>
        </header>

        <Card className="mb-8 p-5">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-[#A5B4FC]">
            Încearcă instrumentul gratuit
          </p>
          <h2 className="mb-2 text-xl font-semibold text-white">{guide.cta.label}</h2>
          <p className="mb-4 text-[#E0E0E0]/80">{guide.cta.text}</p>
          <Link
            href={guide.cta.href}
            className="inline-flex items-center rounded-md bg-[#9F2BFF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#8A24E0]"
          >
            Deschide calculatorul
            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" aria-hidden="true" />
          </Link>
        </Card>

        <div className="space-y-8">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 text-2xl font-semibold text-white">{section.heading}</h2>
              <div className="space-y-4 text-base leading-relaxed text-[#E0E0E0]/85">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10">
          <FAQSection faqs={guide.faqs} />
        </div>
      </article>
    </>
  );
}
