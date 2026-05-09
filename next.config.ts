import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hiwiwxwzdtjesrnvwuwo.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Cap the largest image size — prevents the browser from ever requesting
    // a 3840w image for a 384px circle when `sizes` is missing from a stale ISR page
    deviceSizes: [640, 828, 1080, 1200, 1920],
    minimumCacheTTL: 86400,
    formats: ['image/webp'],
  },
};

export default nextConfig;
