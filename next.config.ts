import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avtoo027-001-site1.ntempurl.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'avtoo027-001-site1.ntempurl.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
