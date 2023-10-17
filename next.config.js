/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent.fbog19-1.fna.fbcdn.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
