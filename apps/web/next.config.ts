import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@classos/board-core",
    "@classos/curriculum",
    "@classos/engines-chem",
    "@classos/engines-math",
    "@classos/input-kit",
    "@classos/topic-ui",
    "@classos/ui",
    "@classos/widgets",
  ],
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
