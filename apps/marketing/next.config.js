module.exports = {
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
      }
    ]
  }
}