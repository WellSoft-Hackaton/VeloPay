import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* You can add other config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // This tells Next.js to treat libsodium as a separate entity 
  // rather than trying to bundle its complex WASM/ESM files.
  serverExternalPackages: ['libsodium-wrappers', 'libsodium'],
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
};

export default nextConfig;