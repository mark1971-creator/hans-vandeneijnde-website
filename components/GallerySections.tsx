import Link from "next/link";
import { Gallery } from "@/components/Gallery";

export type GallerySection = {
  id: string;
  title: string;
  description?: string;
  artworks: import("@/data/artworks").Artwork[];
};

type GallerySectionsProps = {
  sections: GallerySection[];
  showFilterNav?: boolean;
};

export function GallerySections({
  sections,
  showFilterNav = true,
}: GallerySectionsProps) {
  if (sections.length === 0) {
    return (
      <div className="rounded-sm border border-stone/50 bg-stone/15 px-6 py-16 text-center dark:border-charcoal-light/40 dark:bg-charcoal-light/10">
        <p className="font-display text-2xl text-charcoal dark:text-ivory">
          No works in this collection yet.
        </p>
        <p className="mt-3 prose-artist">
          Please check back soon or{" "}
          <Link href="/contact" className="link-accent">
            get in touch
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      {showFilterNav && sections.length > 1 && (
        <nav
          className="sticky top-[4.5rem] z-40 -mx-4 mb-12 border-b border-stone/40 bg-ivory/90 px-4 py-4 backdrop-blur-md dark:border-charcoal-light/40 dark:bg-charcoal/90 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          aria-label="Gallery sections"
        >
          <ul className="container-wide flex flex-wrap gap-2 sm:gap-3">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-stone/60 bg-ivory px-4 py-2 text-sm tracking-wide text-charcoal transition-colors hover:border-terracotta/50 hover:text-terracotta dark:border-charcoal-light/50 dark:bg-charcoal dark:text-ivory dark:hover:border-gold/50 dark:hover:text-gold"
                >
                  {section.title}
                  <span className="rounded-full bg-stone/40 px-2 py-0.5 text-xs text-muted dark:bg-charcoal-light/60">
                    {section.artworks.length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="space-y-20 lg:space-y-28">
        {sections.map((section, sectionIndex) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-36"
            aria-labelledby={`${section.id}-heading`}
          >
            <div className="mb-8 max-w-2xl">
              <h2
                id={`${section.id}-heading`}
                className="font-display text-3xl text-charcoal dark:text-ivory sm:text-4xl"
              >
                {section.title}
              </h2>
              {section.description && (
                <p className="mt-3 prose-artist">{section.description}</p>
              )}
              <div className="divider !mx-0 !mt-6 !w-12" />
            </div>
            <Gallery
              artworks={section.artworks}
              priorityFirst={sectionIndex === 0 ? 3 : 0}
            />
          </section>
        ))}
      </div>
    </>
  );
}
