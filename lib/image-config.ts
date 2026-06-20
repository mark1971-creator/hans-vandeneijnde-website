/** Shared next/image defaults for the portfolio. */
export const IMAGE_QUALITY = 80;

export const IMAGE_SIZES = {
  hero: "100vw",
  gallery: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  galleryWide: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  portrait: "(max-width: 1024px) 100vw, 40vw",
} as const;
