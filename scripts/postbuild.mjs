/**
 * Copies deploy/serve.json into out/ after static export so `npm start` resolves clean URLs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "out");

if (!fs.existsSync(outDir)) {
  console.warn("postbuild: out/ not found — skipping serve.json copy");
  process.exit(0);
}

fs.copyFileSync(
  path.join(root, "deploy", "serve.json"),
  path.join(outDir, "serve.json"),
);
console.log("postbuild: wrote out/serve.json");
