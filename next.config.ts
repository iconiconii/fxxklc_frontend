import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint during production builds to speed up `next build`.
    ignoreDuringBuilds: true,
  },
  // Produce a self-contained server output for Docker image
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ferf1mheo22r9ira.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    // Disable rewrites on Vercel to use server-side proxy instead
    if (process.env.VERCEL) {
      return [];
    }
    
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.BACKEND_ORIGIN}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
