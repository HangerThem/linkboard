/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: {
      pure: true,
      displayName: true,
    },
  },
  images: {
    domains: ["api.qrserver.com"],
  },
  output: "standalone",
};

module.exports = nextConfig;
