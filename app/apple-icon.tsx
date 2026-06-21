import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #2c2416 0%, #9c6644 100%)",
          color: "#faf7f2",
          fontSize: 96,
          fontFamily: "Georgia, serif",
          fontWeight: 500,
        }}
      >
        H
      </div>
    ),
    { ...size },
  );
}
