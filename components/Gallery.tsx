import type { Artwork } from "@/data/artworks";
import { ImageCard } from "./ImageCard";

export type GalleryProps = {
  artworks: Artwork[];
  getHref?: (artwork: Artwork) => string | undefined;
  priorityFirst?: number;
  className?: string;
  columns?: 2 | 3 | 4;
};

const aspectClasses = [
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[5/4]",
  "aspect-square",
] as const;

export function Gallery({
  artworks,
  getHref,
  priorityFirst = 0,
  className = "",
  columns = 3,
}: GalleryProps) {
  const columnClass = {
    2: "columns-1 sm:columns-2",
    3: "columns-1 sm:columns-2 lg:columns-3",
    4: "columns-1 sm:columns-2 lg:columns-3 xl:columns-4",
  }[columns];

  return (
    <div
      className={`${columnClass} gap-4 sm:gap-5 lg:gap-6 [column-fill:balance] ${className}`}
    >
      {artworks.map((artwork, index) => (
        <div
          key={artwork.id}
          className="mb-4 break-inside-avoid sm:mb-5 lg:mb-6"
        >
          <ImageCard
            artwork={artwork}
            href={getHref?.(artwork)}
            priority={index < priorityFirst}
            aspectClass={aspectClasses[index % aspectClasses.length]}
          />
        </div>
      ))}
    </div>
  );
}
