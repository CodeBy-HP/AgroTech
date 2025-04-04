/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      // Add domains for Leaflet marker images
      {
        protocol: 'https',
        hostname: 'unpkg.com',
        pathname: '/**',
      },
      // Add domains for Leaflet tile servers
      {
        protocol: 'https',
        hostname: '*.tile.openstreetmap.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'server.arcgisonline.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.a.ssl.fastly.net',
        pathname: '/**',
      },
    ],
    unoptimized: process.env.NODE_ENV !== 'production',
    dangerouslyAllowSVG: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  webpack: (config) => {
    return config;
  },
  // Add transpilation for Leaflet and react-leaflet
  transpilePackages: ['react-leaflet', 'leaflet'],
};

module.exports = nextConfig; 