import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't infer it from a parent lockfile.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
