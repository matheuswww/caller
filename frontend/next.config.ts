import type { NextConfig } from "next";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const nextConfig: NextConfig = {
  images: {
    domains: ['192.168.0.106'],
  },
};
export default nextConfig;
