/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "ddragon.leagueoflegends.com",
        port: "",
        pathname: "/cdn/13.6.1/img/profileicon/**"
      }
    ]
  }
};

module.exports = nextConfig;
