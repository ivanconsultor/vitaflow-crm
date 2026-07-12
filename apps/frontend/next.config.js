/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendHost = process.env.BACKEND_HOST || 'localhost';
    return [
      {
        source: '/api/:path*',
        destination: `http://${backendHost}:3001/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
