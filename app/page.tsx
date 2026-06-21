import Link from "next/link";
import { Gallery } from "@/components/Gallery";
import { OptimizedImage } from "@/components/OptimizedImage";
import {
  getArtworkById,
  getRecentArtworks,
  heroArtworkId,
} from "@/data/artworks";
import { IMAGE_SIZES } from "@/lib/image-config";

const galleryLinks = [
  { href: "/paintings", label: "Paintings" },
  { href: "/drawings", label: "Drawings" },
  { href: "/portraits", label: "Portraits" },
  { href: "/available-works", label: "Available Works" },
] as const;

function categoryHref(category: string) {
  if (category === "paintings") return "/paintings";
  if (category === "drawings") return "/drawings";
  if (category === "portraits") return "/portraits";
  return "/";
}

export default function Home() {
  const hero = getArtworkById(heroArtworkId);
  const recentWorks = getRecentArtworks(9);

  return (
    <>
      <section className="relative flex min-h-[88vh] items-end overflow-hidden sm:min-h-[92vh]">
        {hero && (
          <OptimizedImage
            src={hero.src}
            alt={`${hero.title} — painting by Hans van den Eijnde`}
            fill
            priority
            profile="hero"
            className="object-cover object-[center_70%] sm:object-center"
            sizes={IMAGE_SIZES.hero}
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/20 dark:from-[#1a1612] dark:via-[#1a1612]/60 dark:to-[#1a1612]/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-transparent dark:from-[#1a1612]/50"
          aria-hidden
        />

        <div className="relative z-10 w-full px-4 pb-16 pt-32 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="container-wide max-w-4xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-sand/90">
              Hans van den Eijnde
            </p>
            <h1 className="font-display text-5xl font-medium leading-none tracking-wide text-ivory sm:text-6xl lg:text-7xl">
              Paintings &amp; Drawings
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/85 sm:text-xl">
              Oil paintings, charcoal studies, and portraits — quiet observations
              of light, landscape, and the human form.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/paintings"
                className="btn-primary border-ivory/20 bg-ivory text-charcoal hover:border-sand hover:bg-sand dark:border-gold/30 dark:bg-gold dark:text-charcoal dark:hover:border-sand"
              >
                View Paintings
              </Link>
              <Link
                href="/drawings"
                className="btn-outline border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory/10 hover:text-ivory dark:border-gold/40 dark:text-ivory dark:hover:border-gold dark:hover:text-gold"
              >
                View Drawings
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="heading-display">Recent Work</h2>
            <div className="divider mx-auto my-6" />
            <p className="prose-artist">
              A selection of recent paintings and drawings from the studio.
            </p>
          </div>

          <Gallery
            className="mt-12 lg:mt-16"
            artworks={recentWorks}
            getHref={(artwork) => categoryHref(artwork.category)}
          />

          <div className="mt-12 text-center lg:mt-16">
            <Link href="/paintings" className="link-accent text-base">
              View full gallery →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-stone/40 bg-stone/15 section-padding dark:border-charcoal-light/30 dark:bg-charcoal-light/10">
        <div className="container-wide text-center">
          <h2 className="heading-display">Explore the Collections</h2>
          <p className="mx-auto mt-4 max-w-xl prose-artist">
            Browse paintings, drawings, portraits, and works currently available
            for purchase.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {galleryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="btn-outline">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
