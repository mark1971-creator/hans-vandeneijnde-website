import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2c2416",
          color: "#faf7f2",
          fontSize: 20,
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
