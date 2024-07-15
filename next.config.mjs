/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/auth',
        destination: process.env.SSO_DOMAIN+'/api/auth',
      },
      {
        source: '/api/auth/generatePass',
        destination: process.env.SSO_DOMAIN+'/api/auth/generatePass',
      },
    ]
  },
};

export default nextConfig;
