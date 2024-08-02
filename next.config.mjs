/** @type {import('next').NextConfig} */
let nextConfig
if(process.env.NODE_ENV == "production"){
  nextConfig = {
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
        {
          source: '/api/auth/authToken',
          destination:"https://"+process.env.NEXT_PUBLIC_SSO_DOMAIN+"/api/auth/authToken",
        },
      ]
    },
  };
} else {
  nextConfig = {
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
}

export default nextConfig;
