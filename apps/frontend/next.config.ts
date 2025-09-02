import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;
