/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Fix per App Router static export
  assetPrefix: process.env.NODE_ENV === 'production' ? '/taxi-pollo/' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/taxi-pollo' : ''
};

module.exports = nextConfig;
