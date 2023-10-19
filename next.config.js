/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: {
      pure: true,
      displayName: true,
    },
  },
};

module.exports = nextConfig;
