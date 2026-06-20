import { ImageResponse } from "next/og";

export const alt = "Hans van den Eijnde — Paintings & Drawings";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #1a1612 0%, #3d3428 38%, #9c6644 72%, #c4a574 100%)",
          color: "#faf7f2",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              border: "2px solid rgba(250, 247, 242, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 500,
            }}
          >
            H
          </div>
          <div
            style={{
              width: 120,
              height: 1,
              background: "rgba(250, 247, 242, 0.4)",
            }}
          />
        </div>
        <p
          style={{
            fontSize: 28,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            opacity: 0.85,
            margin: 0,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Paintings &amp; Drawings
        </p>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 500,
            lineHeight: 1.05,
            margin: "16px 0 0",
            letterSpacing: "0.02em",
          }}
        >
          Hans van den Eijnde
        </h1>
        <p
          style={{
            fontSize: 26,
            marginTop: 20,
            opacity: 0.8,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Oil paintings, drawings &amp; portraits
        </p>
      </div>
    ),
    { ...size },
  );
}
