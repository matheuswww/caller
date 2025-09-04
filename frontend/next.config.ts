import type { NextConfig } from "next";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = process.env.NEXT_PUBLIC_TLS_REJECT_UNAUTHORIZED
const nextConfig: NextConfig = {
  images: {
    domains: ['192.168.0.106', 'localhost'],
  },
};
export default nextConfig;
