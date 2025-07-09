/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['aws-amplify']
  },
  webpack: (config, { isServer }) => {
    // Add alias for @ to resolve to project root
    config.resolve.alias['@'] = path.resolve(__dirname);
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      }
    }

    // Suppress vendor chunk warnings
    config.infrastructureLogging = {
      level: 'error',
    }
    
    return config
  },
  images: {
    unoptimized: true
  },
}

module.exports = nextConfig
