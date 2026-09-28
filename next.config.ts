import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF primeiro (menor), WebP como fallback. As fotos originais ficam em /public/images.
    formats: ["image/avif", "image/webp"],
    // Qualidades permitidas. 75 = padrão, 85 = imagens de destaque (hero, capas).
    qualities: [60, 75, 85],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [32, 64, 128, 256, 384, 480],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
