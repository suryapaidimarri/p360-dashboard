/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['logo.clearbit.com', 'www.google.com', 'favicon.ico'],
    remotePatterns: [
      { protocol: 'https', hostname: 'logo.clearbit.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
