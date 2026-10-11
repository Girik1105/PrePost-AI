//created by kinjal
/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    // Every file in /public/assets is already resized to ~2x its largest display size and saved as
    // compressed WebP (see docs/asset-prompts.md). Serving them as-is from the CDN is faster than
    // resizing on demand, which made first loads slow on Netlify. next/image still lazy-loads,
    // reserves space (no layout shift) and preloads anything marked priority.
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
