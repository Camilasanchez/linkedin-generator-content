/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,  // Habilitar para un mejor manejo de rutas en producción
  },
};

export default nextConfig;
