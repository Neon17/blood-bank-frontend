import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds (Vercel or local)
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    if (!isDev) return []; // No rewrites in production
    return [
      {
        source: '/backend/:path*',
        destination: 'http://localhost:8000/:path*', // Laravel backend in dev
      },
    ];
  },
  async headers() {
    if (!isDev) return []; // No special headers in production
    return [
      {
        source: '/backend/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://localhost:3000', // Next.js dev URL
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
