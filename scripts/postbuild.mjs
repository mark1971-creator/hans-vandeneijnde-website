/**
 * Verifies the static export exists after build.
 * Called automatically via npm postbuild (also run from build-static.mjs).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");
const indexHtml = path.join(outDir, "index.html");

if (!fs.existsSync(indexHtml)) {
  console.error(
    "postbuild: out/index.html is missing — static export did not complete.",
  );
  process.exit(1);
}

// serve.json is written by build-static.mjs; keep a fallback for manual builds.
const serveDest = path.join(outDir, "serve.json");
if (!fs.existsSync(serveDest)) {
  fs.copyFileSync(path.join(root, "deploy", "serve.json"), serveDest);
  console.log("postbuild: wrote out/serve.json");
}
