import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");

const INTERPRETATION_FILES = [
  "data/interpretations/compatibility.json",
  "data/interpretations/energy.json",
  "data/interpretations/life-path.json",
  "data/interpretations/destiny.json",
  "data/interpretations/biorhythm.json",
  "data/interpretations/personal-year.json",
] as const;

const CLEANED_UI_FILES = [
  "app/bioritm/client.tsx",
  "app/bioritm/critice/view.tsx",
  "app/bioritm/energia-zilei/client.tsx",
  "app/mesaj-zilnic/page.tsx",
  "app/numerologie/calea-vietii/client.tsx",
  "app/numerologie/numar-zilnic/client.tsx",
  "app/numerologie/nume-destin/client.tsx",
  "app/numerologie/an-personal/client.tsx",
  "app/numerologie/an-personal/page.tsx",
  "app/confidentialitate/page.tsx",
  "components/numerologie/daily-card.tsx",
  "components/numerologie/destiny-card.tsx",
  "components/numerologie/life-path-card.tsx",
  "app/despre/page.tsx",
] as const;

const BANNED_JSON_STRINGS = [
  "Dormește",
  "Făceți",
  "performă",
  "statistic mai mare",
  "astrele numerologice",
  "Uniunea Divină",
  "motor V12",
  "out of the box",
  "Receptaculul Divin",
  "vampirizat",
  "gresit",
  "—",
  "–",
] as const;

interface InterpretationEntry {
  hero?: {
    title?: string;
    subtitle?: string;
  };
  content?: {
    main_text?: string;
    dos?: string[];
    donts?: string[];
    mantra?: string;
  };
  mantra?: string;
}

function readRepoFile(relativePath: string): string {
  return readFileSync(resolve(ROOT, relativePath), "utf8");
}

describe("interpretation datasets quality", () => {
  test("all 5 JSON files parse cleanly and every entry has non-empty hero.title and content.main_text", () => {
    for (const file of INTERPRETATION_FILES) {
      const parsed = JSON.parse(readRepoFile(file)) as Record<string, InterpretationEntry>;
      const entries = Object.entries(parsed);

      expect(entries.length).toBeGreaterThan(0);

      for (const [key, entry] of entries) {
        expect(typeof entry.hero?.title, `${file}#${key} hero.title`).toBe("string");
        expect(entry.hero?.title?.trim().length, `${file}#${key} hero.title non-empty`).toBeGreaterThan(0);

        expect(typeof entry.content?.main_text, `${file}#${key} content.main_text`).toBe("string");
        expect(
          entry.content?.main_text?.trim().length,
          `${file}#${key} content.main_text non-empty`,
        ).toBeGreaterThan(0);

        expect(Array.isArray(entry.content?.dos), `${file}#${key} content.dos`).toBe(true);
        expect(Array.isArray(entry.content?.donts), `${file}#${key} content.donts`).toBe(true);

        const mantra =
          file === "data/interpretations/compatibility.json"
            ? entry.content?.mantra
            : entry.mantra;
        expect(typeof mantra, `${file}#${key} mantra`).toBe("string");
        expect(mantra?.trim().length, `${file}#${key} mantra non-empty`).toBeGreaterThan(0);
      }
    }
  });

  test("life-path.json uses Calea Vieții subtitles on every entry and zero Cifra Destinului", () => {
    const raw = readRepoFile("data/interpretations/life-path.json");
    const parsed = JSON.parse(raw) as Record<string, InterpretationEntry>;

    expect(raw).not.toContain("Cifra Destinului");

    for (const [key, entry] of Object.entries(parsed)) {
      expect(entry.hero?.subtitle, `life-path.json#${key} hero.subtitle`).toContain("Calea Vieții");
    }
  });

  test("none of the 5 JSON files contain banned typos, medical claims, or slop phrases", () => {
    for (const file of INTERPRETATION_FILES) {
      const raw = readRepoFile(file);

      for (const banned of BANNED_JSON_STRINGS) {
        expect(raw, `${file} contains banned string ${banned}`).not.toContain(banned);
      }
    }
  });
});

describe("UI copy emoji cleanup", () => {
  test("none of the 11 cleaned TSX UI files contain decorative sparkle or galaxy emojis", () => {
    for (const file of CLEANED_UI_FILES) {
      const raw = readRepoFile(file);

      expect(raw, `${file} should not contain ✨`).not.toContain("✨");
      expect(raw, `${file} should not contain 🌌`).not.toContain("🌌");
    }
  });
});
