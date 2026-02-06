/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Ensures Node.js runtime for Route Handlers that depend on Node APIs
    serverActions: false
  }
};

export default nextConfig;
