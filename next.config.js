/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Add basePath if deploying to a subdirectory
  // basePath: '/your-repo-name',
  // assetPrefix: '/your-repo-name/',
}

module.exports = nextConfig
