import type { Metadata } from "next";
import { GallerySections } from "@/components/GallerySections";
import { drawingsSections } from "@/data/gallery-sections";
import { buildGallerySections } from "@/lib/artworks";

export const metadata: Metadata = {
  title: "Drawings | Hans van den Eijnde",
  description:
    "Drawings by Hans van den Eijnde — figure studies from the live model, still lifes, and interiors in charcoal, pencil, ink, and pastel.",
};

export default function DrawingsPage() {
  const sections = buildGallerySections("drawings", drawingsSections);

  return (
    <>
      <header className="page-header">
        <h1 className="heading-display">Drawings</h1>
        <p>
          Figure drawings from the live model, still lifes, and interior studies
          — crayon, ink, pastel, pencil, reed pen, and mixed media.
        </p>
      </header>

      <section className="section-padding pt-0">
        <div className="container-wide">
          <GallerySections sections={sections} />
        </div>
      </section>
    </>
  );
}
