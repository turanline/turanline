/** @type {import('next').NextConfig} */

const nextConfig = {
  // basePath: '/partners',
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  images: {
    domains: [
      "mis-express.com",
      "www.mis-express.com",
      "localhost:3000",
      "drive.google.com",
      "disk.yandex.ru",
    ],
    minimumCacheTTL: 1500000,  
  },
};

module.exports = nextConfig;
