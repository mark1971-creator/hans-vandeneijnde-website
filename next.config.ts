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

  // Keep .next inside this project (never confuse with out/).
  distDir: ".next",

  // Pin the app root when multiple lockfiles exist on the server or dev machine.
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },

  // Keeps URLs clean: /about instead of /about/
  trailingSlash: false,
};

export default nextConfig;
