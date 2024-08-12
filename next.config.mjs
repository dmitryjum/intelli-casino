/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  esLint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
