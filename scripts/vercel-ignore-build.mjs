#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const skippablePathPatterns = [
  /^docs\//,
  /(^|\/)README\.md$/,
  /^AGENTS\.md$/,
];

function git(args) {
  return spawnSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function commitExists(ref) {
  if (!ref) {
    return false;
  }

  return git(["rev-parse", "--verify", `${ref}^{commit}`]).status === 0;
}

function changedPaths(baseRef) {
  const result = git([
    "diff",
    "--name-status",
    "--find-renames",
    baseRef,
    "HEAD",
  ]);

  if (result.status !== 0) {
    return null;
  }

  return result.stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .flatMap((line) => {
      const parts = line.split("\t");
      const status = parts[0] ?? "";

      if (status.startsWith("R") || status.startsWith("C")) {
        return parts.slice(1, 3);
      }

      return parts.slice(1, 2);
    })
    .map((path) => path.replaceAll("\\", "/"));
}

function isSkippable(path) {
  return skippablePathPatterns.some((pattern) => pattern.test(path));
}

const baseRef = [process.env.VERCEL_GIT_PREVIOUS_SHA, "HEAD^"].find(commitExists);

if (!baseRef) {
  console.log("No comparable base commit found; continuing Vercel build.");
  process.exit(1);
}

const paths = changedPaths(baseRef);

if (!paths) {
  console.log(`Could not inspect changes since ${baseRef}; continuing Vercel build.`);
  process.exit(1);
}

const uniquePaths = [...new Set(paths)];
const buildRelevantPaths = uniquePaths.filter((path) => !isSkippable(path));

if (buildRelevantPaths.length === 0) {
  console.log("Only repository docs changed; skipping Vercel build.");
  process.exit(0);
}

console.log("Build-relevant files changed; continuing Vercel build:");
for (const path of buildRelevantPaths.slice(0, 25)) {
  console.log(`- ${path}`);
}

if (buildRelevantPaths.length > 25) {
  console.log(`- ...and ${buildRelevantPaths.length - 25} more`);
}

process.exit(1);
