/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // FIXME: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};


export default nextConfig;
