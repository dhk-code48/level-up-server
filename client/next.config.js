/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.multiavatar.com",
        port: "",
        pathname: "/**",
      },
    ], // Add the hostname here
  },
};

module.exports = nextConfig;
