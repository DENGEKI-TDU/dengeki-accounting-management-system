/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/auth',
        destination: "https://sso.dengeki-fox.net/api/auth",
      },
      {
        source: '/api/auth/generatePass',
        destination:"https://sso.dengeki-fox.net/api/auth/generatePass",
      },
    ]
  },
};

export default nextConfig;
