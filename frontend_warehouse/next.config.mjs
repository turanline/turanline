/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:true,
    swcMinify:true,
    optimizeFonts:true,
    images: {
      loader: 'custom',
      loaderFile: './app/imageLoader.ts',
    },
  };
  
  export default nextConfig;
  