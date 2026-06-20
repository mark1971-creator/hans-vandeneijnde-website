import type { Artwork, ArtworkCategory } from "@/data/artworks";

const CATEGORY_TITLES: Record<ArtworkCategory, Record<string, string>> = {
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

function isCameraOrFileTitle(title: string): boolean {
  const t = title.trim();
  if (!t || /^copy$/i.test(t) || /^untitled$/i.test(t)) return true;
  if (/^IMG\s*[_\s-]?\d+/i.test(t)) return true;
  if (/^\d{1,6}$/.test(t)) return true;
  if (/^[0-9a-f]{8}([\s-][0-9a-f]{4}){2,}/i.test(t.replace(/\s/g, "-"))) return true;
  if (/^[0-9a-f]{8}\s[0-9a-f]{4}\s/i.test(t)) return true;
  if (/^\d+\s+olie op/i.test(t)) return true;
  if (/^carton\d/i.test(t)) return true;
  if (/^IMG\s+\d/i.test(t)) return true;
  return false;
}

function translateMediumTitle(title: string): string | null {
  const normalized = title.trim();

  const olie = normalized.match(
    /olie\s+op\s+(karton|canvas|doek|linnen|papier)/i,
  );
  if (olie) {
    const surface: Record<string, string> = {
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

function cleanResidualTitle(title: string): string {
  return title
    .replace(/\s*IMG\s*[_\s-]?\d+\s*/gi, " ")
    .replace(/\bIMG\s*\d+\b/gi, "")
    .replace(/\s+\d+\s*[x×]\s*\d+.*$/i, "")
    .replace(/\s+copy$/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function fallbackTitle(artwork: Artwork): string {
  return (
    CATEGORY_TITLES[artwork.category]?.[artwork.subcategory] ?? "Untitled"
  );
}

export function getDisplayTitle(artwork: Artwork): string {
  const raw = artwork.title?.trim() ?? "";

  const medium = translateMediumTitle(raw);
  if (medium) return medium;

  if (!isCameraOrFileTitle(raw)) {
    const cleaned = cleanResidualTitle(raw);
    const cleanedMedium = translateMediumTitle(cleaned);
    if (cleanedMedium) return cleanedMedium;
    if (cleaned && !isCameraOrFileTitle(cleaned)) return cleaned;
  }

  return fallbackTitle(artwork);
}

export function getDisplayTitleForScrape(
  filename: string,
  caption: string | undefined,
  category: ArtworkCategory,
  subcategory: string,
): string {
  const artwork = {
    id: "",
    src: "",
    title: caption?.trim() || filename.replace(/\.[^.]+$/, ""),
    size: null,
    year: null,
    category,
    subcategory,
    available: false,
  };
  return getDisplayTitle(artwork);
}
