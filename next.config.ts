import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Silence the "multiple lockfiles" warning caused by a parent package-lock.json
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
