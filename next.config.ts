import type { NextConfig } from "next";

/** Fully static site: `next build` writes plain HTML/JS/CSS to ./out (deploy anywhere). */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
