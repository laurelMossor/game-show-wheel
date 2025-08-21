/** @type {import('next').NextConfig} */
const nextConfig = {
  // API routes will proxy to Flask backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
