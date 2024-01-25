/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "digital-hippo-ecommerce.up.railway.app",
      },
    ],
  },
};

module.exports = nextConfig;
