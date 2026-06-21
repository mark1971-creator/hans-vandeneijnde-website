/**
 * Generates static metadata images in public/ (not app/).
 * Keeping these out of app/ avoids Next.js metadata routes like /apple-icon
 * that break static export on some Linux VPS builds.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const HERO_IMAGE = path.join(
  ROOT,
  "public/images/paintings/jerez-de-la-frontera.png",
);

async function writeIcon() {
  const svg = `
    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="#2c2416"/>
      <text x="16" y="22" text-anchor="middle" fill="#faf7f2" font-family="Georgia, serif" font-size="20" font-weight="500">H</text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(path.join(PUBLIC_DIR, "icon.png"));
}

async function writeAppleIcon() {
  const svg = `
    <svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2c2416"/>
          <stop offset="100%" stop-color="#9c6644"/>
        </linearGradient>
      </defs>
      <rect width="180" height="180" fill="url(#bg)"/>
      <text x="90" y="112" text-anchor="middle" fill="#faf7f2" font-family="Georgia, serif" font-size="96" font-weight="500">H</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(PUBLIC_DIR, "apple-icon.png"));
}

async function writeFavicon() {
  const iconPath = path.join(PUBLIC_DIR, "icon.png");
  await sharp(iconPath).resize(32, 32).toFile(path.join(PUBLIC_DIR, "favicon.ico"));
}

async function writeOpenGraphImage() {
  if (!fs.existsSync(HERO_IMAGE)) {
    throw new Error(`Hero image not found: ${HERO_IMAGE}`);
  }

  const photo = await sharp(HERO_IMAGE)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();

  const overlay = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(26,22,18,0.15)"/>
          <stop offset="45%" stop-color="rgba(26,22,18,0.35)"/>
          <stop offset="100%" stop-color="rgba(26,22,18,0.92)"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#shade)"/>
      <text x="64" y="470" fill="#faf7f2" font-family="system-ui, sans-serif" font-size="22" letter-spacing="6">PAINTINGS &amp; DRAWINGS</text>
      <text x="64" y="540" fill="#faf7f2" font-family="Georgia, serif" font-size="64" font-weight="500">Hans van den Eijnde</text>
      <text x="64" y="585" fill="rgba(250,247,242,0.8)" font-family="system-ui, sans-serif" font-size="24">Jerez de la Frontera</text>
    </svg>
  `;

  const overlayBuffer = await sharp(Buffer.from(overlay)).png().toBuffer();

  await sharp(photo)
    .composite([{ input: overlayBuffer, top: 0, left: 0 }])
    .png()
    .toFile(path.join(PUBLIC_DIR, "opengraph-image.png"));
}

async function main() {
  await writeIcon();
  await writeAppleIcon();
  await writeFavicon();
  await writeOpenGraphImage();
  fs.copyFileSync(
    path.join(PUBLIC_DIR, "opengraph-image.png"),
    path.join(PUBLIC_DIR, "twitter-image.png"),
  );
  console.log(
    "Generated public/icon.png, apple-icon.png, favicon.ico, opengraph-image.png, twitter-image.png",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
