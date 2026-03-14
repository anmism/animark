import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Next.js to transpile the local workspace packages
  transpilePackages: ["animark-core", "animark-react"],
};

export default nextConfig;
