import type { Metadata } from "next";
import { GallerySections } from "@/components/GallerySections";
import { portraitsSections } from "@/data/gallery-sections";
import { buildGallerySections } from "@/lib/artworks";

export const metadata: Metadata = {
  title: "Portraits | Hans van den Eijnde",
  description:
    "Portrait drawings and oil paintings by Hans van den Eijnde — studies and commissioned work from the live model.",
};

export default function PortraitsPage() {
  const sections = buildGallerySections("portraits", portraitsSections);

  return (
    <>
      <header className="page-header">
        <h1 className="heading-display">Portraits</h1>
        <p>
          Portrait drawings and oil paintings — capturing expression and presence
          from the live model.
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
