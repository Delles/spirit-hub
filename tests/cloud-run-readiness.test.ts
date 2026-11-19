import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dir, "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

const OG_ROUTE_FILES = [
  "app/api/og/calea-vietii/[number]/route.tsx",
  "app/api/og/compatibilitate/[score]/route.tsx",
  "app/api/og/destin/[number]/route.tsx",
  "app/api/og/energia-zilei/[date]/route.tsx",
  "app/api/og/mesaj-zilnic/[id]/route.tsx",
  "app/api/og/numar-zilnic/[number]/route.tsx",
] as const;

describe("Cloud Run standalone readiness", () => {
  test("none of the 6 OG route handlers force edge runtime", () => {
    for (const file of OG_ROUTE_FILES) {
      const source = readRepoFile(file);
      expect(source).not.toMatch(/runtime\s*=\s*["']edge["']/);
    }
  });

  test("Dockerfile configures standalone bun build and non-root node runner on port 8080", () => {
    const dockerfile = readRepoFile("Dockerfile");

    expect(dockerfile).toContain("CLOUD_RUN_BUILD=true");
    expect(dockerfile).toContain("PORT=8080");
    expect(dockerfile).toContain("HOSTNAME=0.0.0.0");
    expect(dockerfile).toMatch(/^USER\s+(?!root\b)\S+/m);
    expect(dockerfile).toContain("server.js");
  });

  test(".dockerignore excludes repository metadata, build artifacts, dependencies, and env files", () => {
    const lines = readRepoFile(".dockerignore")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));

    expect(lines).toContain(".git");
    expect(lines).toContain("node_modules");
    expect(lines).toContain(".next");
    expect(lines).toContain(".env*");
  });

  test("next.config.ts gates standalone output on CLOUD_RUN_BUILD and checks K_REVISION", () => {
    const nextConfig = readRepoFile("next.config.ts");

    expect(nextConfig).toContain("CLOUD_RUN_BUILD");
    expect(nextConfig).toContain('"standalone"');
    expect(nextConfig).toContain("K_REVISION");
  });

  test("app/layout.tsx gates Vercel analytics and speed insights behind process.env.VERCEL", () => {
    const layout = readRepoFile("app/layout.tsx");

    expect(layout).toContain("process.env.VERCEL");
    expect(layout).toContain("<Analytics />");
    expect(layout).toContain("<SpeedInsights />");
  });
});
