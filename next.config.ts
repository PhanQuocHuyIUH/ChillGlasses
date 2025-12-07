/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kinhmateyeplus.com', // Domain chứa ảnh của bạn
      }
    ],
  },
};

export default nextConfig;