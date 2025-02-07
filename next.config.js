/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone' // Ideal para entornos serverless
};

module.exports = nextConfig;
