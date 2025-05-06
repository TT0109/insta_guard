import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */   
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      }
    ],
  },
  env: {
    INSTAGRAM_API_URL: 'https://rocketapi-for-developers.p.rapidapi.com/instagram',
    INSTAGRAM_API_HEADER_HOST: 'rocketapi-for-developers.p.rapidapi.com',
    INSTAGRAM_RAPIDAPI_KEY: '86bf04e7f5mshadf0cf3d655fe22p18860fjsn0b5d6c8644d0',
    WHATSAPP_API_URL: 'https://whatsapp-data1.p.rapidapi.com',
    WHATSAPP_API_HEADER_HOST: 'whatsapp-data1.p.rapidapi.com',
    WHATSAPP_RAPIDAPI_KEY: '86bf04e7f5mshadf0cf3d655fe22p18860fjsn0b5d6c8644d0',
  },
};

export default nextConfig;
