import type { Metadata } from "next";
import { GallerySections } from "@/components/GallerySections";
import { paintingsSections } from "@/data/gallery-sections";
import { buildGallerySections } from "@/lib/artworks";

export const metadata: Metadata = {
  title: "Paintings | Hans van den Eijnde",
  description:
    "Oil paintings by Hans van den Eijnde — recent work, figure paintings from the live model, still lifes, and landscapes.",
};

export default function PaintingsPage() {
  const sections = buildGallerySections("paintings", paintingsSections);

  return (
    <>
      <header className="page-header">
        <h1 className="heading-display">Paintings</h1>
        <p>
          Oil on canvas and board — figure work, still lifes, landscapes, and
          interiors painted from life and observation.
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
