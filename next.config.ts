import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Fully static site — build to out/ and serve with Nginx (no Node/PM2 at runtime).
  output: "export",

  // Required for static export; images are served from public/ as-is.
  images: {
    unoptimized: true,
  },

  // Avoid Next.js picking the parent directory when multiple lockfiles exist.
  turbopack: {
    root: projectRoot,
  },

  // Keeps URLs clean: /about instead of /about/
  trailingSlash: false,
};

export default nextConfig;
