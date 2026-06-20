import type { GallerySectionConfig } from "@/lib/artworks";

export const paintingsSections: GallerySectionConfig[] = [
  {
    id: "recent",
    title: "Recent",
    subcategory: "recent",
    description: "Recent oil paintings from the studio.",
  },
  {
    id: "from-model",
    title: "From Model",
    subcategory: "naar-model",
    description: "Figure paintings made from the live model.",
  },
  {
    id: "still-life-landscape",
    title: "Still Life & Landscape",
    subcategory: "still-life-landscape",
    description: "Still lifes, landscapes, and interior scenes.",
  },
];

export const drawingsSections: GallerySectionConfig[] = [
  {
    id: "from-model",
    title: "From Model",
    subcategory: "naar-model",
    description: "Figure drawings from life — charcoal, pencil, ink, and mixed media.",
  },
  {
    id: "still-life-interior",
    title: "Still Life & Interior",
    subcategory: "still-life-interior",
    description: "Still lifes and interior studies in drawing.",
  },
];

export const portraitsSections: GallerySectionConfig[] = [
  {
    id: "drawings",
    title: "Portrait Drawings",
    subcategory: "drawings",
    description: "Portrait studies in pencil, charcoal, pastel, and ink.",
  },
  {
    id: "paintings",
    title: "Portrait Paintings",
    subcategory: "paintings",
    description: "Oil portraits painted from the live model.",
  },
];
