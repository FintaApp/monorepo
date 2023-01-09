const { withContentlayer } = require('next-contentlayer');

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/privacy',
        destination: 'https://www.iubenda.com/privacy-policy/49633829',
        permanent: true,
        basePath: false
      },
      {
        source: '/terms',
        destination: 'https://www.iubenda.com/terms-and-conditions/49633829',
        permanent: true,
        basePath: false
      },
      {
        source: '/integration/:path*',
        destination: '/integrations/:path*',
        permanent: true
      },
      {
        source: '/blog-pages/:path*',
        destination: '/blog/:path*',
        permanent: true
      }
    ]
  }
}

module.exports = withContentlayer(nextConfig);