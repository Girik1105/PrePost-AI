//created by kinjal
/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    // AVIF first (smallest), WebP fallback; Next picks per browser Accept header.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "framer-motion"],
  },
  async headers() {
    return [
      {
        // Static art never changes in place; let browsers and the CDN keep it for a long time.
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
