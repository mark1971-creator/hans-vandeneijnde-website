import type { Artwork } from "@/data/artworks";
import { isArtworkAvailable } from "@/lib/artworks";
import { getDisplayTitle } from "@/lib/artwork-titles";
import { IMAGE_SIZES } from "@/lib/image-config";
import Link from "next/link";
import { OptimizedImage } from "./OptimizedImage";

export type ImageCardProps = {
  artwork: Artwork;
  href?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspectClass?: string;
};

export function ImageCard({
  artwork,
  href,
  priority = false,
  sizes = IMAGE_SIZES.gallery,
  className = "",
  aspectClass = "aspect-[4/5]",
}: ImageCardProps) {
  const title = getDisplayTitle(artwork);

  const content = (
    <article className={`group block ${className}`}>
      <div className="gallery-item">
        <div className={`relative overflow-hidden ${aspectClass}`}>
          <OptimizedImage
            src={artwork.src}
            alt={`${title} by Hans van den Eijnde`}
            fill
            priority={priority}
            sizes={sizes}
            className="gallery-image object-cover"
          />
          {isArtworkAvailable(artwork) && (
            <span className="absolute right-3 top-3 z-10 rounded-full border border-ivory/30 bg-charcoal/75 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-ivory backdrop-blur-sm dark:border-gold/30 dark:bg-charcoal/85 dark:text-gold">
              Available
            </span>
          )}
          <div className="gallery-overlay" aria-hidden />
          <div className="gallery-overlay-text">
            <p className="text-lg">{title}</p>
            {artwork.size && (
              <p className="mt-1 font-sans text-sm opacity-85">{artwork.size}</p>
            )}
          </div>
        </div>
        <div className="px-1 pt-3">
          <h3 className="gallery-caption transition-colors group-hover:text-terracotta dark:group-hover:text-gold">
            {title}
          </h3>
          <p className="gallery-meta">
            {[artwork.size, artwork.year].filter(Boolean).join(" · ") ||
              artwork.category}
          </p>
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
