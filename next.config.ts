import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* You can add other config options here */
  
  // This tells Next.js to treat libsodium as a separate entity 
  // rather than trying to bundle its complex WASM/ESM files.
  serverExternalPackages: ['libsodium-wrappers', 'libsodium'],
};

export default nextConfig;