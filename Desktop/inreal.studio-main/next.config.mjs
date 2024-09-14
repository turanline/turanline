/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: process.env.WP_BASE,
				port: '',
				pathname: '/wp-content/**'
			}
		]
	}
}

export default nextConfig;
