/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/auth',
        destination: "http://"+process.env.NEXT_PUBLIC_SSO_DOMAIN+"/api/auth",
      },
      {
        source: '/api/auth/generatePass',
        destination:"http://"+process.env.NEXT_PUBLIC_SSO_DOMAIN+"/api/auth/generatePass",
      },
      {
        source: '/api/auth/authToken',
        destination:"http://"+process.env.NEXT_PUBLIC_SSO_DOMAIN+"/api/auth/authToken",
      },
    ]
  },
};

export default nextConfig;
