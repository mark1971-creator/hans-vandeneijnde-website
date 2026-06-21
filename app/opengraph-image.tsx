import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt =
  "Jerez de la Frontera — painting by Hans van den Eijnde";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const painting = await readFile(
    join(process.cwd(), "public/images/paintings/jerez-de-la-frontera.png"),
  );
  const paintingSrc = `data:image/png;base64,${painting.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#1a1612",
        }}
      >
        <img
          src={paintingSrc}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 65%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(26, 22, 18, 0.92) 0%, rgba(26, 22, 18, 0.35) 45%, rgba(26, 22, 18, 0.15) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            padding: "56px 64px",
            color: "#faf7f2",
            fontFamily: "Georgia, serif",
          }}
        >
          <p
            style={{
              fontSize: 22,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              margin: 0,
              opacity: 0.85,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Paintings &amp; Drawings
          </p>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 500,
              lineHeight: 1.05,
              margin: "12px 0 0",
              letterSpacing: "0.02em",
            }}
          >
            Hans van den Eijnde
          </h1>
          <p
            style={{
              fontSize: 24,
              marginTop: 14,
              opacity: 0.8,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Jerez de la Frontera
          </p>
        </div>
      </div>
    ),
    { ...size },
  );
}
