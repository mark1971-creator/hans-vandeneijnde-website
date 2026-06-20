/**
 * Rewrite artwork titles in data/artworks.ts using display-title rules.
 * Run: node scripts/fix-artwork-titles.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTWORKS_PATH = path.join(__dirname, "../data/artworks.ts");

const CATEGORY_TITLES = {
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

function isCameraOrFileTitle(title) {
  const t = title.trim();
  if (!t || /^copy$/i.test(t) || /^untitled$/i.test(t)) return true;
  if (/^IMG\s*[_\s-]?\d+/i.test(t)) return true;
  if (/^\d{1,6}$/.test(t)) return true;
  if (/^[0-9a-f]{8}([\s-][0-9a-f]{4}){2,}/i.test(t.replace(/\s/g, "-"))) return true;
  if (/^[0-9a-f]{8}\s[0-9a-f]{4}\s/i.test(t)) return true;
  if (/^\d+\s+olie op/i.test(t)) return true;
  if (/^carton\d/i.test(t)) return true;
  return false;
}

function translateMediumTitle(title) {
  const normalized = title.trim();
  const olie = normalized.match(/olie\s+op\s+(karton|canvas|doek|linnen|papier)/i);
  if (olie) {
    const surface = {
      karton: "Board",
      canvas: "Canvas",
      doek: "Canvas",
      linnen: "Linen",
      papier: "Paper",
    };
    return `Oil on ${surface[olie[1].toLowerCase()] ?? "Canvas"}`;
  }
  if (/^carton\s*\d/i.test(normalized) || /^carton\d/i.test(normalized)) {
    return "Oil on Board";
  }
  if (/slac\s+expo/i.test(normalized)) {
    const year = normalized.match(/\b(19|20)\d{2}\b/)?.[0];
    return year ? `SLAC Exhibition, ${year}` : "SLAC Exhibition";
  }
  return null;
}

function cleanResidualTitle(title) {
  return title
    .replace(/\s*IMG\s*[_\s-]?\d+\s*/gi, " ")
    .replace(/\bIMG\s*\d+\b/gi, "")
    .replace(/\s+\d+\s*[x×]\s*\d+.*$/i, "")
    .replace(/\s+copy$/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function getDisplayTitle(artwork) {
  const raw = artwork.title?.trim() ?? "";
  const medium = translateMediumTitle(raw);
  if (medium) return medium;

  if (!isCameraOrFileTitle(raw)) {
    const cleaned = cleanResidualTitle(raw);
    const cleanedMedium = translateMediumTitle(cleaned);
    if (cleanedMedium) return cleanedMedium;
    if (cleaned && !isCameraOrFileTitle(cleaned)) return cleaned;
  }

  return (
    CATEGORY_TITLES[artwork.category]?.[artwork.subcategory] ?? "Untitled"
  );
}

const source = fs.readFileSync(ARTWORKS_PATH, "utf8");
const match = source.match(/export const artworks: Artwork\[\] = (\[[\s\S]*?\]);/);
if (!match) throw new Error("Could not parse artworks array");

const artworks = JSON.parse(match[1]);
const updated = artworks.map((artwork) => ({
  ...artwork,
  title: getDisplayTitle(artwork),
}));

const newSource = source.replace(
  /export const artworks: Artwork\[\] = \[[\s\S]*?\];/,
  `export const artworks: Artwork[] = ${JSON.stringify(updated, null, 2)};`,
);

fs.writeFileSync(ARTWORKS_PATH, newSource);
console.log(`Updated ${updated.length} artwork titles.`);
