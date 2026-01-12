/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "api.qrserver.com",
        protocol: "https",
      },
    ],
  },
}

module.exports = nextConfig
