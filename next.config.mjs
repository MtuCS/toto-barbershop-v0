/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // In local development the Next app may itself run on port 5000.  Falling
    // back to that port makes every /api request proxy back to this server,
    // causing a request loop and ECONNRESET.  Only enable the proxy when an
    // external backend has been configured explicitly.
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) return [];

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
