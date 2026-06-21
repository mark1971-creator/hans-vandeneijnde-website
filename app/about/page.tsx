import type { Metadata } from "next";
import {
  artisticStatement,
  artistPhoto,
  biography,
} from "@/data/about";
import { OptimizedImage } from "@/components/OptimizedImage";
import { IMAGE_SIZES } from "@/lib/image-config";

export const metadata: Metadata = {
  title: "About | Hans van den Eijnde",
  description:
    "Biography and artistic statement of Hans van den Eijnde — painter and draughtsman working from the live model in oil, charcoal, and mixed media.",
};

export default function AboutPage() {
  return (
    <>
      <header className="page-header">
        <h1 className="heading-display">About the Artist</h1>
        <p>
          Painter and draughtsman — Leuven, Belgium. Working from life since
          2007.
        </p>
      </header>

      <section className="section-padding pt-0">
        <div className="container-wide">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <figure className="gallery-item overflow-hidden shadow-lg shadow-charcoal/10 dark:shadow-black/25">
                <div className="relative aspect-[3/4]">
                  <OptimizedImage
                    src={artistPhoto.src}
                    alt={artistPhoto.alt}
                    fill
                    priority
                    profile="portrait"
                    className="object-cover object-center"
                    sizes={IMAGE_SIZES.portrait}
                  />
                </div>
                <figcaption className="border-t border-stone/40 bg-stone/20 px-5 py-4 text-center dark:border-charcoal-light/40 dark:bg-charcoal-light/20">
                  <p className="font-display text-lg text-charcoal dark:text-ivory">
                    Hans van den Eijnde
                  </p>
                  <p className="mt-1 text-sm text-muted">Painter &amp; draughtsman</p>
                </figcaption>
              </figure>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-6">
                <h2 className="font-display text-3xl text-charcoal dark:text-ivory">
                  Biography
                </h2>
                <div className="divider !mx-0 !w-12" />
                {biography.intro.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="prose-artist">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 space-y-6">
                {biography.practice.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="prose-artist">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-14 rounded-sm border border-stone/50 bg-stone/15 p-8 dark:border-charcoal-light/40 dark:bg-charcoal-light/15 sm:p-10">
                <h2 className="font-display text-2xl text-charcoal dark:text-ivory sm:text-3xl">
                  Artistic Statement
                </h2>
                <div className="divider !mx-0 !mt-6 !w-12" />
                <p className="mt-6 prose-artist">{artisticStatement.lead}</p>
                {artisticStatement.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className="mt-4 prose-artist"
                  >
                    {paragraph}
                  </p>
                ))}
                <blockquote className="mt-8 border-l-2 border-terracotta/50 pl-6 dark:border-gold/50">
                  <p className="font-display text-xl leading-relaxed text-charcoal/90 dark:text-ivory/90 sm:text-2xl">
                    &ldquo;{artisticStatement.quote.text}&rdquo;
                  </p>
                  <footer className="mt-4 text-sm font-medium tracking-wide text-terracotta dark:text-gold">
                    — {artisticStatement.quote.attribution}
                  </footer>
                </blockquote>
              </div>

              <div className="mt-14 space-y-6">
                <h2 className="font-display text-3xl text-charcoal dark:text-ivory">
                  The Work
                </h2>
                <div className="divider !mx-0 !w-12" />
                {biography.oeuvre.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="prose-artist">
                    {paragraph}
                  </p>
                ))}
                <p className="rounded-full border border-terracotta/25 bg-terracotta/5 px-5 py-3 text-center font-display text-lg text-charcoal dark:border-gold/25 dark:bg-gold/5 dark:text-ivory sm:inline-block sm:text-left">
                  ~800 drawings · ~200 paintings
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
