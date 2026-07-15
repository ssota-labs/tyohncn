import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@tyohn/registry"],
}

export default nextConfig
