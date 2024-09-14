/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  images: {
    domains: ["mis-express.com", "www.mis-express.com", "localhost:3000"],
    minimumCacheTTL: 1500000,
  },
};

module.exports = nextConfig;
