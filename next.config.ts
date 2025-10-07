import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com", // Replace with your image host
        port: "",
        pathname: "/**", // Optional: restrict to a specific path
      },
      {
        protocol: "https",
        hostname: "gov.krd",
      },
    ],
  },
};

export default nextConfig;