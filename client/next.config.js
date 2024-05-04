/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  images: {
    domains: ['mis-express.com'],
    minimumCacheTTL: 1500000
  }
};

module.exports = nextConfig;