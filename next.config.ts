import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the site is served entirely from Firebase Hosting (free plan, no SSR).
  output: "export",
  // next/image optimization needs a server; static export uses unoptimized images
  // (we provide responsive srcset/sizes manually at the component level).
  images: { unoptimized: true },
  // Emit /about/index.html style URLs so Hosting serves clean routes.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
