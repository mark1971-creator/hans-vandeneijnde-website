/**
 * Scans public/images/ and regenerates data/artworks.ts
 *
 * Add images:
 *   public/images/paintings/recent/my-work.jpg
 *   public/images/drawings/naar-model/study.jpg
 *
 * Optional metadata (same folder, same base name):
 *   my-work.json  →  { "title": "Evening Light", "size": "60 × 80 cm", "year": 2024, "available": true }
 *
 * Run: npm run sync-artworks
 * Also runs automatically before dev and build.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const ARTWORKS_PATH = path.join(ROOT, "data", "artworks.ts");
const SETTINGS_PATH = path.join(ROOT, "data", "artwork-settings.json");

const CATEGORIES = ["paintings", "drawings", "portraits"];

const VALID_SUBCATEGORIES = {
  paintings: ["featured", "recent", "naar-model", "still-life-landscape"],
  drawings: ["naar-model", "still-life-interior"],
  portraits: ["drawings", "paintings"],
};

const DEFAULT_TITLES = {
  paintings: {
    featured: "Oil Painting",
    recent: "Oil Painting",
    "naar-model": "Figure Painting",
    "still-life-landscape": "Still Life",
  },
  drawings: {
    "naar-model": "Figure Drawing",
    "still-life-interior": "Still Life Drawing",
  },
  portraits: {
    drawings: "Portrait Drawing",
    paintings: "Portrait Painting",
  },
};

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function humanizeFilename(name) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function inferSubcategory(category, relativeDir, fileName) {
  const dirParts = relativeDir.split(path.sep).filter(Boolean);

  for (const part of dirParts) {
    if (VALID_SUBCATEGORIES[category]?.includes(part)) return part;
  }

  const prefix = fileName.replace(IMAGE_EXT, "");
  const match = prefix.match(
    new RegExp(`^${category}-([a-z0-9-]+?)-[a-f0-9]{8}(?:-|$)`, "i"),
  );
  if (match && VALID_SUBCATEGORIES[category]?.includes(match[1])) {
    return match[1];
  }

  const simple = prefix.match(new RegExp(`^${category}-([^-]+)-`, "i"));
  if (simple) {
    const candidate = simple[1];
    if (VALID_SUBCATEGORIES[category]?.includes(candidate)) return candidate;
    const twoPart = `${simple[1]}-${prefix.split("-")[2]}`;
    if (VALID_SUBCATEGORIES[category]?.includes(twoPart)) return twoPart;
  }

  return VALID_SUBCATEGORIES[category]?.[0] ?? "misc";
}

function makeId(category, subcategory, fileName) {
  const base = fileName.replace(IMAGE_EXT, "");
  if (base.startsWith(`${category}-`)) return slugify(base);
  return slugify(`${category}-${subcategory}-${base}`);
}

function loadExistingCatalog() {
  if (!fs.existsSync(ARTWORKS_PATH)) return new Map();
  const source = fs.readFileSync(ARTWORKS_PATH, "utf8");
  const match = source.match(/export const artworks: Artwork\[\] = (\[[\s\S]*?\]);/);
  if (!match) return new Map();
  try {
    const artworks = JSON.parse(match[1]);
    return new Map(artworks.map((a) => [a.src, a]));
  } catch {
    return new Map();
  }
}

function loadSidecar(imagePath) {
  const sidecar = imagePath.replace(IMAGE_EXT, ".json");
  if (!fs.existsSync(sidecar)) return null;
  try {
    return JSON.parse(fs.readFileSync(sidecar, "utf8"));
  } catch (e) {
    console.warn(`  ! Invalid sidecar: ${sidecar} (${e.message})`);
    return null;
  }
}

function defaultTitle(category, subcategory) {
  return DEFAULT_TITLES[category]?.[subcategory] ?? "Untitled";
}

function collectImages() {
  const found = [];

  for (const category of CATEGORIES) {
    const categoryDir = path.join(IMAGES_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;

    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
          continue;
        }
        if (!IMAGE_EXT.test(entry.name)) continue;

        const relativeDir = path.relative(categoryDir, path.dirname(fullPath));
        const subcategory = inferSubcategory(
          category,
          relativeDir === "." ? "" : relativeDir,
          entry.name,
        );
        const id = makeId(category, subcategory, entry.name);
        const src =
          "/images/" +
          path
            .join(category, relativeDir === "." ? "" : relativeDir, entry.name)
            .replace(/\\/g, "/");

        found.push({
          id,
          src,
          category,
          subcategory,
          filePath: fullPath,
          fileName: entry.name,
        });
      }
    };

    walk(categoryDir);
  }

  return found.sort((a, b) => a.src.localeCompare(b.src));
}

function buildArtwork(entry, existing, sidecar) {
  const title =
    sidecar?.title ??
    existing?.title ??
    defaultTitle(entry.category, entry.subcategory);

  if (
    existing?.title &&
    !sidecar?.title &&
    /^[0-9a-f-]{20,}$/i.test(existing.title.replace(/\s/g, ""))
  ) {
    // keep generated title if old title was a file id fragment
  }

  const cleanTitle =
    sidecar?.title ??
    (existing?.title && !/^IMG\s*\d/i.test(existing.title)
      ? existing.title
      : defaultTitle(entry.category, entry.subcategory));

  return {
    id: entry.id,
    src: entry.src,
    title: cleanTitle,
    size: sidecar?.size ?? existing?.size ?? null,
    year: sidecar?.year ?? existing?.year ?? null,
    category: entry.category,
    subcategory: entry.subcategory,
    available: Boolean(sidecar?.available ?? existing?.available),
  };
}

function loadSettings(artworks) {
  if (!fs.existsSync(SETTINGS_PATH)) {
    return artworks.find((a) => a.category === "paintings")?.id ?? artworks[0]?.id;
  }
  const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
  if (settings.heroArtworkId && artworks.some((a) => a.id === settings.heroArtworkId)) {
    return settings.heroArtworkId;
  }
  if (settings.heroSrc) {
    const bySrc = artworks.find((a) => a.src === settings.heroSrc);
    if (bySrc) return bySrc.id;
  }
  return (
    artworks.find((a) => a.category === "paintings" && a.subcategory === "recent")
      ?.id ?? artworks[0]?.id
  );
}

function main() {
  const existingBySrc = loadExistingCatalog();
  const images = collectImages();

  console.log(`Found ${images.length} images in public/images/`);

  const artworks = images.map((entry) => {
    const existing = existingBySrc.get(entry.src);
    const sidecar = loadSidecar(entry.filePath);
    return buildArtwork(entry, existing, sidecar);
  });

  const heroArtworkId = loadSettings(artworks);

  const header = `// AUTO-GENERATED by scripts/sync-artworks.mjs — do not edit by hand.
// Regenerate: npm run sync-artworks
//
// ADD an image:
//   1. Drop a .jpg/.png into public/images/{paintings|drawings|portraits}/{subcategory}/
//      Example: public/images/paintings/recent/evening-light.jpg
//   2. (Optional) Add evening-light.json alongside it:
//      { "title": "Evening Light", "size": "60 × 80 cm", "year": 2024, "available": false }
//   3. Run npm run sync-artworks (or restart dev — runs automatically)
//
// REMOVE an image: delete the image file (+ .json if any), then sync again.
//
// Subcategories:
//   paintings: recent | naar-model | still-life-landscape | featured
//   drawings:  naar-model | still-life-interior
//   portraits: drawings | paintings
`;

  const body = `${header}
export type ArtworkCategory = "paintings" | "drawings" | "portraits";

export type Artwork = {
  id: string;
  src: string;
  title: string;
  size: string | null;
  year: number | null;
  category: ArtworkCategory;
  subcategory: string;
  available: boolean;
};

export const artworks: Artwork[] = ${JSON.stringify(artworks, null, 2)};

export const heroArtworkId = ${JSON.stringify(heroArtworkId)};

export function getArtworksByCategory(category: ArtworkCategory): Artwork[] {
  return artworks.filter((a) => a.category === category);
}

export function getAvailableArtworks(): Artwork[] {
  return artworks.filter((a) => a.available);
}

export function getArtworkById(id: string): Artwork | undefined {
  return artworks.find((a) => a.id === id);
}

export function getRecentArtworks(limit = 9): Artwork[] {
  const recent = artworks.filter(
    (a) => a.category === "paintings" && a.subcategory === "recent",
  );
  return (recent.length ? recent : artworks.filter((a) => a.category === "paintings")).slice(
    0,
    limit,
  );
}
`;

  fs.writeFileSync(ARTWORKS_PATH, body);
  console.log(`Wrote ${artworks.length} artworks to data/artworks.ts`);
  console.log(`Hero: ${heroArtworkId}`);
}

main();
