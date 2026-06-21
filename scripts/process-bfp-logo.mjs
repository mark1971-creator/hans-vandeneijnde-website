/**
 * Builds site-colored BFP logos with transparent backgrounds.
 * Run: node scripts/process-bfp-logo.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const INPUT = path.join(ROOT, "public", "images", "bfp-logo-light.png");

const VARIANTS = [
  { name: "bfp-logo-charcoal.png", rgb: [0x2c, 0x24, 0x16] },
  { name: "bfp-logo-ivory.png", rgb: [0xfa, 0xf7, 0xf2] },
];

function recolorLogo({ data, info }, rgb) {
  const out = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (lum < 24) {
      out[i] = 0;
      out[i + 1] = 0;
      out[i + 2] = 0;
      out[i + 3] = 0;
      continue;
    }

    const alpha = Math.min(255, Math.round(((lum - 24) / (255 - 24)) * 255));
    out[i] = rgb[0];
    out[i + 1] = rgb[1];
    out[i + 2] = rgb[2];
    out[i + 3] = alpha;
  }

  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`Missing source logo: ${INPUT}`);
    process.exit(1);
  }

  const { data, info } = await sharp(INPUT)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (const variant of VARIANTS) {
    const output = path.join(ROOT, "public", "images", variant.name);
    await recolorLogo({ data, info }, variant.rgb).toFile(output);
    console.log(`Wrote ${variant.name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
