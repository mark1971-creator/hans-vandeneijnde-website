/**
 * Verifies the static export exists after build.
 * Called automatically via npm postbuild.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");
const indexHtml = path.join(outDir, "index.html");

const REQUIRED_METADATA = [
  "favicon.svg",
  "icon.png",
  "apple-icon.png",
  "favicon.ico",
  "opengraph-image.png",
  "twitter-image.png",
];

function countWebpFiles(dir) {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countWebpFiles(fullPath);
    } else if (entry.name.endsWith(".webp")) {
      count += 1;
    }
  }
  return count;
}

function isValidIco(filePath) {
  const buffer = fs.readFileSync(filePath);
  return (
    buffer.length > 22 &&
    buffer[0] === 0 &&
    buffer[1] === 0 &&
    buffer[2] === 1 &&
    buffer[3] === 0
  );
}

if (!fs.existsSync(indexHtml)) {
  console.error(
    "postbuild: out/index.html is missing — static export did not complete.",
  );
  process.exit(1);
}

for (const file of REQUIRED_METADATA) {
  const filePath = path.join(outDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`postbuild: missing ${file} in out/ — rebuild after prebuild.`);
    process.exit(1);
  }
}

const faviconPath = path.join(outDir, "favicon.ico");
if (!isValidIco(faviconPath)) {
  console.error("postbuild: favicon.ico is not a valid ICO file.");
  process.exit(1);
}

const optimizedDir = path.join(outDir, "images-optimized");
const webpCount = countWebpFiles(optimizedDir);
if (webpCount === 0) {
  console.error(
    "postbuild: out/images-optimized/ has no WebP files — run npm run optimize-images.",
  );
  process.exit(1);
}

const serveDest = path.join(outDir, "serve.json");
if (!fs.existsSync(serveDest)) {
  fs.copyFileSync(path.join(root, "deploy", "serve.json"), serveDest);
  console.log("postbuild: wrote out/serve.json");
}

console.log(
  `postbuild: verified static export (${webpCount} optimized WebP files in out/images-optimized/)`,
);
