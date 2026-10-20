import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents is intentionally off: it keeps hidden pages mounted via
  // <Activity>, which fights the GSAP/ScrollTrigger page-transition system.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [{ source: "/archieve/:path*", destination: "/archive/:path*", permanent: true }];
  },
};

export default nextConfig;
