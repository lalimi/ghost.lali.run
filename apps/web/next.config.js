/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ghost.lali.run' },
      { protocol: 'https', hostname: 'static.ghost.org' }
    ]
  },
  reactStrictMode: true
}

module.exports = nextConfig