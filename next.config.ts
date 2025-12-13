import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Router Cache configuration for Next.js 16
    // Prevents stale client-side data on SPA navigations
    staleTimes: {
      dynamic: 30,  // 30 seconds for dynamic content
      static: 180,  // 3 minutes for static content
    },
  },
  // Logging for cache debugging in dev and Vercel logs
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;

