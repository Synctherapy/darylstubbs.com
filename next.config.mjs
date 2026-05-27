/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.darylstubbs.com" },
    ],
  },
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;
