/**
 * Production static export build.
 *
 * - Always runs from the project root (next to package.json)
 * - Uses webpack for reliable `output: "export"` → out/
 * - Fails the build if out/ is incomplete (never silently succeeds)
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "out");

const REQUIRED_PATHS = [
  "index.html",
  "about.html",
  "404.html",
  "_next/static",
  "images",
];

function log(message) {
  console.log(`[build] ${message}`);
}

function fail(message) {
  console.error(`[build] ERROR: ${message}`);
  process.exit(1);
}

function countFiles(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(fullPath);
    } else {
      count += 1;
    }
  }
  return count;
}

function hasIndexHtml(dir) {
  return fs.existsSync(path.join(dir, "index.html"));
}

function findMisplacedExport() {
  const candidates = [
    path.join(path.dirname(ROOT), "out"),
    path.join(ROOT, ".next", "out"),
  ];

  for (const candidate of candidates) {
    if (hasIndexHtml(candidate)) {
      return candidate;
    }
  }

  return null;
}

function verifyExport(outDir) {
  for (const relativePath of REQUIRED_PATHS) {
    if (!fs.existsSync(path.join(outDir, relativePath))) {
      fail(`Missing required export path: out/${relativePath}`);
    }
  }
}

function copyServeConfig(outDir) {
  const serveConfig = path.join(ROOT, "deploy", "serve.json");
  if (!fs.existsSync(serveConfig)) {
    fail("Missing deploy/serve.json");
  }

  fs.copyFileSync(serveConfig, path.join(outDir, "serve.json"));
  log("Wrote out/serve.json");
}

if (!fs.existsSync(path.join(ROOT, "next.config.ts"))) {
  fail("next.config.ts not found — are you in the hans-portfolio project?");
}

process.chdir(ROOT);
log(`Project root: ${ROOT}`);

const npx = process.platform === "win32" ? "npx.cmd" : "npx";

const build = spawnSync(npx, ["next", "build", "--webpack", "."], {
  cwd: ROOT,
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
  },
});

if (build.status !== 0) {
  fail(`next build failed with exit code ${build.status ?? 1}`);
}

if (!hasIndexHtml(OUT_DIR)) {
  const misplaced = findMisplacedExport();
  if (misplaced) {
    log(`Export found at ${misplaced} — copying into ${OUT_DIR}`);
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
    fs.cpSync(misplaced, OUT_DIR, { recursive: true });
  }
}

if (!hasIndexHtml(OUT_DIR)) {
  fail(
    'out/index.html was not created. Ensure next.config.ts has output: "export" and build from the project root.',
  );
}

verifyExport(OUT_DIR);
copyServeConfig(OUT_DIR);

const fileCount = countFiles(OUT_DIR);
log(`Static export complete — ${fileCount} files in out/`);
