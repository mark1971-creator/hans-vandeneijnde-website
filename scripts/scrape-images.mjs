/**
 * Scraper + catalog builder for hans-vandeneijnde.be
 * Run: node scripts/scrape-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images");
const BASE = "https://hans-vandeneijnde.be";

const PAGES = [
  { path: "/", category: "paintings", subcategory: "featured" },
  {
    path: "/schilderijen/schilderijen-naar-model",
    category: "paintings",
    subcategory: "naar-model",
  },
  {
    path: "/schilderijen/recente-schilderijen",
    category: "paintings",
    subcategory: "recent",
  },
  {
    path: "/schilderijen/stil-levens-landschap-en-interieur-schilderijen",
    category: "paintings",
    subcategory: "still-life-landscape",
  },
  {
    path: "/tekeningen/tekeningen-naar-model",
    category: "drawings",
    subcategory: "naar-model",
  },
  {
    path: "/tekeningen/stil-levens-en-interieur-tekeningen",
    category: "drawings",
    subcategory: "still-life-interior",
  },
  {
    path: "/portretten/portret-tekeningen",
    category: "portraits",
    subcategory: "drawings",
  },
  {
    path: "/portretten/portret-schilderijen",
    category: "portraits",
    subcategory: "paintings",
  },
];

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
};

function normalizeUrl(url) {
  if (!url || url === "#") return null;
  const cleaned = url.replace(/\\'/g, "'");
  if (cleaned.startsWith("//")) return `https:${cleaned}`;
  return cleaned;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function extractPhysicalSize(...sources) {
  for (const text of sources) {
    if (!text) continue;
    const cmMatch = text.match(/(\d{1,3})\s*cm\s*[x×]\s*(\d{1,3})\s*cm/i);
    if (cmMatch) return `${cmMatch[1]} × ${cmMatch[2]} cm`;
    const dimMatch = text.match(/(\d{2,3})\s*[x×]\s*(\d{2,3})(?:\s*cm)?/i);
    if (dimMatch) {
      const w = Number(dimMatch[1]);
      const h = Number(dimMatch[2]);
      if (w <= 200 && h <= 200) return `${w} × ${h} cm`;
    }
  }
  return null;
}

function cleanTitle(filename, caption, category, subcategory) {
  const raw = caption?.replace(/<[^>]+>/g, "").trim();
  const candidate = raw || filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "");

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
    if (!t || /^copy$/i.test(t)) return true;
    if (/^IMG\s*[_\s-]?\d+/i.test(t)) return true;
    if (/^\d{1,6}$/.test(t)) return true;
    if (/^[0-9a-f]{8}([\s-][0-9a-f]{4}){2,}/i.test(t.replace(/\s/g, "-")))
      return true;
    if (/^\d+\s+olie op/i.test(t)) return true;
    if (/^carton\d/i.test(t)) return true;
    return false;
  }

  function translateMediumTitle(title) {
    const olie = title.match(/olie\s+op\s+(karton|canvas|doek|linnen|papier)/i);
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
    if (/slac\s+expo/i.test(title)) {
      const year = title.match(/\b(19|20)\d{2}\b/)?.[0];
      return year ? `SLAC Exhibition, ${year}` : "SLAC Exhibition";
    }
    return null;
  }

  const medium = translateMediumTitle(candidate);
  if (medium) return medium;

  let title = candidate
    .replace(/^IMG[_\s-]*/i, "")
    .replace(/^\d+\s+/g, "")
    .replace(/\s+\d+\s*[x×]\s*\d+.*$/i, "")
    .replace(/\s+copy$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();

  if (!isCameraOrFileTitle(title)) {
    const cleanedMedium = translateMediumTitle(title);
    if (cleanedMedium) return cleanedMedium;
    if (title.length > 2) return title;
  }

  return (
    CATEGORY_TITLES[category]?.[subcategory] ?? "Untitled"
  );
}

function extractYear(...sources) {
  for (const text of sources) {
    const match = text?.match(/\b(19|20)\d{2}\b/);
    if (match) return Number(match[0]);
  }
  return null;
}

function parseImages(html, pageMeta) {
  const images = [];
  const seen = new Set();
  const captions = new Map();

  const captionPatterns = [
    /data-image-href="([^"]+)"[^>]*title="([^"]*)"/gi,
    /style="background-image:url\('([^']+)'\);"[^>]*title="([^"]*)"/gi,
  ];

  for (const pattern of captionPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const url = normalizeUrl(match[1]);
      if (url) captions.set(url, match[2]);
    }
  }

  const imgTags = html.match(/<img[^>]+>/gi) || [];
  for (const tag of imgTags) {
    const srcRaw =
      tag.match(/src="([^"]+)"/)?.[1] ||
      tag.match(/data-path="([^"]+)"/)?.[1];
    const src = normalizeUrl(srcRaw);
    if (!src || !src.includes("cloudfront.net") || seen.has(src)) continue;
    seen.add(src);

    const filename =
      tag.match(/data-filename="([^"]+)"/)?.[1] || path.basename(src);
    const caption = captions.get(src);

    images.push({
      src,
      filename,
      title: cleanTitle(filename, caption, pageMeta.category, pageMeta.subcategory),
      size: extractPhysicalSize(caption, filename),
      year: extractYear(filename, caption),
      category: pageMeta.category,
      subcategory: pageMeta.subcategory,
      available: /te koop|beschikbaar|verkrijgbaar/i.test(
        `${caption ?? ""} ${filename}`,
      ),
    });
  }

  const bgPattern =
    /background-image:url\('(\/\/[^']+cloudfront\.net[^']+)'\)/gi;
  let bgMatch;
  while ((bgMatch = bgPattern.exec(html)) !== null) {
    const src = normalizeUrl(bgMatch[1]);
    if (!src || seen.has(src)) continue;
    seen.add(src);
    const caption = captions.get(src);
    const filename = path.basename(src);
    images.push({
      src,
      filename,
      title: cleanTitle(filename, caption, pageMeta.category, pageMeta.subcategory),
      size: extractPhysicalSize(caption, filename),
      year: extractYear(filename, caption),
      category: pageMeta.category,
      subcategory: pageMeta.subcategory,
      available: /te koop|beschikbaar|verkrijgbaar/i.test(`${caption ?? ""}`),
    });
  }

  return images;
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, { headers: FETCH_HEADERS });
    if (res.ok) return res.text();
  } catch {
    /* fall through to curl */
  }

  const { execSync } = await import("child_process");
  return execSync(`curl.exe -sL "${url}"`, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
}

async function downloadFile(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) return;
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

function pickHeroId(artworks) {
  const preferred = artworks.find(
    (a) =>
      a.size === "60 × 80 cm" &&
      a.category === "paintings" &&
      a.subcategory === "recent",
  );
  return (
    preferred?.id ||
    artworks.find(
      (a) => a.category === "paintings" && a.subcategory === "recent",
    )?.id ||
    artworks.find((a) => a.category === "paintings")?.id ||
    artworks[0]?.id
  );
}

function inferFromLocalPath(category, fileName) {
  const id = path.basename(fileName, path.extname(fileName));
  const withoutCategory = id.replace(new RegExp(`^${category}-`), "");
  const subcategory = withoutCategory.includes("-")
    ? withoutCategory.split("-").slice(0, 2).join("-")
    : "misc";
  return { id, subcategory };
}

function collectLocalOrphans(catalogById) {
  const orphans = [];
  for (const category of ["paintings", "drawings", "portraits"]) {
    const dir = path.join(OUT_DIR, category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
      const id = path.basename(file, path.extname(file));
      if (catalogById.has(id)) continue;
      const { subcategory } = inferFromLocalPath(category, file);
      orphans.push({
        id,
        src: `/images/${category}/${file}`,
        title: id.replace(/-/g, " "),
        size: extractPhysicalSize(file) || null,
        year: extractYear(file),
        category,
        subcategory,
        available: false,
      });
    }
  }
  return orphans;
}

async function main() {
  const catalogById = new Map();
  const urlToId = new Map();

  for (const page of PAGES) {
    console.log(`Fetching ${page.path}...`);
    let html;
    try {
      html = await fetchPage(`${BASE}${page.path}`);
    } catch (e) {
      console.error(`  ✗ ${page.path}: ${e.message}`);
      continue;
    }
    const images = parseImages(html, page);
    console.log(`  Found ${images.length} images`);

    for (const img of images) {
      const ext = path.extname(img.filename) || ".jpg";
      const id = slugify(
        `${img.category}-${img.subcategory}-${path.basename(img.src, ext)}`,
      );
      if (catalogById.has(id)) continue;

      const localName = `${id}${ext.toLowerCase()}`;
      const dest = path.join(OUT_DIR, img.category, localName);

      try {
        await downloadFile(img.src, dest);
        console.log(`  ✓ ${localName}`);
      } catch (e) {
        if (!fs.existsSync(dest)) {
          console.error(`  ✗ ${img.src}: ${e.message}`);
          continue;
        }
      }

      const artwork = {
        id,
        src: `/images/${img.category}/${localName}`,
        title: img.title,
        size: img.size,
        year: img.year,
        category: img.category,
        subcategory: img.subcategory,
        available: img.available,
      };
      catalogById.set(id, artwork);
      urlToId.set(img.src, id);
    }

    await new Promise((r) => setTimeout(r, 400));
  }

  for (const orphan of collectLocalOrphans(catalogById)) {
    catalogById.set(orphan.id, orphan);
    console.log(`  + orphan ${orphan.src}`);
  }

  const artworks = Array.from(catalogById.values()).sort((a, b) =>
    a.src.localeCompare(b.src),
  );

  const tsContent = `// Auto-generated by scripts/scrape-images.mjs
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

export const heroArtworkId = ${JSON.stringify(pickHeroId(artworks))};

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

  fs.writeFileSync(path.join(ROOT, "data", "artworks.ts"), tsContent);
  console.log(`\nDone: ${artworks.length} artworks in catalog.`);
}

main().catch(console.error);
