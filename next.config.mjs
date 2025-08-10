/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // add WP/Bunny hosts as needed
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
