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
  },
};

export default nextConfig;
