import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dpytug06lde0z.cloudfront.net",
      }
    ]
  }
};

export default nextConfig;
