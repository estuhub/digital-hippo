/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "digital-hippo-seven.vercel.app/",
      },
    ],
  },
};

module.exports = nextConfig;
