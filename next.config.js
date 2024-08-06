/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		styledComponents: {
			pure: true,
			displayName: true,
		},
	},
	images: {
		remotePatterns: [
			{
				hostname: 'api.qrserver.com',
				protocol: 'https',
			}
		]
	},
};

module.exports = nextConfig;
