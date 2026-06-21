/**
 * Runs all prebuild steps in order. Invoked by npm prebuild / predev.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const STEPS = [
  { name: "sync-artworks", script: "sync-artworks.mjs" },
  { name: "optimize-images", script: "optimize-images.mjs" },
  { name: "generate-metadata-images", script: "generate-metadata-images.mjs" },
];

function runStep(step) {
  console.log(`[prebuild] ${step.name}`);
  const scriptPath = path.join(__dirname, step.script);
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    console.error(`[prebuild] ${step.name} failed`);
    process.exit(result.status ?? 1);
  }
}

for (const step of STEPS) {
  runStep(step);
}

console.log("[prebuild] All steps complete");
