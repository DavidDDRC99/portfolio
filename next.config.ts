import type { NextConfig } from "next";

// Static export: the whole site is plain HTML/CSS/JS in out/, so it can be
// hosted for free on Cloudflare Pages, GitHub Pages or any static host.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
