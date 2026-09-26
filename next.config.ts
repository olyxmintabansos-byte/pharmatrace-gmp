import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/pharmatrace-gmp",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
