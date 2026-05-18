import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'export', // ← добавить это!
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true, // ← обязательно при output: 'export'
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
