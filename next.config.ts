import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "exam-app.elevate-bootcamp.cloud",
      },
    ],
  },
  experimental: {
    authInterrupts: true,
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
