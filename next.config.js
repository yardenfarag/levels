/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Only use basePath in production (for GitHub Pages)
  ...(isProd && {
    basePath: '/levels',
    assetPrefix: '/levels/',
  }),
}

module.exports = nextConfig
