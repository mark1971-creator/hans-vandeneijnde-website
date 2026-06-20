import type { Metadata } from "next";
import Link from "next/link";
import { Gallery } from "@/components/Gallery";
import { getAvailableArtworksList } from "@/lib/artworks";

export const metadata: Metadata = {
  title: "Available Works | Hans van den Eijnde",
  description:
    "Original paintings and drawings by Hans van den Eijnde currently available for purchase.",
};

export default function AvailableWorksPage() {
  const available = getAvailableArtworksList();

  return (
    <>
      <header className="page-header">
        <h1 className="heading-display">Available Works</h1>
        <p>
          A selection of original works currently available for purchase. For
          enquiries about price, shipping, or commissioning a portrait, please
          get in touch.
        </p>
      </header>

      <section className="section-padding pt-0">
        <div className="container-wide">
          {available.length > 0 ? (
            <>
              <div className="mb-12 rounded-sm border border-terracotta/25 bg-terracotta/5 px-6 py-5 text-center dark:border-gold/25 dark:bg-gold/5 sm:text-left">
                <p className="prose-artist">
                  Works marked{" "}
                  <span className="inline-flex items-center rounded-full border border-charcoal/20 bg-charcoal/75 px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.12em] text-ivory dark:border-gold/30 dark:text-gold">
                    Available
                  </span>{" "}
                  are ready to acquire.{" "}
                  <Link href="/contact" className="link-accent">
                    Contact Hans
                  </Link>{" "}
                  for details.
                </p>
              </div>
              <Gallery artworks={available} priorityFirst={4} columns={3} />
            </>
          ) : (
            <div className="rounded-sm border border-stone/50 bg-stone/15 px-6 py-16 text-center dark:border-charcoal-light/40 dark:bg-charcoal-light/10">
              <p className="font-display text-2xl text-charcoal dark:text-ivory">
                No works listed at the moment
              </p>
              <p className="mx-auto mt-3 max-w-md prose-artist">
                New pieces are added regularly. You are welcome to enquire about
                commissions or works from the wider gallery.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/paintings" className="btn-primary">
                  View Paintings
                </Link>
                <Link href="/contact" className="btn-outline">
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
