/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/auth',
        destination: "https://"+process.env.NEXT_PUBLIC_SSO_DOMAIN+"/api/auth",
      },
      {
        source: '/api/auth/generatePass',
        destination:"https://"+process.env.NEXT_PUBLIC_SSO_DOMAIN+"/api/auth/generatePass",
      },
    ]
  },
};

export default nextConfig;
