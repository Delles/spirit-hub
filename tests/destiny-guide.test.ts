import { describe, expect, test } from "bun:test";
import { getGuideBySlug } from "@/data/guides";

describe("destiny-number guide authority", () => {
  test("documents the implemented method, a worked example, and interpretation limits", () => {
    const guide = getGuideBySlug("cum-se-calculeaza-numarul-destinului");

    expect(guide).toBeDefined();

    const content = guide!.sections.flatMap((section) => section.body).join(" ");
    const relatedHrefs = guide!.relatedLinks?.map((link) => link.href) ?? [];

    expect(content).toContain("A, J și S");
    expect(content).toContain("Ion Popescu");
    expect(content).toContain("52");
    expect(content).toContain("numerele maestre 11, 22 și 33");
    expect(content).toContain("nu este o metodă științifică");
    expect(relatedHrefs).toContain("/ghiduri/ce-este-calea-vietii-in-numerologie");
    expect(relatedHrefs).toContain("/ghiduri/compatibilitate-numerologica-interpretare-scor");
  });
});
