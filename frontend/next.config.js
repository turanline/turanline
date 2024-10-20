/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  images: {
    domains: [
      "mis-express.com",
      "www.mis-express.com",
      "tyranshop.com",
      "localhost:3001",
      "drive.google.com",
    ],
    minimumCacheTTL: 1500000,
  },
};

module.exports = nextConfig;
