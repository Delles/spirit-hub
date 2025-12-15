import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Expose Vercel's deployment ID to client-side for cache busting
  // Vercel provides VERCEL_* but NOT NEXT_PUBLIC_* versions by default
  env: {
    NEXT_PUBLIC_ASSET_VERSION:
      process.env.VERCEL_GIT_COMMIT_SHA ??
      process.env.VERCEL_DEPLOYMENT_ID ??
      "dev",
  },
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
  // Logging for cache debugging - only in development
  // In production, full URLs could leak sensitive query params
  logging: process.env.NODE_ENV === "development" ? {
    fetches: {
      fullUrl: true,
    },
  } : undefined,
};

export default nextConfig;

