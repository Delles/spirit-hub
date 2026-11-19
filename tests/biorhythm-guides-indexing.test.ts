import { describe, expect, test } from "bun:test";
import sitemap from "@/app/sitemap";
import { getGuideBySlug, guides } from "@/data/guides";

function collectGuideText(slug: string): string {
  const guide = getGuideBySlug(slug);
  expect(guide).toBeDefined();

  return [
    guide!.intro,
    ...guide!.sections.flatMap((section) => [section.heading, ...section.body]),
    ...guide!.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ");
}

describe("biorhythm guides authority and indexing", () => {
  test("all three biorhythm-related guides exist with updatedAt 2026-11-19", () => {
    const slugs = [
      "ce-este-bioritmul",
      "zile-critice-in-bioritm",
      "energia-zilei-cum-sa-o-folosesti",
    ];

    for (const slug of slugs) {
      const guide = getGuideBySlug(slug);
      expect(guide).toBeDefined();
      expect(guide!.updatedAt).toBe("2026-11-19");
    }
  });

  test("ce-este-bioritmul documents sine formula, compatibility link, and symbolic limits", () => {
    const guide = getGuideBySlug("ce-este-bioritmul")!;
    const content = collectGuideText("ce-este-bioritmul");
    const relatedHrefs = guide.relatedLinks?.map((link) => link.href) ?? [];

    expect(content).toContain("sin(");
    expect(content).toMatch(/nu (?:este|reprezintă) o metodă științifică/i);
    expect(relatedHrefs).toContain("/bioritm/compatibilitate");
  });

  test("zile-critice-in-bioritm documents ±0,15 threshold, worked 23-day example, and limits", () => {
    const guide = getGuideBySlug("zile-critice-in-bioritm")!;
    const content = collectGuideText("zile-critice-in-bioritm");
    const relatedHrefs = guide.relatedLinks?.map((link) => link.href) ?? [];

    expect(content).toMatch(/0[,.]15/);
    expect(content).toContain("23 de zile");
    expect(content).toContain("ziua 11");
    expect(content).toContain("ziua 12");
    expect(content).toContain("nu reprezintă o metodă științifică");
    expect(relatedHrefs).toContain("/bioritm/compatibilitate");
  });

  test("energia-zilei-cum-sa-o-folosesti documents daily combination, reflection loop, and limits", () => {
    const guide = getGuideBySlug("energia-zilei-cum-sa-o-folosesti")!;
    const content = collectGuideText("energia-zilei-cum-sa-o-folosesti");
    const relatedHrefs = guide.relatedLinks?.map((link) => link.href) ?? [];

    expect(content).toContain("planetară");
    expect(content).toContain("numărul zilnic");
    expect(content).toContain("bioritmul");
    expect(content).toContain("Dimineața");
    expect(content).toContain("Seara");
    expect(content).toContain("Nu este o metodă științifică");
    expect(relatedHrefs).toContain("/bioritm/compatibilitate");
  });

  test("sitemap includes /bioritm/compatibilitate and all 6 guide URLs", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://www.spirithub.ro/bioritm/compatibilitate");
    expect(guides).toHaveLength(6);

    for (const guide of guides) {
      expect(urls).toContain(`https://www.spirithub.ro/ghiduri/${guide.slug}`);
    }
  });
});
