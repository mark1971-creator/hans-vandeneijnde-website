import {
  artworks,
  type Artwork,
  type ArtworkCategory,
} from "@/data/artworks";

export function isArtworkAvailable(artwork: Artwork): boolean {
  return artwork.available;
}

export function withAvailability(artwork: Artwork): Artwork {
  return isArtworkAvailable(artwork)
    ? { ...artwork, available: true }
    : artwork;
}

export function getArtworksBySubcategory(
  category: ArtworkCategory,
  subcategory: string,
): Artwork[] {
  return artworks.filter(
    (a) => a.category === category && a.subcategory === subcategory,
  );
}

export function getAvailableArtworksList(): Artwork[] {
  return artworks.filter(isArtworkAvailable).map(withAvailability);
}

export type GallerySectionConfig = {
  id: string;
  title: string;
  description?: string;
  subcategory: string;
};

export function buildGallerySections(
  category: ArtworkCategory,
  configs: GallerySectionConfig[],
): { id: string; title: string; description?: string; artworks: Artwork[] }[] {
  return configs
    .map((config) => ({
      id: config.id,
      title: config.title,
      description: config.description,
      artworks: getArtworksBySubcategory(category, config.subcategory).map(
        withAvailability,
      ),
    }))
    .filter((section) => section.artworks.length > 0);
}
